import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";
import FollowButton from "../components/Profile/FollowButton";
import PostCard from "../components/Feed/PostCard";
import { useAuth } from "../context/AuthContext";
import EditProfile from "../components/Profile/EditProfile";

export default function ProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const { user: me } = useAuth();
  const [initiallyFollowing, setInitiallyFollowing] = useState(false);
  const { setUser: setAuthUser } = useAuth();
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    api.get(`/users/${id}`).then((res) => setUser(res.data));
  }, [id]);

  useEffect(() => {
    if (!user || !me) return;
    const followerIds = (user.followers || []).map((f) => f._id || f.id || f);
    setInitiallyFollowing(followerIds.includes(me.id));
  }, [user, me]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="max-w-xl mx-auto mt-6">
      <div className="card">
        <div>
          <h2 className="text-xl font-bold">{user.username}</h2>
          <p className="text-gray-600">{user.bio}</p>
          <p className="text-gray-600 text-sm mt-1">
            <strong>{user.followers?.length || 0}</strong> Followers •
            <strong> {user.following?.length || 0}</strong> Following
          </p>
        </div>
        {me && me.id === user._id ? (
          <button className="btn inline" onClick={() => setEditing((v) => !v)}>
            {editing ? "Close" : "Edit Profile"}
          </button>
        ) : (
          <FollowButton
            targetUserId={user._id}
            initiallyFollowing={initiallyFollowing}
            onToggled={async () => {
              // re-fetch profile to update counts and button state
              const { data } = await api.get(`/users/${id}`);
              setUser(data);
            }}
          />
        )}
      </div>

      {editing && me && me.id === user._id && (
        <div className="mt-4">
          <EditProfile
            user={user}
            onSave={async (form) => {
              try {
                const { data } = await api.put("/users/me", form);
                // update auth context and localStorage user
                localStorage.setItem(
                  "user",
                  JSON.stringify({
                    id: data._id,
                    username: data.username,
                    email: data.email,
                  })
                );
                setAuthUser({
                  id: data._id,
                  username: data.username,
                  email: data.email,
                });
                // refresh profile data
                setUser((prev) => ({ ...prev, ...data }));
                setEditing(false);
              } catch (e) {
                alert(e.response?.data?.message || "Failed to update profile");
              }
            }}
          />
        </div>
      )}
      <h3 className="text-lg font-semibold mt-4 mb-2">Posts</h3>
      {user.posts?.map((p) => (
        <PostCard key={p._id} post={p} />
      ))}
    </div>
  );
}
