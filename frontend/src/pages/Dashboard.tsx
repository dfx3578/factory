import { Link } from 'react-router-dom'
import {
  Users,
  Building2,
  LineChart,
  DollarSign,
  TrendingUp,
  Phone,
  Mail,
  Calendar,
  MessageSquare,
} from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { dashboardData as data } from '@/data/dashboard'
import { formatCurrency, formatDate, statusVariant } from '@/lib/format'

const statMeta = [
  { key: 'totalContacts', label: 'Total contacts', icon: Users, tint: 'bg-blue-100 text-blue-600' },
  { key: 'companies', label: 'Companies', icon: Building2, tint: 'bg-orange-100 text-orange-500' },
  { key: 'activeDeals', label: 'Active deals', icon: LineChart, tint: 'bg-violet-100 text-violet-500' },
  { key: 'revenue', label: 'Revenue', icon: DollarSign, tint: 'bg-emerald-100 text-emerald-600' },
] as const

const activityIcons: Record<string, typeof Phone> = {
  Call: Phone,
  Email: Mail,
  Meeting: Calendar,
}

const pipelineTints = ['bg-sky-500', 'bg-blue-500', 'bg-violet-500', 'bg-emerald-500']

export function Dashboard() {
  const { stats } = data

  const statValues: Record<(typeof statMeta)[number]['key'], { value: string; change: string }> = {
    totalContacts: { value: String(stats.totalContacts), change: stats.contactsChange },
    companies: { value: String(stats.companies), change: stats.companiesChange },
    activeDeals: { value: String(stats.activeDeals), change: stats.dealsChange },
    revenue: { value: stats.revenue, change: stats.revenueChange },
  }

  const maxRevenue = Math.max(...data.monthlyRevenue.map((m) => m.revenue))
  const maxPipelineValue = Math.max(...data.pipeline.map((s) => s.value))
  const pipelineTotal = data.pipeline.reduce((sum, s) => sum + s.value, 0)

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="mt-1 text-muted-foreground">
            Welcome back! Here&apos;s what&apos;s happening with your business
          </p>
        </div>
        <Badge variant="secondary" className="mt-2 px-3 py-1 text-xs">
          Last 12 months
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statMeta.map((meta) => {
          const entry = statValues[meta.key]
          const positive = !entry.change.trim().startsWith('-')
          return (
            <Card key={meta.key}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{meta.label}</p>
                    <p className="mt-2 text-3xl font-bold">{entry.value}</p>
                  </div>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${meta.tint}`}>
                    <meta.icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-4 flex items-center gap-1 text-xs">
                  <TrendingUp
                    className={`h-3.5 w-3.5 ${positive ? 'text-emerald-600' : 'rotate-180 text-red-500'}`}
                  />
                  <span className={positive ? 'font-medium text-emerald-600' : 'font-medium text-red-500'}>
                    {entry.change.split(' ')[0]}
                  </span>{' '}
                  <span className="text-muted-foreground">
                    {entry.change.split(' ').slice(1).join(' ')}
                  </span>
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue overview</CardTitle>
            <CardDescription>Closed-won revenue per month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-56 items-end gap-2 pt-6">
              {data.monthlyRevenue.map((m) => (
                <div key={m.month} className="group relative flex h-full flex-1 flex-col justify-end">
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                    {formatCurrency(m.revenue)}
                  </span>
                  <div
                    className="w-full rounded-t-md bg-primary/80 transition-colors group-hover:bg-primary"
                    style={{ height: `${Math.max((m.revenue / maxRevenue) * 100, 4)}%` }}
                    title={`${m.month}: ${formatCurrency(m.revenue)} across ${m.deals} deals`}
                  />
                </div>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              {data.monthlyRevenue.map((m) => (
                <span key={m.month} className="flex-1 text-center text-xs text-muted-foreground">
                  {m.month}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pipeline by stage</CardTitle>
            <CardDescription>{formatCurrency(pipelineTotal)} open pipeline</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {data.pipeline.map((s, i) => (
              <div key={s.stage}>
                <div className="mb-1.5 flex items-baseline justify-between text-sm">
                  <span className="font-medium">{s.stage}</span>
                  <span className="text-muted-foreground">
                    {s.count} deals · {formatCurrency(s.value)}
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className={`h-full rounded-full ${pipelineTints[i % pipelineTints.length]}`}
                    style={{ width: `${(s.value / maxPipelineValue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {data.recentActivity.map((a) => {
                const Icon = activityIcons[a.type] ?? MessageSquare
                return (
                  <li key={a.id} className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{a.description}</p>
                      <p className="text-xs text-muted-foreground">{a.type}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{formatDate(a.date)}</span>
                  </li>
                )
              })}
            </ul>
            <Link to="/tasks" className="mt-4 inline-block text-sm font-medium text-primary">
              View all
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Full name</TableHead>
                  <TableHead>Closed deals</TableHead>
                  <TableHead>Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.performance.map((p) => (
                  <TableRow key={p.fullName}>
                    <TableCell className="font-medium">{p.fullName}</TableCell>
                    <TableCell>{p.closedDeals}</TableCell>
                    <TableCell>{formatCurrency(p.revenue)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Link to="/deals" className="mt-4 inline-block text-sm font-medium text-primary">
              View all
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recently created contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Full name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.recentContacts.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.fullName}</TableCell>
                  <TableCell>{c.company}</TableCell>
                  <TableCell>{c.source}</TableCell>
                  <TableCell>{c.owner}</TableCell>
                  <TableCell>{formatDate(c.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Link to="/contacts" className="mt-4 inline-block text-sm font-medium text-primary">
            View all
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Related to</TableHead>
                <TableHead>Assigned to</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.upcomingTasks.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.type}</TableCell>
                  <TableCell>{t.relatedTo}</TableCell>
                  <TableCell>{t.assignedTo}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(t.status)}>{t.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Link to="/tasks" className="mt-4 inline-block text-sm font-medium text-primary">
            View all
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
