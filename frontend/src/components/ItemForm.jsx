import { useState } from 'react';

export default function ItemForm({ onAdd }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim()) {
      setError('Item name cannot be empty');
      return;
    }

    setError('');
    onAdd(name.trim());
    setName('');
  }

  return (
    <form onSubmit={handleSubmit} aria-label="item-form">
      <label htmlFor="item-name">New item</label>
      <input
        id="item-name"
        name="item-name"
        placeholder="e.g. Buy groceries"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      {error && <p role="alert">{error}</p>}
      <button type="submit">Add item</button>
    </form>
  );
}
