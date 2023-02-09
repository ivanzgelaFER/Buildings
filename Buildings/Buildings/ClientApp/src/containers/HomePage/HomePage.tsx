import { useSelector } from "react-redux";
import { AppState } from "../../store/configureStore";
import "./HomePage.css";

export const HomePage = () => {
    const user = useSelector((state: AppState) => state.user);

    return (
        <div className="home-container">
            <div>
                <h1>Home page view</h1>
                <h2>Currently this application use: {`${user.firstName} ${user.lastName}`}</h2>
            </div>
        </div>
    );
};
