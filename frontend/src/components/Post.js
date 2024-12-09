import React, { useState } from 'react';
import { useApi } from '../hooks/useApi';
import './Post.css';

const Post = ({ post }) => {
  const [likes, setLikes] = useState(post.likes);
  const [comment, setComment] = useState('');
  const { fetchData } = useApi();

  const handleLike = async () => {
    try {
      await fetchData(`/posts/${post.id}/like`, { method: 'POST' });
      setLikes(likes + 1);
    } catch (err) {
      console.error('Failed to like post:', err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      await fetchData(`/posts/${post.id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment }),
      });
      setComment('');
      // Optionally, you could fetch updated comments here
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  return (
    <div className="post">
      <img src={post.image} alt="Post" className="post-image" />
      <p className="post-caption">{post.caption}</p>
      <div className="post-actions">
        <button onClick={handleLike}>Like ({likes})</button>
        <span>Comments: {post.comments}</span>
      </div>
      <form onSubmit={handleComment} className="comment-form">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <button type="submit">Post</button>
      </form>
    </div>
  );
};

export default Post;

