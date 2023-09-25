import React, { useEffect } from "react";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { db } from "../config/Config";
import Image from "react-bootstrap/Image";
import { ref, onValue, update } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/Config";
import { storage } from "../config/Config";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

const NewEdit = (props) => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [newProfilePicture, setNewProfilePicture] = useState(null);

  const navigate = useNavigate();
  let { id } = props;
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [getUserData, setGetUserData] = useState([]);
  const [profilePictureUrl, setProfilePictureUrl] = useState("");

  console.log(getUserData);
  //Getting data -------------------------------------
  //------
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Set the new profile picture in state
      setNewProfilePicture(file);
    }
  };
  const profilePicturePath = getUserData?.ProfilePicturePath;
  //-----
  useEffect(() => {
    try {
      let userDetails = ref(db, "RegUser/" + id);
      onValue(userDetails, (snapshot) => {
        let data = snapshot.val();

        setGetUserData(data);
        setProfilePictureUrl(data?.ProfilePictureURL || "");
      });
    } catch (error) {
      console.log(error.message);
    }
  }, [id]);

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
    if (gender !== "") {
      userData.Gender = gender;
    }
    if (country !== "") {
      userData.Country = country;
    }
    if (profilePictureUrl !== "") {
      userData.ProfilePictureURL = profilePictureUrl;
    }
    if (profilePicturePath !== "") {
      userData.ProfilePicturePath = profilePicturePath;
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

      const currentProfilePictureUrl = getUserData.ProfilePictureURL;
      // =========================================

      // if (getUserData?.ProfilePicturePath) {
      //   const oldProfilePictureRef = storageRef(
      //     storage,
      //     getUserData.ProfilePicturePath
      //   );

      //   // Delete the old profile picture
      //   await deleteObject(oldProfilePictureRef);
      // }
      //==========================================
      if (newProfilePicture) {
        // Upload the new profile picture to Firebase Storage
        const profilePictureRef = storageRef(storage, `profilePictures/${id}`);
        await uploadBytes(profilePictureRef, newProfilePicture);

        // Get the download URL of the uploaded profile picture
        const downloadUrl = await getDownloadURL(profilePictureRef);

        // Update the ProfilePictureURL in the Realtime Database
        userData.ProfilePictureURL = downloadUrl;
        setProfilePictureUrl(downloadUrl);
        setNewProfilePicture(null);
      } else {
        userData.ProfilePictureURL = currentProfilePictureUrl;
      }
      //==========================================
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
        // =========================================
        // Use the correct path field
        const profilePictureRef = storageRef(
          storage,
          `profilePictures/${profilePicturePath}`
        );
        await deleteObject(profilePictureRef);
        //==================================
        const user = auth.currentUser;
        await user.delete();

        await update(ref(db, "RegUser/" + id), {
          Username: null,
          Email: null,
          Age: null,
          Country: null,
          Gender: null,
          Agreed: null,
          ProfilePictureURL: null,
          ProfilePicturePath: null,
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
      {/* <Button variant="outline-warning" onClick={handleShow} className="ms-3">
        My Profile
      </Button> */}
      <Image
        className="ms-5 shadow bg-white"
        onClick={handleShow}
        src={getUserData.ProfilePictureURL}
        roundedCircle
        width={70}
        height={70}
        style={{
          cursor: "pointer",
        }}
      />

      <Offcanvas show={show} onHide={handleClose} placement={"end"}>
        <Offcanvas.Header
          closeButton
          className="bg-dark text-warning text-center"
        >
          <Offcanvas.Title>Edit Profile. . . . .</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="bg-dark">
          {/* ----------------------------- */}
          <div className="text-center">
            <img
              src={getUserData.ProfilePictureURL}
              alt="dp"
              className="mb-3 dp"
              width={100}
              height={100}
            />
          </div>
          {/* ----------------------------- */}
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
            {/* ------------------------------------- */}
            <Row>
              <Form.Label column="sm" lg={4} className="text-light">
                Gender :
              </Form.Label>
              <Col>
                <Form.Control
                  size="md"
                  className="w-55 mb-3"
                  type="text"
                  placeholder="Gender"
                  defaultValue={getUserData.Gender || ""}
                  onChange={(e) => {
                    setGender(e.target.value);
                  }}
                />
              </Col>
            </Row>
            <Row>
              <Form.Label column="sm" lg={4} className="text-light">
                Country :
              </Form.Label>
              <Col>
                <Form.Control
                  size="md"
                  className="w-55 mb-3"
                  type="text"
                  placeholder="Country"
                  defaultValue={getUserData.Country || ""}
                  onChange={(e) => {
                    setCountry(e.target.value);
                  }}
                />
              </Col>
            </Row>
            <Row>
              <Form.Label column="sm" lg={4} className="text-light">
                Profile Picture:
              </Form.Label>
              <Col>
                <Form.Group controlId="profilePicture">
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleProfilePictureChange(e)}
                  />
                </Form.Group>
              </Col>
            </Row>
            {/* ------------------------------------- */}

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
