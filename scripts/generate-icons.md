# Generate PWA Icons

The PWA manifest requires `icon-192.png` and `icon-512.png` in the `public/` directory.

## Option 1 — Using Inkscape (CLI)

```bash
# Save the SVG from AppIcon component, then:
inkscape icon.svg -w 192 -h 192 -o public/icon-192.png
inkscape icon.svg -w 512 -h 512 -o public/icon-512.png
```

## Option 2 — Using sharp (Node.js)

```js
const sharp = require('sharp');
const fs = require('fs');

const svg = fs.readFileSync('icon.svg');

sharp(svg).resize(192, 192).png().toFile('public/icon-192.png');
sharp(svg).resize(512, 512).png().toFile('public/icon-512.png');
```

## Option 3 — Browser screenshot

1. Render `<AppIcon size={512} />` in a page
2. Right-click the SVG and "Save as PNG"
3. Resize to 192x192 for the smaller icon

Place both files in `/public/`.
