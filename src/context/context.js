import React, {
  createContext,
  useContext,
  useReducer,
  useState,
  useEffect,
} from "react";
import { reducer } from "./reducer";

const context = createContext();

const fUrl = "https://api.jikan.moe/v4";

const LOADING = "LOADING";
const SEARCH = "SEARCH";
const GET_POPULAR_ANIME = "GET_POPULAR_ANIME";
const GET_UPCOMING_ANIME = "GET_UPCOMING_ANIME";
const GET_AIRING_ANIME = "GET_AIRING_ANIME";
const GET_PICTURES = "GET_PICTURES";

export const ContextApi = ({ children }) => {
  const defaultState = {
    popularAnime: [],
    upcomingAnime: [],
    airingAnime: [],
    pictures: [],
    isSearch: false,
    searchResults: [],
    loading: false,
  };

  const [state, dispatch] = useReducer(reducer, defaultState);
  const [search, setSearch] = useState("");

  const handleChange = (e) => {
    setSearch(e.target.value);
    if (e.target.value === "") {
      state.isSearch = false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search) {
      searchAnime(search);
      state.isSearch = true;
    } else {
      state.isSearch = false;
      alert("Please enter a search term");
    }
  };

  const getPopularAnime = async () => {
    dispatch({ type: LOADING });
    const response = await fetch(`${fUrl}/top/anime?filter=bypopularity`);
    const obj = await response.json();
    dispatch({ type: GET_POPULAR_ANIME, payload: obj.data });
  };

  const getUpcomingAnime = async () => {
    dispatch({ type: LOADING });
    const response = await fetch(`${fUrl}/top/anime?filter=upcoming`);
    const obj = await response.json();
    dispatch({ type: GET_UPCOMING_ANIME, payload: obj.data });
  };

  const getAiringAnime = async () => {
    dispatch({ type: LOADING });
    const response = await fetch(`${fUrl}/top/anime?filter=airing`);
    const obj = await response.json();
    dispatch({ type: GET_AIRING_ANIME, payload: obj.data });
  };

  const searchAnime = async (anime) => {
    dispatch({ type: LOADING });
    const response = await fetch(
      `https://api.jikan.moe/v4/anime?q=${anime}&order_by=popularity&sort=asc&sfw`
    );
    const obj = await response.json();
    dispatch({ type: SEARCH, payload: obj.data });
  };

  const getAnimePictures = async (id) => {
    dispatch({ type: LOADING });
    const response = await fetch(
      `https://api.jikan.moe/v4/characters/${id}/pictures`
    );
    const obj = await response.json();
    dispatch({ type: GET_PICTURES, payload: obj.data });
  };

  useEffect(() => {
    getPopularAnime();
  }, []);

  return (
    <context.Provider
      value={{
        ...state,
        handleChange,
        handleSubmit,
        searchAnime,
        search,
        getPopularAnime,
        getUpcomingAnime,
        getAiringAnime,
        getAnimePictures,
      }}
    >
      {children}
    </context.Provider>
  );
};

export const AnimeContext = () => {
  return useContext(context);
};
