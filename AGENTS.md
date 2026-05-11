<!-- BEGIN:nextjs-agent-rules -->

# IMPORTANT — Read Before Generating Any Next.js Code

This project uses a modified/newer Next.js architecture that may include breaking changes compared to your training data.

Before writing or modifying any code:

- Read the relevant documentation inside:
  `node_modules/next/dist/docs/`

- Do NOT assume:
  - old App Router behavior
  - Pages Router conventions
  - legacy API patterns
  - outdated file structures
  - deprecated config formats
  - previous middleware implementations

- Always verify:
  - routing conventions
  - server/client component rules
  - data fetching methods
  - caching behavior
  - metadata APIs
  - config structure
  - deployment/build requirements

- Strictly follow:
  - current framework conventions
  - latest deprecation warnings
  - official migration guidance
  - existing project architecture

- Avoid generating:
  - deprecated APIs
  - legacy patterns
  - unnecessary client components
  - outdated configuration syntax
  - unsupported experimental features

- Prefer:
  - modern App Router architecture
  - server-first rendering patterns
  - optimized performance practices
  - reusable scalable components
  - production-grade code structure

Treat the local project documentation as the source of truth over prior framework knowledge.

# IMPORTANT — Styling & UI System Rules

This project follows a strict premium sportswear design system inspired by:

- Puma
- Nike
- TechnoSport

However, the final UI must feel unique, modern, engineered, and production-grade — not like a copied ecommerce template.

## Design Language

The interface should feel:

- premium
- minimal
- fast
- athletic
- technical
- editorial
- high-performance

Avoid:

- cluttered layouts
- flashy gradients
- glassmorphism
- random colors
- playful UI
- oversized shadows
- template-looking sections

## Core Styling Rules

- Use a clean spacing hierarchy
- Maintain large whitespace between sections
- Prefer sharp layouts with subtle soft corners
- Keep product imagery as the visual focus
- Use strong typography hierarchy
- Preserve visual balance and breathing room

## Color System

Always use global CSS variables.

Primary palette:

```css id="u3c8vz"
:root {
  --primary: #964900;
  --primary-bright: #ec7700;
  --primary-light: #ffb786;

  --background: #f9f9f9;
  --surface: #ffffff;
  --surface-soft: #f3f3f4;

  --text-primary: #1a1c1c;
  --text-secondary: #574336;

  --border: #e2e2e2;
  --outline: #8a7263;

  --black: #1E1E1E;
  --white: #FFFFFF;

  --success: #0061a2;
  --error: #ba1a1a;
}
Color Usage Rules
Orange is reserved ONLY for:
CTA buttons
active states
highlights
interactive emphasis
Black and white define:
structure
contrast
typography
layout hierarchy
Gray tones must remain subtle and minimal.
Typography Rules

Use:

Space Grotesk → headings
Lexend → body/UI

Typography should feel:

bold
clean
modern
athletic
editorial

Avoid:

decorative fonts
playful typography
inconsistent text sizing
Layout Rules
Use a 12-column desktop grid
Large section spacing (80px+)
Responsive mobile-first structure
Editorial-style composition
Minimal clutter
Proper content alignment
Components
Buttons
Primary:
orange background
white text
uppercase labels
minimal radius
Secondary:
black outline
transparent background
invert on hover
Product Cards
image-first design
no heavy borders
subtle hover elevation
hover quick-add interaction
minimal metadata
Navbar
transparent initially
sticky on scroll
premium spacing
clean iconography
Shadows

Use only soft subtle shadows:

low opacity
minimal blur
premium depth

Avoid heavy floating cards.

Animation Rules

Use:

smooth transitions
subtle hover scaling
micro interactions
premium motion

Avoid:

excessive animations
bouncing effects
flashy movement
distracting transitions
Responsive Design

Must be fully optimized for:

desktop
tablet
mobile

Mobile UI should:

preserve premium feel
prioritize readability
maintain touch-friendly spacing
Final Visual Goal

The final website should feel like:

a globally premium sportswear brand
high-performance athletic ecommerce
engineered minimalism
modern editorial commerce

Every section should look production-ready and visually balanced.

<!-- END:nextjs-agent-rules -->
```
