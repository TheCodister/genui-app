import React, { useState } from 'react'
import { useGetMovie } from '@/hooks/movie/useGetMovie'
import { useGetSearchMovies } from '@/hooks/movie/useGetSearchMovies'
import MovieCard from '@/components/moviecard'
import { MovieSearchData } from '@/types/schema/schema'

const MovieComponent = () => {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [inputValue, setInputValue] = useState<string>('')
  const [movieTitle, setMovieTitle] = useState<string>('')
  const { data, loading, error } = useGetMovie(movieTitle)
  const { data: MovieData } = useGetSearchMovies(searchQuery)

  const handleSearch = () => {
    setMovieTitle(inputValue)
    setSearchQuery(inputValue)
  }

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value)
          setSearchQuery(e.target.value)
        }}
        placeholder="Enter movie title"
      />
      <button onClick={handleSearch}>Search</button>

      {error && <p>Error: {error}</p>}
      {data && <MovieCard movie={data} />}
      <div>
        {MovieData.length > 0 ? (
          <div>
            <h1>Other Result:</h1>
            <div className="flex gap-5">
              {MovieData.slice(1, 7).map((movie: MovieSearchData) => (
                <MovieCard key={movie.imdbID} movie={movie} />
              ))}
            </div>
          </div>
        ) : (
          <p>No results found</p>
        )}
      </div>
    </div>
  )
}

export default MovieComponent
