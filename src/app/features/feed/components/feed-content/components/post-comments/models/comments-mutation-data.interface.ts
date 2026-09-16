export interface CommentsMutationDataResponse {
  success: boolean;
  message: string;
  data: CommentsMutationData;
}

export interface CommentsMutationData {
  comment: Comment;
}

export interface Comment {
  _id: string;
  content: string;

  image?: string | null;

  commentCreator: CommentCreator;
  post: string;
  parentComment: any;
  likes: any[];
  createdAt: string;
  likesCount: number;
  isReply: boolean;
  id: string;
}

export interface CommentCreator {
  _id: string;
  name: string;
  username: string;
  photo: string;
  followersCount: number;
  followingCount: number;
  bookmarksCount: number;
  id: string;
}
