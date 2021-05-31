import React, { Component } from "react";
import { getGenreId } from "../../API";
import { VideoPlayer } from "../../components";
import { urlParams } from "../../utils";

export default class BaseContentRoute extends Component {
  constructor() {
    super();

    this.state = {
      showPlayer: false,
    };

    this.renderVideoPlayer.bind(this);
    this.handlePlayer.bind(this);
  }

  getGenre = async () => {
    const genreId = await getGenreId(urlParams("genre"));
    return genreId;
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
