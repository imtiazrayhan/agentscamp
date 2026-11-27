---
name: MagicSchool
title: MagicSchool
description: "MagicSchool is an AI platform for K-12 schools with 80+ teacher tools for lessons, quizzes and rubrics, 50+ student tools, and district admin controls."
date: "2026-09-10"
updated: "2026-11-27"
reviewed: "2026-11-27"
topics:
- ai-at-work
- workflow-prompting
audience: []
tags:
- education
- teachers
- lesson-planning
- assessment
- k-12
featured: false
related:
- guide:ai-exit-tickets-from-lesson-objectives
- glossary:formative-assessment
- agent:exit-ticket-reviewer
summary: "MagicSchool is an AI platform built for K-12 teachers, students and districts. Teachers pick a purpose-built tool, such as the lesson plan, worksheet, quiz or rubric generator, fill in a short form and get a classroom-ready draft. It has a free plan for individual teachers, a paid Plus plan, and an Enterprise plan with district controls."
url: https://www.magicschool.ai
pricing: freemium
category: assistant
alternativeTo: ["chatgpt", "claude", "gemini", "notebooklm"]
os:
- Web
color: pink
faq:
- q: "Is MagicSchool free for teachers?"
  a: "Yes. As of November 2026, the pricing page lists a Forever Free plan at $0 for individual teachers with 80+ teacher tools, the Raina chatbot, quizzes and class writing feedback. Plus is $8.33 per user a month billed annually ($99.96 a year) or $12.99 billed monthly, and adds unlimited generations, output history and 50+ student tools. Enterprise is custom-priced."
- q: "Does MagicSchool train AI on student data?"
  a: "MagicSchool says it does not use student or teacher data to train AI. Its student FAQ adds that student conversations are stored so teachers and authorized administrators can see them, are not sold or shared for advertising, and are not allowed to be used to train external AI models. A custom data privacy agreement is part of the Enterprise plan."
- q: "Can students use MagicSchool on their own?"
  a: "Not independently. MagicSchool says students use the platform when a school or educator enables access for an educational purpose and consent requirements are met. Teachers choose which student tools to introduce, and student activity is visible to the teacher."
- q: "How is MagicSchool different from ChatGPT for lesson planning?"
  a: "MagicSchool wraps the model in task-specific forms, so a teacher enters a grade level, topic and standard instead of writing a prompt, and it adds student access with teacher visibility, moderation and district controls. A general assistant is more flexible and works from long uploaded documents, but it has no classroom layer."
---

[MagicSchool](https://www.magicschool.ai) is an AI platform made for K-12 education by Magic School, Inc. Where a general assistant gives a teacher an empty chat box, MagicSchool gives them a catalogue of single-purpose tools, each a short form that produces one kind of classroom material. A separate set of tools is built for students, used under a teacher's oversight, and the district tier adds administration on top.

## Highlights

- **80+ teacher tools.** The catalogue includes the Lesson Plan Generator, Worksheet Generator, Multiple Choice Quiz Maker, Rubric Generator and Presentation Generator. Each takes structured inputs such as grade level, topic and standard, and returns a draft to edit.
- **Raina.** A chatbot for open-ended requests that do not fit a form, included in the free plan.
- **50+ student tools.** MagicSchool calls the student side MagicStudent. Teachers decide which tools to introduce, and built-in moderation and teacher visibility keep activity inside classroom expectations.
- **Quizzes and class writing feedback.** Both are listed on every plan, including the free one.
- **Works with school software.** MagicSchool lists integrations with Google Docs, Google Classroom and Canvas, and Google and Microsoft exports. SIS and LMS integrations and single sign-on are Enterprise features.
- **District controls.** Enterprise adds tool management controls and guardrails, custom tools, alignment to district standards, usage dashboards, co-branding and a customer success manager.
- **Privacy posture.** MagicSchool describes itself as SOC 2 certified and FERPA and COPPA compliant, lists a 1EdTech certification, and says it does not use student or teacher data to train AI.

## In an AI-assisted workflow

Create a free teacher account at [magicschool.ai](https://www.magicschool.ai), open a tool from the [tool catalogue](https://www.magicschool.ai/magic-tools) and fill in the form. The [Multiple Choice Quiz Maker](https://www.magicschool.ai/tools/multiple-choice-quiz-assessment) takes a text or topic, a grade level, a number of questions and any standards, and accepts a pasted reading or an uploaded document. For a quick check for understanding, the inputs might be:

```text
Grade level: 7
Number of questions: 3
Topic or objective: Students can explain why the Moon shows phases,
using the positions of the Sun, Earth and Moon.
Source: the pasted lesson reading (questions should come only from it)
Focus: one question must target the misconception that Earth's shadow
causes the phases.
```

Then read the draft against the lesson before students see it. Check that each question tests the objective, not a detail from the reading, that exactly one option is defensible, and that the answer key is right. A generated item can test recall when the objective asks for explanation, and only you know which one you taught.

The [exit-ticket guide](/guides/workflow/ai-exit-tickets-from-lesson-objectives) covers that review in detail, including how to tie each item to one objective and what to do with the results. [Formative assessment](/glossary/formative-assessment) explains why a short, low-stakes check is worth the care, and the [exit-ticket reviewer](/agents/analytics/exit-ticket-reviewer) agent audits a drafted ticket against the objective you supply.

## Pricing

As of November 2026, [MagicSchool's pricing page](https://www.magicschool.ai/pricing) lists three plans:

| Plan | Price | For | Adds |
| --- | --- | --- | --- |
| Forever Free | $0 | Individual teachers | 80+ teacher tools, Raina, quizzes, class writing feedback |
| Plus | $8.33 per user a month billed annually, or $12.99 billed monthly | Individual teachers | Unlimited generations, output history and output editing, 50+ student tools, student learning insights |
| Enterprise | Custom | Schools and districts | Custom data privacy agreement, SSO, SIS and LMS integrations, tool controls, dashboards |

The annual Plus price works out to $99.96 a year. The page does not publish the generation cap on the free plan; it only lists unlimited generations as a Plus feature, so expect a limit. Enterprise licences are quoted by volume, and the pricing page lists purchasing partners such as BuyBoard in Texas and Shop DOE in New York City.

## Good to know

MagicSchool's own guidance is that its output is a draft: it recommends using AI to brainstorm, organize and differentiate materials, then reviewing and refining before anything reaches students. The tools do not know your class, your pacing or what you taught yesterday unless you put it in the form.

A teacher signing up alone is not the same as a district approval. The custom data privacy agreement, SSO and admin oversight sit in the Enterprise plan, so check your school's policy before you put student work or names into a free account, and before you give students access.

The forms that make MagicSchool fast also make it narrow. [ChatGPT](/tools/chatgpt), [Claude](/tools/claude) and [Gemini](/tools/gemini) handle unusual requests, long back-and-forth revision and large uploaded documents better, but none of them gives you student accounts with teacher visibility. [Gemini Notebook](/tools/notebooklm), formerly NotebookLM, is the closer fit when the job is answering strictly from a set of readings you upload, since it grounds every answer in those sources.
