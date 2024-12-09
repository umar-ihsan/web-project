import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import Post from './Post';
import './Feed.css';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const { fetchData, error, isLoading } = useApi();

  useEffect(() => {
    fetchData('/posts').then(setPosts);
  }, [fetchData]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="feed-container">
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Feed;

