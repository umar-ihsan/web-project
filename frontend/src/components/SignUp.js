import React, { useState } from "react";
import logo from "../img/logo.png";
import "./SignUp.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

export default function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);  // Loading state to disable submit button

  // Toast functions
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

  const postData = () => {
    // Client-side validation
    if (!email || !name || !userName || !password) {
      notifyA("All fields are required.");
      return;
    }
    if (!emailRegex.test(email)) {
      notifyA("Invalid email address.");
      return;
    }
    if (!passRegex.test(password)) {
      notifyA("Password must be at least 8 characters long and include a mix of uppercase, lowercase, numbers, and special characters.");
      return;
    }

    setLoading(true); // Set loading to true when the request starts

    // Sending data to the server
    fetch("http://localhost:5000/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        userName,
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);  // Set loading to false after request is complete
        if (data.error) {
          notifyA(data.error);
        } else {
          notifyB(data.message);
          navigate("/signin");
        }
      })
      .catch((err) => {
        setLoading(false);  // Set loading to false if an error occurs
        notifyA("Something went wrong. Please try again.");
        console.error(err);
      });
  };

  return (
    <div className="signUp">
      <div className="form-container">
        <div className="form">
          <img className="signUpLogo" src={logo} alt="Logo" />
          <p className="loginPara">
            Sign up to see photos and videos <br /> from your friends
          </p>
          <div>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              name="name"
              id="name"
              value={name}
              placeholder="Full Name"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              name="username"
              id="username"
              value={userName}
              placeholder="Username"
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <p className="loginPara" style={{ fontSize: "12px", margin: "3px 0px" }}>
            By signing up, you agree to our Terms, <br /> privacy policy and cookies policy.
          </p>
          <input
            type="submit"
            id="submit-btn"
            value={loading ? "Signing Up..." : "Sign Up"}
            onClick={postData}
            disabled={loading} // Disable submit button during loading
          />
        </div>
        <div className="form2">
          Already have an account?{" "}
          <Link to="/signin">
            <span style={{ color: "blue", cursor: "pointer" }}>Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
