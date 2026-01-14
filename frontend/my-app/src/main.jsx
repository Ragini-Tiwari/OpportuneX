import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'
import App from './App.jsx'

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  // Render a friendly error message instead of crashing
  createRoot(document.getElementById('root')).render(
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-xl border border-red-500/20">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Configuration Error</h1>
        <p className="text-gray-300 mb-4">
          Missing <strong>VITE_CLERK_PUBLISHABLE_KEY</strong> environment variable.
        </p>
        <p className="text-gray-400 text-sm mb-6">
          Please add your Clerk Publishable Key to the <code className="bg-black/30 px-2 py-1 rounded">frontend/my-app/.env</code> file.
        </p>
        <div className="bg-black/50 p-4 rounded text-xs font-mono text-gray-500 break-all">
          VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
        </div>
      </div>
    </div>
  )
} else {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <App />
      </ClerkProvider>
    </StrictMode>,
  )
}
