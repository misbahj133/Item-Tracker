import { useState } from 'react';
import LoginForm from './components/LoginForm.jsx';
import ItemForm from './components/ItemForm.jsx';
import ItemList from './components/ItemList.jsx';
import { login, fetchItems, createItem } from './api.js';

export default function App() {
  const [token, setToken] = useState(null);
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  async function handleLogin(username, password) {
    try {
      const { token: newToken } = await login(username, password);
      setToken(newToken);
      setError('');
      const existing = await fetchItems(newToken);
      setItems(existing);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleAddItem(name) {
    try {
      const item = await createItem(token, name);
      setItems((prev) => [...prev, item]);
    } catch (err) {
      setError(err.message);
    }
  }

  if (!token) {
    return (
      <main>
        <LoginForm onLogin={handleLogin} />
        {error && <p role="alert">{error}</p>}
      </main>
    );
  }

  return (
    <main>
      <h1>My Items</h1>
      <ItemForm onAdd={handleAddItem} />
      {error && <p role="alert">{error}</p>}
      <ItemList items={items} />
    </main>
  );
}
