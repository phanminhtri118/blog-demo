import { render, screen } from '@testing-library/react';
import { RightSidebar } from '../right-sidebar';

describe('RightSidebar component', () => {
  it('should render the AirdropCard', () => {
    render(<RightSidebar />);
    expect(screen.getByText('Airdrop Medals')).toBeInTheDocument();
    expect(screen.getByText('Complete all steps below to be eligible for the Airdrop.')).toBeInTheDocument();
  });

  it('should render the PremiumCard', () => {
    render(<RightSidebar />);
    expect(screen.getByText('Get Premium to boost your Medals')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Upgrade/i })).toBeInTheDocument();
  });

  it('should render the WelcomeCard', () => {
    render(<RightSidebar />);
    expect(screen.getByText('Welcome to TechHub (BIC)')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Quick Introductions and Guides/i })).toBeInTheDocument();
  });

  it('should render the TrendingCard', () => {
    render(<RightSidebar />);
    expect(screen.getByText('Trending')).toBeInTheDocument();
    expect(screen.getByText('TechHub Global Admin')).toBeInTheDocument();
  });
});
