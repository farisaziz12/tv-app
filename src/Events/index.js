export const dispatchPlayEvent = () => {
  const playEvent = new CustomEvent("play-video");
  document.dispatchEvent(playEvent);
};

export const dispatchShowPageEvent = (id) => {
  const showEvent = new CustomEvent("show-page", { detail: { id } });
  document.dispatchEvent(showEvent);
};
