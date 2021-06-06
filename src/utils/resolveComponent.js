import { BasicCard, DisplayCard } from "../components";
import { TYPES } from "../Enums";

export const resolveComponent = (component, props) => {
  switch (component) {
    case TYPES.BASIC_COMPONENT:
      return <BasicCard key={props.id} {...props} />;
    case TYPES.DISPLAY_COMPONENT:
      return <DisplayCard key={props.id} {...props} />;

    default:
      break;
  }
};
