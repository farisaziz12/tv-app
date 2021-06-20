import { TYPES } from "../Types";
import { urlParams } from "./urlParams";

export const createGroups = (arr, numGroups) => {
  const perGroup = Math.ceil(arr.length / numGroups);
  return new Array(numGroups).fill("").map((_, index) => {
    const cards = arr.slice(index * perGroup, (index + 1) * perGroup);

    if ((index / 2) % 2 === 0) {
      return { cards, component: TYPES.DISPLAY_COMPONENT };
    } else {
      return { cards, component: TYPES.BASIC_COMPONENT };
    }
  });
};

export const keyHandler = (event, keyConfig) => {
  const handler = keyConfig[event.key];
  if (handler) handler();
};

export const formatTime = (seconds) => {
  // Hours, minutes and seconds
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  // Output like "1:01" or "4:03:59" or "123:03:59"
  let formattedTime = "";
  if (hrs > 0) {
    formattedTime += "" + hrs + ":" + (mins < 10 ? "0" : "");
  }
  formattedTime += "" + mins + ":" + (secs < 10 ? "0" : "");
  formattedTime += "" + secs;
  return formattedTime;
};

export const isHighPerfDevice = () => {
  const performanceTier = urlParams(TYPES.PERFORMANCE);
  return (
    performanceTier === TYPES.HIGH_TIER ||
    performanceTier === TYPES.MID_TIER ||
    performanceTier === undefined
  );
};

const fuzzyMatch = (compareTerm = "", term = "") => {
  if (term.length === 0) return 1;
  let string = compareTerm.toLowerCase();
  let compare = term.toLowerCase();
  let matches = 0;
  for (let i = 0; i < compare.length; i++) {
    string.indexOf(compare[i]) > -1 ? (matches += 1) : (matches -= 1);
  }
  return matches / compareTerm.length;
};

export const sortSearch = (movies = [], query = "") => {
  const results = movies.map((movie) => [movie, fuzzyMatch(movie.title, query)]);
  results.sort((a, b) => b[1] - a[1]);
  const filteredResults = results
    .filter((result) => result[1] > 0)
    .map((movie) => movie[0]);
  return filteredResults;
};
