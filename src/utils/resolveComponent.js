import { DisplayCard, BasicCard } from "../components";

export const resolveComponent = (component, props) => {
  switch (component) {
    case "basic":
      return <BasicCard key={props.id} {...props} />;
    case "display":
      return <DisplayCard key={props.id} {...props} />;

    default:
      break;
  }
};
