import { ResourcePage } from '@/components/ResourcePage'
import type { Contact } from '@/lib/api'
import { formatDate } from '@/lib/utils'

export function Contacts() {
  return (
    <ResourcePage<Contact>
      title="Contacts"
      description="Everyone you are doing business with"
      resource="contacts"
      columns={[
        { key: 'fullName', header: 'Full name' },
        { key: 'email', header: 'Email' },
        { key: 'company', header: 'Company' },
        { key: 'source', header: 'Source' },
        { key: 'owner', header: 'Owner' },
        { key: 'createdAt', header: 'Created', render: (row) => formatDate(row.createdAt) },
      ]}
      fields={[
        { name: 'fullName', label: 'Full name' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'phone', label: 'Phone' },
        { name: 'company', label: 'Company' },
        { name: 'source', label: 'Source' },
        { name: 'owner', label: 'Owner' },
        { name: 'createdAt', label: 'Created', type: 'date' },
      ]}
    />
  )
}
