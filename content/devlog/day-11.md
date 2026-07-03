---
title: "Day 11: Shipping v3.0.0"
date: "July 3, 2026"
tag: Product
active: true
---

I started the day away from the code. Before writing another line, I wanted to ground myself in real user problems — scraping forums, reading threads, understanding the actual pain points people share online. It's easy to get lost in architecture and forget that systems exist to serve humans.

That research clarified something I'd been feeling for a while. Dream Wall started as a physical wall inside my room — sticky notes, scribbled ideas, things I wanted to see every day. The digital version should honor that origin. Not a task manager. Not a notes app. **A visual wall for the ideas and dreams you want to see often.**

*EP-014: Build for the human on the other side of the screen.*

With that direction locked in, I moved to design. I used Claude to rapidly scaffold an MVP design foundation — colors, typography, spacing, component patterns. Having an AI pair for design is a genuine game changer. What would normally take days of iteration compressed into hours.

Then came the final push to ship. The entire day funneled into getting **v3.0.0** live. And of course, the last boss before deployment was an old nemesis: CORS. The same class of error that bit me on Day 10, but this time with a twist — trailing slashes on the API URL were causing the preflight requests to fail silently on Render. A quick, clever fix to normalize the URLs, and the deploy went through.

v3.0.0 is live and working. The system is secure, the architecture is clean, and for the first time, it actually *looks* like a product someone would want to use.