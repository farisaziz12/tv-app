import { searchMovies } from "../../API";
import { GridsContainer, Input } from "../../components";
import { FocusManager } from "../../utils";
import BaseContentRoute from "../BaseContentRoute";
import styles from "./Search.module.css";

export class Search extends BaseContentRoute {
  constructor() {
    super();

    this.state = {
      searchResults: {},
      firstSearchDone: false,
    };

    this.noTargetKeyConfig = {
      ArrowUp: this.handleFocusOnSearchInput,
    };
  }

  componentDidMount() {
    const focusManager = new FocusManager();
    focusManager.getComponent("search-input").focus();
  }

  handleFocusOnSearchInput = () => {
    const focusManager = new FocusManager();
    focusManager.getComponent("search-input").focus();
  };

  handleSearch = async (event) => {
    const { firstSearchDone } = this.state;
    const query = event.target.value;
    const results = await searchMovies(query);

    if (!firstSearchDone) {
      this.setState({ firstSearchDone: true });
    }

    this.setState({ searchResults: results });
  };

  renderResults = () => {
    const {
      searchResults: { movies = [] },
      firstSearchDone,
    } = this.state;

    if (movies[0]) {
      return (
        <GridsContainer
          noTarget={this.noTargetKeyConfig}
          position={{ top: "10vw" }}
          grids={movies}
          focusOnMount={false}
        />
      );
    } else if (firstSearchDone) {
      return <div className={styles["no-results"]}>No Results</div>;
    }
  };

  inputFocusOut = () => {
    const focusManager = new FocusManager();
    const isFocusedOnGrid = focusManager.initialGridFocus();

    return isFocusedOnGrid;
  };

  render() {
    const {
      searchResults: { autofillSuggestions = [] },
    } = this.state;
    return (
      <div>
        <Input
          component="search-input"
          placeholder="search"
          className={styles["search-input"]}
          onChange={this.handleSearch}
          onFocusOut={this.inputFocusOut}
          autofillSuggestions={autofillSuggestions}
        />
        {this.renderResults()}
      </div>
    );
  }
}
