import { AuthProvider, useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import HabitList from './pages/HabitList';
import HabitCreate from './pages/HabitCreate';
import TaskList from './pages/TaskList';
import TaskCreate from './pages/TaskCreate';
import Login from './pages/Login';
import React from 'react';
import { Layout } from 'antd';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';

const { Content, Sider } = Layout;

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/habits" />;
};

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {isAuthenticated && (
        <Sider width={200} style={{ background: '#fff' }}>
          <Sidebar />
        </Sider>
      )}
      <Layout>
        <Content style={{ padding: isAuthenticated ? '24px' : '0' }}>
          <Routes>
            <Route
              path="/login"
              element={
                <AuthRoute>
                  <Login />
                </AuthRoute>
              }
            />

            <Route
              path="/habits"
              element={
                <ProtectedRoute>
                  <HabitList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/habits/create"
              element={
                <ProtectedRoute>
                  <HabitCreate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <ProtectedRoute>
                  <TaskList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks/create"
              element={
                <ProtectedRoute>
                  <TaskCreate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={<Navigate to={isAuthenticated ? '/habits' : '/login'} />}
            />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
