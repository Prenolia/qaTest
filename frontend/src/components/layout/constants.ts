import { Activity, FileText, Home, Users, Video } from 'lucide-react'

export const NAVIGATION_ITEMS = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Video', href: '/video', icon: Video },
  { name: 'Form', href: '/form', icon: FileText },
  { name: 'Status', href: '/status', icon: Activity },
]
