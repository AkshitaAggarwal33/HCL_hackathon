import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import PatientDashboard from './pages/PatientDashboard.jsx';
import ProviderDashboard from './pages/ProviderDashboard.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import PublicInfoPage from './pages/PublicInfoPage.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import Navbar from './components/Navbar.jsx';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/public-info" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/public-info" element={<PublicInfoPage />} />

          <Route
            path="/patient/dashboard"
            element={
              <PrivateRoute allowedRoles={['patient']}>
                <PatientDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/provider/dashboard"
            element={
              <PrivateRoute allowedRoles={['provider']}>
                <ProviderDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <PrivateRoute allowedRoles={['patient', 'provider']}>
                <ProfilePage />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<h2>Page Not Found</h2>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
