---
title: Welcome to Quokkabot
layout: '@layouts/Default/index.astro'
setup: |
  import Posts from '../components/parts/posts/index.astro'
---

## What is Quokkabot?

Quokkas are the happiest animal in Australia that surprisingly isn't trying to kill you. But can you really be sure that what you're looking at is a Quokka and not something more dangerous?

Utilising Microsoft's Custom Vision and Twilio's WhatsApp and Sendgrid APIs, Quokkabot allows users to send in an image and have Quokkabot tell them is the image contains a quokka (or something more dangerous, at which point it may be too late)

## What are Quokkas?

Quokkas are Australian marsupials (related to kangaroos and wallabies), only found on a small island called Rottnest Island, off the coast of Perth. They're herbivors (although will eat most food you leave lying around) and have no natural predators therefore aren't afraid of humans.

![](/img/quokka-map.png)

But what's made quokkas so famous is that they look like they're smiling and are excellent at posing for selfies.

## But why?

Built for Twilio Engage Sydney 2019, Quokkabot originally showcased the iconic West Australian creature by sending you a picture of a quokka when you asked for them.

Since then, it has been expanded to integrate with Microsoft's Custom Vision to allow users to send an image in, and have it detect if the image contains a quokka, via Twilio communication APIs (currently supporting WhatsApp and Sendgrid options).

Also, who doesn't love pictures of quokkas?

## How does it work?

There are two version of the Quokkabot workflows, one utilising WhatsApp as the communication method and the other using email.

![Flow of information for Quokkabot when using WhatsApp. User sends a WhatsApp message to Twilio registered account, which triggers a webhook to an Azure function. This function then sends the image to Custom Vision, which sends the result back to Azure functions which uses the Twilio WhatsApp API to send the results back to the user.](/img/whatsapp_workflow.svg)

![Flow of information for Quokkabot when using Sendgrid. User sends an email which is passed through Twilio Sendgrid, which triggers a webhook to an Azure function. This function then sends the image to Custom Vision, which sends the result back to Azure functions which uses the Sengrid API to send the results back to the user.](/img/sendgrid_workflow.svg)

<!-- ### Twilio APIs

### Azure Functions

Azure Functions are serverless and allow easy

### Azure Cognitive Services Custom Vision

Custom vision is part of Azure Cognitive Services and recognises major differences between images to apply user defined labels.

### Twilio Sync -->

## How is it build?

<Posts />

## How can I use it?

### WhatsApp

![](img/quokkabot_qr.png)

To use Quokkabot on WhatsApp, scan the QR code on your phone (with the WhatsApp app installed) and send a message to the number

### Email

Send an email to [hi@quokkas.dev](mailto:hi@quokkas.dev).