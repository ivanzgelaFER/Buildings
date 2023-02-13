import axios from "axios";
import { HomePage } from "./containers/HomePage/HomePage";
import { Layout } from "./containers/Layout/Layout";
import { Route, Routes, useLocation } from "react-router-dom";
import { configureAxiosClient } from "./api/axiosClient";
import { ResetPasswordFirstLogin } from "./containers/ResetPassword/ResetPasswordFirstLogin";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./App.css";

configureAxiosClient(axios);

export const App = () => {
    const location = useLocation();

    return (
        <Layout>
            <Routes location={location}>
                <Route index path="*" element={<HomePage />} />
            </Routes>
            <ResetPasswordFirstLogin />
        </Layout>
    );
};
