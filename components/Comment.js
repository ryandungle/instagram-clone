import Moment from "react-moment";

const Comment = ({ userImage, comment, username, timestamp }) => {
  return (
    <div className="flex items-center space-x-2 mb-3">
      <img className="h-7 rounded-full" src={userImage} alt="" />
      <p className="text-sm flex-1">
        <span className="font-bold">{username}</span> {comment}
      </p>
      <Moment fromNow className="pr-5 text-xs">
        {timestamp}
      </Moment>
    </div>
  );
};

export default Comment;
