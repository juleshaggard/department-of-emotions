# Department of Emotions design system

## Theme

A person uses a quiet, tactile-feeling wheel in ordinary ambient light to find language for an emotion. Retain the approved light warm-paper theme.

## Colors

Paper: oklch(98% 0.008 105). Ink: oklch(28% 0.022 154). Muted text: oklch(49% 0.016 154). Dividers: oklch(86% 0.012 125). Feelings preserves its source palette and approved appearance settings. The approved alternative palettes use separate OKLCH anchors: warm spiced pastels for Situations, mineral tones for Sensations, and brighter fruit-and-leaf tones for Behaviors. Families sweep through neighboring hues; softer middle rings and richer/lighter outer steps make the hierarchy visible. Keep dark-label contrast at least 4.5:1. Selection outlines are white; the original wheel's default borders are hidden.

## Typography

Gilda Display, locally hosted, for emotion headlines. System sans-serif for prose and controls. Radial wheel labels use Calibri/Carlito/Arial and always read outward. Small section labels use uppercase sans-serif with 1.6px tracking.

## Layout

Large left-bleeding wheel, vertically centered. Right reading column up to 400px with stable bands, hierarchy after examples, and a compact brand/creator footer. Portrait phones and tablets use a bottom drawer; landscape phones retain a stationary wheel and independently scrolling sidebar. Use the existing breakpoints and interaction rules from AGENTS.md.

## Components

Native modal drawer with full logo and wordmark at the top-left and Close at the top-right. Wheel tabs sit above the emotion in the inline sidebar, with selected text and an underline. Portrait layouts keep the tabs at the top. The creator link stays underlined. Keep the original static wheel unchanged.

## Motion

Reuse the interruptible wheel motion and reduced-motion support. Selected wheel variants remount cleanly so stale selections, gestures, and drawer state do not carry into another dataset.
