import { DOM } from "../utils";

export const dispatchPlayEvent = () => {
  const playEvent = new CustomEvent("play-video");
  document.dispatchEvent(playEvent);
};

export const dispatchShowPageEvent = (id) => {
  const showEvent = new CustomEvent("show-page", { detail: { id } });
  document.dispatchEvent(showEvent);
};

export const dispatchCardMountEvent = (event) => {
  const dom = new DOM();
  const element = event.target;
  const gridCards = dom.getChildrenArray(element.parentElement);
  const currentPosition = dom.getElementPosition(gridCards, element);
  const cardToMount = gridCards[currentPosition + 2];
  const cardToUnmount = gridCards[gridCards.length - 1];

  const mountEvent = new CustomEvent("card-mount", {
    detail: { cardToMount, cardToUnmount },
  });
  document.dispatchEvent(mountEvent);
};

export const dispatchNoTargetEvent = (key) => {
  const noTarget = new CustomEvent("no-nav-target", { detail: { key } });
  document.dispatchEvent(noTarget);
};
