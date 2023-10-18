import React from "react";
import * as ReactDOMClient from "react-dom/client";
import App from "./App"
import { BrowserRouter } from "react-router-dom";

const app = ReactDOMClient.createRoot(document.getElementById("root"))

app.render(
    <BrowserRouter>
    <App/>
    </BrowserRouter>
)
