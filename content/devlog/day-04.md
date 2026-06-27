---
title: "Day 04: The Shift to TypeScript & PostgreSQL"
date: "June 24, 2026"
tag: Architecture
---

The honeymoon phase of v1.0 is over. It's time to get serious. 

If this were a production system, JavaScript's dynamic typing and SQLite's file-based locking wouldn't cut it. Today, I began the great migration.

First, I initialized the TypeScript compiler to bring end-to-end type safety to the backend. Catching errors at compile-time instead of runtime is a game changer. 

Then, I ripped out SQLite and connected the app to a robust PostgreSQL database. The code is getting stricter, and the infrastructure is getting stronger.
