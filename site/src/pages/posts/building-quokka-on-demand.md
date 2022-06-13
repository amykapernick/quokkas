---
title: Building Quokka on Demand
date: 2020-02-07
description: Stage one of Quokkabot was built on Twilio Functions, using the Twilio WhatsApp API. On request, the user can ask for a picture of a Quokka, and one is sent to them.
tags: 'posts'
layout: '@layouts/Post/index.astro'
featured: /img/Image_from_iOS.jpg
---

Last year I got the chance to give a live demo at the Superclass at [Twilio Engage](https://twilioengage.com/sydney2019) in Sydney. It was just a quick demo so I didn't have the chance to do much, but I thought it would be a good opportunity to show how easy the APIs are to use, and maybe I could put a little Perth in it. Then I came up with the idea of Quokkabot 🎉.

Using the [Twilio WhatsApp API](https://www.twilio.com/whatsapp), it allows people to send a message in and ask for a picture of a Quokka. For those who haven't heard of them before, Quokkas are Australian marsupials (related to kangaroos and wallabies), only found on a small island called Rottnest Island, off the coast of Perth. They're herbivores (although will eat most food you leave lying around) and have no natural predators and aren't afraid of humans. But what's made them famous the most is they look like they're smiling, and are excellent at posing for selfies. So I built a bot which allowed people to ask for (and get a photo of a quokka) to brighten their day.

![Quokkas are smiling, friendly creatures that live off the coast of Perth, Australia](/img/quokka-map.png)

I would have preferred to use MMS, but currently only US numbers are supported with the Twilio MMS API (something, something, telcos 😠), so I used the WhatsApp API instead. It's currently still in beta so you have to [join a testing sandbox](https://www.twilio.com/docs/sms/whatsapp/api#twilio-sandbox-for-whatsapp), but after that it works fine. For ease of use, I also used [Twilio Functions](https://www.twilio.com/docs/runtime/functions) so that I didn't have to worry about setting up a serverless function. There's a great [quickstart guide for Twilio API for WhatsApp](https://www.twilio.com/docs/sms/whatsapp/quickstart/node), or your can follow along below.

---
If you don't already have one, [sign up for a Twilio account](https://www.twilio.com/referral/09ifDK). Using the referral link provided will give you $10 credit when you set up your account.

In the [Twilio Console](https://www.twilio.com/console), navigate to **Functions** → **Manage** and create a new function. When prompted you can start from scratch using the **Blank** template. Define your function information, and set it to fire the event on *Incoming Messages*.

![](/img/twilio_function.png)

Twilio gives you some code to start with (even though we're using the Blank template 🤷‍♀️), we just need to make a couple of tweaks to get started. This function will be triggered whenever a WhatsApp message is sent to your number and will send a response to the same number.

```js
    exports.handler = function(context, event, callback) {
    	// Load the Twilio Markup Language (TwiML) function and message
    	let twiml = new Twilio.twiml.MessagingResponse(),
    	message = twiml.message();
    
    	// Set the body of the message
    	message.body('Hi, do you want a quokka?')
    
    	// Send the message
    	callback(null, twiml);
    };
```

Get the full path of your function and hold onto it. 


![](/img/function_path.png)

Navigate to **SMS** → **WhatsApp** → **Sandbox** and enter the function url in the box for when a message comes in. If you haven't used WhatsApp before, you might have to go through the tutorial in the **Learn** tab first.

![](/img/whatsapp_sandbox.png)

If you haven't already joined the WhatsApp sandbox, send a message with the activation code to the WhatsApp number, this will join the testing sandbox.

![](/img/whatsapp_number.png)

Send a message to the number and see the response you get back. Try tweaking the `message.body` and see the new response you get.

![](/img/message1.png)

We need to know if the people sending a message are asking for a quokka, so to access the message text, define a new variable below our existing ones:

```js
    let twiml = new Twilio.twiml.MessagingResponse(),
    	message = twiml.message(),
    
    	// From the message event, get the Body, which is the message text
    	request = event.Body;
    
    	// Log the message to view what was sent
    
    	console.log(request)
```

On the function page, you can scroll down to the bottom and view the results that we've logged, which is the text of the messages that were sent.

![](/img/functions_console.png)

Changing the body of our function and using the most advanced AI in tech (an `if/else` statement 😂), we can check if the message body contains the word `quokka`

```js
    exports.handler = function(context, event, callback) {
    	let twiml = new Twilio.twiml.MessagingResponse(),
    	message = twiml.message(),
    	request = event.Body;
    	
    	// Check if the message contains the word quokka (not case sensitive)
    	if(RegExp('quokka', 'i').test(request)) {
    			// Set the message body to say they want a  quokka
    	    message.body('You want a quokka')
    	}
    	else {
    			// They didn't want a quokka, but we should respond anyway.
    	    message.body(`You didn't ask for a quokka. Are you sure?`)
    	}
    	
    	
    	callback(null, twiml);
    };
```

With the new function, the response changes based on what the initial message said.

![](/img/message2.png)

But the reason we're using WhatsApp is so we can add images. As well as being able to define the body of a message, we can also define media to include with it. If we change the first part of our `if/else` statement to also define the message media by giving it a URL. I've hosted some images so they're easy to use for this

```js
    if(RegExp('quokka', 'i').test(request)) {
    	    message.body('This is a quokka')
    		
    			// Give the URL of an image to send with the message
    	    message.media(`https://quokkas.amyskapers.dev/img/quokka_(1).jpg`)
    }
```

Now when you send a message asking for a quokka, it will send you a picture of a quokka!

![](/img/message3.png)

To change it up a bit, I have a bunch of different images, and generate a random number each time the function is triggered and feed that number into the image URL. It didn't seem fair that people only got images when asking for quokkas either, so I have a bunch of images of things that aren't quokkas, to send then.

```js
    exports.handler = function(context, event, callback) {
    	let twiml = new Twilio.twiml.MessagingResponse(),
    	message = twiml.message(),
    	request = event.Body,
    
    	// Randomly generate a number between 0 and 9 (inclusive)
    	photo = Math.floor(Math.random() * 10);
    	
    	if(RegExp('quokka', 'i').test(request)) {
    	    message.body('This is a quokka')
    	    message.media(`https://quokkas.amyskapers.dev/img/quokka_(${photo}).jpg`)
    	}
    	else {
    			// This text was a bit of a joke that my dad would make when my parents came to visit me in Perth
    	    message.body(`This is not a quokka`)
    	    message.media(`https://quokkas.amyskapers.dev/img/not_quokka(${photo}).jpg`)
    	}
    	
    	
    	callback(null, twiml);
    };
```

Now it randomly sends one of the photos of quokkas in each message, shaking it up a bit.

![](/img/message4.png)

---

Feel free to play around with it, you can also fork the [repo on GitHub](https://github.com/amykapernick/quokka-on-demand).

---

**Part 2 - [*Building Quokkabot*](/posts/building-quokkabot-part-2)**
