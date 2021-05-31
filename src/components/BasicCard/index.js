import { Card } from "../Card";
import styles from "./BasicCard.module.css";

export class BasicCard extends Card {
  constructor(props) {
    super(props);

    this.height = 18.485; //vw
    this.width = 11.5; //vw
  }

  renderCard = () => {
    const { title, posterUrl, id } = this.props;
    return (
      <img
        data-id={id}
        data-height={this.height}
        data-width={this.width}
        loading="lazy"
        {...this.focusManagerProps}
        className={styles["basic-card"]}
        aria-label={title}
        alt=""
        src={posterUrl}
      ></img>
    );
  };

  render() {
    return this.renderCard();
  }
}
