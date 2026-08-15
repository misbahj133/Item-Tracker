import { useState } from 'react';

export default function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError('Username and password are both required');
      return;
    }

    setError('');
    onLogin(username, password);
  }

  return (
    <form onSubmit={handleSubmit} aria-label="login-form">
      <h2>Log in</h2>

      <label htmlFor="username">Username</label>
      <input
        id="username"
        name="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <label htmlFor="password">Password</label>
      <input
        id="password"
        name="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p role="alert">{error}</p>}

      <button type="submit">Log in</button>
    </form>
  );
}
