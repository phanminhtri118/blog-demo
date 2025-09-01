import { render, screen } from '@testing-library/react';
import Page from '../page';

// Mock the Clerk SignUp component
jest.mock('@clerk/nextjs', () => ({
  SignUp: () => <div data-testid="clerk-sign-up">Sign Up</div>,
}));

describe('Sign-Up Page', () => {
  it('should render the Clerk SignUp component', () => {
    render(<Page />);
    expect(screen.getByTestId('clerk-sign-up')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });
});
