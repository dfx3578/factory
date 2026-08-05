import { Trash2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableCell, TableHead } from '@/components/ui/table'
import { api } from '@/lib/api'

export interface Column<T> {
  key: keyof T & string
  header: string
  render?: (row: T) => React.ReactNode
}

export interface Field {
  name: string
  label: string
  type?: 'text' | 'number' | 'date' | 'email'
}

interface ResourcePageProps<T> {
  title: string
  description: string
  resource: string
  columns: Column<T>[]
  fields: Field[]
}

export function ResourcePage<T extends { id?: number }>({
  title,
  description,
  resource,
  columns,
  fields,
}: ResourcePageProps<T>) {
  const [rows, setRows] = useState<T[]>([])
  const [error, setError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [draft, setDraft] = useState<Record<string, string>>({})

  const load = useCallback(async () => {
    try {
      setRows(await api.list<T>(resource))
      setError(null)
    } catch (cause) {
      setError((cause as Error).message)
    }
  }, [resource])

  useEffect(() => {
    void load()
  }, [load])

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    const body = Object.fromEntries(
      fields.map((field) => [field.name, field.type === 'number' ? Number(draft[field.name] ?? 0) : draft[field.name] ?? '']),
    )
    try {
      await api.create<T>(resource, body as Partial<T>)
      setDraft({})
      setCreating(false)
      await load()
    } catch (cause) {
      setError((cause as Error).message)
    }
  }

  async function remove(id: number) {
    try {
      await api.remove(resource, id)
      await load()
    } catch (cause) {
      setError((cause as Error).message)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="text-sm text-muted">{description}</p>
        </div>
        <Button onClick={() => setCreating((open) => !open)}>{creating ? 'Cancel' : `Add ${title.slice(0, -1)}`}</Button>
      </div>

      {error && <p className="rounded-md bg-rose-50 px-4 py-2 text-sm text-rose-700">{error}</p>}

      {creating && (
        <Card className="p-5">
          <form className="grid grid-cols-2 gap-4 lg:grid-cols-3" onSubmit={submit}>
            {fields.map((field) => (
              <label key={field.name} className="space-y-1 text-sm">
                <span className="text-slate-600">{field.label}</span>
                <Input
                  type={field.type ?? 'text'}
                  required
                  value={draft[field.name] ?? ''}
                  onChange={(event) => setDraft({ ...draft, [field.name]: event.target.value })}
                />
              </label>
            ))}
            <div className="col-span-full">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        <Table>
          <thead>
            <tr>
              {columns.map((column) => (
                <TableHead key={column.key} className="border-t-0">
                  {column.header}
                </TableHead>
              ))}
              <TableHead className="border-t-0" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                {columns.map((column) => (
                  <TableCell key={column.key}>{column.render ? column.render(row) : String(row[column.key] ?? '—')}</TableCell>
                ))}
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete ${row.id}`}
                    onClick={() => row.id != null && remove(row.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  )
}
