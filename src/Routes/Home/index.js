import React, { useState, useEffect } from "react";
import { GridsContainer, Hero, Loader } from "../../components";
import { getMovies } from "../../API";

export function Home() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const movies = await getMovies();

      if (movies[0]) {
        setMovies(movies);

        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    })();
  }, []);

  const renderHome = () => {
    if (isLoading) {
      return <Loader />;
    } else {
      return (
        <div>
          <Hero />
          <GridsContainer grids={movies} />
        </div>
      );
    }
  };

  return renderHome();
}