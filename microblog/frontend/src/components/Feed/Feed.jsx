import { useEffect, useState } from "react";
import api from "../../api/api";
import PostCard from "./PostCard";
import CreatePost from "./CreatePost";

export default function Feed() {
  const [posts, setPosts] = useState([]);

  const fetchFeed = async () => {
    const { data } = await api.get("/posts/feed");
    setPosts(data.posts);
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  return (
    <div className="max-w-xl mx-auto mt-6">
      <CreatePost onPosted={fetchFeed} />
      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          onChanged={fetchFeed}
          onDeleted={fetchFeed}
        />
      ))}
    </div>
  );
}
