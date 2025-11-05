import { Routes, Route } from 'react-router-dom';

import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { ProfilePage } from './pages/ProfilePage';
import { SearchPage } from './pages/SearchPage';


// === ГЛАВНЫЙ КОМПОНЕНТ ===
export default function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/:userId/:username" element={<ProfilePage />} />   {/* Чужой */}
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </>
  );
}