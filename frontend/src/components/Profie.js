import React, { useEffect, useState } from "react";
import PostDetail from "./PostDetail";
import "./Profile.css";
import ProfilePic from "./ProfilePic";

export default function Profile() {
  const defaultPicLink = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png";
  const [pic, setPic] = useState([]);
  const [show, setShow] = useState(false);
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState("");
  const [changePic, setChangePic] = useState(false);

  const toggleDetails = (posts) => {
    setShow(!show);
    setPosts(posts);
  };

  const changeProfile = () => {
    setChangePic(!changePic);
  };

  useEffect(() => {
    fetch(`http://localhost:5000/user/${JSON.parse(localStorage.getItem("user"))._id}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setPic(result.post);
        setUser(result.user);
      });
  }, []);

  return (
    <div className="profile">
      {/* Profile frame */}
      <div className="profile-frame">
        {/* Profile Picture */}
        <div className="profile-pic">
          <img
            onClick={changeProfile}
            src={user.Photo ? user.Photo : defaultPicLink}
            alt="Profile"
          />
        </div>

        {/* Profile Data */}
        <div className="profile-data">
          <h1>{JSON.parse(localStorage.getItem("user")).name}</h1>
          <div className="profile-info">
            <p>
              <span>{pic ? pic.length : "0"}</span> posts
            </p>
            <p>
              <span>{user.followers ? user.followers.length : "0"}</span> followers
            </p>
            <p>
              <span>{user.following ? user.following.length : "0"}</span> following
            </p>
          </div>
        </div>
      </div>

      <hr
        style={{
          width: "90%",
          opacity: "0.8",
          margin: "25px auto",
        }}
      />

      {/* Gallery */}
      <div className="gallery">
        {pic.map((pics) => (
          <img
            key={pics._id}
            src={pics.photo}
            onClick={() => toggleDetails(pics)}
            className="item"
            alt="Post"
          />
        ))}
      </div>

      {/* Show Post Detail */}
      {show && <PostDetail item={posts} toggleDetails={toggleDetails} />}

      {/* Change Profile Picture Modal */}
      {changePic && <ProfilePic changeProfile={changeProfile} />}
    </div>
  );
}
