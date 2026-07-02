---
title: "Day 10: Wiring It All Together"
date: "July 2, 2026"
tag: Integration
active: true
---

Yesterday, React was just a mental model. Today, I needed to prove it works. I gave myself one goal for the day: one complete user journey. Open the app, log in, see the home page, log out. No shortcuts, no mocks.

I started by building out the frontend's service layer — `api.ts` and `auth.ts`. And immediately, a pattern I've been feeling all project long finally crystallized. `api.ts` is to the frontend what Prisma is to the backend. It's a data access layer. It shouldn't know about business logic, it shouldn't know about UI state. It should only know how to make HTTP requests. Same principle, different side of the stack.

*EP-013: Things that change together should live together.*

That's cohesion. When I noticed the token logic was scattered between `api.ts` and `auth.ts`, I extracted it into its own `storage.ts` module. One place that knows about `localStorage`. One place to change if we ever swap the storage mechanism. Things that change together, live together.

Then came the wall. I wired the Login page to the backend, hit submit, and... CORS. The browser just silently refused to talk to my own server. The error message didn't scream "you need a cors package." It just looked like the request vanished. It took me longer than I'd like to admit to trace it back to a missing middleware on the Express side. A one-line fix after a not-so-one-line debugging session.

But once CORS was resolved, something quietly remarkable happened. I typed in an email, entered a password, clicked Login — and the app navigated to the home page. A real JWT, stored in the browser, issued by my own backend, validated by my own middleware. For the first time, a user can actually *use* this thing end-to-end.

I closed the loop with a logout button, then paused. The engineering is solid. The architecture is clean. But staring at the raw, unstyled React pages, I realized something: *nobody cares how clean your code is if the product doesn't feel real.* I started sketching out an MVP Design System. It's time to stop building only for the compiler and start building for the human on the other side of the screen.