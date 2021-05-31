import { pathOr } from "ramda";
import { getMovie } from "../../API";
import { Loader } from "../../components";
import { dispatchPlayEvent } from "../../Events";
import { FocusManager, keyHandler } from "../../utils";
import BaseContentRoute from "../BaseContentRoute";
import { notFound$ } from "../Routing";
import styles from "./Show.module.css";

export class Show extends BaseContentRoute {
  constructor() {
    super();

    this.state = {
      movie: {},
      isLoading: true,
    };

    this.keyConfig = {
      Enter: dispatchPlayEvent,
      ArrowLeft: this.focusSidebar,
      Backspace: this.goBack,
    };
  }

  componentDidMount() {
    (async () => {
      const id = pathOr("", ["match", "params", "id"], this.props);
      const movie = await getMovie(id);

      if (movie.title || movie.description) {
        this.setState({ movie, isLoading: false });
        const focusManager = new FocusManager();
        focusManager.getComponent("watch-now-button").focus();
      } else {
        this.setState({ isLoading: false });
        notFound$.next(true);
      }
    })();
    this.addPlayerEventListener();
  }

  componentWillUnmount() {
    this.removePlayerEventListener();
  }

  focusSidebar = () => {
    const focusManager = new FocusManager();
    focusManager.focusOnSidebar();
  };

  goBack = () => {
    this.props.history.goBack();
  };

  renderImage = () => {
    const { posterUrl = "" } = this.state.movie;
    return <img src={posterUrl} alt="" className={styles["show-img"]} />;
  };

  renderGenres = () => {
    const { genres = [] } = this.state.movie;

    if (genres[0]) {
      return (
        <div className={styles["genres-container"]}>
          {genres.map((genre, index) => (
            <div key={index}>
              <span className={styles.dot}></span>
              <div className={styles.genre}>{genre}</div>
            </div>
          ))}
        </div>
      );
    }
  };

  renderMetaData = () => {
    const {
      title = "",
      description = "",
      tagline = "",
      releaseDate = "",
      runtime = "",
    } = this.state.movie;
    return (
      <div className={styles["metadata-container"]}>
        <div className={styles["movie-title"]}>{title}</div>
        <div className={styles["movie-tagline"]}>{tagline}</div>
        <div className={styles["release-date"]}>
          {releaseDate + " - " + runtime + " Min"}
        </div>
        <div>{this.renderGenres()}</div>
        <div className={styles["movie-description"]}>{description}</div>
        {this.renderWatchNowButton()}
      </div>
    );
  };

  renderWatchNowButton = () => {
    return (
      <div
        data-component="watch-now-button"
        tabIndex="-1"
        className={styles["watch-now-button"]}
        onKeyDown={(event) => keyHandler(event, this.keyConfig)}
      >
        Watch Now
      </div>
    );
  };

  renderShowPage = () => {
    const { isLoading } = this.state;

    if (isLoading) {
      return <Loader />;
    } else {
      return (
        <div>
          {this.renderMetaData()}
          {this.renderImage()}
          {this.renderVideoPlayer()}
        </div>
      );
    }
  };

  render() {
    return this.renderShowPage();
  }
}
