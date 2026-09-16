export interface PostsDataResponse {
  success: boolean;
  message: string;
  data: PostsData;
  meta: Meta;
}

export interface PostsData {
  posts: Post[];
}

export interface Post {
  _id: string;
  id: string;

  privacy: string;
  body?: string;
  image?: string;

  user: User;

  sharedPost?: Post | null;

  likes: string[];

  createdAt: string;

  commentsCount: number;
  topComment?: Comment;

  sharesCount: number;
  likesCount: number;

  isShare: boolean;

  bookmarked?: boolean;
  bookmarksCount?: number;
}

export interface User {
  _id: string;
  name: string;
  username: string;
  photo: string;
}

export interface Comment {
  _id: string;
  content: string;

  commentCreator: User;

  post: string;

  parentComment: string | null;

  likes: string[];

  createdAt: string;

  image?: string;
}

export interface Meta {
  pagination: Pagination;
}

export interface Pagination {
  currentPage: number;
  numberOfPages: number;
  limit: number;
  nextPage: number;
  total: number;
}
