---
title: 'Building Quokkabot: Part 2'
date: 2020-05-19
description: Building on the Functionality of Quokka on Demand, the next step was moving the function over to Azure Functions and hooking up Cognitive Services so that users could send in an image and it would detect if there was a Quokka in the photo
tags: posts
layout: layouts/post.njk
featured: /img/quokkabot_feature.png
---

Last year, for a demo at Twilio Superclass in Sydney, I built a bot that sent pictures of Quokkas when requested - Quokka on Demand (covered in Part 1 of this blog series, *[Building Quokka on Demand](/building-quokka-on-demand/)*). After that was done, chatting with Phil and Devin from Twilio, they came up with a new idea - a Quokka recognising bot, something people can send pictures to, and it identifies if there's a Quokka in the photo.

Now I've never done anything with image recognition, or really any form of AI or machine learning before, so this was a bit confronting. Thankfully, I had people who were able to able to help me out, and so while sitting at the helpdesk at Microsoft Ignite, one of my friends, Damian, helped me to set up and configure [Microsoft's Cognitive Services Custom Vision](https://www.customvision.ai/) (yep that's a mouthful) to run image classification - does the image have a Quokka in it or not?

The previous version of Quokkabot was run on [Twilio Functions](https://www.twilio.com/docs/runtime/functions), a serverless environment that is easy to get up and running with Twilio functions. But due to the added complexity with image recognition, I wanted an option that had a bit more flexibility, so I switched to use [Azure Functions](https://azure.microsoft.com/en-in/services/functions/) instead. It took a little while to get used to the differences between the two, but thankfully Aaron was able to help out (and thankfully show me where I can find the logs). It was also super easy to [get started with Azure Functions](https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-first-function-vs-code?pivots=programming-language-javascript), with a VS Code extension to setup the new function files.

Once the function is set up, it was a case of bringing across the WhatsApp code from Quokka on Demand. If you don't already have one, [sign up for a Twilio account](https://www.twilio.com/referral/09ifDK). Using the referral link provided will give you $10 credit when you set up your account.

```javascript
// whatsapp/index.js
require('dotenv').config()

module.exports = async function (context) {
    const res = context.res,
    MessagingResponse = require('twilio').twiml.MessagingResponse,
    twiml = new MessagingResponse()
    message = twiml.message()
    
    message.body(`Welcome to Quokkabot!`)

    res.set('content-type', 'text/xml')
	res.end(message.toString())
};
```

The function is triggered when a WhatsApp message is sent, and returns the message in response.

![When a WhatsApp message is sent, it triggers a response back](/img/quokkabot-1.png)

Next step is to fetch an image that's been included in the message, and the first thing to do with this is parse the request body, which was prevented a slight hiccup. Previously, I'd been using express and middleware to parse the request, but unfortunately the express middleware packages aren't compatible with Azure Functions. Thankfully I managed to find an alternative (`querystring`) without too many issues, and parsed the message body to find the image when included in a message.

```javascript
require('dotenv').config()

module.exports = async function (context) {
    const res = context.res,
    qs = require('querystring'),
    MessagingResponse = require('twilio').twiml.MessagingResponse,
    twiml = new MessagingResponse(),
    message = twiml.message(),
    body = qs.parse(context.req.body)
    
    message.body(
        `Welcome to Quokkabot!\n
        ${body.MediaUrl0}`
    )

    res.set('content-type', 'text/xml')
	res.end(message.toString())
};
```

Now when an image is sent, it sends the URL of the image back to the user.

![](/img/quokkabot-2.png)

Thankfully, Twilio provides a URL to the image that's sent, which makes it much easier to send the image through to Custom Vision. At this point I created a separate file, at focus on the Custom Vision side of things. Using the [Custom Vision Prediction SDK](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/cognitiveservices/cognitiveservices-customvision-prediction), I can pass in an image URL and get the prediction results back

```javascript
// quokka-test.js
require('dotenv').config()

const fs = require('fs'),
PredictionApi = require('@azure/cognitiveservices-customvision-prediction'),
key = process.env.API_KEY,
endpoint = process.env.ENDPOINT,
projectId = process.env.PROJECT_ID,
publishIterationName = process.env.ITERATION,
predictor = new PredictionApi.PredictionAPIClient(key, endpoint)

const customVision = async (image) => {
	return (results = await predictor.classifyImageUrl(projectId, publishIterationName, { url: image })) 
}

module.exports = {
	customVision
}
```

Importing the function into the main file, I can pass the image URL from Twilio in to be sent to Custom Vision.

```javascript
// whatsapp/index.js
require('dotenv').config()

const quokkaTest = require('../quokka-test'),
customVision = quokkaTest.customVision

module.exports = async function (context) {
    const res = context.res,
    qs = require('querystring'),
    MessagingResponse = require('twilio').twiml.MessagingResponse,
    twiml = new MessagingResponse(),
    message = twiml.message(),
    body = qs.parse(context.req.body),
    image = body.NumMedia && body.MediaUrl0

    const results = await customVision(image)
    
    message.body(
        `Welcome to Quokkabot!`
    )

    res.set('content-type', 'text/xml')
	res.end(message.toString())
};
```

Now, while it's great to be able to send an image in, the user ideally wants the results back so they know whether there is a Quokka in the image. Creating another function to use when sending the image to Custom Vision, I can find the results and just return them from the function (I don't need to worry about any other data for this).

```javascript
// quokka-test.js
require('dotenv').config()

const fs = require('fs'),
PredictionApi = require('@azure/cognitiveservices-customvision-prediction'),
key = process.env.API_KEY,
endpoint = process.env.ENDPOINT,
projectId = process.env.PROJECT_ID,
publishIterationName = process.env.ITERATION,
predictor = new PredictionApi.PredictionAPIClient(key, endpoint)

const customVision = async (image) => {
	const results = await predictor.classifyImageUrl(projectId, publishIterationName, { url: image }),
	outcome = quokkaTest(results)

	return outcome
}

const quokkaTest = (results) => {
	let outcome = {}

	results.predictions.forEach(tag => {
		if (tag.tagName == 'Negative') {
			outcome.negative = tag.probability
		} else if (tag.tagName == 'Quokka') {
			outcome.quokka = tag.probability
		}
	})

	return outcome
}

module.exports = {
	customVision
}
```

Now that the results are being returned to the main function, I can use them to craft the message response back to the user. The values are converted to percentages and depending on which result is higher a different response is set.

```javascript
// whatsapp/index.js
require('dotenv').config()

const quokkaTest = require('../quokka-test'),
customVision = quokkaTest.customVision

const whatsappReply = (outcome) => {
    let message,
    quokka = `${(outcome.quokka * 100).toFixed(2)}%`,
        notQuokka = `${(outcome.negative * 100).toFixed(2)}%`
        
    if (outcome.negative > outcome.quokka) {
        message = `Sorry, doesn't look like that's a quokka 😢
        \nQuokka: ${quokka}, Not Quokka: ${notQuokka}`
    } else {
        message = `Yep, that looks like a quokka!
        \nQuokka: ${quokka}, Not Quokka: ${notQuokka}`
    }

    return message
}

module.exports = async function (context) {
    const res = context.res,
    qs = require('querystring'),
    MessagingResponse = require('twilio').twiml.MessagingResponse,
    twiml = new MessagingResponse(),
    message = twiml.message(),
    body = qs.parse(context.req.body),
    image = body.NumMedia && body.MediaUrl0

    const results = await customVision(image),
    reply = whatsappReply(results)
    
    message.body(reply)

    res.set('content-type', 'text/xml')
	res.end(message.toString())
};
```

![](/img/quokkabot-3.png)

Because this originally started with the ability to request pictures of Quokkas, I wanted to keep that original functionality as well. So creating a new file, I randomly chose an image and added an extra response to let people know how they can use Quokkabot.

```javascript
// quokkabot.js
const quokkaBot = (text) => {
	let results = {},
	photo = Math.floor(Math.random() * 12)

	if(RegExp('quokka', 'i').test(text)) {
		results.body = `This is a quokka`
		
	}
	else {
		results.body = `Welcome to Quokka bot! I can do a bunch of different things that have to do with quokkas.
		\nNeed a picture of a quokka? Just ask me
		\nNot sure if you've seen a quokka? Send me a picture and I'll tell you if there's a quokka in it`
	}

	results.media = `https://quokkas.amyskapers.dev/img/quokka_(${photo}).jpg`

	return results
}

module.exports = {
	quokkaBot
}
```

Adding a slight tweak to to the main function, I can check if someone has sent an image (therefore sending it to Custom Vision), otherwise it looks at the Quokkbot functionality.

```javascript
// whatsapp/index.js
require('dotenv').config()

const quokkaTest = require('../quokka-test'),
customVision = quokkaTest.customVision,
quokkaBot = require('../quokkabot')

const whatsappReply = (outcome) => {
    let message,
    quokka = `${(outcome[1] * 100).toFixed(2)}%`,
        notQuokka = `${(outcome[0] * 100).toFixed(2)}%`
        
    if (outcome[0] > outcome[1]) {
        message = `Sorry, doesn't look like that's a quokka 😢
        \nQuokka: ${quokka}, Not Quokka: ${notQuokka}`
    } else {
        message = `Yep, that looks like a quokka!
        \nQuokka: ${quokka}, Not Quokka: ${notQuokka}`
    }

    return message
}

module.exports = async function (context) {
    const res = context.res,
    qs = require('querystring'),
    MessagingResponse = require('twilio').twiml.MessagingResponse,
    twiml = new MessagingResponse(),
    message = twiml.message(),
    body = qs.parse(context.req.body),
    text = body.Body,
    image = body.NumMedia && body.MediaUrl0

    if(image) {
        const results = await customVision(image),
        reply = whatsappReply(results)
        
        message.body(reply)
    }
    else {
        const results = quokkaBot.quokkaBot(text)

        message.body(results.body)
        message.media(results.media)
    }

    res.set('content-type', 'text/xml')
	res.end(message.toString())
};
```
---

Now that this is working though, this is only the start (more posts incoming). The current state of this project is in [GitHub](https://github.com/amykapernick/quokka_or_not). 