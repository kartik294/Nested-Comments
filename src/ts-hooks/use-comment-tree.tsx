import {useState} from "react";
import {Comment} from "../ts-components/types";

const useCommentTree = (initialComments: Comment[]) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);

  const insertNode = (
    tree: Comment[],
    commentId: number,
    content: Comment
  ): Comment[] => {
    return tree.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...comment.replies, content],
        };
      } else if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: insertNode(comment.replies, commentId, content),
        };
      }
      return comment;
    });
  };

  const insertComment = (commentId: number | undefined, content: string) => {
    const newComment: Comment = {
      id: Date.now(),
      content,
      votes: 0,
      timestamp: new Date().toISOString(),
      replies: [],
    };

    if (commentId) {
      setComments((prevComments) =>
        insertNode(prevComments, commentId, newComment)
      );
    } else {
      setComments((prevComments) => [newComment, ...prevComments]);
    }
  };

  const editNode = (
    tree: Comment[],
    nodeId: number,
    content: string
  ): Comment[] => {
    return tree.map((node) => {
      if (node.id === nodeId) {
        return {
          ...node,
          content: content,
          timestamp: new Date().toISOString(),
        };
      } else if (node.replies && node.replies.length > 0) {
        return {
          ...node,
          replies: editNode(node.replies, nodeId, content),
        };
      }
      return node;
    });
  };

  const editComment = (commentId: number, content: string) => {
    setComments((prevComments) => editNode(prevComments, commentId, content));
  };

  const deleteNode = (tree: Comment[], nodeId: number): Comment[] => {
    return tree.reduce<Comment[]>((acc, node) => {
      if (node.id === nodeId) {
        return acc;
      } else if (node.replies && node.replies.length > 0) {
        node.replies = deleteNode(node.replies, nodeId);
      }
      return [...acc, node];
    }, []);
  };

  const deleteComment = (commentId: number) => {
    setComments((prevComments) => deleteNode(prevComments, commentId));
  };

  const sortNodes = (tree: Comment[], sortOrder: string): Comment[] => {
    return tree.slice().sort((a, b) => {
      if (sortOrder === "newest") {
        return (
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      } else if (sortOrder === "oldest") {
        return (
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
      } else if (sortOrder === "most-voted") {
        return b.votes - a.votes;
      }
      return 0;
    });
  };

  const sortComments = (sortOrder: string) => {
    setComments((prevComments) => sortNodes(prevComments, sortOrder));
  };

  const upDownVote = (
    tree: Comment[],
    upvote: boolean,
    commentId: number
  ): Comment[] => {
    return tree.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          votes: upvote ? comment.votes + 1 : comment.votes - 1,
        };
      } else if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: upDownVote(comment.replies, upvote, commentId),
        };
      }
      return comment;
    });
  };

  const upDownVoteComment = (upvote: boolean = true, commentId: number) => {
    setComments((prevComments) => upDownVote(prevComments, upvote, commentId));
  };

  return {
    comments,
    insertComment,
    editComment,
    deleteComment,
    sortComments,
    upDownVoteComment,
  };
};

export default useCommentTree;
