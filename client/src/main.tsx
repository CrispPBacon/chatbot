import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router basename="/chatbot">
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  </StrictMode>
);
