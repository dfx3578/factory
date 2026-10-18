import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { Plus, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { api } from '@/lib/api'

export interface Column<T> {
  header: string
  render: (item: T) => ReactNode
}

export interface Field {
  name: string
  label: string
  type?: 'text' | 'number' | 'email' | 'date'
  options?: string[]
  placeholder?: string
}

interface ResourcePageProps<T> {
  title: string
  description: string
  /** REST endpoint to fetch/create/delete against. Omit to keep data
   * client-side from `initialData` (frontend-only mode). */
  endpoint?: string
  initialData?: T[]
  columns: Column<T>[]
  fields: Field[]
  defaults: Record<string, string>
}

export function ResourcePage<T extends { id: number }>({
  title,
  description,
  endpoint,
  initialData,
  columns,
  fields,
  defaults,
}: ResourcePageProps<T>) {
  const [items, setItems] = useState<T[]>(initialData ?? [])
  const [loading, setLoading] = useState(Boolean(endpoint))
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Record<string, string>>(defaults)
  const [saving, setSaving] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  const emptyForm = useMemo(() => defaults, [defaults])
  const reload = () => {
    setLoading(true)
    setReloadKey((key) => key + 1)
  }

  useEffect(() => {
    if (!endpoint) return
    let active = true
    api
      .get<T[]>(endpoint)
      .then((data) => {
        if (!active) return
        setItems(data)
        setError(null)
      })
      .catch((err: Error) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [endpoint, reloadKey])

  async function handleCreate() {
    setSaving(true)
    try {
      const payload: Record<string, unknown> = {}
      for (const field of fields) {
        const raw = form[field.name] ?? ''
        payload[field.name] = field.type === 'number' ? Number(raw || 0) : raw
      }
      if (endpoint) {
        await api.post(endpoint, payload)
        reload()
      } else {
        setItems((prev) => [
          ...prev,
          {
            ...payload,
            id: prev.reduce((max, item) => Math.max(max, item.id), 0) + 1,
            createdAt: new Date().toISOString().slice(0, 10),
          } as unknown as T,
        ])
      }
      setOpen(false)
      setForm(emptyForm)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number) {
    try {
      if (endpoint) {
        await api.del(`${endpoint}/${id}`)
        reload()
      } else {
        setItems((prev) => prev.filter((item) => item.id !== id))
      }
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          <p className="mt-1 text-muted-foreground">{description}</p>
        </div>
        <Dialog open={open} onOpenChange={(value) => { setOpen(value); if (value) setForm(emptyForm) }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" /> Add {title.replace(/s$/, '')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add {title.replace(/s$/, '')}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              {fields.map((field) => (
                <div key={field.name} className="grid gap-2">
                  <Label htmlFor={field.name}>{field.label}</Label>
                  {field.options ? (
                    <Select
                      value={form[field.name] ?? ''}
                      onValueChange={(value) => setForm((f) => ({ ...f, [field.name]: value }))}
                    >
                      <SelectTrigger id={field.name}>
                        <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id={field.name}
                      type={field.type ?? 'text'}
                      placeholder={field.placeholder}
                      value={form[field.name] ?? ''}
                      onChange={(e) => setForm((f) => ({ ...f, [field.name]: e.target.value }))}
                    />
                  )}
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={saving}>
                {saving ? 'Saving…' : 'Save'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead key={col.header}>{col.header}</TableHead>
                ))}
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} className="text-muted-foreground">
                    Loading…
                  </TableCell>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} className="text-muted-foreground">
                    No records yet.
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => (
                  <TableRow key={item.id}>
                    {columns.map((col) => (
                      <TableCell key={col.header}>{col.render(item)}</TableCell>
                    ))}
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(item.id)}
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
