import createClient from 'openapi-fetch'
import type { paths } from './generated/schema'

export const api = createClient<paths>({ baseUrl: import.meta.env.VITE_API_BASE_URL || '' })

export async function getHealth() {
  const { data, error } = await api.GET('/api/v1/health', { signal: AbortSignal.timeout(5000) })
  if (error || !data) throw new Error('Backend connectivity is unavailable.')
  return data
}

export async function getReadiness() {
  const { data, error } = await api.GET('/api/v1/ready', { signal: AbortSignal.timeout(5000) })
  if (error || !data) throw new Error('Supabase API readiness is unavailable.')
  return data
}
