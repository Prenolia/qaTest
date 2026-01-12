import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MainLayout } from '@/components/layout/MainLayout'
import { Toaster } from '@/components/ui/sonner'
import { RequestHistoryProvider } from '@/contexts'
import { RequestHistoryPanel } from '@/components/request-history'
import Home from '@/pages/Home'
import Users from '@/pages/Users'
import Video from '@/pages/Video'
import Form from '@/pages/Form'
import Status from '@/pages/Status'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RequestHistoryProvider>
        <BrowserRouter>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/users" element={<Users />} />
              <Route path="/video" element={<Video />} />
              <Route path="/form" element={<Form />} />
              <Route path="/status" element={<Status />} />
            </Routes>
          </MainLayout>
          <RequestHistoryPanel />
          <Toaster position="top-right" richColors />
        </BrowserRouter>
      </RequestHistoryProvider>
    </QueryClientProvider>
  )
}

export default App
