import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Navbar from './components/Navbar';
import { Home } from './pages/Home';
import { Register } from './pages/Register';
import { LogIn } from './components/LogIn';
import { AuthProvider } from './context/auth';
import { PrivateRoute } from './utils/PrivateRoute';
import { Profile } from './pages/Profile';


export const App = () => {
    return (
        <>
            <AuthProvider>
                <BrowserRouter>
                    <Navbar />
                    <Routes>
                        <Route path='/register' element={<Register />} />
                        <Route path='/login' element={<LogIn />} />
                        <Route element={<PrivateRoute />}>
                            <Route path='/' element={<Home />} />
                            <Route path='/profile' element={<Profile />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </>
    );
}
