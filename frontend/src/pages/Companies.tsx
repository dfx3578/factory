import { ResourcePage } from '@/components/ResourcePage'
import type { Company } from '@/lib/api'

export function Companies() {
  return (
    <ResourcePage<Company>
      title="Companies"
      description="Accounts in your pipeline"
      resource="companies"
      columns={[
        { key: 'name', header: 'Name' },
        { key: 'industry', header: 'Industry' },
        { key: 'website', header: 'Website' },
        { key: 'size', header: 'Size' },
        { key: 'owner', header: 'Owner' },
      ]}
      fields={[
        { name: 'name', label: 'Name' },
        { name: 'industry', label: 'Industry' },
        { name: 'website', label: 'Website' },
        { name: 'size', label: 'Size' },
        { name: 'owner', label: 'Owner' },
      ]}
    />
  )
}
