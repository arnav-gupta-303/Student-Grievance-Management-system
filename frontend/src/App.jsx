import React, { useState } from 'react';
import { useAuth, AuthProvider } from './context/AuthContext';
import LoginForm from './components/Auth/LoginForm';
import RegistrationForm from './components/Auth/RegistrationForm';
import Dashboard from './components/Dashboard/Dashboard';

const AppContent = () => {
  const { user, token } = useAuth();
  const [showLogin, setShowLogin] = useState(true);

  if (user && token) {
    return <Dashboard />;
  }

  return (
    <>
      {showLogin ? (
        <LoginForm onToggle={() => setShowLogin(false)} />
      ) : (
        <RegistrationForm onToggle={() => setShowLogin(true)} />
      )}
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
