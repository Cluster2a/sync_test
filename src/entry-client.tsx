import { hydrateRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const container = document.getElementById("root");
if (container) {
  hydrateRoot(container, <App />);
} else {
  console.error("Root element not found");
}
