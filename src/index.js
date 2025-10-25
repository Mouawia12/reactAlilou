import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Route, Routes} from "react-router-dom";

import reportWebVitals from './reportWebVitals';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';



import Login from "./auth/Login";
import Register from "./auth/Register";
import MasterLayout from "./pages/MasterLayout";
import ProtectedRoute from "./helper/ProtectedRoute";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Login/>}/>
            <Route path="/login" element={<ProtectedRoute><Login/></ProtectedRoute>}/>
            <Route path="/register" element={<ProtectedRoute><Register/></ProtectedRoute>}/>
            <Route path="/*" element={<ProtectedRoute><MasterLayout /></ProtectedRoute>} />
        </Routes>
    </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
