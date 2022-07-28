import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { createStore, applyMiddleware } from "redux";
import * as immutableState from "redux-immutable-state-invariant";
import { Provider } from "react-redux";
import { composeWithDevTools } from "@redux-devtools/extension";
import { init } from "./socket";

// import thunk from "redux-thunk";

import rootReducer from "./redux/reducer";
import "./index.css";
import App from "./App";
import Welcome from "./welcome";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(immutableState.default()))
);

fetch("api/user/id")
    .then((response) => response.json())
    .then((data) => {
        console.log("Data received from server:", data);

        if (!data.userId) {
            console.log("data.userId", data.userId);

            root.render(<Welcome />);
        } else {
            // I want to initialize Websocket connection ans pass the store to it
            init(store);

            root.render(
                <React.StrictMode>
                    <Provider store={store}>
                        <BrowserRouter>
                            <App />
                        </BrowserRouter>
                    </Provider>
                </React.StrictMode>
            );
        }
    });

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
