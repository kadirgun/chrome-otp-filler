import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./app.tsx";
import styles from "./index.css?inline";

console.log("content script loaded");

const host = document.createElement("otp-filler");
const shadow = host.attachShadow({ mode: "open" });
const root = document.createElement("div");
root.id = "root";
shadow.appendChild(root);
document.body.appendChild(host);

setInterval(() => {
  chrome.runtime.sendMessage("content-script-sync");
}, 1000);

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <style>{styles}</style>
    <App />
  </React.StrictMode>
);
