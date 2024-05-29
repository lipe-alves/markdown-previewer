import React from "react";
import ReactDOM from "react-dom";

import {
    ThemeProvider,
    EditorProvider,
    ModalProvider,
    LoaderProvider,
    I18nProvider,
} from "@providers";
import { Composer } from "@components";
import App from "./App";

import "@styles/main.scss";
import "@styles/fonts.scss";

const providers = [
    I18nProvider,
    ThemeProvider,
    LoaderProvider,
    ModalProvider,
    EditorProvider,
];

const rootElement = document.getElementById("root")!;

ReactDOM.render(
    <React.StrictMode>
        <Composer components={providers}>
            <App />
        </Composer>
    </React.StrictMode>,
    rootElement
);
