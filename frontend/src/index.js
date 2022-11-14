import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'antd/dist/antd.min.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

// Global variable. Switched to localhost for testing locally, and to / when
// building and serving from node server

window.APIROOT = '/';
// window.APIROOT = 'http://localhost:4000/';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </BrowserRouter>
);
