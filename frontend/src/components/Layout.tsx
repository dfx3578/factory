import { LayoutDashboard, Building2, Contact as ContactIcon, FileText, ListChecks } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { cn } from '@/lib/utils'

const navigation = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/contacts', label: 'Contacts', icon: ContactIcon },
  { to: '/companies', label: 'Companies', icon: Building2 },
  { to: '/deals', label: 'Deals', icon: FileText },
  { to: '/tasks', label: 'Tasks', icon: ListChecks },
]

export function Layout() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-56 shrink-0 border-r border-border bg-white">
        <div className="px-5 py-5">
          <p className="text-lg font-semibold text-brand">CRM Pro</p>
          <p className="text-xs text-muted">Customer Relationship Management</p>
        </div>
        <nav className="flex flex-col">
          {navigation.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-5 py-2.5 text-sm text-slate-600 hover:bg-slate-50',
                  isActive && 'bg-slate-100 font-medium text-slate-900',
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 px-8 py-6">
        <Outlet />
      </main>
    </div>
  )
}
