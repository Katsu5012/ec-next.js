import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider as UrqlProvider } from 'urql';
import { createUrqlClient } from '@/lib/urql';

const urqlClient = createUrqlClient();

interface AllTheProvidersProps {
  children: React.ReactNode;
}

const AllTheProviders = ({ children }: AllTheProvidersProps) => {
  return <UrqlProvider value={urqlClient}>{children}</UrqlProvider>;
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render, AllTheProviders };
