---
title: "Day 05: Clean Architecture & The Service Layer"
date: "June 25, 2026"
tag: Architecture
---

As the backend grew, the route files started doing too much. They were parsing requests, writing database queries, and handling responses — all in the same function. Every time I touched one thing, I risked breaking something else.

*EP-003: Organize by feature, not by generic names.*

I introduced a dedicated **Service Layer**. The route files now strictly handle the HTTP context — extracting `req.body`, setting status codes, sending responses. Everything else gets passed down to the services, which own the actual business logic.

It's the kind of refactor that doesn't change what the app *does*, but fundamentally changes how it *feels* to work on. The code reads like clear responsibilities now, not tangled spaghetti. And for the first time, I can look at a route and know exactly where to find the logic it depends on.
