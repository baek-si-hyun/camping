import { Navigate, Route, Routes } from 'react-router-dom';
import LegacyPage from './pages/LegacyPage.jsx';
import { legacyRoutes } from './routes.js';

export default function App() {
  return (
    <Routes>
      {legacyRoutes.map(({ path, file, showBottomNav }) => (
        <Route key={`${path}-${file}`} path={path} element={<LegacyPage file={file} showBottomNav={showBottomNav} />} />
      ))}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
