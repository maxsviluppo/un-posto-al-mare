import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './views/Home';
import { Booking } from './views/Booking';
import { Temp } from './views/Temp';
import { AdminDashboard } from './views/AdminDashboard';
import { AdminSettings } from './views/AdminSettings';
import { Profile } from './views/Profile';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="booking" element={<Booking />} />
          <Route path="temp" element={<Temp />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/settings" element={<AdminSettings />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
