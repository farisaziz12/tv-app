import React from "react";
import BaseContentRoute from "../BaseContentRoute";
import { GridsContainer, Hero, Loader } from "../../components";
import { getMovies } from "../../API";

export class Home extends BaseContentRoute {
  constructor() {
    super();

    this.state = {
      movies: [],
      isLoading: true,
    };
  }

  componentDidMount() {
    (async () => {
      const movies = await getMovies(30, 30);

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
