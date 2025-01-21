import React, { Suspense } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import theme from './theme';
import Layout from './components/layout/Layout';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import PrivateRoute from './components/auth/PrivateRoute';
import Profile from './pages/Profile';

// Lazy load the components
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const EditorPage = React.lazy(() => import('./pages/EditorPage'));
const Library = React.lazy(() => import('./pages/Library'));
const Characters = React.lazy(() => import('./pages/Characters'));
const WorldBuilder = React.lazy(() => import('./pages/WorldBuilder'));
const ProjectWorld = React.lazy(() => import('./pages/ProjectWorld'));

console.log('Environment check:', {
  hasApiKey: !!process.env.REACT_APP_FIREBASE_API_KEY,
  hasProjectId: !!process.env.REACT_APP_FIREBASE_PROJECT_ID,
});

function App() {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Layout>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                {/* Redirect root to login */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                
                <Route path="/dashboard" element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } />
                <Route path="/editor/:projectId" element={
                  <PrivateRoute>
                    <EditorPage />
                  </PrivateRoute>
                } />
                <Route path="/library" element={
                  <PrivateRoute>
                    <Library />
                  </PrivateRoute>
                } />
                <Route path="/characters" element={
                  <PrivateRoute>
                    <Characters />
                  </PrivateRoute>
                } />
                <Route path="/world-builder" element={
                  <PrivateRoute>
                    <WorldBuilder />
                  </PrivateRoute>
                } />
                <Route path="/world-builder/:projectId" element={
                  <PrivateRoute>
                    <ProjectWorld />
                  </PrivateRoute>
                } />
                <Route path="/profile" element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                } />
              </Routes>
            </Suspense>
          </Layout>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App; 