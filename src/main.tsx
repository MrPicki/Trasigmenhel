import { createRoot } from 'react-dom/client'
// Both faces are self-hosted and bundled with the site: no third-party
// stylesheet blocking the first paint, and no visitor IP handed to a font
// CDN. The @font-face rules carry unicode-range, so a Swedish visitor only
// ever downloads the latin subset.
import '@fontsource-variable/familjen-grotesk'
import '@fontsource-variable/martian-mono'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);
