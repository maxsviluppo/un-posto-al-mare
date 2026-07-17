import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './views/Home';
import { PrenotazioniSpiaggia } from './views/PrenotazioniSpiaggia';
import { AdminDashboard } from './views/AdminDashboard';
import { AdminSettings } from './views/AdminSettings';
import { Profile } from './views/Profile';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="prenotazioni-spiaggia" element={<PrenotazioniSpiaggia />} />
          <Route path="temp" element={<Navigate to="/prenotazioni-spiaggia" replace />} />
          <Route path="booking" element={<Navigate to="/prenotazioni-spiaggia" replace />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/settings" element={<AdminSettings />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
