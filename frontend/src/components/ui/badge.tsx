import { cn } from '@/lib/utils'

const tones: Record<string, string> = {
  Pending: 'bg-amber-50 text-amber-700',
  'In Progress': 'bg-blue-50 text-blue-700',
  Completed: 'bg-emerald-50 text-emerald-700',
  Won: 'bg-emerald-50 text-emerald-700',
  Lost: 'bg-rose-50 text-rose-700',
}

export function Badge({ label }: { label: string }) {
  return (
    <span className={cn('rounded px-2 py-1 text-xs font-medium', tones[label] ?? 'bg-slate-100 text-slate-600')}>
      {label}
    </span>
  )
}
