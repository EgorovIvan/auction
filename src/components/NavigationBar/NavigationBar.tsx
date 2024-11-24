import React from 'react';
import './NavigationBar.scss';
import {Link} from "react-admin";
import {Button} from "@mui/material";
import socket from "../../services/socket.ts";
import useAuthStore from "../../stores/AuthStore.ts";

const NavigationBar: React.FC = () => {
    const {login, isLoggedIn, logout} = useAuthStore();
    const handleLogout = () => {
        socket.emit('logout', {login});
        socket.on('loggedOut', () => {
            logout();
        });

        socket.on('logout_error', (message) => {
            console.error('logout_error:', message);
        });
    }

    return (
        <nav className="navigation-bar">
            <div className="logo">HeatExchangerAuction</div>
            <div className="buttons">
                {isLoggedIn ?
                    (<Button className="btn primary" onClick={handleLogout}>
                        Выйти
                    </Button>) :
                    (<>
                        <Link to="/login">
                            <button className="btn primary">Войти</button>
                        </Link>
                        <Link to="/register">
                            <button className="btn secondary">Зарегистрироваться</button>
                        </Link>
                    </>)
                }
            </div>
        </nav>
    );
};

export default NavigationBar;