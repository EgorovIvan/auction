import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());

interface auctionData {
    availability: boolean;
    manufacturingTime: number;
    warrantyObligations: number;
    paymentTerms: number;
    price: number;
}

interface Admin {
    uuid: string;
    login: string;
    password: string;
    isAuthenticated: boolean;
}

interface User {
    uuid: string;
    login: string;
    password: string;
    isAuthenticated: boolean;
    isConfirm: boolean;
    data: auctionData;
}

const admins: Admin[] = [
    {
        uuid: '100',
        login: 'admin',
        password: 'admin123',
        isAuthenticated: false,
    }
]

const users: User[] = [
    {
        uuid: '1',
        login: 'user1',
        password: 'password1',
        isAuthenticated: false,
        isConfirm: false,
        data: {
            availability: true,
            manufacturingTime: 70,
            warrantyObligations: 24,
            paymentTerms: 95,
            price: 2000000,
        }
    },
    { uuid: '2',
        login: 'user2',
        password: 'password2',
        isAuthenticated: false,
        isConfirm: false,
        data: {
            availability: false,
            manufacturingTime: 68,
            warrantyObligations: 24,
            paymentTerms: 90,
            price: 2000000,
        }
    },
    {
        uuid: '3',
        login: 'user3',
        password: 'password3',
        isAuthenticated: false,
        isConfirm: false,
        data: {
            availability: true,
            manufacturingTime: 76,
            warrantyObligations: 24,
            paymentTerms: 95,
            price: 1900000,
        }
    },
    { uuid: '4',
        login: 'user4',
        password: 'password4',
        isAuthenticated: false,
        isConfirm: false,
        data: {
            availability: true,
            manufacturingTime: 81,
            warrantyObligations: 24,
            paymentTerms: 100,
            price: 2000000,
        }
    },
    {
        uuid: '5',
        login: 'user5',
        password: 'password5',
        isAuthenticated: true,
        isConfirm: false,
        data: {
            availability: false,
            manufacturingTime: 79,
            warrantyObligations: 24,
            paymentTerms: 95,
            price: 2000000,
        }
    },
];
let usersAreConfirm: User[] = users.filter((user) => user.isConfirm)
let activeUserIndex = 0;
let globalTimer: NodeJS.Timeout | null = null;
let userTimer: NodeJS.Timeout | null = null;

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Регистрация
    socket.on('register', ({ login, password }) => {
        const existingUser = users.find((user) => user.login === login);
        if (existingUser) {
            socket.emit('error', { message: 'User already exists' });
        } else {
            const newUser: User = {
                uuid: socket.id,
                login,
                password,
                isAuthenticated: true,
                isConfirm: false,
                data: {
                    availability: false,
                    manufacturingTime: 0,
                    warrantyObligations: 0,
                    paymentTerms: 0,
                    price: 0,
                }
            };
            users.push(newUser);
            socket.emit('registered', { uuid: newUser.uuid, login: newUser.login });
        }
    });

    // Авторизация
    socket.on('login', ({ login, password }) => {
        const user = users.find((u) => u.login === login && u.password === password);
        const admin = admins.find((a) => a.login === login && a.password === password);
        if (user) {
            user.isAuthenticated = true;
            socket.emit('loggedIn', { uuid: user.uuid, login: user.login });
            return;
        } if (admin) {
            admin.isAuthenticated = true;
            socket.emit('loggedIn', { uuid: admin.uuid, login: admin.login });
            return;
        } else {
            socket.emit('login_error', { message: 'Invalid credentials1' });
        }
    });

    // Выход из системы
    socket.on('logout', ({ login }) => {
        const user = users.find((u) => u.login === login);
        const admin = admins.find((a) => a.login === login);
        if (user) {
            user.isAuthenticated = false;
            user.isConfirm = false;
            socket.emit('loggedOut');
            return;
        } if (admin) {
            admin.isAuthenticated = false;
            socket.emit('loggedOut');
            return;
        } else {
            socket.emit('logout_error', { message: 'Invalid credentials' });
        }
    });

    // Подтверждение участия в торгах
    socket.on('isConfirm', ({login}) => {
        const user = users.find((u) => u.login === login);
        if (user) {
            user.isConfirm = true;
            usersAreConfirm = users.filter((user) => user.isConfirm);
            socket.emit('loadUsers', usersAreConfirm);
            return;
        } else {
            socket.emit('confirm_error', { message: 'Invalid credentials' });
        }
    })

    // Выход из торгов
    socket.on('exitAuction', ({login}) => {
        const user = users.find((u) => u.login === login);
        if (user) {
            user.isConfirm = false;
            usersAreConfirm = users.filter((user) => user.isConfirm);
            socket.emit('loadUsers', usersAreConfirm);
            return;
        } else {
            socket.emit('confirm_error', { message: 'Invalid credentials' });
        }
    })

    // Обновление окна торгов
    socket.on('updateUsersAreConfirm', () => {
        socket.emit('loadUsers', usersAreConfirm);
    });

    // Отправка массив участников участвующих в торгах
    socket.emit('loadUsers', usersAreConfirm);

    // Запуск общего времени
    socket.on('startGlobalTimer', () => {
        if (globalTimer) return;

        let remainingTime = 15 * 60; // 15 minutes
        io.emit('globalTimer', remainingTime);

        globalTimer = setInterval(() => {
            remainingTime -= 1;
            io.emit('globalTimer', remainingTime);

            if (remainingTime <= 0) {
                clearInterval(globalTimer!);
                clearInterval(userTimer!);
                globalTimer = null;
                userTimer = null;
                io.emit('globalTimerEnd');
            }
        }, 1000);

        activeUserIndex = 0
        startUserTimer();

    });

    // Остановка общего времени
    socket.on('stopGlobalTimer',() => {
        clearInterval(globalTimer!);
        clearInterval(userTimer!);
        globalTimer = null;
        userTimer = null;
        io.emit('globalTimerEnd');
    });

    // Передача хода
    socket.on('passUserTimer',() => {
        activeUserIndex = (activeUserIndex + 1) % usersAreConfirm.length;
        startUserTimer();
    });

    // Старт времени участника
    const startUserTimer = () => {
        if (userTimer) clearInterval(userTimer);

        let userTime = 30; // 30 seconds

        io.emit('activeUser', usersAreConfirm[activeUserIndex].uuid);

        userTimer = setInterval(() => {
            userTime -= 1;
            io.emit('userTimer', { userId: usersAreConfirm[activeUserIndex].uuid, time: userTime });

            if (userTime <= 0) {
                userTime = 30;
                activeUserIndex = (activeUserIndex + 1) % usersAreConfirm.length;
                console.log('объект', usersAreConfirm)
                console.log('индек', activeUserIndex)
                console.log('uuid', usersAreConfirm[activeUserIndex].uuid)
                io.emit('activeUser', usersAreConfirm[activeUserIndex].uuid);
            }
        }, 1000);
    };

    // Обновление суммы
    socket.on('updatePrice', ({ uuid, price }) => {
        const user = usersAreConfirm.find((u) => u.uuid === uuid);
        if (user) {
            user.data.price = price;
            io.emit('priceUpdated', { uuid, price });
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(4000, () => {
    console.log('Server is running on http://localhost:4000');
});
