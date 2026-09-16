export interface PostBookmarkResponse {
  success: boolean;
  message: string;
  data: PostBookmark;
}

export interface PostBookmark {
  bookmarked: boolean;
  bookmarksCount: number;
}
