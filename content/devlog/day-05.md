---
title: "Day 05: Clean Architecture & The Service Layer"
date: "June 25, 2026"
tag: Architecture
---

As the backend grew, the route files started doing too much. They were parsing requests, writing SQL queries, and handling responses. 

*EP-003: Organize by feature, not by generic names.*

I introduced a dedicated **Service Layer**. Now, the route files strictly handle the HTTP context (req/res), and they pass the data down to the services which handle the actual business logic. 

By separating these concerns, the code is significantly easier to test, read, and maintain. The system is starting to feel incredibly solid.
