import React, { useEffect } from "react";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Badge from "react-bootstrap/Badge";
import { db } from "../config/Config";
import { ref, onValue, update, remove } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/Config";
import {
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
  onAuthStateChanged,
} from "firebase/auth";

const NewEdit = (props) => {
  const [userName, setUserName] = useState("");

  const [email, setEmail] = useState("");

  const [age, setAge] = useState("");

  const navigate = useNavigate();
  let { id } = props;
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [getUserData, setGetUserData] = useState([]);

  console.log(getUserData);
  //Getting data -------------------------------------

  useEffect(() => {
    try {
      let userDetails = ref(db, "RegUser/" + id);
      onValue(userDetails, (snapshot) => {
        let data = snapshot.val();

        setGetUserData(data);
      });
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();

    const userData = {};

    if (userName !== "") {
      userData.Username = userName;
    }

    if (email !== "") {
      userData.Email = email;
    }

    if (age !== "") {
      userData.Age = age;
    }

    const currentPassword = prompt("Please enter your current password:");

    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );

    try {
      await reauthenticateWithCredential(user, credential);
      updateEmail(auth.currentUser, userData.Email)
        .then(() => {
          console.log("email updated");
        })
        .catch((error) => {
          console.log(error);
        });

      if (Object.keys(userData).length > 0) {
        await update(ref(db, "RegUser/" + id), userData);
        alert("Details updated successfully");
      } else {
        alert("No changes were made");
      }
    } catch (error) {
      console.log(error);
      alert("An error occurred while updating the details");
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account?"
    );

    if (confirmDelete) {
      try {
        const user = auth.currentUser;
        await user.delete();

        await update(ref(db, "RegUser/" + id), {
          Username: null,

          Email: null,

          Age: null,
        });

        alert("Account deleted successfully");
        navigate("/");
      } catch (error) {
        console.log(error.message);
        alert("An error occurred while deleting the account");
      }
    }
  };
  if (!getUserData) {
    navigate("/");
    return null;
  }
  return (
    <div className="editProfile">
      <Button variant="outline-warning" onClick={handleShow} className="ms-3">
        My Profile
      </Button>

      <Offcanvas show={show} onHide={handleClose} placement={"end"}>
        <Offcanvas.Header
          closeButton
          className="bg-dark text-warning text-center"
        >
          <Offcanvas.Title>Edit Profile. . . . .</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="bg-dark">
          <Form>
            <Row>
              <Form.Label column="sm" lg={4} className="text-light">
                Username :
              </Form.Label>
              <Col>
                <Form.Control
                  size="md"
                  className="w-55 mb-3"
                  type="text"
                  placeholder="Username"
                  defaultValue={getUserData.Username || ""}
                  onChange={(e) => {
                    setUserName(e.target.value);
                  }}
                />
              </Col>
            </Row>

            <Row>
              <Form.Label column="sm" lg={4} className="text-light">
                Email :
              </Form.Label>
              <Col>
                <Form.Control
                  size="md"
                  className="w-55 mb-3"
                  type="email"
                  placeholder="Email"
                  defaultValue={getUserData.Email || ""}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </Col>
            </Row>

            <Row>
              <Form.Label column="sm" lg={4} className="text-light">
                Age :
              </Form.Label>
              <Col>
                <Form.Control
                  size="md"
                  className="w-55 mb-3"
                  type="number"
                  placeholder="Age"
                  defaultValue={getUserData.Age || ""}
                  onChange={(e) => {
                    setAge(e.target.value);
                  }}
                />
              </Col>
            </Row>

            <Button variant="success" type="submit" onClick={handleSave}>
              Save
            </Button>
            <Button
              variant="danger"
              type="submit"
              className="ms-3"
              onClick={handleDelete}
            >
              Delete Account
            </Button>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default NewEdit;
