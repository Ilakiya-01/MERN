import { useState } from "react";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";

export default function PostCard({ post, onChanged, onDeleted }) {
  const { user } = useAuth();
  const isOwner =
    user && (post.author._id === user.id || post.author.id === user.id);
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(post.content);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [liked, setLiked] = useState(() =>
    (post.likes || []).some((u) => (u._id || u) === user?.id)
  );

  const saveEdit = async () => {
    try {
      await api.put(`/posts/${post._id}`, { content });
      setEditing(false);
      onChanged && onChanged();
    } catch (e) {
      alert(e.response?.data?.message || "Failed to edit post");
    }
  };

  const deletePost = async () => {
    if (!confirm("Delete this post?")) return;
    try {
      await api.delete(`/posts/${post._id}`);
      onDeleted && onDeleted();
    } catch (e) {
      alert(e.response?.data?.message || "Failed to delete post");
    }
  };

  const toggleLike = async () => {
    try {
      if (liked) {
        const { data } = await api.post(`/posts/${post._id}/unlike`);
        setLiked(false);
        setLikesCount(data.likes);
      } else {
        const { data } = await api.post(`/posts/${post._id}/like`);
        setLiked(true);
        setLikesCount(data.likes);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="post-card">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 8,
        }}
      >
        <strong>{post.author.username}</strong>
        <span style={{ marginLeft: "auto", color: "#657786", fontSize: 12 }}>
          {new Date(post.createdAt).toLocaleString()}
        </span>
      </div>

      {!editing ? (
        <p>{post.content}</p>
      ) : (
        <textarea
          style={{
            width: "100%",
            border: "1px solid #e1e8ed",
            borderRadius: 6,
            padding: 8,
          }}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={280}
        />
      )}

      <div className="actions">
        <button onClick={toggleLike} aria-label="like">
          {liked ? "♥" : "♡"} {likesCount}
        </button>

        {isOwner && !editing && (
          <button onClick={() => setEditing(true)}>Edit</button>
        )}
        {isOwner && !editing && <button onClick={deletePost}>Delete</button>}
        {isOwner && editing && (
          <>
            <button onClick={saveEdit}>Save</button>
            <button onClick={() => setEditing(false)}>Cancel</button>
          </>
        )}
      </div>
    </div>
  );
}
