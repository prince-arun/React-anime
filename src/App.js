import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Homepage from "./components/Homepage";
import SingleItem from "./components/SingleItem";
import Template from "./components/Template";
import Hero from "./components/Hero";
import SignIn from "./components/SignIn";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" Component={Hero} />
          <Route exact path="/signin/:id" Component={SignIn} />
          <Route exact path="/home/:id" Component={Homepage} />
          <Route exact path="/anime/:id" Component={SingleItem} />
          <Route exact path="/character/:id" Component={Template} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
