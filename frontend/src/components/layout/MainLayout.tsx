import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Home, Users, Video, FileText, Activity } from 'lucide-react'

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Video', href: '/video', icon: Video },
  { name: 'Form', href: '/form', icon: FileText },
  { name: 'Status', href: '/status', icon: Activity },
]

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation()

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Header - Fixed at top */}
      <header className="shrink-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 items-center px-4">
          <div className="mr-8 flex items-center space-x-3">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">QA</span>
            </div>
            <div>
              <span className="font-semibold text-lg">Testbed</span>
              <span className="ml-2 text-xs text-muted-foreground hidden sm:inline">
                v1.0.0
              </span>
            </div>
          </div>
          <nav className="flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </header>

      {/* Main Content - Scrollable */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto py-6 px-4">
          {children}
        </div>
      </main>

      {/* Footer - Fixed at bottom */}
      <footer className="shrink-0 border-t bg-white py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          QA Testbed - Built for testing React applications
        </div>
      </footer>
    </div>
  )
}
