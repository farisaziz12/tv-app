import React, { Component } from "react";
import videojs from "video.js";
import { Controls, isPaused$, progress$ } from "./Controls";
import { FocusManager, keyHandler, logger, formatTime } from "../../utils";
import "video.js/dist/video-js.css";
import styles from "./VideoPlayer.module.css";

export class VideoPlayer extends Component {
  constructor() {
    super();
    this.videoJsOptions = {
      autoplay: true,
      sources: [
        {
          src: "https://s3.amazonaws.com/senkorasic.com/test-media/video/caminandes-llamigos/caminandes_llamigos_1080p.mp4",
          type: "video/mp4",
        },
      ],
    };

    this.keyConfig = {
      Enter: this.handlePlayPause,
      Backspace: this.handleExit,
    };
  }
  componentDidMount() {
    // instantiate Video.js
    this.player = videojs(this.videoNode, this.videoJsOptions, function onPlayerReady() {
      logger("onPlayerReady", this).log();
    });
    this.handlePlayer = this.props.handlePlayer;

    this.progressInterval = setInterval(() => {
      if (!this.player.paused()) {
        const secondsRemaining = this.player.remainingTime();
        const currentTime = this.player.currentTime();
        const duration = this.player.duration();
        progress$.next({
          duration,
          currentTime,
          secondsRemaining,
          displayTime: formatTime(secondsRemaining),
        });
      }
    }, 1000);
  }

  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }
    clearInterval(this.progressInterval);
  }

  handleExit = () => {
    this.handlePlayer();
    const focusManager = new FocusManager();
    focusManager.initialGridFocus();
  };

  handlePlayPause = () => {
    if (this.player.paused()) {
      this.player.play();
      isPaused$.next(false);
    } else {
      this.player.pause();
      isPaused$.next(true);
    }
  };

  render() {
    return (
      <div>
        <div onKeyDown={(event) => keyHandler(event, this.keyConfig)} data-vjs-player>
          <video
            ref={(node) => (this.videoNode = node)}
            className={`video-js ${styles["player-container"]}`}
          ></video>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Controls />
          </div>
        </div>
      </div>
    );
  }
}
