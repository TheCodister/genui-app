import useSWR from 'swr'
import { BASE_URL } from '@/constants/BASE_URL'
import { SearchResponse } from '@/types/schema/schema'

const fetcher = async (url: string): Promise<SearchResponse> => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch')
  }
  const result = await response.json()
  if (result.Response === 'False') {
    throw new Error(result.Error)
  }
  return result
}

export const useGetSearchMovies = (searchQuery: string) => {
  const apiKey = process.env.NEXT_PUBLIC_OMDB_API_KEY

  const { data, error } = useSWR<SearchResponse>(
    searchQuery
      ? `${BASE_URL}?apikey=${apiKey}&s=${encodeURIComponent(searchQuery)}`
      : null,
    fetcher,
  )

  return {
    data: data?.Search || [],
    loading: !error && !data,
    error: error ? error.message : null,
  }
}
