import { Card } from "../Card";
import { prop } from "ramda";
import styles from "./DisplayCard.module.css";

export class DisplayCard extends Card {
  constructor(props) {
    super(props);
    this.height = 13.5; //vw
    this.width = 18.485; //vw
  }

  renderTitle = () => {
    const { title } = this.props;
    return <div className={styles["display-card-title"]}>{title}</div>;
  };

  renderGenre = () => {
    const { genres } = this.props;
    const genre = prop(0, genres);

    if (genre) {
      return <div className={styles["display-card-genre"]}>{genre}</div>;
    }
  };

  render() {
    const { title, backdropUrl, id } = this.props;
    const { shouldMount } = this.state;
    return (
      <div
        className={styles["display-card-container"]}
        data-id={id}
        data-height={this.height}
        data-width={this.width}
        {...this.focusManagerProps}
        aria-label={title}
        ref={this.ref}
      >
        <div
          style={{ backgroundImage: `url(${shouldMount ? backdropUrl : ""})` }}
          className={styles["display-card"]}
        ></div>
        {this.renderTitle()}
        {this.renderGenre()}
      </div>
    );
  }
}
