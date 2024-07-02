export interface Comment {
  id: number;
  content: string;
  votes: number;
  timestamp: string;
  replies: Comment[];
}

export interface CommentProps {
  comment: Comment;
  onSubmitComment: (commentId: number, content: string) => void;
  onEditComment: (commentId: number, content: string) => void;
  onDeleteComment: (commentId: number) => void;
  onUpvoteComment: (commentId: number) => void;
  onDownvoteComment: (commentId: number) => void;
}

export interface NestedCommentsProps {
  comments: Comment[];
  onSubmit: (content: string) => void;
  onEdit: (content: string) => void;
  onDelete: (commentId: number) => void;
  onUpvote: (commentId: number) => void;
  onDownvote: (commentId: number) => void;
}
