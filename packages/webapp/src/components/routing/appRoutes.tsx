import { Navigate, Route, Routes } from 'react-router';

import AdminConfig from '@components/adminConfig';
import CommandCenter from '@components/commandCenter';
import SnapRaidConfig from '@components/snapRaidConfig';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/command-center" replace />} />
      <Route path="/command-center" element={<CommandCenter />} />
      <Route path="/admin-config" element={<AdminConfig />} />
      <Route path="/snapraid-config" element={<SnapRaidConfig />} />
      <Route path="*" element={<Navigate to="/command-center" replace />} />
    </Routes>
  );
}
