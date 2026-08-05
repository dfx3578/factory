import { Building2, DollarSign, LineChart, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableCell, TableHead } from '@/components/ui/table'
import { api, type Dashboard as DashboardData } from '@/lib/api'
import { cn, formatCurrency, formatDate } from '@/lib/utils'

const icons: Record<string, typeof Users> = {
  users: Users,
  building: Building2,
  chart: LineChart,
  dollar: DollarSign,
}

const iconTints: Record<string, string> = {
  users: 'bg-blue-50 text-blue-600',
  building: 'bg-orange-50 text-orange-600',
  chart: 'bg-violet-50 text-violet-600',
  dollar: 'bg-emerald-50 text-emerald-600',
}

export function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api.dashboard().then(setData).catch((cause: Error) => setError(cause.message))
  }, [])

  if (error) {
    return <p className="rounded-md bg-rose-50 px-4 py-2 text-sm text-rose-700">{error}</p>
  }
  if (!data) {
    return <p className="text-sm text-muted">Loading…</p>
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted">Welcome back! Here's what's happening with your business</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.stats.map((stat) => {
          const Icon = icons[stat.icon] ?? Users
          return (
            <Card key={stat.label} className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted">{stat.label}</p>
                  <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
                </div>
                <span className={cn('flex h-9 w-9 items-center justify-center rounded-full', iconTints[stat.icon])}>
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <p className={cn('mt-3 text-xs', stat.tone === 'up' ? 'text-emerald-600' : 'text-rose-600')}>
                {stat.change}
              </p>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Recent activity" to="/tasks" headers={['Type', 'Activity']}>
          {data.recentActivity.map((activity) => (
            <tr key={activity.id}>
              <TableCell>{activity.type}</TableCell>
              <TableCell>{activity.description}</TableCell>
            </tr>
          ))}
        </Panel>

        <Panel title="Performance" to="/deals" headers={['Full name', 'Closed deals', 'Revenue']}>
          {data.performance.map((performer) => (
            <tr key={performer.fullName}>
              <TableCell>{performer.fullName}</TableCell>
              <TableCell>{performer.closedDeals}</TableCell>
              <TableCell>{formatCurrency(performer.revenue)}</TableCell>
            </tr>
          ))}
        </Panel>
      </div>

      <Panel title="Recently created contacts" to="/contacts" headers={['Full name', 'Company', 'Source', 'Owner', 'Created']}>
        {data.recentContacts.map((contact) => (
          <tr key={contact.id}>
            <TableCell>{contact.fullName}</TableCell>
            <TableCell>{contact.company}</TableCell>
            <TableCell>{contact.source}</TableCell>
            <TableCell>{contact.owner}</TableCell>
            <TableCell>{formatDate(contact.createdAt)}</TableCell>
          </tr>
        ))}
      </Panel>

      <Panel title="Upcoming tasks" to="/tasks" headers={['Type', 'Related to', 'Assigned to', 'Status']}>
        {data.upcomingTasks.map((task) => (
          <tr key={task.id}>
            <TableCell>{task.title}</TableCell>
            <TableCell>{task.relatedTo}</TableCell>
            <TableCell>{task.assignedTo}</TableCell>
            <TableCell>
              <Badge label={task.status} />
            </TableCell>
          </tr>
        ))}
      </Panel>
    </div>
  )
}

function Panel({
  title,
  to,
  headers,
  children,
}: {
  title: string
  to: string
  headers: string[]
  children: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <Table>
        <thead>
          <tr>
            {headers.map((header) => (
              <TableHead key={header}>{header}</TableHead>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </Table>
      <CardContent className="border-t border-border pt-3">
        <Link className="text-sm font-medium text-brand hover:underline" to={to}>
          View all
        </Link>
      </CardContent>
    </Card>
  )
}
