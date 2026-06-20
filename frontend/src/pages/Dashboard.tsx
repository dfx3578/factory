import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, Building2, LineChart, DollarSign } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { api } from '@/lib/api'
import type { DashboardResponse } from '@/types'
import { formatCurrency, formatDate, statusVariant } from '@/lib/format'

const statMeta = [
  { key: 'totalContacts', label: 'Total contacts', icon: Users, tint: 'bg-blue-100 text-blue-600' },
  { key: 'companies', label: 'Companies', icon: Building2, tint: 'bg-orange-100 text-orange-500' },
  { key: 'activeDeals', label: 'Active deals', icon: LineChart, tint: 'bg-violet-100 text-violet-500' },
  { key: 'revenue', label: 'Revenue', icon: DollarSign, tint: 'bg-emerald-100 text-emerald-600' },
] as const

export function Dashboard() {
  const [data, setData] = useState<DashboardResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api
      .get<DashboardResponse>('/dashboard')
      .then(setData)
      .catch((err: Error) => setError(err.message))
  }, [])

  if (error) {
    return <p className="text-sm text-destructive">Failed to load dashboard: {error}</p>
  }

  if (!data) {
    return <p className="text-sm text-muted-foreground">Loading…</p>
  }

  const { stats } = data

  const statValues: Record<(typeof statMeta)[number]['key'], { value: string; change: string }> = {
    totalContacts: { value: String(stats.totalContacts), change: stats.contactsChange },
    companies: { value: String(stats.companies), change: stats.companiesChange },
    activeDeals: { value: String(stats.activeDeals), change: stats.dealsChange },
    revenue: { value: stats.revenue, change: stats.revenueChange },
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="mt-1 text-muted-foreground">
          Welcome back! Here&apos;s what&apos;s happening with your business
        </p>
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
                <p className="mt-4 text-xs">
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Activity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentActivity.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.type}</TableCell>
                    <TableCell>{a.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Link to="/tasks" className="mt-2 inline-block px-4 text-sm font-medium text-primary">
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
            <Link to="/deals" className="mt-2 inline-block px-4 text-sm font-medium text-primary">
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
          <Link to="/contacts" className="mt-2 inline-block px-4 text-sm font-medium text-primary">
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
          <Link to="/tasks" className="mt-2 inline-block px-4 text-sm font-medium text-primary">
            View all
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
