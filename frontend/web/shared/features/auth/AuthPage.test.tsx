import React from 'react';
import { render, screen } from '@testing-library/react';
import AuthPage from './AuthPage';

const replaceMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: replaceMock }),
}));

jest.mock('@common/shared/ui-kit', () => ({
  AuthForm: () => <div data-testid="auth-form">Auth Form</div>,
}));

const useAuthenticationStoreMock = jest.fn();

jest.mock('@common/shared/stores/useAuthStore', () => ({
  useAuthenticationStore: (selector: (state: { currentUser: { id: string } | null }) => unknown) =>
    useAuthenticationStoreMock(selector),
}));

describe('AuthPage', () => {
  beforeEach(() => {
    replaceMock.mockReset();
    useAuthenticationStoreMock.mockReset();
  });

  it('renders auth form when user is not authenticated', () => {
    useAuthenticationStoreMock.mockImplementation(
      (selector: (state: { currentUser: { id: string } | null }) => unknown) =>
        selector({ currentUser: null }),
    );

    render(<AuthPage />);

    expect(screen.getByTestId('auth-form')).toBeInTheDocument();
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it('redirects to dashboard when user exists', () => {
    useAuthenticationStoreMock.mockImplementation(
      (selector: (state: { currentUser: { id: string } | null }) => unknown) =>
        selector({ currentUser: { id: '1' } }),
    );

    const { container } = render(<AuthPage />);

    expect(container.firstChild).toBeNull();
    expect(replaceMock).toHaveBeenCalledWith('/dashboard');
  });
});
