# @spec2app/web

Frontend application for Spec2App - Transform natural language specifications into Design Contracts.

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework

## Features

- 🎨 Modern and responsive UI
- 🚀 Real-time API status indicator
- 📝 Interactive specification input with examples
- 🔍 Visual Design Contract display
- 📥 Download contracts as JSON
- ⚡ Fast development with Vite HMR

## Development

```bash
# Install dependencies (from monorepo root)
pnpm install

# Start dev server
pnpm --filter @spec2app/web dev

# Or from this directory
cd apps/web
pnpm dev
```

The app will be available at `http://localhost:5173`

## Environment Variables

Create a `.env` file in this directory:

```env
VITE_API_URL=http://localhost:3000
```

## Build

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Docker

```bash
# Build Docker image
docker build -t spec2app-web .

# Run container
docker run -p 5173:80 spec2app-web
```

## Project Structure

```
apps/web/
├── src/
│   ├── components/        # React components
│   │   ├── Header.tsx           # App header with status
│   │   ├── SpecificationInput.tsx   # Input form
│   │   └── ContractDisplay.tsx      # Contract viewer
│   ├── api.ts            # API client
│   ├── types.ts          # TypeScript types
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # App entry point
│   └── index.css         # Tailwind CSS
├── public/               # Static assets
├── index.html           # HTML template
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
├── tsconfig.json        # TypeScript configuration
└── Dockerfile           # Docker build
```

## Components

### Header
- Displays app title and description
- Shows real-time API health status
- Auto-refreshes every 30 seconds

### SpecificationInput
- Textarea for specification input
- Loading state during analysis
- Quick example buttons
- Clear button

### ContractDisplay
- Visual representation of Design Contract
- Organized sections: Metadata, Entities, Services, UI
- Color-coded badges and tags
- JSON download functionality

## API Integration

The app connects to the Spec2App API at `VITE_API_URL` (default: `http://localhost:3000`).

Endpoints used:
- `GET /health` - Health check
- `POST /api/analyze` - Analyze specification
- `POST /api/validate` - Validate contract

## Styling

Using Tailwind CSS with custom configuration:
- Responsive design (mobile-first)
- Modern color palette
- Smooth transitions and animations
- Accessible components

## Best Practices

✅ **TypeScript** - Fully typed with strict mode  
✅ **Component composition** - Small, reusable components  
✅ **Error handling** - User-friendly error messages  
✅ **Loading states** - Clear feedback during async operations  
✅ **Responsive design** - Works on all screen sizes  
✅ **Performance** - Optimized builds with Vite  
✅ **Accessibility** - Semantic HTML and ARIA labels
