import { Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Companies } from '@/pages/Companies'
import { Contacts } from '@/pages/Contacts'
import { Dashboard } from '@/pages/Dashboard'
import { Deals } from '@/pages/Deals'
import { Tasks } from '@/pages/Tasks'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="contacts" element={<Contacts />} />
        <Route path="companies" element={<Companies />} />
        <Route path="deals" element={<Deals />} />
        <Route path="tasks" element={<Tasks />} />
      </Route>
    </Routes>
  )
}
