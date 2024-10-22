import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import SseEvent from "./SseEvent.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <SseEvent />
    </StrictMode>
);
