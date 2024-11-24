import React, { useState } from 'react';
import "./Register.scss"
import { useNavigate } from 'react-router-dom';
import socket from '../../services/socket';
import {Box, Button, TextField, Typography} from "@mui/material";

const Register: React.FC = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = () => {
        socket.emit('register', { login, password });
        socket.on('registered', (data) => {
            navigate(`/?${data.login}`);
        });
    };

    return (
        <Box className="register-container">
            <Box className="register-box">
                <Typography variant="h4" className="register-box__title">
                    Регистрация
                </Typography>
                <form className="register-box__form" onSubmit={(e) => e.preventDefault()}>
                    <TextField
                        label="Логин"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        className="register-box__form-input"
                    />
                    <TextField
                        label="Пароль"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        className="register-box__form-input"
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        className="register-box__form-button"
                        onClick={handleRegister}
                    >
                        Зарегистрироваться
                    </Button>
                </form>
            </Box>
        </Box>
    );
};

export default Register;
