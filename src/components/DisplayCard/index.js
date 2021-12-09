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
    const { backdropUrl, id } = this.props;
    const { shouldMount } = this.state;
    return (
      <focus-container
        className={styles["display-card-container"]}
        id={id}
        height={this.height}
        width={this.width}
        component="card"
        auto-aria-label
        ref={this.ref}
        {...this.focusManagerProps}
      >
        <div
          style={{ backgroundImage: `url(${shouldMount ? backdropUrl : ""})` }}
          className={styles["display-card"]}
        ></div>
        {this.renderTitle()}
        {this.renderGenre()}
      </focus-container>
    );
  }
}
