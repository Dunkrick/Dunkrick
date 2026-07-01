---
title: "Day 09: The React Migration"
date: "July 1, 2026"
tag: Architecture
---

The frontend has been running on vanilla HTML, CSS, and JS since v1.0. It worked, but there was a fundamental friction I couldn't ignore any longer.

With plain HTML, you're constantly *telling* the browser what to change. "Update this div. Remove that element. Append this child." It's imperative, and it's exhausting. With **React**, you simply *describe* how the UI should look, and React figures out what to change. It's the difference between micromanaging and delegating.

*EP-012: Declare intent, don't dictate steps.*

Today, I initiated the React architecture. The first thing that clicked was that React components are just **functions that return UI**. That's it. No magic. And once I saw it that way, a beautiful symmetry with the backend became impossible to unsee:

```text
Backend:  Input (Request)  →  Function (Route)     →  Output (JSON)
Frontend: Input (Props)    →  Function (Component)  →  Output (HTML)
```

Both sides of the stack are just functions that transform inputs into outputs. The shapes are different, but the *pattern* is identical.

Even the orchestration mirrors itself. On the backend, the **Server** orchestrates and the **Routes** implement. On the frontend, the **App** orchestrates and the **Pages** implement. Same architecture, different rendering target.

The migration is just getting started, but the mental model already feels right.
