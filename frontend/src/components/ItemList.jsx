export default function ItemList({ items }) {
  if (!items || items.length === 0) {
    return <p>No items yet. Add one above!</p>;
  }

  return (
    <ul aria-label="item-list">
      {items.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
