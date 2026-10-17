// Shared Tailwind class names, so every page looks consistent.
// Reference system: warm blurred brown canvas, frosted glass panels,
// solid white cards, white active pills, a single orange accent.

const button =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c8805a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#e9e1d7] disabled:cursor-not-allowed disabled:opacity-60";

// White pill (the reference's active pill): the one primary action on a screen.
export const btnPrimary = `${button} bg-[#fffffd] text-[#2a1a16] shadow-[0_10px_24px_-12px_rgba(120,90,70,0.6)] hover:bg-white hover:-translate-y-px`;
// Translucent pill for secondary actions on glass.
export const btnSecondary = `${button} border border-[#fffffd]/30 bg-[#fffffd]/12 text-[#3a2e28] hover:bg-[#fffffd]/22`;
export const btnGhost = `${button} text-[#3a2e28]/85 hover:bg-[#fffffd]/14 hover:text-[#3a2e28]`;
// Outlined pill for use on top of white cards.
export const btnOutline = `${button} border border-[#2a1a16]/20 bg-white text-[#2a1a16] hover:bg-[#2a1a16]/5 focus-visible:ring-offset-white`;

export const inputClass =
  "block w-full rounded-2xl border border-[#2a1a16]/12 bg-[#f6f1ec] px-4 py-3 text-sm text-[#2a1a16] placeholder:text-[#2a1a16]/40 focus:border-[#c8805a] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c8805a]/30 disabled:opacity-60 aria-[invalid=true]:border-red-500";

// Solid white card (sits on glass for readability).
export const cardClass = "paper rounded-[1.5rem] p-5 sm:p-6";

// Large frosted glass panel.
export const glassPanel = "glass rounded-[2rem] p-3 sm:p-4";

export const containerClass = "mx-auto w-full max-w-6xl px-4 sm:px-6";

// Small label above headings.
export const eyebrow = "text-sm font-medium text-[#3a2e28]/65";

// Light, wide-tracked geometric headings, as the reference's "Smart Light".
export const displayHeading = "font-light tracking-tight";
