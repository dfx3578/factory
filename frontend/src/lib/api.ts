export interface Contact {
  id?: number
  fullName: string
  email: string
  phone: string
  company: string
  source: string
  owner: string
  createdAt: string
}

export interface Company {
  id?: number
  name: string
  industry: string
  website: string
  size: string
  owner: string
}

export interface Deal {
  id?: number
  name: string
  company: string
  amount: number
  stage: string
  owner: string
  closeDate: string
}

export interface Task {
  id?: number
  title: string
  relatedTo: string
  assignedTo: string
  status: string
  dueDate: string
}

export interface Activity {
  id?: number
  type: string
  description: string
  occurredAt: string
}

export interface Stat {
  label: string
  value: string
  change: string
  tone: 'up' | 'down'
  icon: string
}

export interface Performer {
  fullName: string
  closedDeals: number
  revenue: number
}

export interface Dashboard {
  stats: Stat[]
  recentActivity: Activity[]
  performance: Performer[]
  recentContacts: Contact[]
  upcomingTasks: Task[]
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  if (!response.ok) {
    throw new Error(`${init?.method ?? 'GET'} /api${path} failed: ${response.status}`)
  }
  return response.status === 204 ? (undefined as T) : ((await response.json()) as T)
}

export const api = {
  dashboard: () => request<Dashboard>('/dashboard'),
  list: <T>(resource: string) => request<T[]>(`/${resource}`),
  create: <T>(resource: string, body: Partial<T>) =>
    request<T>(`/${resource}`, { method: 'POST', body: JSON.stringify(body) }),
  update: <T>(resource: string, id: number, body: Partial<T>) =>
    request<T>(`/${resource}/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  remove: (resource: string, id: number) => request<void>(`/${resource}/${id}`, { method: 'DELETE' }),
}
