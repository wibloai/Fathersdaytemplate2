# TEMPLATE_02_SCRAPBOOK_SPEC.md

> **DIRECTIVE FOR AI AGENT:**
> This document dictates the architecture, UI/UX flow, and state management for Template 2 ("The Analog Scrapbook") of the Father's Day campaign. 
> Stack: Next.js 16, React 19, TypeScript, Tailwind CSS v4.
> Requirement: Build a single-page interactive component (`ScrapbookEngine.tsx`) that relies on React state (`useState`) to transition between distinct visual phases. Do not build multi-page navigation. Maintain strict schema parity with the global `sites.custom_data` object.

---

## 1. Engine Overview & Aesthetic
* **Theme Name:** The Analog Scrapbook
* **Vibe:** Warm, tactile, vintage, highly physical interaction.
* **Typography:** Typewriter or Monospace for captions/headers; Handwritten/Cursive (e.g., `font-caveat` or `font-handwriting`) for the custom letter.
* **Color Palette:** Warm sepia/cream background (`#F4EFE6`), dark charcoal text (`#1A1A1A`), white borders for photos.

---

## 2. Global Data Schema (`sites.custom_data`)
The component MUST consume this exact JSON structure. Do not invent new fields.

```json
{
  "theme_style": "retro",
  "content": {
    "dad_name": "Arvind Sharma",
    "hero_tagline": "Special Delivery for",
    "custom_letter": "Dear Dad, thank you for everything...",
    "music_source_url": "[https://www.youtube.com/watch?v=](https://www.youtube.com/watch?v=)...",
    "memory_photos": [
      { "url": "[https://res.cloudinary.com/](https://res.cloudinary.com/)...", "year": "2005", "caption": "Teaching me to ride a bike." },
      { "url": "[https://res.cloudinary.com/](https://res.cloudinary.com/)...", "year": "2012", "caption": "Graduation day." }
    ]
  }
}

3. The Interactive State Machine (The Flow)
Manage the user's journey using a primary React state: const [currentPhase, setCurrentPhase] = useState(1);.

Phase 1: The Delivery (State: 1)
Visual: A solid, warm cream background. In the center, a digital envelope icon or graphic. Above it, typewriter text reads: content.hero_tagline + content.dad_name.

Interaction: A pulsing "Tap to Open" indicator.

Transition: On tap, setCurrentPhase(2). The envelope triggers a CSS fade-out/scale-down, and the first photo slides in.

Phase 2: The Polaroid Stack (State: 2)
Visual: A stack of photos rendered via absolute positioning. Each photo has a thick white border, a slight CSS rotation (rotate-2, -rotate-1, etc.), and a heavy drop shadow. The caption and year are written below the image in a handwritten font.

State Logic: Require a secondary state: const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);.

Interaction: When the user taps the top photo, increment currentPhotoIndex. Apply a Tailwind transition (translate-x-[120%] opacity-0 rotate-12 duration-500 ease-in-out) to animate the top card flying off the screen.

Transition: When currentPhotoIndex === memory_photos.length, automatically trigger setCurrentPhase(3).

Phase 3: The Folded Note (State: 3)
Visual: A folded piece of lined notebook paper or vintage parchment sits in the center of the screen.

Interaction: A button reads: "Unfold your letter."

Transition: On click, apply a CSS transform that expands the paper vertically. Reveal the content.custom_letter inside a container with overflow-y-auto so the user can scroll through long text without breaking the page layout. Delay rendering the final CTA button by 2 seconds to ensure they read the letter.

Phase 4: The Cassette Climax (State: 4)
Visual: At the bottom of the unfolded letter, a graphic of a vintage cassette tape appears.

Interaction: A button reads: "Press Play."

Transition & Execution: 1. The cassette graphic spins via a CSS keyframe animation (animate-spin).
2. The embedded audio track (content.music_source_url) begins playing.
3. The notebook paper fades away, and all uploaded photos instantly fan out across the background in a scattered masonry or overlapping collage layout.

4. Technical Implementation Directives
Avoid Complex Libraries: Do not install Framer Motion or heavy physics libraries. Use Tailwind v4 transition utilities (e.g., transition-all duration-700 ease-out) for phase shifts and card swipes.

Audio Handling: Use a hidden react-player instance or a standard <audio> tag. The audio .play() method MUST be attached to the onClick event of the "Press Play" button in Phase 4 to bypass browser autoplay restrictions.

Z-Index Management: For the Phase 2 stack, map the memory_photos array in reverse order, or dynamically assign z-index based on the array length minus the current index to ensure the correct photo stays on top.