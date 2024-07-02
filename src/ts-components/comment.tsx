import React, {useRef, useState, useEffect} from "react";
import {CommentProps} from "./types";

const Comment: React.FC<CommentProps> = ({
  comment,
  onSubmitComment,
  onEditComment,
  onDeleteComment,
  onUpvoteComment,
  onDownvoteComment,
}) => {
  const [expand, setExpand] = useState<boolean>(false);
  const [replyContent, setReplyContent] = useState<string>("");
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editedContent, setEditedContent] = useState<string>(comment.content);

  const replyTextareaRef = useRef<HTMLTextAreaElement>(null);
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editMode && editTextareaRef.current) {
      editTextareaRef.current.focus();
    }
    if (expand && replyTextareaRef.current) {
      replyTextareaRef.current.focus();
    }
  }, [editMode, expand]);

  const toggleExpand = () => {
    setExpand(!expand);
  };

  const handleReplySubmit = () => {
    if (replyContent) {
      onSubmitComment(comment.id, replyContent);
      setReplyContent("");
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    setEditedContent(comment.content); // Reset edited content to current comment content
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (editMode) {
      setEditedContent(e.target.value);
    } else {
      setReplyContent(e.target.value);
    }
  };

  const handleEditSubmit = () => {
    onEditComment(comment.id, editedContent);
    setEditMode(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      if (editMode) {
        handleEditSubmit();
      } else {
        handleReplySubmit();
      }
    }
  };

  return (
    <div className="comment">
      {!editMode ? (
        <>
          <p className="comment-content">{comment.content}</p>
          <p className="comment-info">Votes: {comment.votes}</p>
          <p className="comment-info">
            {new Date(comment.timestamp).toLocaleString()}
          </p>
        </>
      ) : (
        <div className="add-comment">
          <textarea
            ref={editTextareaRef}
            value={editedContent}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            rows={3}
            cols={50}
            className="comment-textarea"
            aria-label="Edit comment"
          />
          <button onClick={handleEditSubmit} className="comment-button">
            Save Edit
          </button>
          <button onClick={toggleEditMode} className="comment-button">
            Cancel Edit
          </button>
        </div>
      )}

      <div className="comment-actions">
        <button
          onClick={() => onUpvoteComment(comment.id)}
          className="comment-button"
        >
          👍
        </button>
        <button
          onClick={() => onDownvoteComment(comment.id)}
          className="comment-button"
        >
          👎
        </button>
        <button onClick={toggleExpand} className="comment-button">
          {expand ? "Hide Replies" : "Reply"}
        </button>
        <button onClick={toggleEditMode} className="comment-button">
          Edit
        </button>
        <button
          onClick={() => onDeleteComment(comment.id)}
          className="comment-button"
          aria-label="Delete comment"
        >
          Delete
        </button>
      </div>

      {expand && (
        <div className="comment-replies">
          <div className="add-comment">
            <textarea
              ref={replyTextareaRef}
              value={replyContent}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Add a reply..."
              rows={3}
              cols={50}
              className="comment-textarea"
              aria-label="Add a reply"
            />
            <button onClick={handleReplySubmit} className="comment-button">
              Submit Reply
            </button>
          </div>
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              onSubmitComment={onSubmitComment}
              onEditComment={onEditComment}
              onDeleteComment={onDeleteComment}
              onUpvoteComment={onUpvoteComment}
              onDownvoteComment={onDownvoteComment}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;
