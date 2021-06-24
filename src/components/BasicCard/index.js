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
    const { shouldMount } = this.state;
    return (
      <focus-container
        id={id}
        height={this.height}
        component="card"
        width={this.width}
        className={styles["basic-card-container"]}
        aria-label={title}
        ref={this.ref}
        {...this.focusManagerProps}
      >
        <img
          className={styles["basic-card"]}
          alt=""
          src={shouldMount ? posterUrl : ""}
          loading="lazy"
        ></img>
      </focus-container>
    );
  };

  render() {
    return this.renderCard();
  }
}
