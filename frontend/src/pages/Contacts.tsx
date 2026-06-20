import { ResourcePage } from '@/components/ResourcePage'
import type { Column, Field } from '@/components/ResourcePage'
import type { Contact } from '@/types'
import { formatDate } from '@/lib/format'

const columns: Column<Contact>[] = [
  { header: 'Full name', render: (c) => <span className="font-medium">{c.fullName}</span> },
  { header: 'Email', render: (c) => c.email },
  { header: 'Company', render: (c) => c.company },
  { header: 'Source', render: (c) => c.source },
  { header: 'Owner', render: (c) => c.owner },
  { header: 'Created', render: (c) => formatDate(c.createdAt) },
]

const fields: Field[] = [
  { name: 'fullName', label: 'Full name', placeholder: 'Jane Smith' },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'jane@example.com' },
  { name: 'phone', label: 'Phone', placeholder: '+1 555 0100' },
  { name: 'company', label: 'Company', placeholder: 'Acme Corp' },
  { name: 'source', label: 'Source', options: ['Website', 'LinkedIn', 'Referral', 'Cold call', 'Event'] },
  { name: 'owner', label: 'Owner', options: ['Sarah', 'Daniel', 'Alex', 'Emma', 'Liam'] },
]

const defaults = {
  fullName: '',
  email: '',
  phone: '',
  company: '',
  source: 'Website',
  owner: 'Sarah',
}

export function Contacts() {
  return (
    <ResourcePage<Contact>
      title="Contacts"
      description="Manage the people in your pipeline"
      endpoint="/contacts"
      columns={columns}
      fields={fields}
      defaults={defaults}
    />
  )
}
