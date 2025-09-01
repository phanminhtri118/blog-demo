import { render, screen } from '@testing-library/react';
import Page from '../page';

// Mock the Clerk SignIn component
jest.mock('@clerk/nextjs', () => ({
  SignIn: () => <div data-testid="clerk-sign-in">Sign In</div>,
}));

describe('Sign-In Page', () => {
  it('should render the Clerk SignIn component', () => {
    render(<Page />);
    expect(screen.getByTestId('clerk-sign-in')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });
});
