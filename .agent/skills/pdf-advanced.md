# Skill: Advanced PDF Styling & Layout

> [!NOTE]
> This skill is based on the `pdf-official` and `pdf-advanced` skills discovered via SkillsMP.

## Overview

While `html2canvas` and `jspdf` provide a basic way to generate PDFs, professional resumes require precise control over typography, spacing, and multi-page layouts.

## Key Challenges

1.  **Page Transitions**: Preventing text from being cut in half at the bottom of a page.
2.  **Korean Font Rendering**: Ensuring fonts load BEFORE the snapshot (GR-10).
3.  **High DPI**: Ensuring the PDF isn't blurry.

## Advanced Techniques

### 1. Wait for Fonts (GR-10)

```typescript
await document.fonts.ready;
// or specifically for your target font
await document.fonts.load('1rem "Pretendard"');
```

### 2. Precise Page Breaking

Use the `break-inside: avoid` CSS property in the HTML before capturing.

```css
.resume-section {
  page-break-inside: avoid;
  break-inside: avoid;
}
```

### 3. Custom jspdf Configuration

```typescript
const doc = new jsPDF({
  orientation: 'portrait',
  unit: 'mm',
  format: 'a4',
  compress: true
});

// Calculate height to fit A4 ratio
const canvas = await html2canvas(element, { scale: 2 });
const imgData = canvas.toDataURL('image/jpeg', 1.0);
doc.addImage(imgData, 'JPEG', 0, 0, 210, 297);
```

### 4. Vector vs Raster

For best quality, combine `html2canvas` for complex layouts with direct `jspdf` text drawing for sharp headings.

## Best Practices

- **Margins**: Maintain at least 15mm margins on all sides.
- **File Size**: Compress images (like the profile photo) before adding to the canvas to keep the PDF under 2MB.
- **Accessibility**: Ensure the HTML has proper semantic tags (`h1`, `p`) so screen readers can interpret the resume if needed.