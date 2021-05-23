import { propOr } from "ramda";
import { get } from "./fetch";
import { createGroups } from "../utils";

const APIKey = process.env.REACT_APP_MOVIE_API_KEY;

export const getMovies = async (groups = 2, page = 1) => {
  const movies = await get(
    `https://api.themoviedb.org/3/discover/movie?api_key=${APIKey}&language=en-US&sort_by=popularity.desc&include_adult=true&include_video=true&page=${page}&with_genres=28&with_watch_monetization_types=free`
  );
  const results = propOr([], "results", movies);
  return results[0] ? createGroups(results, groups) : [];
};
