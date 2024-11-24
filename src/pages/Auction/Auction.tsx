import React, {useEffect, useState} from 'react';
import "./Auction.scss"
import socket from '../../services/socket';
import {io} from 'socket.io-client';
import {Button, TextField} from "@mui/material";
import {rowHeaders} from '../../constants/rowHeaders';
import {formatTime} from "../../helpers/formatTime.ts";
import {useNavigate} from "react-router-dom";
import {formatCurrency} from "../../helpers/formatCurrency.ts";
import useAuthStore from "../../stores/AuthStore.ts";

export interface auctionData {
    availability: boolean;
    manufacturingTime: number;
    warrantyObligations: number;
    paymentTerms: number;
    price: number;
}

export interface User {
    uuid: string;
    login: string;
    password: string;
    isAuthenticated: boolean;
    data: auctionData;
}

const Auction: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [globalTimer, setGlobalTimer] = useState<number>(0);
    const [activeUserId, setActiveUserId] = useState<string | null>(null);
    const [userTime, setUserTime] = useState<number>(0);
    const {login} = useAuthStore();
    const navigate = useNavigate();

    // Обновление суммы
    const handlePriceChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, uuid: string, price: number) => {
        e.preventDefault();
        socket.emit('updatePrice', {uuid: uuid, price: price});
    };

    // Передача хода следующему
    const handlePassUserTimer = () => {
        socket.emit('passUserTimer');
    }

    // Выход из торгов
    const handleOnClose = () => {
        navigate(`/`);
        socket.emit('exitAuction', {login});
        socket.on('loadUsers', (users) => {
            setUsers(users);
        });
    }

    // Обновление окна торгов
    const handleUpdate = () => {
        socket.emit('updateUsersAreConfirm');
        socket.on('loadUsers', (users) => {
            setUsers(users);
        });
    }

    useEffect(() => {
        const socket = io('http://localhost:4000');
        socket.on('connect', () => {
            console.log('Connected to socket server');
        });

        socket.on('loadUsers', (users) => {
            setUsers(users);
        });

        socket.on('priceUpdated', (data) => {

            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.uuid === data.uuid
                        ? {
                            ...user,
                            data: {
                                ...user.data,
                                price: data.price,
                            },
                        }
                        : user
                )
            );
        });

        socket.on('userTimer', ({userId, time}: { userId: string; time: number }) => {
            setActiveUserId(userId);
            setUserTime(time);
        });

        socket.on('activeUser', (userId) => {
            setActiveUserId(userId);
        });

        socket.on('globalTimer', (time) => {
            setGlobalTimer(time);
        });

        socket.on('globalTimerEnd', () => {
            setGlobalTimer(0);
        });

        return () => {
            socket.off('loadUsers');
            socket.off('priceUpdated');
            socket.off('userTimer');
            socket.off('activeUser');
            socket.off('globalTimer');
            socket.off('globalTimerEnd');
            socket.off('connect');
            console.log("Socket disconnected");
        };
    }, []);

    return (
        <div className="auction">
            <h1 className="auction__title">
                Ход торгов
                <strong> Тестовые торги на аппарат ЛОТОС №2033564 (09.11.2020 07:00)</strong>
            </h1>
            <div className="auction__info">
                Уважаемые участники, во время вашего хода вы можете изменить параметры торгов, указанных в таблице:
            </div>
            <div className="auction__row auction__timer">
                <div className="auction__cell-column auction__cell--header">
                    Ход
                </div>
                {users.map((user, index) => (
                    (globalTimer > 0 && activeUserId === user.uuid) ? (
                        <div key={"t" + index} className="auction__cell auction__cell--timer">
                            {formatTime(userTime)}
                        </div>
                    ) : (
                        <div key={"t" + index} className="auction__cell"></div>
                    )
                ))}
            </div>
            <div className="auction__row auction__row--header">
                <div className="auction__cell-column auction__cell--header">
                    Параметры и требования
                </div>
                {users.map((user, index) => (
                    <div key={index} className="auction__cell auction__cell--header">
                        {user.login}
                    </div>
                ))}
            </div>
            {rowHeaders.map((rowHeader, rowIndex) => (
                <div key={rowIndex} className="auction__row-info">
                    <div className="auction__cell-column auction__cell--row-header">{rowHeader.label}</div>

                    {users.map((user, userIndex) => (
                        rowHeader.key != 'price' ?
                            (
                                <div key={userIndex} className="auction__cell auction__border">
                                    {user.data[rowHeader.key]}
                                    {
                                        rowHeader.key == 'manufacturingTime' ||
                                        rowHeader.key == 'warrantyObligations' ? " мес." :
                                            rowHeader.key == 'paymentTerms' ? "%" :
                                                rowHeader.key == 'availability' &&
                                                user.data.availability ? "Да" :
                                                    rowHeader.key == 'availability' &&
                                                    !user.data.availability ? "Нет" : ""
                                    }
                                </div>
                            ) :
                            (
                                <div key={userIndex} className="auction__cell auction__border">
                                    <div className="auction__cell-inner">
                                        {(globalTimer > 0 && activeUserId === user.uuid && login == user.login) ?
                                            (<TextField id="outlined-basic" label="Ввести сумму" variant="outlined"
                                                        size="small"
                                                        type="number"
                                                        value={user.data.price}
                                                        onChange={(e) => handlePriceChange(e, user.uuid, Number(e.target.value))}
                                            />) : (<p className="blue">{formatCurrency(user.data.price)}</p>)
                                        }
                                        <p className="red">{formatCurrency(user.data.price * 0.2)}</p>
                                        <p className="green">{formatCurrency(user.data.price * 0.8)}</p>
                                    </div>
                                    {(globalTimer > 0 && activeUserId === user.uuid && login == user.login) ?
                                        (
                                            <Button variant="outlined" color="success" size="small"
                                                    onClick={handlePassUserTimer}>
                                                <span>Передать ход</span>
                                            </Button>
                                        ) :
                                        ("")
                                    }
                                </div>
                            )
                    ))}
                </div>
            ))}

            <div className="auction__btns">
                <Button variant="contained" color="success">
                    <span>Чат</span>
                    <img src="../../../src/assets/auction/chat.png" alt="chat"/>
                </Button>
                <Button variant="contained" color="primary" onClick={handleUpdate}>
                    <span>Обновить</span>
                    <img src="../../../src/assets/auction/update.svg" alt="update"/>
                </Button>
                <Button variant="outlined" color="error">
                    <span>Отчет</span>
                    <img src="../../../src/assets/auction/report.svg" alt="report"/>
                </Button>
                <Button variant="outlined" disabled={(globalTimer != undefined && globalTimer > 0)} color="inherit"
                        onClick={handleOnClose}>
                    <span>Закрыть</span>
                    <img src="../../../src/assets/auction/close.svg" alt="close"/>
                </Button>
            </div>

            <h2 className="auction__global-timer">Общее время торгов: {formatTime(globalTimer)}</h2>
        </div>
    );
};

export default Auction;