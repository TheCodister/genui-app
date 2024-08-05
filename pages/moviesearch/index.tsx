import React, { useState } from 'react'
import { useGetMovie } from '@/hooks/movie/useGetMovie'
import { useGetSearchMovies } from '@/hooks/movie/useGetSearchMovies'
import MovieCard from '@/components/moviecard'
import { MovieSearchData } from '@/types/schema/schema'
import { set } from 'zod'

const MovieComponent = () => {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [inputValue, setInputValue] = useState<string>('')
  const [movieTitle, setMovieTitle] = useState<string>('')
  const { data, loading, error } = useGetMovie(movieTitle)
  const { Data } = useGetSearchMovies(searchQuery)

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

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {data && <MovieCard movie={data} />}
      {Data.length > 0 ? (
        <div>
          {Data.slice(0, 3).map((movie: MovieSearchData) => (
            <div key={movie.imdbID}>
              <h3>{movie.Title}</h3>
              <p>{movie.Year}</p>
              <img src={movie.Poster} alt={movie.Title} />
            </div>
          ))}
        </div>
      ) : (
        <p>No results found</p>
      )}
    </div>
  )
}

export default MovieComponent
