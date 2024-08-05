'use server'

import { streamUI } from 'ai/rsc'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'
import { ChatOpenAI } from '@langchain/openai'
import { AIMessage, HumanMessage } from 'langchain/schema'
import { useGetMovie } from '@/hooks/movie/useGetMovie'
import { useGetSearchMovies } from '@/hooks/movie/useGetSearchMovies'
import MovieCard from '@/components/moviecard'
import React from 'react'

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

const LoadingComponent = () => (
  <div className="animate-pulse p-4">Loading...</div>
)

interface MovieProps {
  movie: any // Adjust the type as needed
}

const MovieCardComponent = (props: MovieProps) => (
  <MovieCard movie={props.movie} />
)

const SearchMoviesComponent = ({ movies }: { movies: any[] }) => (
  <div>
    {movies.map((movie) => (
      <MovieCard key={movie.imdbID} movie={movie} />
    ))}
  </div>
)

const getMovieDetails = async (title: string) => {
  const { data: movie, error } = useGetMovie(title)
  if (error) {
    return <p>Error: {error}</p>
  }
  if (!movie) {
    return <p>No movie found</p>
  }
  return <MovieCardComponent movie={movie} />
}

const searchMovies = async (query: string) => {
  const { data: searchResults, error } = useGetSearchMovies(query)
  if (error) {
    return <p>Error: {error}</p>
  }
  if (!searchResults || searchResults.length === 0) {
    return <p>No movies found</p>
  }
  return <SearchMoviesComponent movies={searchResults} />
}

export async function POST() {
  //   const {
  //     messages,
  //   }: {
  //     messages: { role: string; content: string }[]
  //   } = await req.json()

  //   const model = new ChatOpenAI({
  //     model: 'gpt-3.5-turbo',
  //     temperature: 0.7,
  //   })

  //   const augmentedMessages = [
  //     new HumanMessage(recommendationPrompt),
  //     ...messages.map((message) =>
  //       message.role == 'user'
  //         ? new HumanMessage(message.content)
  //         : new AIMessage(message.content),
  //     ),
  //   ]

  //   const stream = await model.stream(augmentedMessages)

  const result = await streamUI({
    model: openai('gpt-3.5-turbo'),
    prompt: recommendationPrompt,
    text: ({ content }) => <div>{content}</div>,
    tools: {
      get_movie_details: {
        description: 'Get details for a movie',
        parameters: z.object({
          title: z.string().describe('the title of the movie'),
        }),
        generate: async function* ({ title }) {
          yield <LoadingComponent />
          const movieDetails = await getMovieDetails(title)
          return movieDetails
        },
      },
      search_movies: {
        description: 'Search for movies by query',
        parameters: z.object({
          query: z.string().describe('the search query'),
        }),
        generate: async function* ({ query }) {
          yield <LoadingComponent />
          const searchResults = await searchMovies(query)
          return searchResults
        },
      },
    },
  })

  return result.value
}
