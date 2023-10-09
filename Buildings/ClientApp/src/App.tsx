import axios from "axios";
import "./App.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Layout } from "./containers/Layout/Layout";
import { Route, Routes, useLocation } from "react-router-dom";
import { configureAxiosClient } from "./api/axiosClient";
import { ResetPasswordFirstLogin } from "./containers/ResetPassword/ResetPasswordFirstLogin";
import { UserDetails } from "./containers/UserDetails/UserDetails";
import { UserDetailsForm } from "./containers/UserDetails/UserDetailsForm";
import { Buildings } from "./containers/Buildings/Buildings";
import { BuildingForm } from "./containers/Buildings/BuildingForm";
import { BuildingSuperAdminDetails } from "./containers/Buildings/BuildingSuperAdminDetails";

configureAxiosClient(axios);

export const App = () => {
    const location = useLocation();

    return (
        <Layout>
            <Routes location={location}>
                <Route index path="*" element={<Buildings />} />
                <Route path="userDetails" element={<UserDetails />} />
                <Route path="userDetailsForm" element={<UserDetailsForm />} />
                <Route path={"/buildings"}>
                    <Route path={":guid"} element={<BuildingSuperAdminDetails />} />
                    <Route path={"add"} element={<BuildingForm />} />
                </Route>
            </Routes>
            <ResetPasswordFirstLogin />
        </Layout>
    );
};
