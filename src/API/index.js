import { pathOr, propOr } from "ramda";
import { get } from "./fetch";
import { createGroups, urlParams } from "../utils";

const APIKey = process.env.REACT_APP_MOVIE_API_KEY;
const baseURL = "https://api.themoviedb.org/3/";

const apiKey = () => {
  return `?api_key=${APIKey}`;
};

const TMDBAdapter = (movie, genresArr) => {
  const {
    title,
    overview: description,
    id,
    release_date: releaseDate,
    genre_ids,
  } = movie;

  const genres = genresArr
    .filter((genre) => genre_ids.includes(genre.id))
    .map((genre) => genre.name)
    .slice(0, 3);

  let images = getImages(movie);
  images = images ? images : {};

  return { ...images, title, description, id, releaseDate, genres };
};

const fetchMovies = async (page, genreId = "") => {
  return await get(
    `${baseURL}discover/movie${apiKey()}&language=en-US&sort_by=popularity.desc&include_adult=true&with_genres=${genreId}&include_video=true&page=${page}&with_watch_monetization_types=free`
  );
};

const fetchGenres = () => {
  return get(`${baseURL}genre/movie/list${apiKey()}&language=en-US`, "genres");
};

export const getGenreId = (genre, genres) => {
  if (!genre) return;
  const matchedGenre = genres.filter(
    (genreObj) => genreObj.name.toLowerCase() === genre.toLowerCase()
  );

  return pathOr(null, [0, "id"], matchedGenre);
};

export const getMovies = async (groups = 2, pages = 1, genre) => {
  let results;
  const genres = await fetchGenres();
  const genreId = getGenreId(genre, genres);

  if (pages === 1) {
    const movies = await fetchMovies(1, genreId);
    results = propOr([], "results", movies).map((movie) => TMDBAdapter(movie, genres));
  } else {
    const moviesArr = [];
    for (let index = 1; index <= pages; index += 1) {
      const movies = await fetchMovies(index, genreId);
      let movieResults = propOr([], "results", movies);
      movieResults = movieResults.map((movie) => TMDBAdapter(movie, genres));
      moviesArr.push(...movieResults);
    }
    results = moviesArr;
  }

  return results[0] ? createGroups(results, groups) : [];
};

export const getConfigurations = async () => {
  const configurations = await get(`${baseURL}configuration${apiKey()}`);
  return configurations;
};

export const getImages = (movie) => {
  const devicePerformanceTier = urlParams("perf");

  const getSize = (sizes) => {
    if (sizes[devicePerformanceTier]) {
      return sizes[devicePerformanceTier];
    } else {
      return sizes.high;
    }
  };

  const backdropSize = {
    lowest: "w300",
    low: "w300",
    mid: "w780",
    high: "w1280",
  };

  const posterSize = {
    lowest: "w92",
    low: "w154",
    mid: "w342",
    high: "w780",
  };

  const { backdrop_path, poster_path } = movie;
  const backdropUrl =
    "https://image.tmdb.org/t/p/" +
    getSize(backdropSize) +
    `/${backdrop_path || poster_path}`;
  const posterUrl =
    "https://image.tmdb.org/t/p/" + getSize(posterSize) + `/${poster_path}`;

  return { backdropUrl, posterUrl };
};
