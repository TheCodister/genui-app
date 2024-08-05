import useSWR from 'swr'
import { MovieData } from '@/types/schema/schema'
import { BASE_URL } from '@/constants/BASE_URL'

const fetcher = async (url: string): Promise<MovieData> => {
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

export const useGetMovie = (movieTitle: string) => {
  const { data, error } = useSWR<MovieData>(
    movieTitle
      ? `${BASE_URL}?apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}&t=${encodeURIComponent(movieTitle)}`
      : null,
    fetcher,
  )

  return {
    data,
    loading: !error && !data,
    error: error ? error.message : null,
  }
}
