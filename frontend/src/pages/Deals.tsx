import { ResourcePage } from '@/components/ResourcePage'
import type { Column, Field } from '@/components/ResourcePage'
import { Badge } from '@/components/ui/badge'
import type { Deal } from '@/types'
import { formatCurrency, statusVariant } from '@/lib/format'

const columns: Column<Deal>[] = [
  { header: 'Name', render: (d) => <span className="font-medium">{d.name}</span> },
  { header: 'Company', render: (d) => d.company },
  { header: 'Value', render: (d) => formatCurrency(d.value) },
  { header: 'Stage', render: (d) => d.stage },
  { header: 'Owner', render: (d) => d.owner },
  { header: 'Status', render: (d) => <Badge variant={statusVariant(d.status)}>{d.status}</Badge> },
]

const fields: Field[] = [
  { name: 'name', label: 'Name', placeholder: 'CRM Redesign' },
  { name: 'company', label: 'Company', placeholder: 'Acme Corp' },
  { name: 'value', label: 'Value', type: 'number', placeholder: '25000' },
  { name: 'stage', label: 'Stage', options: ['Discovery', 'Qualified', 'Proposal', 'Negotiation', 'Closed'] },
  { name: 'owner', label: 'Owner', options: ['Sarah', 'Daniel', 'Alex', 'Emma', 'Liam'] },
  { name: 'status', label: 'Status', options: ['Open', 'Won', 'Lost'] },
]

const defaults = {
  name: '',
  company: '',
  value: '',
  stage: 'Discovery',
  owner: 'Sarah',
  status: 'Open',
}

export function Deals() {
  return (
    <ResourcePage<Deal>
      title="Deals"
      description="Track opportunities through your pipeline"
      endpoint="/deals"
      columns={columns}
      fields={fields}
      defaults={defaults}
    />
  )
}
