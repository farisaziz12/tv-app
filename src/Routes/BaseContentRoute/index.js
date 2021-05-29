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

  handlePlayer = () => {
    this.setState((prevState) => ({ showPlayer: !prevState.showPlayer }));
  };

  renderVideoPlayer = () => {
    if (this.state.showPlayer) {
      return <VideoPlayer handlePlayer={this.handlePlayer} />;
    }
  };
}
