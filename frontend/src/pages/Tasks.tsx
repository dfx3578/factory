import { ResourcePage } from '@/components/ResourcePage'
import type { Column, Field } from '@/components/ResourcePage'
import { Badge } from '@/components/ui/badge'
import type { Task } from '@/types'
import { formatDate, statusVariant } from '@/lib/format'

const columns: Column<Task>[] = [
  { header: 'Type', render: (t) => <span className="font-medium">{t.type}</span> },
  { header: 'Related to', render: (t) => t.relatedTo },
  { header: 'Assigned to', render: (t) => t.assignedTo },
  { header: 'Due date', render: (t) => formatDate(t.dueDate) },
  { header: 'Status', render: (t) => <Badge variant={statusVariant(t.status)}>{t.status}</Badge> },
]

const fields: Field[] = [
  { name: 'type', label: 'Type', placeholder: 'Call client' },
  { name: 'relatedTo', label: 'Related to', placeholder: 'Acme Inc.' },
  { name: 'assignedTo', label: 'Assigned to', options: ['Sarah', 'Daniel', 'Alex', 'Emma', 'Liam'] },
  { name: 'dueDate', label: 'Due date', type: 'date' },
  { name: 'status', label: 'Status', options: ['Pending', 'In Progress', 'Completed'] },
]

const defaults = {
  type: '',
  relatedTo: '',
  assignedTo: 'Sarah',
  dueDate: '',
  status: 'Pending',
}

export function Tasks() {
  return (
    <ResourcePage<Task>
      title="Tasks"
      description="Stay on top of your follow-ups"
      endpoint="/tasks"
      columns={columns}
      fields={fields}
      defaults={defaults}
    />
  )
}
