import React, { Component } from "react";
import { VideoPlayer } from "../../components";

export default class BaseContentRoute extends Component {
  constructor() {
    super();

    this.state = {
      showPlayer: false,
    };

    this.renderVideoPlayer.bind(this);
    this.handlePlayer.bind(this);
  }

  addPlayerEventListener = () => {
    document.addEventListener("play-video", this.handlePlayer);
  };

  removePlayerEventListener = () => {
    document.removeEventListener("play-video", this.handlePlayer);
  };

  handlePlayer = () => {
    this.setState((prevState) => ({ showPlayer: !prevState.showPlayer }));
  };

  renderVideoPlayer = () => {
    if (this.state.showPlayer) {
      return <VideoPlayer handlePlayer={this.handlePlayer} />;
    }
  };
}
