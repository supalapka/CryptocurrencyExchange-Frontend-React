import { Routes, Route } from "react-router-dom";
import Login from "./components/authentication/Login";
import Register from "./components/authentication/Register";
import Staking from "./components/staking/Staking";
import Market from "./components/market/Market";
import CoinPage from "./components/market/CoinPage";

export const router = () => (
    <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/staking" element={<Staking/>} />
        <Route path="/market" element={<Market/>} />
        <Route path="/market/:symbol" element={<CoinPage/>} />
    </Routes>
)