import { QueryClientProvider } from '@tanstack/react-query'

import { queryClient } from './client'

export function QueryProvider(props: Readonly<{ children: React.ReactNode }>) {
  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
    </QueryClientProvider>
  )
}
