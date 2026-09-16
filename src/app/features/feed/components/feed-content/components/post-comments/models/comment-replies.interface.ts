export interface CommentRepliesResponse {
  success: boolean;
  message: string;
  data: CommentReplies;
  meta: Meta;
}

export interface CommentReplies {
  replies: Reply[];
}

export interface Reply {
  _id: string;

  content: string;

  image?: string | null;

  commentCreator: CommentCreator;

  post: string;

  parentComment: string;

  likes: string[];

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

export interface Meta {
  pagination: Pagination;
}

export interface Pagination {
  currentPage: number;
  limit: number;
  total: number;
  numberOfPages: number;
}
