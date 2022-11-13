import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Layout } from 'antd';

import AnimationLayout from './utility/routeAnimation';
import RemoveLoader from './utility/removeLoader';

import MenuBar from './components/MenuBar';

import QRCodePage from './routes/QRCode';
import SchedulePage from './routes/Schedule';
import PurchaseHistoryPage from './routes/PurchaseHistory';
import BuyPage from './routes/Buy';
import AdminPanel from './routes/AdminPanel';
import TotalMealsPage from './routes/TotalMeals';
import ScanQRPage from './routes/ScanQR';

export default function App() {
    useEffect(RemoveLoader, []);

    return (
        <div className="App">
            <Layout style={{ minHeight: "100vh" }}>
                <MenuBar />
                <Routes>
                    <Route element={<AnimationLayout />}>
                        <Route path="/" element={<SchedulePage />} />
                        <Route path="/qr-code" element={<QRCodePage />} />
                        <Route path="/purchase-history" element={<PurchaseHistoryPage />} />
                        <Route path="/buy-coupons" element={<BuyPage />} />
                        <Route path="/admin" element={<AdminPanel />} />
                        <Route path="/total-meals" element={<TotalMealsPage />} />
                        <Route path="/scan-qr" element={<ScanQRPage />} />
                    </Route>
                </Routes>
            </Layout>
        </div>
    );
}
