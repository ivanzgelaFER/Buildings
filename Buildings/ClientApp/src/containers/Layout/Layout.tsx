import { Footer } from "../Footer/Footer";
import { Header } from "../Header/Header";
import PrimeReact from "primereact/api";
import "./Layout.css";

PrimeReact.zIndex = {
    modal: 1100,
    overlay: 2100,
    menu: 1000,
    tooltip: 1100,
    toast: 1200,
};

export const Layout = (props: any) => {
    return (
        <div id="layout">
            <Header />
            <div id="layout-columns">
                <div className="main-column">
                    <main className="main">{props.children}</main>
                    <Footer />
                </div>
            </div>
        </div>
    );
};
