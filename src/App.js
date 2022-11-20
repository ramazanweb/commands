import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
} from "react-router-dom";

import logo from './logo.svg';
import './App.css';

import Home from "./components/Home";
import Result from "./components/Result";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/result" element={<Result/>}/>
            </Routes>
        </Router>
    );
}

export default App;
