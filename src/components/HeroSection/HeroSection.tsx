import React from 'react';
import './HeroSection.scss';
import {Link, useNavigate} from "react-router-dom";
import useAuthStore from "../../stores/AuthStore.ts";
import socket from "../../services/socket.ts";
import {Button} from "@mui/material";

const HeroSection: React.FC = () => {
    const {login, isLoggedIn} = useAuthStore();
    const navigate = useNavigate();

    const handleIsConfirm = () => {
        socket.emit('isConfirm', {login});

        navigate(`/auction/${login}`);
    }

    return (
        <section className="hero-section">
            <h1>Добро пожаловать на аукцион теплообменников!</h1>
            <p>Продавайте или покупайте теплообменники по лучшим ценам.</p>
            {isLoggedIn && login == "admin" ?
                (<Link to={`/dashboard/${login}`}>
                    <button className="btn primary">Войти в панель управления аукционом</button>
                </Link>) : isLoggedIn ?
                    (
                        <Button className="btn primary" onClick={handleIsConfirm}>
                            Принять участие в аукционе
                        </Button>
                    ) :
                    (<Link to={`/login`}>
                        <button className="btn primary">Принять участие в аукционе, пройти авторизацию</button>
                    </Link>)
            }
        </section>
    );
};

export default HeroSection;