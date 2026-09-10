export interface PostMutationDataResponse {
  success: boolean;
  message: string;
  data: PostMutationData;
}

export interface PostMutationData {
  post: Post;
}

export interface Post {
  body: string;
  image: string;
  privacy: string;
  user: string;
  sharedPost: Post | null;
  likes: string[];
  _id: string;
  createdAt: string;
  likesCount: number;
  isShare: boolean;
  id: string;
}
