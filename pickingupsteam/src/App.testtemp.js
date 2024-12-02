import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('axios', () => ({
    get: jest.fn(),
    post: jest.fn(),
    // mock other axios methods if needed
  }));

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
