import useSWR from 'swr'
import { MovieSearchData } from '@/types/schema/schema'
import { BASE_URL } from '@/constants/BASE_URL'

interface SearchResponse {
  Search: MovieSearchData[]
  totalResults: string
  Response: string
  Error?: string
}

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
    Data: data?.Search || [],
    Loading: !error && !data,
    Error: error ? error.message : null,
  }
}