import { useSelector, useDispatch } from "react-redux";
import { Navigate, RouteProps, useLocation } from "react-router-dom";
import { SetLoginRedirectPath } from "../../actions/loginRedirectPathActions";
import { AppState } from "../../store/configureStore";

type PrivateRouteProps = RouteProps & {
    component: any;
};

export const PrivateRoute = ({ component: Component, ...rest }: PrivateRouteProps) => {
    const token = useSelector((state: AppState) => state.user.token);
    const loginState = useSelector((state: AppState) => state.login);
    const location = useLocation();
    const dispatch = useDispatch();

    if (token && loginState.loggedIn) return <Component />;
    else {
        const loginRedirectPath = loginState.loggingOut
            ? null
            : `${location.pathname}${location.search}`;
        dispatch(SetLoginRedirectPath(loginRedirectPath));
        return <Navigate to="/login" />;
    }
};
