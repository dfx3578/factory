import type { Company } from '@/types'

const INDUSTRIES = ['Software', 'Finance', 'Retail', 'Healthcare', 'Manufacturing']
const LAST_NAMES = [
  'Walker', 'Hughes', 'Bennett', 'Foster', 'Reed',
  'Parker', 'Bryant', 'Coleman', 'Hayes', 'Russell',
  'Griffin', 'Diaz', 'Murphy', 'Cole', 'Ward',
]

// Frontend-only dataset for the Companies page. Mirrors
// backend DataSeeder.seedCompanies: the five named records first,
// then generated filler up to 53 total.
const named: Company[] = [
  { id: 1, name: 'Acme Corp', industry: 'Software', size: '201-500', location: 'San Francisco, CA', website: 'acme.com', createdAt: '2025-01-15' },
  { id: 2, name: 'Acme Inc.', industry: 'Manufacturing', size: '501-1000', location: 'Austin, TX', website: 'acmeinc.com', createdAt: '2025-01-15' },
  { id: 3, name: 'Freelance', industry: 'Consulting', size: '1-10', location: 'Remote', website: '', createdAt: '2025-01-15' },
  { id: 4, name: 'Globex', industry: 'Finance', size: '1001-5000', location: 'New York, NY', website: 'globex.com', createdAt: '2025-01-15' },
  { id: 5, name: 'Initech', industry: 'Software', size: '51-200', location: 'Seattle, WA', website: 'initech.com', createdAt: '2025-01-15' },
]

const filler: Company[] = Array.from({ length: 48 }, (_, idx) => {
  const i = idx + named.length
  return {
    id: i + 1,
    name: `${LAST_NAMES[i % LAST_NAMES.length]} ${INDUSTRIES[i % INDUSTRIES.length]} Co.`,
    industry: INDUSTRIES[i % INDUSTRIES.length],
    size: '11-50',
    location: `City ${i}`,
    website: `company${i}.com`,
    createdAt: '2025-01-15',
  }
})

export const companies: Company[] = [...named, ...filler]
