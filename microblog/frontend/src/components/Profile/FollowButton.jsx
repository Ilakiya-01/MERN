import React, { useState, useEffect } from "react";
import api from "../../api/api";

export default function FollowButton({ targetUserId, initiallyFollowing, onToggled }) {
  const [following, setFollowing] = useState(initiallyFollowing);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFollowing(initiallyFollowing);
  }, [initiallyFollowing]);

  const toggle = async () => {
    if (loading) return;
    setLoading(true);
    try {
      if (following) await api.post(`/users/${targetUserId}/unfollow`);
      else await api.post(`/users/${targetUserId}/follow`);
      setFollowing((v) => !v);
      onToggled && onToggled();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`px-3 py-1 rounded ${
        following ? "bg-gray-200" : "bg-blue-500 text-white"
      }`}
    >
      {loading ? "..." : following ? "Following" : "Follow"}
    </button>
  );
}
