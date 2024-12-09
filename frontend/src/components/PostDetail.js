import React from "react";
import "./PostDetail.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function PostDetail({ item, toggleDetails }) {
  const navigate = useNavigate();

  // Toast functions
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  const removePost = (postId) => {
    if (window.confirm("Do you really want to delete this post ?")) {
      fetch(`http://localhost:5000/deletePost/${postId}`, {
        method: "delete",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
          toggleDetails();
          navigate("/");
          notifyB(result.message);
        });
    }
  };

  return (
    <div className="showComment">
      <div className="container">
        <div className="postPic">
          <img src={item.photo} alt="Post" />
        </div>
        <div className="details">
          {/* Header */}
          <div className="card-header">
            <div className="card-pic">
              <img
                src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
                alt="User"
              />
            </div>
            <h5>{item.postedBy.name}</h5>
            <div className="deletePost" onClick={() => removePost(item._id)}>
              <span className="material-symbols-outlined">delete</span>
            </div>
          </div>

          {/* Comments Section */}
          <div className="comment-section">
            {item.comments.map((comment) => (
              <p key={comment._id} className="comm">
                <span className="commenter">{comment.postedBy.name}</span>
                <span className="commentText">{comment.comment}</span>
              </p>
            ))}
          </div>

          {/* Card Content */}
          <div className="card-content">
            <p>{item.likes.length} Likes</p>
            <p>{item.body}</p>
          </div>

          {/* Add Comment */}
          <div className="add-comment">
            <span className="material-symbols-outlined">mood</span>
            <input type="text" placeholder="Add a comment" />
            <button className="comment">Post</button>
          </div>
        </div>
      </div>

      {/* Close Button */}
      <div className="close-comment" onClick={toggleDetails}>
        <span className="material-symbols-outlined">close</span>
      </div>
    </div>
  );
}
