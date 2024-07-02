import {useState} from "react";

const useCommentTree = (initialComments) => {
  const [comments, setComments] = useState(initialComments);

  const insertNode = (tree, commentId, content) => {
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

  const insertComment = (commentId, content) => {
    const newComment = {
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

  const editNode = (tree, nodeId, content) => {
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

  const editComment = (commentId, content) => {
    setComments((prevComments) => editNode(prevComments, commentId, content));
  };

  const deleteNode = (tree, nodeId) => {
    return tree.reduce((acc, node) => {
      if (node.id === nodeId) {
        return acc;
      } else if (node.replies && node.replies.length > 0) {
        node.replies = deleteNode(node.replies, nodeId);
      }
      return [...acc, node];
    }, []);
  };

  const deleteComment = (commentId) => {
    setComments((prevComments) => deleteNode(prevComments, commentId));
  };

   const sortNodes = (tree, sortOrder) => {
    return tree.slice().sort((a, b) => {
     if (sortOrder === "newest") {
      return new Date(b.timestamp) - new Date(a.timestamp);
      } else if (sortOrder === "oldest") {
        return new Date(a.timestamp) - new Date(b.timestamp);
    } else if (sortOrder === "most-voted") {
         return b.votes - a.votes;
     }
      return 0;
   });
  };

  const sortComments = (sortOrder) => {
     setComments((prevComments) => sortNodes(prevComments, sortOrder));
  };

 const upDownVote = (tree, upvote, commentId) => {
    return tree.map((comment) => {
       if (comment.id === commentId) {
      return {
          ...comment,
         votes: upvote ? comment.votes + 1 : comment.votes - 1,
      };
      } else if (comment.replies && comment.replies.length > 0) {
       console.log("here");
       return {
         ...comment,
        replies: upDownVote(comment.replies, upvote, commentId),
      };
     }
      return comment;
   });
};

  const upDownVoteComment = (upvote = true, commentId) => {
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
