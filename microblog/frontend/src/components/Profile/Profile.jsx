import React, { useEffect, useState } from "react";
import "../styles/profile.css";

const Profile = ({ userId }) => {
  const [profile, setProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    // TODO: fetch user profile & posts from backend
    setProfile({
      username: "john_doe",
      bio: "Love coding and blogging 💻✨",
      followers: 12,
      following: 8,
      posts: [
        { id: 1, text: "Hello MicroBlog!" },
        { id: 2, text: "This is my second post 🚀" },
      ],
    });
  }, [userId]);

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
    // TODO: call API for follow/unfollow
  };

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>@{profile.username}</h2>
        <p>{profile.bio}</p>
        <p>
          <strong>{profile.followers}</strong> Followers •{" "}
          <strong>{profile.following}</strong> Following
        </p>

        <button
          className={`follow-btn ${isFollowing ? "unfollow" : ""}`}
          onClick={toggleFollow}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </button>
      </div>

      <div className="profile-posts">
        <h3>Posts</h3>
        {profile.posts.map((post) => (
          <div key={post.id} className="post-card">
            <p>{post.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
