import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "@firebase/firestore";
import {
  DotsHorizontalIcon,
  HeartIcon,
  ChatIcon,
  PaperAirplaneIcon,
  BookmarkIcon,
  EmojiHappyIcon,
} from "@heroicons/react/outline";
import { HeartIcon as HeartIconFilled } from "@heroicons/react/solid";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import Comment from "./Comment";

const Post = ({ id, username, userImg, img, caption }) => {
  const { data: session } = useSession();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);

  //get post's comments
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, `posts/${id}/comments`),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => {
        setComments(snapshot.docs);
      }
    );
    return unsubscribe;
  }, [db]);

  //get post's likes
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, `posts/${id}/likes`)),
      (snapshot) => {
        setLikes(snapshot.docs);
      }
    );
    return unsubscribe;
  }, [db, id]);

  //check if liked already
  useEffect(() => {
    const liked = likes.findIndex((like) => like.id === session?.user.uid);
    if (liked === -1) return;
    setHasLiked(true);
  }, [likes]);

  useEffect(() => {
    // console.log(comments.map((doc) => doc.data()));
  }, [comments]);

  async function postComment(e) {
    e.preventDefault();
    await addDoc(collection(db, `posts/${id}/comments`), {
      comment,
      username: session.user.username,
      userImage: session.user.image,
      timestamp: serverTimestamp(),
    });
    setComment("");
  }

  async function likePost() {
    if (hasLiked) {
      await deleteDoc(doc(db, "posts", id, "likes", session.user.uid));
      setHasLiked(false);
      return;
    }
    await setDoc(doc(db, "posts", id, "likes", session.user.uid), {
      username: session.user.username,
    });
    setHasLiked(true);
  }

  return (
    <div className="bg-white my-7 border rounded-t-sm">
      {/* Header */}
      <div className="flex items-center p-5">
        <img
          src={userImg}
          className="rounded-full h-12 w-12 object-contain border p-1 mr-3"
          alt=""
        />
        <p className="flex-1 font-bold">{username}</p>
        <DotsHorizontalIcon className="h-5" />
      </div>
      {/* img */}
      <img src={img} className="object-cover w-full" alt="" />
      {/* Buttons */}
      {session ? (
        <div className="flex justify-between px-4 pt-4">
          <div className="flex space-x-4">
            {hasLiked ? (
              <HeartIconFilled
                className="btn text-red-500"
                onClick={likePost}
              />
            ) : (
              <HeartIcon className="btn" onClick={likePost} />
            )}

            <ChatIcon className="btn" />
            <PaperAirplaneIcon className="btn" />
          </div>
          <BookmarkIcon className="btn" />
        </div>
      ) : null}

      {/* caption */}
      <p className="p-5 truncate">
        {likes.length > 0 && (
          <p className="font-bold mb-1">
            {likes.length} {likes.length > 1 ? "likes" : "like"}
          </p>
        )}
        <span className="font-bold mr-1">{username}</span> {caption}
      </p>
      {/* comments */}
      {comments.length > 0 && (
        <div className="ml-10 h-20 overflow-y-scroll scrollbar-thumb-black scrollbar-thin">
          {comments.map((comment) => {
            return (
              <Comment
                key={comment.id}
                comment={comment.data().comment}
                timestamp={comment.data().timestamp?.toDate()}
                username={comment.data().username}
                userImage={comment.data().userImage}
              />
            );
          })}
        </div>
      )}

      {/* input box */}
      {session ? (
        <form className="flex items-center p-4">
          <EmojiHappyIcon className="h-7" />
          <input
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className=" flex-1 border-none focus:ring-0 outline-none"
          />

          <button
            className={`font-semibold text-blue-400 bg-blue-50 p-2 px-6
         hover:bg-blue-400 hover:text-blue-50
          rounded-md
           active:scale-110 duration-200 ease-out
            disabled:bg-gray-500
             disabled:text-gray-100
              disabled:cursor-not-allowed
             disabled:hover:bg-gray-500
        `}
            type="submit"
            disabled={!comment.trim()}
            onClick={postComment}
          >
            Post
          </button>
        </form>
      ) : null}
    </div>
  );
};

export default Post;
