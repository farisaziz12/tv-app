import React, { Component } from "react";
import videojs from "video.js";
import { Controls, isPaused$, progress$, playerControls$ } from "./Controls";
import { FocusManager, keyHandler, logger } from "../../utils";
import "video.js/dist/video-js.css";
import styles from "./VideoPlayer.module.css";
import { pathOr } from "ramda";

export class VideoPlayer extends Component {
  constructor() {
    super();
    this.videoJsOptions = {
      autoplay: "play",
      sources: [
        {
          src: "https://s3.amazonaws.com/senkorasic.com/test-media/video/caminandes-llamigos/caminandes_llamigos_720p.mp4",
          type: "video/mp4",
        },
      ],
    };

    this.keyConfig = {
      Backspace: this.handleExit,
    };
  }
  componentDidMount() {
    // instantiate Video.js
    this.player = videojs(this.videoNode, this.videoJsOptions, function onPlayerReady() {
      logger("onPlayerReady", this).log();
    });
    this.player.on("ended", () => {
      logger("video ended").log();
      this.handleExit();
    });

    this.handlePlayer = this.props.handlePlayer;

    this.progressInterval = setInterval(this.handleProgressInterval, 1000);

    this.playerControls$ = playerControls$.subscribe(this.handlePlayerControls);
  }

  handlePlayerControls = (component) => {
    switch (component) {
      case "play-pause-button":
        this.handlePlayPause();
        break;
      case "forward-button":
        this.player.currentTime(this.player.currentTime() + 15);
        break;
      case "back-button":
        this.player.currentTime(this.player.currentTime() - 15);
        break;

      default:
        break;
    }
  };

  handleProgressInterval = () => {
    if (!this.player.paused()) {
      const displayTime = pathOr(
        "00:00",
        ["controlBar", "remainingTimeDisplay", "formattedTime_"],
        this.player
      );
      const currentTime = this.player.currentTime() ?? 0;
      const duration = this.player.duration() ?? 0;
      progress$.next({
        duration,
        currentTime,
        displayTime,
      });
    }
  };

  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }
    clearInterval(this.progressInterval);
    this.playerControls$.unsubscribe();
  }

  handleExit = () => {
    this.handlePlayer();
    const focusManager = new FocusManager();
    focusManager.getComponent("watch-now-button").focus();
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
