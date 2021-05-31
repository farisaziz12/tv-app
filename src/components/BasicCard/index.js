import { Card } from "../Card";
import styles from "./BasicCard.module.css";

export class BasicCard extends Card {
  constructor(props) {
    super(props);

    this.height = 18.485; //vw
    this.width = 11.5; //vw
  }

  renderCard = () => {
    const { title, posterUrl } = this.props;

    return (
      <img
        loading="lazy"
        data-height={this.height}
        data-width={this.width}
        data-component="card"
        tabIndex="-1"
        className={styles["basic-card"]}
        onKeyDown={this.handleFocus}
        aria-label={title}
        onFocus={this.handleHero}
        alt=""
        src={posterUrl}
      ></img>
    );
  };

  render() {
    return this.renderCard();
  }
}
