import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Editor from './components/Editor';
import Characters from './pages/Characters';
import WorldBuilder from './pages/WorldBuilder';
import Library from './pages/Library';

console.log('Environment check:', {
  hasApiKey: !!process.env.REACT_APP_FIREBASE_API_KEY,
  hasProjectId: !!process.env.REACT_APP_FIREBASE_PROJECT_ID,
  // ... check other required env vars
});

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/editor/:projectId" element={<Editor />} />
          <Route path="/characters" element={<Characters />} />
          <Route path="/world-builder" element={<WorldBuilder />} />
          <Route path="/library" element={<Library />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App; 