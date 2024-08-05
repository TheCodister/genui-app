import React from 'react'
import { Card, CardHeader, CardBody, Image } from '@nextui-org/react'
import { MovieData } from '@/types/schema/schema'

interface MovieCardProps {
  movie: MovieData
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <Card className="py-4 w-[300px]">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <p className="text-tiny uppercase font-bold">{movie.Genre}</p>
        <small className="text-default-500">{movie.Year}</small>
        <ul className="flex gap-3">
          {movie.Ratings.slice(0, 2).map((rating, index) => (
            <small key={index}>
              {rating.Source}: {rating.Value}
            </small>
          ))}
        </ul>
        <h4 className="font-bold text-large">{movie.Title}</h4>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <Image
          alt={`${movie.Title} Poster`}
          className="object-cover rounded-xl"
          src={movie.Poster}
          width={270}
        />
        <p className="mt-4">Description: {movie.Plot}</p>
      </CardBody>
    </Card>
  )
}

export default MovieCard
