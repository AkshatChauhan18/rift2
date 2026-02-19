# 🚀 PharmaGuard Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

## Installation

```bash
cd frontend
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

Visit: `http://localhost:5173`

## Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

## Preview Production Build

```bash
npm run preview
```

## Key Features to Explore

### 1. Landing Page (`/`)
- Animated hero section with floating elements
- Feature cards with hover effects
- Statistics display
- Animated CTA section

### 2. Analysis Page (`/analysis`)
- Interactive file upload (drag & drop)
- Searchable drug multi-select
- Real-time analysis with loading animation
- Premium results dashboard with:
  - Risk assessment card
  - Pharmacogenomic profile
  - Clinical recommendations
  - AI-generated explanations
  - Quality metrics

### 3. About Page (`/about`)
- Mission, features, and team info
- Animated statistics
- Feature cards with icons

### 4. Dark Mode
- Toggle in the navbar (top right)
- Smooth transition animation
- Optimized colors for both themes

## Design Highlights

### Glassmorphism
All cards use premium glass effects with:
- Backdrop blur
- Transparent backgrounds
- Soft shadows
- Border highlights

### Animations
- Page transitions
- Component entrance animations
- Hover effects
- Loading states
- Micro-interactions

### Color System
- **Primary**: Deep Blue (#2563EB)
- **Secondary**: Teal (#14B8A6)
- **Success**: Green (#22C55E)
- **Warning**: Yellow (#EAB308)
- **Danger**: Red (#EF4444)

## Testing the Analysis Flow

1. Go to `/analysis`
2. Upload a VCF file (or use drag & drop)
3. Select one or more drugs from the dropdown
4. Click "Analyze Risk"
5. View the animated results dashboard

## Customization

### Colors
Edit `frontend/src/index.css` to modify CSS variables:
```css
:root {
  --primary: 217 91% 60%;
  --secondary: 172 66% 50%;
  /* ... */
}
```

### Animations
Edit `frontend/tailwind.config.ts` to add/modify animations:
```typescript
keyframes: {
  "your-animation": {
    /* ... */
  }
}
```

### Components
All components are in `frontend/src/components/`
- Fully typed with TypeScript
- Use Framer Motion for animations
- Styled with Tailwind CSS

## Performance Tips

1. **Lazy Loading**: Components load on demand
2. **Optimized Images**: Use WebP format
3. **Code Splitting**: Automatic with Vite
4. **Tree Shaking**: Unused code removed in production

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use
```bash
# Use a different port
npm run dev -- --port 3000
```

### Slow Performance
- Check browser DevTools for console errors
- Disable browser extensions
- Clear browser cache

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions
│   ├── services/       # API services
│   ├── utils/          # Helper functions
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles
├── public/             # Static assets
├── package.json        # Dependencies
├── tailwind.config.ts  # Tailwind configuration
├── tsconfig.json       # TypeScript configuration
└── vite.config.ts      # Vite configuration
```

## Next Steps

1. ✅ Explore all pages and features
2. ✅ Test the analysis flow
3. ✅ Try dark mode toggle
4. ✅ Test on mobile devices
5. ✅ Customize colors/branding
6. ✅ Deploy to production

## Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

## Support

For issues or questions:
- Check `REDESIGN_COMPLETE.md` for detailed documentation
- Review component code in `src/components/`
- Check browser console for errors

---

**Enjoy your premium AI healthcare platform! 🎉**
