import { ChatOpenAI } from '@langchain/openai'
import { LangChainAdapter, Message } from 'ai'
import { AIMessage, HumanMessage } from 'langchain/schema'
import { z } from 'zod'
import { useGetMovie } from '@/hooks/movie/useGetMovie'
import { useGetSearchMovies } from '@/hooks/movie/useGetSearchMovies'
import MovieCard from '@/components/moviecard'
import { Spinner } from '@nextui-org/react'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

// Define a prompt template for movie recommendations
const recommendationPrompt = `
You are a movie recommendation assistant named IMAI bot. Based on the user's preferences, suggest a movie that they might like. Consider the following details:
- Genre
- Year
- Mood
- Any specific actors or directors

Respond with the movie title, a brief description, and why it fits the user's preferences.
`

export async function POST(req: Request) {
  const {
    messages,
  }: {
    messages: Message[]
  } = await req.json()

  const model = new ChatOpenAI({
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
  })

  // Add the recommendation prompt to the conversation
  const augmentedMessages = [
    new HumanMessage(recommendationPrompt),
    ...messages.map((message) =>
      message.role == 'user'
        ? new HumanMessage(message.content)
        : new AIMessage(message.content),
    ),
  ]

  const stream = await model.stream(augmentedMessages)

  return LangChainAdapter.toDataStreamResponse(stream)
}

// Integrate with movie recommendation logic
const fetchMovieData = async (title: string) => {
  const { data: movie, error } = useGetMovie(title)
  if (error) throw new Error(error)
  return movie
}

const fetchSearchResults = async (query: string) => {
  const { data: searchResults, error } = useGetSearchMovies(query)
  if (error) throw new Error(error)
  return searchResults
}

// Add tools to render movie recommendations
export const movieRecommendationTools = {
  get_movie_details: {
    description: 'Get details of a specific movie',
    parameters: z
      .object({
        title: z.string().describe('The title of the movie'),
      })
      .required(),
    render: async function* ({ title }: { title: string }) {
      yield <Spinner />
      const movie = await fetchMovieData(title)
      if (!movie) {
        return <p>No movie found</p>
      }
      return <MovieCard movie={movie} />
    },
  },
  search_movies: {
    description: 'Search for movies based on a query',
    parameters: z
      .object({
        query: z.string().describe('Search query for movies'),
      })
      .required(),
    render: async function* ({ query }: { query: string }) {
      yield <Spinner />
      const searchResults = await fetchSearchResults(query)
      if (!searchResults || searchResults.length === 0) {
        return <p>No movies found</p>
      }
      return (
        <div>
          {searchResults.map((movie) => (
            <MovieCard key={movie.imdbID} movie={movie} />
          ))}
        </div>
      )
    },
  },
}
