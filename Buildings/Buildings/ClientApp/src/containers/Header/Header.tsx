import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../actions/authentificationActions";
import { Button } from "primereact/button";
import "primeicons/primeicons.css";
import "./Header.css";

export const Header = () => {
    const dispatch = useDispatch();

    const start = (
        <Link to="/" aria-label="Početak headera">
            <i className="fas fa-building-user" />
        </Link>
    );

    const end = (
        <div className="header-end-buttons">
            <Button label="Logout" onClick={() => dispatch(logout())} />
        </div>
    );

    return (
        <header>
            <div className="menubar">
                {start}
                {/*}
                <nav className="header-content">
                    {headerItems.map(item => {
                        return (
                            <div key={item.link}>
                                <Link className="menu-item" to={item.link} aria-label={item.label}>
                                    <span>{item.label}</span>
                                </Link>
                            </div>
                        );
                    })}
                </nav>*/}
                {end}
            </div>
        </header>
    );
};
