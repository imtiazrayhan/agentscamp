---
name: "Rork"
description: "An AI mobile app builder that turns a chat prompt into native iPhone (Swift), Android (Kotlin), and web apps you can publish to the App Store."
seoDescription: "Rork for founders: how the AI mobile app builder works, its switch from Expo to native Swift and Kotlin, App Store publishing, plans as of September 2026."
date: 2026-09-10
url: "https://rork.com"
pricing: "freemium"
category: "app-builder"
color: "cyan"
os: ["Web", "iOS"]
topics: ["ai-at-work", "workflow-prompting"]
audience: ["founders"]
tags: ["app-builder", "mobile", "ios", "android", "vibe-coding", "founders"]
featured: false
alternativeTo: ["lovable", "replit-agent"]
sameAs: ["https://docs.rork.com"]
related: ["guide:best-ai-app-builders-2026", "guide:claude-code-for-non-developers", "guide:build-an-mvp-with-claude-code", "tool:emergent", "tool:lovable", "tool:replit-agent", "glossary:ai-app-builder"]
keywords: ["Rork", "AI mobile app builder", "prompt to iOS app", "App Store publishing", "vibe coding mobile"]
summary: "Rork is a prompt-to-mobile-app builder. Describe an app in chat and it generates a native iPhone app in Swift, an Android app in Kotlin, or a React web app, then builds and uploads store binaries on its own machines so you never need a Mac or Xcode. It used to generate Expo (React Native) apps and switched to native code; existing Expo projects still work."
faq:
  - q: "What is Rork?"
    a: "Rork is an AI platform for creating mobile and web apps by chatting. It targets founders who want to ship to the App Store or Google Play without a developer, and everything runs in the browser, with a companion iPhone app called Rork Max for building and publishing on the go."
  - q: "Does Rork use React Native or Expo?"
    a: "Not for new projects. Rork's docs say it used to build Expo (React Native) apps and switched because internal benchmarks showed the agent writes better Swift apps. New iPhone apps are Swift, new Android apps are Kotlin, and new web apps are React. Existing Expo projects can still be built, published, and synced to GitHub, and Rork offers to convert them to SwiftUI."
  - q: "How does App Store publishing work with Rork?"
    a: "Rork builds and uploads the binary on its own machines, so you do not need a Mac, Xcode, or Android Studio. You still need your own Apple Developer account (99 dollars a year) or Google Play developer account (25 dollars one time) with identity verified, plus your own listing, screenshots, and a review submission. TestFlight beta testing and web publishing are also supported."
  - q: "How much does Rork cost?"
    a: "As of September 2026 the free plan is design-only with 5 design credits a day and no Build mode. Rork Pro is 20 dollars a month for 100 credits and unlocks building native iPhone, Android, and web apps plus Dev mode. Rork Max runs from 200 to 1,800 dollars a month for 1,000 to 10,000 credits and adds iPad, Apple Watch, and Vision Pro targets, native games and widgets, and priority chat support."
---

Rork is the mobile-first member of the AI app builder family. You describe an app in chat, and it produces a native iPhone app written in Swift, a native Android app in Kotlin, or a web app in React, then compiles and uploads store builds on Rork's own machines. The point of difference is the last mile: it is built around getting something onto TestFlight and into the App Store, not just into a browser preview.

That native choice is recent. Rork's documentation states it used to generate Expo (React Native) apps and switched because internal benchmarks showed the agent writes better Swift apps. If you read an older review that calls Rork "a React Native builder," that is out of date for new projects, although existing Expo projects remain buildable and can be converted to SwiftUI on request.

## Highlights

- **Native code, not a web wrapper.** New iOS apps are Swift, Android apps are Kotlin, and web apps are React. iOS and Android can live in one project sharing a backend while keeping separate codebases.
- **Store builds without a Mac.** Rork builds and uploads for you; the docs are explicit that you do not need a Mac, Xcode, or Android Studio. TestFlight distribution and direct web publishing are covered too.
- **A backend when you need one.** Rork Cloud is a managed backend inside the product with Postgres, server functions, and AI models. You can bring Supabase or Firebase instead, and many simple apps need no backend at all.
- **Real code you can take.** Everyone can read the generated code; paid plans can edit it and connect GitHub, which stores one commit per agent turn. The docs say you can export and run the project like any Vite, Swift, or Kotlin project.
- **Rork Max on iPhone.** A companion iOS app lets you build Swift and web apps, install them on your phone, and publish to the App Store from the phone itself.
- **Store-listing helpers.** The site advertises a Screenshot Studio for App Store images and an AI App Store reviewer that checks your submission before Apple does.

## In a founder's workflow

Rork fits the consumer or field-service idea that only makes sense as a phone app: a habit tracker, a booking app for a local business, a tool for technicians in the field. Describe the screens and the data the app keeps, and be explicit about accounts, because that decides whether you need a backend:

```text
Build an iPhone app for a dog-walking business. Clients sign up,
add their dogs, book a walk on a calendar, and get a push
notification when the walk starts and ends. Walkers see today's
schedule and mark walks complete. Store data in Rork Cloud.
```

Test on your own phone through TestFlight, iterate in chat, then submit. Set up your Apple Developer account in parallel on day one; identity verification is the slowest step and Rork cannot do it for you.

> [!WARNING]
> New personal Google Play accounts must run a closed test with 12 testers for 14 days before a production release. Plan an Android launch around that requirement, not around when the build is ready.

## Good to know

Rork runs in the browser, with the Rork Max iPhone app as a companion. As of September 2026 the free plan is design mode only (5 design credits a day, private projects, no Build mode). Rork Pro is $20/month for 100 credits and unlocks native iPhone, Android, and web builds plus Dev mode. Rork Max tiers run from $200 to $1,800/month for 1,000 to 10,000 credits and add iPad, Apple Watch, and Vision Pro, native games and iOS widgets, and priority chat support. A Rork Start plan is listed for India only. Rork's own FAQ page still carries the older React Native description and a higher starting price; the docs' plans page is the current source.

Store fees are separate: Apple's developer membership is $99 a year and Google Play registration is a one-time $25, both paid to the stores. If your product is web-first with a mobile version later, [Emergent](/tools/emergent) (Expo mobile through its Mobile Agent, sharing the web app's backend) or [Lovable](/tools/lovable) may be the better starting point; the [best AI app builders in 2026](/guides/comparisons/best-ai-app-builders-2026) roundup compares them. Once the app is in GitHub, the [build an MVP with Claude Code](/guides/founders/build-an-mvp-with-claude-code) guide shows how to keep shipping with a coding agent instead of the builder.
