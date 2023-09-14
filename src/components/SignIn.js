import React from "react";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import { auth } from "../config/Config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import animeL from "../assets/logo.png";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ------validation--------------------
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // ------------------------------------------

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    // -----validation--------------
    setError(null);
    setLoading(true);

    if (!email || !password) {
      setError("Both email and password are required");
      setLoading(false);
      return;
    }
    //------------------------------
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      alert("User Successfully Log In");
      const id = user.user.uid;
      navigate(`/home/${id}`);
    } catch (error) {
      console.log(error.message);
      //alert(`wrong user credentials : ${error.message}`);
      setError(`Wrong user credentials: ${error.message}`);
      setLoading(false);
    }
  };

  const handleBlur = () => {
    setError(null); // Clear error when input loses focus
  };
  return (
    <div>
      {/* ---------------navbar------------- */}
      <Navbar className="bg-dark">
        <Container>
          <Link to="/">
            <Navbar.Brand>
              <img src={animeL} alt="anime-logo" width={180} />
            </Navbar.Brand>
          </Link>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>Sample</Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* ---------------------------------- */}

      <div className="signIn container w-50 mt-4">
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">
              <Badge bg="success">Log In</Badge>
            </h2>
            <Form>
              <Form.Group className="mb-3" controlId="formGroupEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  required
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  onBlur={handleBlur}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formGroupPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  required
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  onBlur={handleBlur}
                />
              </Form.Group>
              {error && <p className="error">{error}</p>}
              <Button
                variant="primary"
                type="submit"
                className="w-25"
                onClick={handleLogin}
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>
              <Form.Label className="ms-5">
                Don't have an user Account?{" "}
                <Link to={"/"}>
                  <span className="login-link ms-2">Register</span>
                </Link>
              </Form.Label>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
