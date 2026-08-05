import { ResourcePage } from '@/components/ResourcePage'
import { Badge } from '@/components/ui/badge'
import type { Deal } from '@/lib/api'
import { formatCurrency, formatDate } from '@/lib/utils'

export function Deals() {
  return (
    <ResourcePage<Deal>
      title="Deals"
      description="Opportunities you are working"
      resource="deals"
      columns={[
        { key: 'name', header: 'Deal' },
        { key: 'company', header: 'Company' },
        { key: 'amount', header: 'Amount', render: (row) => formatCurrency(row.amount) },
        { key: 'stage', header: 'Stage', render: (row) => <Badge label={row.stage} /> },
        { key: 'owner', header: 'Owner' },
        { key: 'closeDate', header: 'Close date', render: (row) => formatDate(row.closeDate) },
      ]}
      fields={[
        { name: 'name', label: 'Deal' },
        { name: 'company', label: 'Company' },
        { name: 'amount', label: 'Amount', type: 'number' },
        { name: 'stage', label: 'Stage' },
        { name: 'owner', label: 'Owner' },
        { name: 'closeDate', label: 'Close date', type: 'date' },
      ]}
    />
  )
}
