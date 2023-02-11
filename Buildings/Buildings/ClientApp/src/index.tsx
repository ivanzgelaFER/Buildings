import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { store } from "./store/configureStore";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PrivateRoute } from "./containers/Login/PrivateRoute";
import { Login } from "./containers/Login/Login";
import { Signup } from "./containers/Login/Signup";
import { ForgotPassword } from "./containers/ForgotPassword/ForgotPassword";
import { ResetPassword } from "./containers/ResetPassword/ResetPassword";
import { ToastMessage } from "./containers/ToastMessage/ToastMessage";
import { App } from "./App";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./index.css";

const root = createRoot(document.getElementById("root")!);

root.render(
    <Provider store={store}>
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/sign-up" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/*" element={<PrivateRoute path="/" component={App} />} />
            </Routes>
        </BrowserRouter>
        <ToastMessage />
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
