import React, { useState } from "react";
const EditProfile = ({ user, onSave }) => {
  const [formData, setFormData] = useState({
    username: user?.username || "",
    bio: user?.bio || "",
  });
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: call backend API to update profile
    onSave(formData);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />
          <textarea
            name="bio"
            placeholder="Your bio"
            value={formData.bio}
            onChange={handleChange}
          />
          <button type="submit" className="follow-btn">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
