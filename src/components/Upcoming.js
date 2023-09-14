import React from "react";
import { Link } from "react-router-dom";
import { AnimeContext } from "../context/context";
import Sidebar from "./Sidebar";

const Upcoming = ({ getPopular }) => {
  const { upcomingAnime, isSearch, searchResults } = AnimeContext();

  const displayUp = () => {
    if (!isSearch && getPopular === "upcoming") {
      return upcomingAnime?.map((anime) => {
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
    <div className="upcoming">
      <div className="upcoming-anime">{displayUp()}</div>
      <Sidebar />
    </div>
  );
};

export default Upcoming;
