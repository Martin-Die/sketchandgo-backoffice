import React, { useState } from 'react';
import { login } from '../services/api';
import { config } from '../config';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState(config.username || '');
    const [password, setPassword] = useState(config.password || '');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = await login(username, password);
            onLogin(token);
        } catch (error) {
            alert('Login failed');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;