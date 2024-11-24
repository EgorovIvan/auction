import React, { useState } from 'react';
import './Login.scss';
import { useNavigate } from 'react-router-dom';
import socket from '../../services/socket.ts';
import { TextField, Button, Box, Typography } from '@mui/material';
import useAuthStore from "../../stores/AuthStore.ts";

const Login: React.FC = () => {
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login, setLogin } = useAuthStore();

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        socket.emit('login', { login, password });
        socket.on('loggedIn', (data) => {
            navigate(`/?login=${data.login}`);
        });

        socket.on('login_error', (data) => {
            alert(`login_error: ${data.message}`);
        });
    };

    return (
        <Box className="login-container">
            <Box className="login-box">
                <Typography variant="h4" className="login-box__title">
                    Вход
                </Typography>
                <form className="login-box__form" onSubmit={handleLogin}>
                    <TextField
                        label="Логин"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        className="login-box__form-input"
                        value={login ? login : ""}
                        onChange={(e) => setLogin(e.target.value)}
                    />
                    <TextField
                        label="Пароль"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        className="login-box__form-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        type="submit"
                        color="primary"
                        fullWidth
                        className="login-box__form-button"
                    >
                        Войти
                    </Button>
                </form>
            </Box>
        </Box>
    );
};

export default Login;
