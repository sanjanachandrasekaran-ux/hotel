import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { store } from "./store.js";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <HelmetProvider>
      <App />
     </HelmetProvider>
      </Provider>
  </StrictMode>,
)
