export const createGroups = (arr, numGroups) => {
  const perGroup = Math.ceil(arr.length / numGroups);
  return new Array(numGroups).fill("").map((_, index) => {
    const cards = arr.slice(index * perGroup, (index + 1) * perGroup);

    if ((index / 2) % 2 === 0) {
      return { cards, component: "display" };
    } else {
      return { cards, component: "basic" };
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
