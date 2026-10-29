import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

console.log(
  "%cYou made it all the way to the console!",
  "color: #c2410c; font-size: 16px; font-weight: 700; padding: 4px 0;",
);
console.log(
  "%cCurious people are my kind of people. Let’s connect on LinkedIn:\n%c%s",
  "color: #4a3a2e; font-size: 12px; line-height: 1.6;",
  "color: #c2410c; font-size: 12px; font-weight: 700;",
  "https://www.linkedin.com/in/vinette-sequeira/",
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
