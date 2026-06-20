export interface Contact {
  id: number
  fullName: string
  email: string
  phone: string
  company: string
  source: string
  owner: string
  createdAt: string
}

export interface Company {
  id: number
  name: string
  industry: string
  size: string
  location: string
  website: string
  createdAt: string
}

export interface Deal {
  id: number
  name: string
  company: string
  value: number
  stage: string
  owner: string
  status: string
  closeDate: string
}

export interface Task {
  id: number
  type: string
  relatedTo: string
  assignedTo: string
  status: string
  dueDate: string
}

export interface Activity {
  id: number
  type: string
  description: string
  date: string
}

export interface Performer {
  fullName: string
  closedDeals: number
  revenue: number
}

export interface DashboardStats {
  totalContacts: number
  contactsChange: string
  companies: number
  companiesChange: string
  activeDeals: number
  dealsChange: string
  revenue: string
  revenueChange: string
}

export interface DashboardResponse {
  stats: DashboardStats
  recentActivity: Activity[]
  performance: Performer[]
  recentContacts: Contact[]
  upcomingTasks: Task[]
}
