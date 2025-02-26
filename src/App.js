import React, { useState } from 'react';
import Login from './components/Login';
import StepsList from './components/StepsList';
import './App.css'

const App = () => {
  const [token, setToken] = useState(null);

  return (
    <div>
      {!token ? (
        <Login onLogin={setToken} />
      ) : (
        <StepsList token={token} />
      )}
    </div>
  );
};

export default App;