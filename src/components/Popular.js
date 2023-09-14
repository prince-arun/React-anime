import React from "react";
import { Link } from "react-router-dom";
import { AnimeContext } from "../context/context";
import Sidebar from "./Sidebar";

const Popular = ({ getPopular }) => {
  const { popularAnime, isSearch, searchResults } = AnimeContext();

  const displayPopular = () => {
    if (!isSearch && getPopular === "popular") {
      return popularAnime?.map((anime) => {
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
    <div className="pop">
      <div className="popular-anime">{displayPopular()}</div>
      <Sidebar />
    </div>
  );
};

export default Popular;
