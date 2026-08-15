import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ItemList from '../components/ItemList.jsx';

describe('ItemList', () => {
  it('renders a list item for each item passed in props (rendering)', () => {
    const items = [
      { id: 1, name: 'Buy groceries' },
      { id: 2, name: 'Walk the dog' },
    ];
    render(<ItemList items={items} />);

    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
    expect(screen.getByText('Walk the dog')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('renders an empty state message when there are no items (rendering)', () => {
    render(<ItemList items={[]} />);

    expect(screen.getByText(/no items yet/i)).toBeInTheDocument();
  });
});
