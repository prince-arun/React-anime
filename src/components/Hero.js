import React from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import animeL from "../assets/logo.png";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Carousel from "react-bootstrap/Carousel";
import anime_cover from "../assets/anime cover.jpg";
import anime_cover_1 from "../assets/anime_cover_1.jpg";
import anime_cover_2 from "../assets/anime_cover_2.jpg";
import anime_cover_3 from "../assets/anime_cover_3.jpg";
import { auth } from "../config/Config";
import { db } from "../config/Config";
import { storage } from "../config/Config";
import { ref as refi, uploadBytes, getDownloadURL } from "firebase/storage";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Hero = () => {
  // ---------------------------Model States--------------------
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);
  //------------------------------------------------------------

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [country, setCountry] = useState("");
  const [gender, setGender] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureURL, setProfilePictureURL] = useState("");
  const [imId, setImId] = useState("");
  //-----------------------------
  //******************************
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [ageError, setAgeError] = useState("");
  const [countryError, setCountryError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [agreedError, setAgreedError] = useState("");
  const [profilePictureError, setProfilePictureError] = useState("");

  const handleInputChange = () => {
    // setError(null); // Clear error when user starts typing
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setAgeError("");
    setCountryError("");
    setGenderError("");
    setAgreedError("");
    setProfilePictureError("");
  };
  //******************************

  // const [error, setError] = useState(null); // Add error state
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  console.log(profilePictureURL);
  let regUser = {
    Username: userName,
    Email: email,
    Age: age,
    Country: country,
    Gender: gender,
    Agreed: agreed,
  };
  //-----------------------------------------
  const handleProfilePictureChange = (e) => {
    const imageFile = e.target.files[0];
    setProfilePicture(imageFile);
  };
  //----------------------------------------

  const handleClose = async (e) => {
    e.preventDefault();
    setLoading(true);

    // ***************************************************************
    let isValid = true;
    if (userName.length < 3) {
      setNameError("Username must be at least 3 characters long");
      isValid = false;
      setLoading(false);
    }

    const isValidEmail = (email) => {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(email);
    };
    if (!isValidEmail(email)) {
      setEmailError("Invalid email format");
      isValid = false;
      setLoading(false);
    }
    const validatePassword = (password) => {
      const passwordError = [];

      if (password.length < 8) {
        passwordError.push("Password must be 8 characters long");
      }

      if (!/[A-Z]/.test(password)) {
        passwordError.push("Should contain one capital letter");
      }

      if (!/\d/.test(password)) {
        passwordError.push("Should contain at least one number");
      }

      if (!/[@$!%*?&]/.test(password)) {
        passwordError.push("should contain one special character");
      }

      return passwordError;
    };
    const passwordError = validatePassword(password);
    if (passwordError.length > 0) {
      setPasswordError(passwordError);
      isValid = false;
      setLoading(false);
    }

    if (age < 6 || age > 150) {
      setAgeError("Age should be between 6 and 150");
      isValid = false;
      setLoading(false);
    }

    if (!country) {
      setCountryError("Please select a country");
      isValid = false;
      setLoading(false);
    }
    if (!gender) {
      setGenderError("Please select a gender");
      isValid = false;
      setLoading(false);
    }

    if (!agreed) {
      setAgreedError("Please agree to the terms and conditions");
      isValid = false;
      setLoading(false);
    }

    if (!profilePicture) {
      setProfilePictureError("Please select a profile picture");
      isValid = false;
      setLoading(false);
    }

    // ***************************************************************
    if (isValid) {
      if (profilePicture) {
        try {
          const storageRef = refi(
            storage,
            `profilePictures/${imId}/${profilePicture.name}`
          );
          await uploadBytes(storageRef, profilePicture);

          // Get the download URL of the uploaded profile picture
          const downloadURL = await getDownloadURL(storageRef);
          console.log(downloadURL);

          // Set the download URL in your state and user data
          setProfilePictureURL(downloadURL);
          regUser.ProfilePictureURL = downloadURL; // Add this line to your user data
          //==============================
          const pathSegments = storageRef._location.path.split("/");
          const path = pathSegments.slice(1).join("/"); // Exclude the first empty element
          regUser.ProfilePicturePath = path;
          //==============================
        } catch (error) {
          console.error("Error uploading profile picture:", error);
          setLoading(false);
          return;
        }
      }
      //--------------------------------

      try {
        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        ).then((success) => {
          const id = success.user.uid;
          setImId(id);
          console.log(regUser);
          set(ref(db, "RegUser/" + id), regUser);
          alert("User Created Successfully  ");

          // setError(null); // Clear error after successful registration
          setLoading(false);

          //-------------------------
          setShow(false);
          navigate(`/signin/${id}`);
        });
        console.log(userCredentials);
      } catch (error) {
        // setError(error.message);
        setLoading(false);
        console.log(error);
      }
    }
  };

  return (
    <div className="hero">
      {/* ------------------------------------Nav Bar------------------------------------ */}
      <Navbar className="bg-dark">
        <Container>
          <Navbar.Brand href="#home">
            <img src={animeL} alt="anime-logo" width={180} />
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              <Link to={"/signin/:id"}>
                <Button variant="success" className="me-4">
                  Test Login
                </Button>{" "}
              </Link>

              <Button
                variant="primary"
                onClick={handleShow}
                className="px-4 py-2"
              >
                New Account ?
              </Button>
              <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Register...</Modal.Title>
                  <small className="ms-5 tUser">Test user Login Below</small>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group
                      className="mb-1"
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="user name"
                        autoFocus
                        onChange={(e) => {
                          setUserName(e.target.value);
                          handleInputChange();
                        }}
                      />
                      {nameError && <p className="error">{nameError}</p>}
                    </Form.Group>
                    <Form.Group
                      className="mb-1"
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Label>Age</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter Age"
                        // autoFocus
                        onChange={(e) => {
                          setAge(e.target.value);
                          handleInputChange();
                        }}
                      />
                      {ageError && <p className="error">{ageError}</p>}
                    </Form.Group>
                    <Form.Group
                      className="mb-1"
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Label>Email address</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="name@example.com"
                        // autoFocus
                        onChange={(e) => {
                          setEmail(e.target.value);
                          handleInputChange();
                        }}
                      />
                      {emailError && <p className="error">{emailError}</p>}
                    </Form.Group>
                    <Form.Group
                      className="mb-1"
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Enter password"
                        // autoFocus
                        onChange={(e) => {
                          setPassword(e.target.value);
                          handleInputChange();
                        }}
                      />
                      {passwordError.length > 0 && (
                        <div className="error">
                          <ul>
                            {passwordError.map((error, index) => (
                              <li key={index}>{error}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </Form.Group>

                    <Form.Group
                      className="mb-1"
                      controlId="exampleForm.ControlSelect1"
                    >
                      <Form.Label>Country</Form.Label>
                      <Form.Control
                        as="select"
                        onChange={(e) => {
                          setCountry(e.target.value);
                          handleInputChange();
                        }}
                      >
                        <option value="">Select country</option>
                        {/*========================================================== */}
                        <option value="Afghanistan">Afghanistan</option>
                        <option value="Albania">Albania</option>
                        <option value="Algeria">Algeria</option>
                        <option value="Andorra">Andorra</option>
                        <option value="Angola">Angola</option>
                        <option value="Antigua and Barbuda">
                          Antigua and Barbuda
                        </option>
                        <option value="Argentina">Argentina</option>
                        <option value="Armenia">Armenia</option>
                        <option value="Australia">Australia</option>
                        <option value="Austria">Austria</option>
                        <option value="Azerbaijan">Azerbaijan</option>
                        <option value="Bahamas">Bahamas</option>
                        <option value="Bahrain">Bahrain</option>
                        <option value="Bangladesh">Bangladesh</option>
                        <option value="Barbados">Barbados</option>
                        <option value="Belarus">Belarus</option>
                        <option value="Belgium">Belgium</option>
                        <option value="Belize">Belize</option>
                        <option value="Benin">Benin</option>
                        <option value="Bhutan">Bhutan</option>
                        <option value="Bolivia">Bolivia</option>
                        <option value="Bosnia and Herzegovina">
                          Bosnia and Herzegovina
                        </option>
                        <option value="Botswana">Botswana</option>
                        <option value="Brazil">Brazil</option>
                        <option value="Brunei">Brunei</option>
                        <option value="Bulgaria">Bulgaria</option>
                        <option value="Burkina Faso">Burkina Faso</option>
                        <option value="Burundi">Burundi</option>
                        <option value="Cabo Verde">Cabo Verde</option>
                        <option value="Cambodia">Cambodia</option>
                        <option value="Cameroon">Cameroon</option>
                        <option value="Canada">Canada</option>
                        <option value="Central African Republic">
                          Central African Republic
                        </option>
                        <option value="Chad">Chad</option>
                        <option value="Chile">Chile</option>
                        <option value="China">China</option>
                        <option value="Colombia">Colombia</option>
                        <option value="Comoros">Comoros</option>
                        <option value="Congo (Congo-Brazzaville)">
                          Congo (Congo-Brazzaville)
                        </option>
                        <option value="Costa Rica">Costa Rica</option>
                        <option value="Croatia">Croatia</option>
                        <option value="Cuba">Cuba</option>
                        <option value="Cyprus">Cyprus</option>
                        <option value="Czechia (Czech Republic)">
                          Czechia (Czech Republic)
                        </option>
                        <option value="Democratic Republic of the Congo">
                          Democratic Republic of the Congo
                        </option>
                        <option value="Denmark">Denmark</option>
                        <option value="Djibouti">Djibouti</option>
                        <option value="Dominica">Dominica</option>
                        <option value="Dominican Republic">
                          Dominican Republic
                        </option>
                        <option value="East Timor (Timor-Leste)">
                          East Timor (Timor-Leste)
                        </option>
                        <option value="Ecuador">Ecuador</option>
                        <option value="Egypt">Egypt</option>
                        <option value="El Salvador">El Salvador</option>
                        <option value="Equatorial Guinea">
                          Equatorial Guinea
                        </option>
                        <option value="Eritrea">Eritrea</option>
                        <option value="Estonia">Estonia</option>

                        <option value="Ethiopia">Ethiopia</option>
                        <option value="Fiji">Fiji</option>
                        <option value="Finland">Finland</option>
                        <option value="France">France</option>
                        <option value="Gabon">Gabon</option>
                        <option value="Gambia">Gambia</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Germany">Germany</option>
                        <option value="Ghana">Ghana</option>
                        <option value="Greece">Greece</option>
                        <option value="Grenada">Grenada</option>
                        <option value="Guatemala">Guatemala</option>
                        <option value="Guinea">Guinea</option>
                        <option value="Guinea-Bissau">Guinea-Bissau</option>
                        <option value="Guyana">Guyana</option>
                        <option value="Haiti">Haiti</option>
                        <option value="Holy See">Holy See</option>
                        <option value="Honduras">Honduras</option>
                        <option value="Hungary">Hungary</option>
                        <option value="Iceland">Iceland</option>
                        <option value="India">India</option>
                        <option value="Indonesia">Indonesia</option>
                        <option value="Iran">Iran</option>
                        <option value="Iraq">Iraq</option>
                        <option value="Ireland">Ireland</option>
                        <option value="Israel">Israel</option>
                        <option value="Italy">Italy</option>
                        <option value="Ivory Coast">Ivory Coast</option>
                        <option value="Jamaica">Jamaica</option>
                        <option value="Japan">Japan</option>
                        <option value="Jordan">Jordan</option>
                        <option value="Kazakhstan">Kazakhstan</option>
                        <option value="Kenya">Kenya</option>
                        <option value="Kiribati">Kiribati</option>
                        <option value="Kosovo">Kosovo</option>
                        <option value="Kuwait">Kuwait</option>
                        <option value="Kyrgyzstan">Kyrgyzstan</option>
                        <option value="Laos">Laos</option>
                        <option value="Latvia">Latvia</option>
                        <option value="Lebanon">Lebanon</option>
                        <option value="Lesotho">Lesotho</option>
                        <option value="Liberia">Liberia</option>
                        <option value="Libya">Libya</option>
                        <option value="Liechtenstein">Liechtenstein</option>
                        <option value="Lithuania">Lithuania</option>
                        <option value="Luxembourg">Luxembourg</option>
                        <option value="Madagascar">Madagascar</option>
                        <option value="Malawi">Malawi</option>
                        <option value="Malaysia">Malaysia</option>
                        <option value="Maldives">Maldives</option>
                        <option value="Mali">Mali</option>
                        <option value="Malta">Malta</option>
                        <option value="Marshall Islands">
                          Marshall Islands
                        </option>
                        <option value="Mauritania">Mauritania</option>
                        <option value="Mauritius">Mauritius</option>
                        <option value="Mexico">Mexico</option>
                        <option value="Micronesia">Micronesia</option>
                        <option value="Moldova">Moldova</option>
                        <option value="Monaco">Monaco</option>
                        <option value="Mongolia">Mongolia</option>
                        <option value="Montenegro">Montenegro</option>
                        <option value="Morocco">Morocco</option>
                        <option value="Mozambique">Mozambique</option>
                        <option value="Myanmar (formerly Burma)">
                          Myanmar (formerly Burma)
                        </option>
                        <option value="Namibia">Namibia</option>
                        <option value="Nauru">Nauru</option>
                        <option value="Nepal">Nepal</option>
                        <option value="Netherlands">Netherlands</option>
                        <option value="New Zealand">New Zealand</option>
                        <option value="Nicaragua">Nicaragua</option>
                        <option value="Niger">Niger</option>
                        <option value="Nigeria">Nigeria</option>
                        <option value="North Korea">North Korea</option>
                        <option value="North Macedonia (formerly Macedonia)">
                          North Macedonia (formerly Macedonia)
                        </option>
                        <option value="Norway">Norway</option>
                        <option value="Oman">Oman</option>
                        <option value="Pakistan">Pakistan</option>
                        <option value="Palau">Palau</option>
                        <option value="Palestine State">Palestine State</option>
                        <option value="Panama">Panama</option>
                        <option value="Papua New Guinea">
                          Papua New Guinea
                        </option>
                        <option value="Paraguay">Paraguay</option>
                        <option value="Peru">Peru</option>
                        <option value="Philippines">Philippines</option>
                        <option value="Poland">Poland</option>
                        <option value="Portugal">Portugal</option>
                        <option value="Qatar">Qatar</option>
                        <option value="Romania">Romania</option>
                        <option value="Russia">Russia</option>
                        <option value="Rwanda">Rwanda</option>
                        <option value="Saint Kitts and Nevis">
                          Saint Kitts and Nevis
                        </option>
                        <option value="Saint Lucia">Saint Lucia</option>
                        <option value="Saint Vincent and the Grenadines">
                          Saint Vincent and the Grenadines
                        </option>
                        <option value="Samoa">Samoa</option>
                        <option value="San Marino">San Marino</option>
                        <option value="Sao Tome and Principe">
                          Sao Tome and Principe
                        </option>
                        <option value="Saudi Arabia">Saudi Arabia</option>
                        <option value="Senegal">Senegal</option>
                        <option value="Serbia">Serbia</option>
                        <option value="Seychelles">Seychelles</option>
                        <option value="Sierra Leone">Sierra Leone</option>
                        <option value="Singapore">Singapore</option>
                        <option value="Slovakia">Slovakia</option>
                        <option value="Slovenia">Slovenia</option>
                        <option value="Solomon Islands">Solomon Islands</option>
                        <option value="Somalia">Somalia</option>
                        <option value="South Africa">South Africa</option>
                        <option value="South Korea">South Korea</option>
                        <option value="South Sudan">South Sudan</option>
                        <option value="Spain">Spain</option>
                        <option value="Sri Lanka">Sri Lanka</option>
                        <option value="Sudan">Sudan</option>
                        <option value="Suriname">Suriname</option>
                        <option value="Sweden">Sweden</option>
                        <option value="Switzerland">Switzerland</option>
                        <option value="Syria">Syria</option>
                        <option value="Tajikistan">Tajikistan</option>
                        <option value="Tanzania">Tanzania</option>
                        <option value="Thailand">Thailand</option>
                        <option value="Timor-Leste">Timor-Leste</option>
                        <option value="Togo">Togo</option>
                        <option value="Tonga">Tonga</option>
                        <option value="Trinidad and Tobago">
                          Trinidad and Tobago
                        </option>
                        <option value="Tunisia">Tunisia</option>
                        <option value="Turkey">Turkey</option>
                        <option value="Turkmenistan">Turkmenistan</option>
                        <option value="Tuvalu">Tuvalu</option>
                        <option value="Uganda">Uganda</option>
                        <option value="Ukraine">Ukraine</option>
                        <option value="United Arab Emirates">
                          United Arab Emirates
                        </option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="United States of America">
                          United States of America
                        </option>
                        <option value="Uruguay">Uruguay</option>
                        <option value="Uzbekistan">Uzbekistan</option>
                        <option value="Vanuatu">Vanuatu</option>
                        <option value="Venezuela">Venezuela</option>
                        <option value="Vietnam">Vietnam</option>
                        <option value="Yemen">Yemen</option>
                        <option value="Zambia">Zambia</option>
                        <option value="Zimbabwe">Zimbabwe</option>
                        {/*========================================================== */}
                      </Form.Control>
                      {countryError && <p className="error">{countryError}</p>}
                    </Form.Group>
                    <Form.Group
                      className="mb-1"
                      controlId="exampleForm.ControlSelect2"
                    >
                      <Form.Label>Gender</Form.Label>
                      <div className="d-flex gap-5">
                        <Form.Check
                          type="radio"
                          label="Male"
                          name="gender"
                          value="Male"
                          onChange={(e) => {
                            setGender(e.target.value);
                            handleInputChange();
                          }}
                        />
                        <Form.Check
                          type="radio"
                          label="Female"
                          name="gender"
                          value="Female"
                          onChange={(e) => {
                            setGender(e.target.value);
                            handleInputChange();
                          }}
                        />
                        <Form.Check
                          type="radio"
                          label="Prefer not to say"
                          name="gender"
                          value="Prefer not to say"
                          onChange={(e) => {
                            setGender(e.target.value);
                            handleInputChange();
                          }}
                        />
                      </div>
                      {genderError && <p className="error">{genderError}</p>}
                    </Form.Group>
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlCheckbox1"
                    >
                      <Form.Check
                        type="checkbox"
                        label="I agree to the terms and conditions"
                        onChange={(e) => {
                          setAgreed(e.target.checked);
                          handleInputChange();
                        }}
                      />
                      {agreedError && <p className="error">{agreedError}</p>}
                    </Form.Group>
                    <Form.Group controlId="profilePicture">
                      <Form.Label>Profile Picture</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                      />
                      {profilePictureError && (
                        <p className="error">{profilePictureError}</p>
                      )}
                    </Form.Group>

                    <Button
                      variant="primary"
                      type="submit"
                      onClick={handleClose}
                      className="px-4"
                    >
                      {loading ? "Signing Up..." : "Register"}
                    </Button>
                    <Form.Label className="ms-3">
                      Already have a user Account?{" "}
                      <Link to={"/signin/:id"}>
                        <span className="login-link ms-2">Log In</span>
                      </Link>
                    </Form.Label>
                  </Form>
                </Modal.Body>
              </Modal>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* ---------------------------Carousal------------------------------------------- */}
      <Carousel fade>
        <Carousel.Item>
          <img className="d-block w-100" src={anime_cover} alt="First slide" />
          {/* <Carousel.Caption>
            <h3>First slide label</h3>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption> */}
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={anime_cover_1}
            alt="Second slide"
          />

          {/* <Carousel.Caption>
            <h3>Second slide label</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </Carousel.Caption> */}
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={anime_cover_2}
            alt="Third slide"
          />

          {/* <Carousel.Caption>
            <h3>Third slide label</h3>
            <p>
              Praesent commodo cursus magna, vel scelerisque nisl consectetur.
            </p>
          </Carousel.Caption> */}
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={anime_cover_3}
            alt="Fourth slide"
          />

          {/* <Carousel.Caption>
            <h3>fourth slide label</h3>
            <p>
              Praesent commodo cursus magna, vel scelerisque nisl consectetur.
            </p>
          </Carousel.Caption> */}
        </Carousel.Item>
      </Carousel>
    </div>
  );
};

export default Hero;
