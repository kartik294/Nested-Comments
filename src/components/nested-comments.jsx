/* eslint-disable react/prop-types */
import {useState} from "react";
import useCommentTree from "../hooks/use-comment-tree";
import Comment from "./comment";
import "./styles.css";

const NestedComments = ({
  comments = [],
  onSubmit = () => {},
  onEdit = () => {},
  onDelete = () => {},
  // onUpvote = () => {},
  // onDownvote = () => {},
}) => {
  const [comment, setComment] = useState("");
  // const [sortOrder, setSortOrder] = useState("newest");

  const {
    comments: commentsData,
    insertComment,
    editComment,
    deleteComment,
    // sortComments,
    // upDownVoteComment,
  } = useCommentTree(comments);

  const handleReply = (commentId, content) => {
    insertComment(commentId, content);
    onSubmit(content);
  };

  const handleEdit = (commentId, content) => {
    editComment(commentId, content);
    onEdit(content);
  };

  const handleDelete = (commentId) => {
    deleteComment(commentId);
    onDelete(commentId);
  };

  const handleEditChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = () => {
    if (comment) {
      handleReply(undefined, comment);
      setComment("");
    }
  };

  // const handleSortChange = (e) => {
  //   setSortOrder(e.target.value);
  //   sortComments(e.target.value);
  // };

  // const handleKeyDown = (e) => {
  //   if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
  //     handleSubmit();
  //   }
  // };

  // const handleUpvote = (commentId) => {
  //   upDownVoteComment(true, commentId);
  //   onUpvote(commentId);
  //   if (sortOrder === "most-voted") sortComments(sortOrder);
  // };

  // const handleDownvote = (commentId) => {
  //   upDownVoteComment(false, commentId);
  //   onDownvote(commentId);
  //   if (sortOrder === "most-voted") sortComments(sortOrder);
  // };

  return (
    <>
      <div className="add-comment">
        <textarea
          value={comment}
          onChange={handleEditChange}
          // onKeyDown={handleKeyDown}
          rows={3}
          cols={50}
          className="comment-textarea"
          placeholder="Add a new comment..."
          // aria-label="Add a new comment"
        />
        <button onClick={handleSubmit} className="comment-button">
          Add Comment
        </button>
      </div>

      {/* <div>
        <label htmlFor="sortOrder">Sort by: </label>
        <select
          id="sortOrder"
          value={sortOrder}
          onChange={handleSortChange}
          aria-label="Sort comments"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="most-voted">Most Voted</option>
        </select>
      </div> */}

      {commentsData.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          onSubmitComment={handleReply}
          onEditComment={handleEdit}
          onDeleteComment={handleDelete}
          // onUpvoteComment={handleUpvote}
          // onDownvoteComment={handleDownvote}
        />
      ))}
    </>
  );
};

export default NestedComments;
