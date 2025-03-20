import { expect, test } from 'vitest'
import { render } from '@testing-library/react'
import { vi } from 'vitest';
import LoginForm from './LoginForm';

test("login_succes_test", async () => {
    const setAccessTokenMock = vi.fn();
    const setRefreshTokenMock = vi.fn();

    render(
      <LoginForm
        setAccessToken={setAccessTokenMock}
        setRefreshToken={setRefreshTokenMock}
      />
    );

  });