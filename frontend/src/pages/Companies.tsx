import { ResourcePage } from '@/components/ResourcePage'
import type { Column, Field } from '@/components/ResourcePage'
import type { Company } from '@/types'

const columns: Column<Company>[] = [
  { header: 'Name', render: (c) => <span className="font-medium">{c.name}</span> },
  { header: 'Industry', render: (c) => c.industry },
  { header: 'Size', render: (c) => c.size },
  { header: 'Location', render: (c) => c.location },
  { header: 'Website', render: (c) => c.website },
]

const fields: Field[] = [
  { name: 'name', label: 'Name', placeholder: 'Acme Corp' },
  {
    name: 'industry',
    label: 'Industry',
    options: ['Software', 'Finance', 'Retail', 'Healthcare', 'Manufacturing', 'Consulting'],
  },
  { name: 'size', label: 'Size', options: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000'] },
  { name: 'location', label: 'Location', placeholder: 'San Francisco, CA' },
  { name: 'website', label: 'Website', placeholder: 'acme.com' },
]

const defaults = {
  name: '',
  industry: 'Software',
  size: '11-50',
  location: '',
  website: '',
}

export function Companies() {
  return (
    <ResourcePage<Company>
      title="Companies"
      description="Accounts and organizations you work with"
      endpoint="/companies"
      columns={columns}
      fields={fields}
      defaults={defaults}
    />
  )
}
