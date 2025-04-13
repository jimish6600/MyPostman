import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';
import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';
import ApiTesterPage from './pages/ApiTesterPage';
import CollectionsPage from './pages/CollectionsPage';
import ApiDetails from './pages/ApiDetails';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/api-tester" element={<ApiTesterPage />} />
            <Route path="/collections" element={<CollectionsPage />} />
            <Route path="/api-details/:id" element={<ApiDetails />} />
          </Routes>
        </MainLayout>
      </Router>
    </ThemeProvider>
  );
};

export default App;
