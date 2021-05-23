export const createGroups = (arr, numGroups) => {
  const perGroup = Math.ceil(arr.length / numGroups);
  return new Array(numGroups).fill("").map((_, i) => {
    const cards = arr.slice(i * perGroup, (i + 1) * perGroup);
    return { cards };
  });
};
