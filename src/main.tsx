import { StrictMode } from 'react'
import { ConfigProvider as ThemeProvider, theme } from 'antd';
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// get url params
const urlParams = new URLSearchParams(window.location.search);
const themeParam = urlParams.get('theme');

const selectedTheme = themeParam === 'light' ? 'defaultAlgorithm' : 'darkAlgorithm';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider
      theme={{
      algorithm: theme[selectedTheme],
      "token": {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
      },
    }}>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
