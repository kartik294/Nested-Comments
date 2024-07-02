/* eslint-disable react/prop-types */
import React, {useState, useEffect, useRef} from "react";
import useCommentTree from "../hooks/use-comment-tree";
import Comment from "./comment";
import "./styles.css";
import {NestedCommentsProps} from "./types";

const NestedComments: React.FC<NestedCommentsProps> = ({
  comments = [],
  onSubmit = () => {},
  onEdit = () => {},
  onDelete = () => {},
  onUpvote = () => {},
  onDownvote = () => {},
}) => {
  const [comment, setComment] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("newest");

  const {
    comments: commentsData,
    insertComment,
    editComment,
    deleteComment,
    sortComments,
    upDownVoteComment,
  } = useCommentTree(comments);

  const handleReply = (commentId: number | undefined, content: string) => {
    insertComment(commentId, content);
    onSubmit(content);
  };

  const handleEdit = (commentId: number, content: string) => {
    editComment(commentId, content);
    onEdit(content);
  };

  const handleDelete = (commentId: number) => {
    deleteComment(commentId);
    onDelete(commentId);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleSubmit = () => {
    if (comment) {
      handleReply(undefined, comment);
      setComment("");
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value);
    sortComments(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleSubmit();
    }
  };

  const handleUpvote = (commentId: number) => {
    upDownVoteComment(true, commentId);
    onUpvote(commentId);
    if (sortOrder === "most-voted") sortComments(sortOrder);
  };

  const handleDownvote = (commentId: number) => {
    upDownVoteComment(false, commentId);
    onDownvote(commentId);
    if (sortOrder === "most-voted") sortComments(sortOrder);
  };

  return (
    <>
      <div className="add-comment">
        <textarea
          value={comment}
          onChange={handleEditChange}
          onKeyDown={handleKeyDown}
          rows={3}
          cols={50}
          className="comment-textarea"
          placeholder="Add a new comment..."
          aria-label="Add a new comment"
        />
        <button onClick={handleSubmit} className="comment-button">
          Add Comment
        </button>
      </div>

      <div>
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
      </div>

      {commentsData.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          onSubmitComment={handleReply}
          onEditComment={handleEdit}
          onDeleteComment={handleDelete}
          onUpvoteComment={handleUpvote}
          onDownvoteComment={handleDownvote}
        />
      ))}
    </>
  );
};

export default NestedComments;
