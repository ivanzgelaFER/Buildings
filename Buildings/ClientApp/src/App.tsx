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
import { HomePage } from "./containers/HomePage/HomePage";

configureAxiosClient(axios);

export const App = () => {
    const location = useLocation();

    return (
        <Layout>
            <Routes location={location}>
                <Route index path="*" element={<HomePage />} />
                <Route path={"/buildings"}>
                    <Route path={"all"} element={<Buildings />} />
                    <Route path={":guid"} element={<BuildingSuperAdminDetails />} />
                    <Route path={"add"} element={<BuildingForm />} />
                </Route>
                <Route path={"user"}>
                    <Route path={":guid"} element={<UserDetails />} />
                    <Route path={"add"} element={<UserDetailsForm />} />
                </Route>
            </Routes>
            <ResetPasswordFirstLogin />
        </Layout>
    );
};
