import { useSearchParams } from 'react-router-dom'

export default function useQueryParams(): Record<string, string> {
  const [searchParams] = useSearchParams()
  const params: Record<string, string> = {}

  searchParams.forEach((value, key) => {
    params[key] = value
  })

  return params
}
