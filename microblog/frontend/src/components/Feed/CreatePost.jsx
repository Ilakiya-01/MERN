import React, { useState } from "react";
import api from "../../api/api";

export default function CreatePost({ onPosted }) {
  const [content, setContent] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    await api.post("/posts", { content });
    setContent("");
    if (onPosted) onPosted();
  };
  return (
    <form onSubmit={submit} className="p-3 border rounded">
      <div className="text">
        <textarea
          id="postBox"
          name="content"
          className="w-100 form-control"
          rows={3}
          maxLength={280}
          placeholder="Write a Post..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div className="post-container mt-2">
        <button id="postBtn" type="submit" className="btn btn-primary">
          Post
        </button>
      </div>
    </form>
  );
}
