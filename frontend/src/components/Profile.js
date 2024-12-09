import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import './Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { fetchData, error, isLoading } = useApi();

  useEffect(() => {
    fetchData('/user/profile').then(setProfile);
  }, [fetchData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profile) return;

    try {
      const updatedProfile = await fetchData('/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      setProfile(updatedProfile);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!profile) return null;

  return (
    <div className="profile-container">
      <img src={profile.profilePicture} alt="Profile" className="profile-picture" />
      <h2>{profile.username}</h2>
      <p>{profile.bio}</p>
      <div className="profile-stats">
        <span>Followers: {profile.followers}</span>
        <span>Following: {profile.following}</span>
      </div>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={profile.username}
            onChange={(e) => setProfile({ ...profile, username: e.target.value })}
          />
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      ) : (
        <button onClick={() => setIsEditing(true)}>Edit Profile</button>
      )}
    </div>
  );
};

export default Profile;

