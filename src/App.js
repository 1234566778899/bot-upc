import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { AuthProvider, FirestoreProvider, useFirebaseApp } from 'reactfire';
import { AuthContextApp } from './contexts/AuthContextApp';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import Chat from './pages/Chat';
import { History } from './pages/History';
import MainLayout from './layouts/MainLayout';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { Training } from './pages/Training';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/Landing';

function App() {
  const firebaseApp = useFirebaseApp();
  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);

  return (
    <AuthProvider sdk={auth}>
      <FirestoreProvider sdk={firestore}>
        <AuthContextApp>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="admin"
              element={<MainLayout />}
            >
              <Route index element={<Navigate to="/chat" replace />} />
              <Route path="chat" element={<Chat />} />
              <Route path="chat/:chatId" element={<Chat />} />
              <Route path="feedback" element={<Dashboard />} />
              <Route path="history" element={<History />} />
              <Route path="training" element={<Training />} />
            </Route>
            {/* <Route path="*" element={<Navigate to="/home" replace />} /> */}
          </Routes>
        </AuthContextApp>
      </FirestoreProvider>
    </AuthProvider>
  );
}

export default App;