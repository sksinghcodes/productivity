import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

const view = ["By Task", "Daily", "Weekly", "Monthly", "Yearly"];
const dateRange = ["By Task", "Daily", "Weekly", "Monthly", "Yearly"];

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
