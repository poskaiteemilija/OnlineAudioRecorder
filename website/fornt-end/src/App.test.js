import { render, screen } from '@testing-library/react';
import App from './App';

//to be modified for future test - to research how to implement the tests
test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
