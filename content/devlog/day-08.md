---
title: "Day 08: Identity & Ownership (v3.0.0)"
date: "June 29, 2026"
tag: Engineering
---

We've officially entered v3.0.0 territory. Today, I implemented a complete JWT-based authentication system from scratch using bcrypt and jsonwebtoken.

While building this, the distinction between two often-confused concepts became impossible to mix up — because the code forces them apart:
- **Authentication** asks: *"Who are you?"* (Handled by the `/auth/login` route generating a token).
- **Authorization** asks: *"Does this resource belong to you?"* (Handled by strict Prisma queries tying dreams to a specific `userId`).

To enforce this, I wrote an `authenticate` middleware. Here's how the protected data flow looks now:

```text
[ Browser ] 
    │ (Bearer Token)
    ▼
[ Authorization Header ]
    │
    ▼
[ authenticate Middleware ] ── (Validates JWT)
    │
    ▼
[ req.user.id ] ── (Injects Identity)
    │
    ▼
[ Route ] ── (Extracts req.body & req.user.id)
    │
    ▼
[ Service ] ── (Business Logic)
    │
    ▼
[ Prisma ORM ] ── (where: { id, userId })
    │
    ▼
[ PostgreSQL Database ]
```

By passing `userId` all the way down to the database layer, we guarantee that users can only ever touch their own dreams. Not through permission checks in the UI, not through frontend validation — through the query itself. The system isn't just functional anymore; it's secure by design.