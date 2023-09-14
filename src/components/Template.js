import React from "react";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { AnimeContext } from "../context/context";
import animeL from "../assets/logo.png";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import NewEdit from "./NewEdit";
import Button from "react-bootstrap/Button";

const Template = () => {
  const { getAnimePictures, pictures } = AnimeContext();
  const { id } = useParams();

  const [index, setIndex] = useState(0);

  const handleImageClick = (i) => {
    setIndex(i);
  };

  useEffect(() => {
    getAnimePictures(id);
  }, [getAnimePictures, id]);
  return (
    <div className="gallery">
      {/* ---------------------Navbar----------------- */}
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
      {/* ----------------------------------------------- */}
      <div className="back">
        <Link to="/home">
          <i className="fas fa-arrow-left"></i>
          Back to Home
        </Link>
      </div>
      <div className="big-image">
        <img src={pictures[index]?.jpg.image_url} alt="" />
      </div>
      <div className="small-images">
        {pictures?.map((picture, i) => {
          return (
            <div
              className="image-con"
              onClick={() => {
                handleImageClick(i);
              }}
              key={i}
            >
              <img
                src={picture?.jpg.image_url}
                style={{
                  border:
                    i === index ? "3px solid #27AE60" : "3px solid #e5e7eb",
                  filter: i === index ? "grayscale(0)" : "grayscale(60%)",
                  transform: i === index ? "scale(1.1)" : "scale(1)",
                  transition: "all .3s ease-in-out",
                }}
                alt=""
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Template;
