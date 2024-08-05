'use client'

import React from 'react'
import { Card, CardHeader, CardBody, Image } from '@nextui-org/react'
import { MovieData, MovieSearchData } from '@/types/schema/schema'
import { IMDB_URL } from '@/constants/IMDB_URL'
import Link from 'next/link'

type MovieCardProps = {
  movie: MovieData | MovieSearchData
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  // Type guards to determine the type of movie
  const isMovieData = (
    movie: MovieData | MovieSearchData,
  ): movie is MovieData => {
    return (movie as MovieData).Plot !== undefined
  }

  return (
    <Link href={`${IMDB_URL}${movie.imdbID}`}>
      <Card className="py-4 w-[300px]">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <p className="text-tiny uppercase font-bold">
            {isMovieData(movie) ? movie.Genre : ''}
          </p>
          <small className="text-default-500">{movie.Year}</small>
          {isMovieData(movie) ? (
            <ul className="flex gap-3">
              {movie.Ratings.slice(0, 2).map((rating, index) => (
                <small key={index}>
                  {rating.Source}: {rating.Value}
                </small>
              ))}
            </ul>
          ) : null}
          <h4 className="font-bold text-large">
            {isMovieData(movie) ? movie.Title : movie.Title}
          </h4>
        </CardHeader>
        <CardBody className="overflow-visible py-2">
          <Image
            alt={`${isMovieData(movie) ? movie.Title : 'Movie'} Poster`}
            className="object-cover rounded-xl"
            src={movie.Poster}
            width={270}
          />
          <p className="mt-4">
            {isMovieData(movie) ? `Description: ${movie.Plot}` : ''}
          </p>
        </CardBody>
      </Card>
    </Link>
  )
}

export default MovieCard
