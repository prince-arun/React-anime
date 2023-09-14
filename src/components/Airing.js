import React from "react";
import { Link } from "react-router-dom";
import { AnimeContext } from "../context/context";
import Sidebar from "./Sidebar";

const Airing = ({ getPopular }) => {
  const { airingAnime, isSearch, searchResults } = AnimeContext();

  const showAiring = () => {
    if (!isSearch && getPopular === "airing") {
      return airingAnime?.map((anime) => {
        return (
          <Link to={`/anime/${anime.mal_id}`} key={anime.mal_id}>
            <img src={anime.images.jpg.large_image_url} alt="" />
          </Link>
        );
      });
    } else {
      return searchResults?.map((anime) => {
        return (
          <Link to={`/anime/${anime.mal_id}`} key={anime.mal_id}>
            <img src={anime.images.jpg.large_image_url} alt="" />
          </Link>
        );
      });
    }
  };
  return (
    <div className="airing">
      <div className="airing-anime">{showAiring()}</div>
      <Sidebar />
    </div>
  );
};

export default Airing;
