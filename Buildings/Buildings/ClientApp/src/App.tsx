import axios from "axios";
import "./App.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { HomePage } from "./containers/HomePage/HomePage";
import { Layout } from "./containers/Layout/Layout";
import { Route, Routes, useLocation } from "react-router-dom";
import { configureAxiosClient } from "./api/axiosClient";
import { ResetPasswordFirstLogin } from "./containers/ResetPassword/ResetPasswordFirstLogin";
import { UserDetails } from "./containers/UserDetails/UserDetails";
import { UserDetailsForm } from "./containers/UserDetails/UserDetailsForm";

configureAxiosClient(axios);

export const App = () => {
    const location = useLocation();

    return (
        <Layout>
            <Routes location={location}>
                <Route index path="*" element={<HomePage />} />
                <Route path="userDetails" element={<UserDetails />} />
                <Route path="userDetailsForm" element={<UserDetailsForm />} />
            </Routes>
            <ResetPasswordFirstLogin />
        </Layout>
    );
};
