---
title: 'Building Quokkabot Part 3 - Moving to Azure Static Web Apps'
date: 2020-05-19
description: Last week I got the chance to speak at Microsoft Build, and do a first-look demo on their newly announced featured - Azure Static Web Apps. And as I didn't get access to Static Web Apps until they same time everyone else did (the day before my demo), I got to showcase how easy it was the first time you used it (ok, so maybe it was the second time that I'd used it).
categories:
  - Quokkas
  - Dev
  - Azure
  - Azure Static Web Apps
tags: posts
layout: layouts/post.njk
featured: /img/welcome_to_quokkabot.png
---
Last week I got the chance to speak at [Microsoft Build](https://mybuild.microsoft.com/), and do a first-look demo on their newly announced featured - [Azure Static Web Apps](https://azure.microsoft.com/en-au/services/app-service/static/). And as I didn't get access to Static Web Apps until they same time everyone else did (the day before my demo), I got to showcase how easy it was the first time you used it (ok, so maybe it was the second time that I'd used it).

## Deploying from GitHub

Using an [existing static site](https://github.com/amykapernick/quokkas), with information about Quokkabot, built with [Eleventy](https://www.11ty.dev/), I set up the continuous deployment pipeline which uses a GitHub action to trigger the site to rebuild in Static Web Apps.

From the Azure Portal, create a new resource for Static Web App (currently in preview)

![](/img/static_web_app_resource.png)

Select your Azure subscription and resource group (for now, Static Web Apps is free), you'll need to authorise your GitHub account and select the repository and branch you're deploying from.

![](/img/swas_repo_connect.png)

Specify the details for the site build, my static site sits in the root folder of the repository, and builds out to a folder called `_site`. While I don't have an API to include there yet, leaving the API location as is is fine (if they can't find the `api` folder, they'll ignore it.

![](/img/swas_build.png)

Next, click **Review + create** to create the new resource. 

This will automatically create a workflow file in your repo, with a GitHub action to build the site and deploy it to Azure.

![](/img/swas_github_action.png)

That's it. You're done.

## Setting a Custom Domain

In the Azure portal, you can add a custom domain to your application. Click to **Add** a new domain, and setup the DNS records provided, then wait to verify the DNS changes.

![](/img/aswa_custom_domain.png)

Again, you're done.

## Adding an API back end

I already had a [separate repository](https://github.com/amykapernick/quokka_or_not) where I was running the Quokkabot back end on Azure Functions, so as Static Web Apps uses Azure Functions for the back end that was also an easy integration.

I created a new folder in the static site project called `api` and copied all the files from the API repository over, then deployed the updates.

When the GitHub action detects the API folder, it will deploy that part of the project to Azure Functions. These functions then appear in the Azure portal with the static site.

![](/img/aswa_functions.png)

## Gotchas

Azure Static Web Apps has only been available for a week, is still in preview and therefore not suited to production apps. But so far this is a really great product, great integrations and simple and easy to use. There are just a few gotchas or issues though

### Node Modules

During the build process, Azure uses it's own node_modules folder to install things in, `__oryx_prod_node_modules`, which as it wasn't called `node_modules`, my Eleventy site tried to build out the content 🤦‍♀️. This was an easy fix though, by adding that folder to the [`.eleventyignore` file](https://www.11ty.dev/docs/ignores/), the build ignored it.

### Azure Functions

**Fixed**

While Static Web Apps does use Azure Functions for the API back ends, there's a layer that sits between the two, which currently stops the API sending custom headers with the response (such as `Content-Type`). This has been lodged as an issue though and should be fixed shortly.

**Update 1-June-2020**: This issue has now been fixed, and Azure functions are now passing through custom headers.

---

You can see the live site at [quokkas.amyskapers.dev](https://quokkas.amyskapers.dev/).