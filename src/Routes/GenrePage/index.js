import React from "react";
import BaseContentRoute from "../BaseContentRoute";
import { GridsContainer, Hero, Loader } from "../../components";
import { getMovies } from "../../API";
import { pathOr } from "ramda";

export class GenrePage extends BaseContentRoute {
  constructor() {
    super();

    this.state = {
      movies: [],
      isLoading: true,
      currentGenre: "",
    };
  }

  componentDidMount() {
    (async () => {
      const genre = pathOr("", ["match", "params", "genre"], this.props);
      const movies = await getMovies(20, 30, genre);
      this.setState({ currentGenre: genre });

      if (movies[0]) {
        this.setState({ movies, isLoading: false });
      } else {
        this.setState({ isLoading: false });
      }
    })();
  }

  renderHome = () => {
    const { isLoading, movies } = this.state;
    if (isLoading) {
      return <Loader />;
    } else {
      return (
        <div>
          <Hero />
          <GridsContainer grids={movies} playVideo={this.handlePlayer} />
          {this.renderVideoPlayer()}
        </div>
      );
    }
  };

  render() {
    return this.renderHome();
  }
}
