import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import ItemForm from '../components/ItemForm.jsx';

describe('ItemForm', () => {
  it('renders the input field and add button (rendering)', () => {
    render(<ItemForm onAdd={vi.fn()} />);

    expect(screen.getByLabelText(/new item/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add item/i })).toBeInTheDocument();
  });

  it('shows a validation error when submitting an empty item name (form validation)', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<ItemForm onAdd={onAdd} />);

    await user.click(screen.getByRole('button', { name: /add item/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/cannot be empty/i);
    expect(onAdd).not.toHaveBeenCalled();
  });

  it('calls onAdd with the trimmed item name and clears the input (user interaction)', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<ItemForm onAdd={onAdd} />);

    const input = screen.getByLabelText(/new item/i);
    await user.type(input, '  Buy groceries  ');
    await user.click(screen.getByRole('button', { name: /add item/i }));

    expect(onAdd).toHaveBeenCalledWith('Buy groceries');
    expect(input).toHaveValue('');
  });
});
