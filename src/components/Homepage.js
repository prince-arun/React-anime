import React, { useState } from "react";
import { AnimeContext } from "../context/context";
import Popular from "./Popular";
import Upcoming from "./Upcoming";
import Airing from "./Airing";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import animeL from "../assets/logo.png";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import NewEdit from "./NewEdit";

const Homepage = () => {
  const {
    handleSubmit,
    search,
    handleChange,
    getUpcomingAnime,
    getAiringAnime,
  } = AnimeContext();

  const [getPopular, setRendered] = useState("popular");

  const switchComponent = () => {
    switch (getPopular) {
      case "popular":
        return <Popular getPopular={getPopular} />;
      case "airing":
        return <Airing getPopular={getPopular} />;
      case "upcoming":
        return <Upcoming getPopular={getPopular} />;
      default:
        return <Popular getPopular={getPopular} />;
    }
  };
  const { id } = useParams();
  return (
    <div className="homepage">
      {/* ------------------------------------Nav Bar------------------------------------ */}
      <Navbar className="bg-dark">
        <Container>
          <Navbar.Brand href="#home">
            <img src={animeL} alt="anime-logo" width={180} />
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Link to={"/signin/:id"}>
              <Button variant="outline-secondary" className="ps-10px">
                Sign Out
              </Button>{" "}
            </Link>
            <NewEdit id={id} />
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <header>
        <div className="logo">
          <h1>
            {getPopular === "popular"
              ? "Popular Anime"
              : getPopular === "airing"
              ? "Airing Anime"
              : "Upcoming Anime"}
          </h1>
        </div>
        <div className="search-container">
          <div className="filter-btn popular-filter">
            <button
              onClick={() => {
                setRendered("popular");
              }}
            >
              Popular<i className="fas fa-fire"></i>
            </button>
          </div>
          <form action="" className="search-form" onSubmit={handleSubmit}>
            <div className="input-control">
              <input
                type="text"
                placeholder="Search Anime"
                value={search}
                onChange={handleChange}
              />
              <button type="submit">Search</button>
            </div>
          </form>
          <div className="filter-btn airing-filter">
            <button
              onClick={() => {
                setRendered("airing");
                getAiringAnime();
              }}
            >
              Airing
            </button>
          </div>
          <div className="filter-btn upcoming-filter">
            <button
              onClick={() => {
                setRendered("upcoming");
                getUpcomingAnime();
              }}
            >
              Upcoming
            </button>
          </div>
        </div>
      </header>
      {switchComponent()}
    </div>
  );
};

export default Homepage;
