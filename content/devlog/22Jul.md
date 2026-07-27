# Engineering Lessons from Today

I've realized that the main difference between a product that feels alive and one that feels rigid and "dead" comes down to one thing: timing.

Everything that happens in a user interface has a duration. A reaction time of 0ms feels instant, digital, and robotic. On the other hand, 150ms–300ms feels human and physical. 

Every CSS transition added isn't just an afterthought; it's the process of intentionally slowing down from machine speed to human speed. It's not a performance cost—it's a core feature of the experience.

Here's a breakdown of today's progress:

### Moving Beyond Hardcoded Pixels
I initially started by positioning elements with hardcoded pixels. The issue? Using `left: 900px` means exactly 900 pixels from the left edge. On a large MacBook Pro, that looks perfectly fine. But on a 768px tablet screen, 900px is completely off-screen, causing the card to disappear entirely.

**The Fix:** Transitioning to CSS percentages for horizontal positioning. 
By using `left: 60%`, we're asking for 60% of the wall container's width. On a 1400px screen, that translates to 840px. On a smaller 768px screen, it scales down to 461px. Now, the cards stay on screen automatically, no matter the device.

### Breathing Life into Card Animations
I spent a good chunk of time fine-tuning the card animations to make them feel natural:
- Implemented a staggered animation and keyframes for a satisfying "pop-in" effect.
- **The Toolkit:**
  - `@keyframes` to script the core animation logic.
  - `cubic-bezier()` using a spring curve to give the cards a physical, tangible weight.
  - `animation-delay` mapped to the item's index to create a cascading stagger effect.
  - `animation-fill-mode: both` to ensure delayed cards don't awkwardly flash before appearing.
  - The CSS `rotate` property (kept separate from `transform`) so that the hover scale effect and the card's natural tilt don't conflict with one another.

### Wrapping Up
We've also successfully finished building out the empty state!

**Tomorrow's Focus:** Refactoring the Home layout. The plan is to expand the Wall to take up the full viewport and elegantly float the header/input form directly over the center.