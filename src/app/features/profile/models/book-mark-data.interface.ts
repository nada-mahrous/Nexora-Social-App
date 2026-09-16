import { Post } from '../../../core/models/posts-data.interface';

export interface BookmarksDataResponse {
  success: boolean;
  message: string;
  data: BookmarksData;
  meta: BookmarksMeta;
}

export interface BookmarksData {
  bookmarks: Post[];
}

export interface BookmarksMeta {
  pagination: BookmarksPagination;
}

export interface BookmarksPagination {
  currentPage: number;
  limit: number;
  total: number;
  numberOfPages: number;
}
