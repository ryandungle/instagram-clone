import { collection, onSnapshot, orderBy, query } from "@firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import Post from "./Post";

// const DUMMY_DATA = [
//   {
//     id: "123",
//     username: "Ryan",
//     img: "https://links.papareact.com/3ke",
//     userImg: "https://cdn.fakercloud.com/avatars/chadengle_128.jpg",
//     caption: "Subscribe and destroy like button",
//   },
//   {
//     id: "456",
//     username: "John",
//     img: "https://links.papareact.com/3ke",
//     userImg: "https://cdn.fakercloud.com/avatars/chadengle_128.jpg",
//     caption: "Subscribe and destroy like button",
//   },
// ];

const Posts = () => {
  const [posts, setPosts] = useState(null);
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "posts"), orderBy("timestamp", "desc")),
      (snapshot) => {
        const posts = [];
        snapshot.docs.forEach((doc) =>
          posts.push({ ...doc.data(), id: doc.id })
        );
        setPosts(posts);
      }
    );
    return unsubscribe;
  }, []);
  return (
    <div>
      {posts?.map((post, index) => (
        <Post
          key={post.id}
          id={post.id}
          username={post.username}
          userImg={post.profileImg}
          img={post.image}
          caption={post.caption}
        />
      ))}
    </div>
  );
};

export default Posts;
