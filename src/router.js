import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/authentication/Login";
import Register from "./components/authentication/Register";
import Staking from "./components/staking/Staking";
import Market from "./components/market/Market";
import CoinPage from "./components/market/CoinPage";
import Profile from "./components/userprofile/Profile";
import Wallet from "./components/userprofile/Wallet";
import UserStaking from "./components/userprofile/staking/UserStaking";
import PageNotFound from "./PageNotFound";

export const router = () => (
    <Routes>
        <Route path="/" element={<Market />} />
        <Route path="*" element={<PageNotFound />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/staking" element={<Staking />} />
        <Route path="/market" element={<Market />} />
        <Route path="/market/:symbol" element={<CoinPage />} />
        <Route path="/profile" element={<Profile />}>
            <Route index element={<Navigate to="wallet" />} />
            <Route index path="wallet" element={<Wallet />} />
            <Route path="staking" element={<UserStaking />} />
        </Route>
    </Routes>
)