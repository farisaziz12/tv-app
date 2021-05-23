import { propOr } from "ramda";
import { get } from "./fetch";
import { createGroups, urlParams } from "../utils";

const APIKey = process.env.REACT_APP_MOVIE_API_KEY;
const baseURL = "https://api.themoviedb.org/3/";

const apiKey = () => {
  return `?api_key=${APIKey}`;
};

export const getMovies = async (groups = 2, pages = 1) => {
  let results;
  const fetchMovies = (page) =>
    get(
      `${baseURL}discover/movie${apiKey()}&language=en-US&sort_by=popularity.desc&include_adult=true&include_video=true&page=${page}&with_genres=28&with_watch_monetization_types=free`
    );
  if (pages === 1) {
    const movies = await fetchMovies(1);
    results = propOr([], "results", movies);
  } else {
    const moviesArr = [];
    for (let index = 1; index <= pages; index += 1) {
      const movies = await fetchMovies(index);
      const movieResults = propOr([], "results", movies);
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
    if (devicePerformanceTier) {
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
