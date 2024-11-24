import * as React from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.tsx';
import Home from "../pages/Home/Home.tsx";
import Login from "../pages/Login/Login.tsx";
import Auction from "../pages/Auction/Auction.tsx";
import Register from "../pages/Register/Register.tsx";
import Error404 from "../pages/Error404/Error404.tsx";
import Dashboard from "../pages/Dashboard/Dashboard.tsx";

const AppRouter: React.FC = () => {
    return (

        <Router>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>

                {/* Защищённые маршруты */}
                <Route element={<ProtectedRoute/>}>
                    <Route path="/auction/:login" element={<Auction/>}/>
                    <Route path="/dashboard/:login" element={<Dashboard />}/>
                </Route>

                {/* Если нет url, по умолчанию переходим на /error404 */}
                <Route path="*" element={<Error404/>}/>
            </Routes>
        </Router>
    );
};

export default AppRouter;
