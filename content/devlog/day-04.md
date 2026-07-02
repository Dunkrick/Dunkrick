---
title: "Day 04: The Shift to TypeScript & PostgreSQL"
date: "June 24, 2026"
tag: Architecture
---

The honeymoon phase of v1.0 is over. It's time to get serious.

If this were a production system — the kind that handles real users, real data, real stakes — JavaScript's dynamic typing and SQLite's file-based locking wouldn't cut it. I've been putting off this migration because everything "works." But "works" and "works correctly under pressure" are two very different standards.

Today, I began the great migration. First, I initialized the TypeScript compiler to bring end-to-end type safety to the backend. There's a specific kind of relief that comes from catching a misspelled property name at compile-time instead of discovering it in a 2 AM production bug.

Then, I ripped out SQLite and connected the app to PostgreSQL. The code is getting stricter, and the infrastructure is getting stronger. It feels less like a side project now and more like a real system.
