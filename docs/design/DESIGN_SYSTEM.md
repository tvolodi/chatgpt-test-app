# AI-Dala Design System Guide

## Overview
This guide ensures all pages maintain a consistent, modern, and vibrant design aesthetic across the AI-Dala platform.

## Color Palette

### Primary Colors
```css
--primary: #0066FF;        /* Electric Blue - primary actions, links, CTAs */
--secondary: #0A1929;      /* Deep Navy - headings, body text */
--accent: #FF6B35;         /* Sunset Orange - secondary actions, highlights */
--background: #F8FAFC;     /* Soft Gray - page backgrounds */
--white: #FFFFFF;          /* White - cards, containers */
```

### Gradient Colors (for badges, special elements)
```css
--purple: #6366F1;         /* Purple - gradient endpoints */
--cyan: #00D4FF;           /* Vibrant Cyan - accents (future use) */
```

### Usage Guidelines
- **Primary (#0066FF)**: Use for all primary buttons, main links, stat values, loading states
- **Secondary (#0A1929)**: Use for all headings (h1-h6), body text, important labels
- **Accent (#FF6B35)**: Use for secondary buttons, call-to-action elements, highlights
- **Background (#F8FAFC)**: Use for page backgrounds
- **White (#FFFFFF)**: Use for cards, modals, elevated surfaces

## Typography

### Font Family
```css
font-family: Inter, system-ui, sans-serif;
```

### Font Sizes & Weights
- **Hero Heading**: 52px, weight 900
- **Page Heading (h1)**: 36-40px, weight 700
- **Section Heading (h2)**: 32px, weight 700
- **Subsection (h3)**: 22-24px, weight 700
- **Body Text**: 16px, weight 400
- **Small Text**: 14px, weight 400-600
- **Tiny Text**: 12px, weight 700 (badges, labels)

## Buttons

### Primary Button
```tsx
{
  background: "#0066FF",
  color: "#FFFFFF",
  padding: "14px 28px",
  borderRadius: 12,
  fontWeight: 700,
  boxShadow: "0 8px 20px rgba(0, 102, 255, 0.3)",
  transition: "all 0.3s ease"
}
```

### Secondary Button
```tsx
{
  background: "#FF6B35",
  color: "#FFFFFF",
  padding: "14px 28px",
  borderRadius: 12,
  fontWeight: 700,
  boxShadow: "0 8px 20px rgba(255, 107, 53, 0.3)",
  transition: "all 0.3s ease"
}
```

### Button Guidelines
- Use **14px vertical** and **28px horizontal** padding
- **12px border radius** for modern, soft corners
- Always include **box-shadow** with color-matched glow
- Add **transition** for smooth hover effects
- Use **700 font weight** for button text

## Cards & Containers

### Standard Card
```tsx
{
  background: "#FFFFFF",
  borderRadius: 16,
  padding: "20-28px",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.04)",
  border: "1px solid rgba(0, 0, 0, 0.05)"
}
```

### Stat Card (Dashboard)
```tsx
{
  background: "#FFFFFF",
  borderRadius: 16,
  padding: "28px 24px",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.04)",
  textAlign: "center",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  border: "1px solid rgba(0, 0, 0, 0.05)"
}
```

### Card Guidelines
- Use **16px border radius** for modern, soft corners
- Always include **dual-layer shadows** for depth
- Add **subtle border** (1px, rgba(0, 0, 0, 0.05)) for definition
- Include **transitions** for interactive cards
- Use **generous padding** (20-28px) for breathing room

## Badges & Labels

### Brand Badge
```tsx
{
  display: "inline-block",
  padding: "6px 16px",
  background: "linear-gradient(135deg, #0066FF 0%, #6366F1 100%)",
  color: "#FFFFFF",
  borderRadius: 20,
  fontSize: "12px",
  fontWeight: 700,
  letterSpacing: "0.5px"
}
```

### Info Box
```tsx
{
  background: "#EFF6FF",
  border: "1px solid #0066FF",
  borderRadius: 12,
  padding: "16px 20px",
  color: "#0A1929"
}
```

## Shadows

### Elevation Levels
- **Button Shadow**: `0 8px 20px rgba(0, 102, 255, 0.3)` (color-matched)
- **Card Shadow**: `0 10px 30px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.04)`
- **Elevated Card**: `0 12px 40px rgba(0, 0, 0, 0.1), 0 6px 16px rgba(0, 0, 0, 0.06)`

### Shadow Guidelines
- Use **color-matched shadows** for buttons (blue glow for blue buttons, orange for orange)
- Use **dual-layer shadows** for cards (large soft + small sharp)
- Increase shadow on **hover** for interactive elements
- Keep shadows **subtle** - avoid harsh, dark shadows

## Spacing

### Standard Spacing Scale
- **4px**: Tight spacing (icon + text)
- **8px**: Small gap
- **12px**: Medium gap (within cards)
- **16px**: Standard gap (between elements)
- **24px**: Large gap (between sections)
- **32px**: Extra large gap (major sections)
- **48px**: Hero spacing

## Border Radius

### Standard Radii
- **Buttons**: 12px
- **Cards**: 16px
- **Badges**: 20px (pill shape)
- **Pills**: 9999px (full pill)
- **Small Elements**: 8px

## Quick Checklist for New Pages

When creating a new page, ensure:

- [ ] Use **Electric Blue (#0066FF)** for primary elements
- [ ] Use **Deep Navy (#0A1929)** for headings and text
- [ ] Use **Sunset Orange (#FF6B35)** for secondary actions
- [ ] Buttons have **14px 28px padding** and **12px border radius**
- [ ] Buttons include **color-matched box-shadow**
- [ ] Cards have **16px border radius** and **dual-layer shadows**
- [ ] Cards include **subtle 1px border**
- [ ] Use **Inter font family** throughout
- [ ] Headings use **700-900 font weight**
- [ ] Include **smooth transitions** (0.3s ease) on interactive elements
- [ ] Maintain **generous spacing** (16-32px between sections)
- [ ] Text has good **contrast** against backgrounds

## Example Component Template

```tsx
// Modern AI-Dala Component
const componentStyle: CSSProperties = {
  background: "#FFFFFF",
  borderRadius: 16,
  padding: "24px",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.04)",
  border: "1px solid rgba(0, 0, 0, 0.05)"
};

const headingStyle: CSSProperties = {
  fontSize: "32px",
  fontWeight: 700,
  color: "#0A1929",
  margin: "0 0 16px"
};

const buttonStyle: CSSProperties = {
  background: "#0066FF",
  color: "#FFFFFF",
  padding: "14px 28px",
  borderRadius: 12,
  fontWeight: 700,
  boxShadow: "0 8px 20px rgba(0, 102, 255, 0.3)",
  transition: "all 0.3s ease",
  border: "none",
  cursor: "pointer"
};
```

## References

- Main Page: `web/src/app/page.tsx`
- Dashboard: `web/src/app/dashboard/page.tsx`
- Login Page: `web/src/app/login/page.tsx`

---

**Last Updated**: 2025-11-20  
**Version**: 1.0
