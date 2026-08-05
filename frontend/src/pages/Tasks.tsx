import { ResourcePage } from '@/components/ResourcePage'
import { Badge } from '@/components/ui/badge'
import type { Task } from '@/lib/api'
import { formatDate } from '@/lib/utils'

export function Tasks() {
  return (
    <ResourcePage<Task>
      title="Tasks"
      description="What your team needs to do next"
      resource="tasks"
      columns={[
        { key: 'title', header: 'Type' },
        { key: 'relatedTo', header: 'Related to' },
        { key: 'assignedTo', header: 'Assigned to' },
        { key: 'status', header: 'Status', render: (row) => <Badge label={row.status} /> },
        { key: 'dueDate', header: 'Due', render: (row) => formatDate(row.dueDate) },
      ]}
      fields={[
        { name: 'title', label: 'Type' },
        { name: 'relatedTo', label: 'Related to' },
        { name: 'assignedTo', label: 'Assigned to' },
        { name: 'status', label: 'Status' },
        { name: 'dueDate', label: 'Due', type: 'date' },
      ]}
    />
  )
}
