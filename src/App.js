import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import './App.css';
import StepsList from './components/StepsList';
import StepPage from './pages/StepPage';
import ThemePage from './pages/ThemePage';
import NotionPage from './pages/NotionPage';

const App = () => {
  const [token, setToken] = useState(null);

  return (
    <Router>
      <div>
        {!token ? (
          <Login onLogin={setToken} />
        ) : (
          <Routes>
            {/* Route pour la liste des étapes (page d'accueil) */}
            <Route path="/" element={<StepsList token={token} />} />

            {/* Route pour la gestion d'une étape spécifique */}
            <Route path="/step/:stepUuid" element={<StepPage token={token} />} />

            {/* Route pour la gestion d'un thème spécifique */}
            <Route path="/theme/:themeUuid" element={<ThemePage token={token} />} />

            {/* Route pour la gestion d'une notion spécifique */}
            <Route path="/notion/:notionUuid" element={<NotionPage token={token} />} />


            {/* Redirection par défaut */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )}
      </div>
    </Router>
  );
};

export default App;