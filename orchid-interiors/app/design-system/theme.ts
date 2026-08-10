/**
 * Type-safe Design System Tokens for ORCHID.
 * Use these tokens for consistent layout calculations,
 * inline styles, canvas drawings, or GSAP / Framer Motion animations.
 */

export const COLORS = {
  light: {
    background: "#F8F6F2",     // Warm Sand
    foreground: "#1E1E1C",     // Obsidian
    bgSecondary: "#EFE8DE",    // Soft Beige
    bgTertiary: "#F5F1EB",     // Warm White
    muted: "#5F5A54",          // Body Text Muted
    border: "#DDD5CA",         // Warm Border
    accentRed: "#CF252A",      // Red Accent
    accentSage: "#B7C3AE",     // Sage Green
    accentWalnut: "#6F5846",   // Walnut Wood
    accentGold: "#C4A76A",     // Gold Accent
  },
  dark: {
    background: "#1E1E1C",     // Obsidian
    foreground: "#F8F6F2",     // Warm Sand
    bgSecondary: "#2B2926",    // Charcoal
    bgTertiary: "#373531",     // Card Charcoal
    muted: "#A39E96",          // Light Warm Muted
    border: "#3D3B38",         // Subtle Dark Border
    accentRed: "#E23A3F",      // Adjusted Red
    accentSage: "#9FB297",     // Adjusted Sage
    accentWalnut: "#8A715C",   // Adjusted Walnut
    accentGold: "#D2B57B",     // Adjusted Gold
  }
} as const;

export const TYPOGRAPHY = {
  fonts: {
    heading: "var(--font-serif), Cormorant Garamond, Georgia, serif",
    body: "var(--font-sans), Manrope, Inter, sans-serif",
  },
  sizes: {
    hero: {
      desktop: "96px",
      mobile: "56px",
      lineHeight: "1.05",
      letterSpacing: "-0.03em",
    },
    display: {
      desktop: "72px",
      mobile: "40px",
      lineHeight: "1.1",
      letterSpacing: "-0.02em",
    },
    h1: {
      desktop: "64px",
      mobile: "36px",
      lineHeight: "1.15",
      letterSpacing: "-0.02em",
    },
    h2: {
      desktop: "48px",
      mobile: "28px",
      lineHeight: "1.2",
      letterSpacing: "-0.01em",
    },
    h3: {
      desktop: "36px",
      mobile: "24px",
      lineHeight: "1.25",
      letterSpacing: "0",
    },
    h4: {
      desktop: "28px",
      mobile: "20px",
      lineHeight: "1.3",
      letterSpacing: "0",
    },
    bodyLarge: "20px",
    body: "18px",
    small: "16px",
    caption: "14px",
    buttons: "15px",
    navigation: "14px",
  }
} as const;

export const SPACING = {
  space1: "8px",
  space2: "16px",
  space3: "24px",
  space4: "32px",
  space5: "40px",
  space6: "48px",
  space8: "64px",
  space10: "80px",
  space12: "96px",
  space15: "120px",
  space20: "160px",
} as const;

export const RADIUS = {
  button: "999px",
  input: "20px",
  card: "24px",
  image: "28px",
} as const;

export const SHADOWS = {
  soft: "0 4px 30px rgba(30, 30, 28, 0.02)",
  luxury: "0 10px 50px rgba(30, 30, 28, 0.04)",
  floating: "0 20px 60px rgba(30, 30, 28, 0.06)",
} as const;

export const ANIMATION = {
  easings: {
    luxury: "cubic-bezier(0.22, 0.61, 0.36, 1)",
  },
  durations: {
    fast: "150ms",
    normal: "300ms",
    slow: "600ms",
    page: "800ms",
  }
} as const;
