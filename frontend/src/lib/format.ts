import type { BadgeProps } from '@/components/ui/badge'

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatDate(value: string): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function statusVariant(status: string): BadgeProps['variant'] {
  switch (status.toLowerCase()) {
    case 'completed':
    case 'won':
      return 'success'
    case 'in progress':
    case 'open':
      return 'info'
    case 'pending':
      return 'warning'
    case 'lost':
      return 'secondary'
    default:
      return 'default'
  }
}
