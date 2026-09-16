import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PostDetailsDataResponse } from '../../features/details/models/post-details-data.interface';
import { PostLikesResponse } from '../models/post-likes.interface';
import { PostMutationDataResponse } from '../models/post-mutation-data.interface';
import { PostsDataResponse } from '../models/posts-data.interface';
import { PostBookmarkResponse } from '../models/post-bookmark.interface';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private readonly httpClient = inject(HttpClient);

  // myHeaders: object = {
  //   headers: {
  //     AUTHORIZATION: `Bearer ${localStorage.getItem('socialToken')}`,
  //   },
  // };

  //
  getAllPosts(): Observable<PostsDataResponse> {
    return this.httpClient.get<PostsDataResponse>(`${environment.base_url}/posts`);
  }

  //
  createPost(data: FormData): Observable<PostMutationDataResponse> {
    return this.httpClient.post<PostMutationDataResponse>(`${environment.base_url}/posts`, data);
  }

  //
  getSinglePost(postId: string): Observable<PostDetailsDataResponse> {
    return this.httpClient.get<PostDetailsDataResponse>(`${environment.base_url}/posts/${postId}`);
  }

  //
  updatePost(postId: string, data: FormData): Observable<PostMutationDataResponse> {
    return this.httpClient.put<PostMutationDataResponse>(
      `${environment.base_url}/posts/${postId}`,
      data,
    );
  }

  //
  deletePost(postId: string): Observable<PostMutationDataResponse> {
    return this.httpClient.delete<PostMutationDataResponse>(
      `${environment.base_url}/posts/${postId}`,
    );
  }

  //
  likeUnlikePost(postId: string): Observable<PostLikesResponse> {
    return this.httpClient.put<PostLikesResponse>(
      `${environment.base_url}/posts/${postId}/like`,
      {},
    );
  }

  bookmarkUnbookmarkPost(postId: string): Observable<PostBookmarkResponse> {
    return this.httpClient.put<PostBookmarkResponse>(
      `${environment.base_url}/posts/${postId}/bookmark`,
      {},
    );
  }
}
/* 
POSTS:
------
get all posts
create post
get single post
update post
delete post
like/unlike post

(get home feed
get post likes)


bookmark/unbookmark post
share post
*/

/* 
POSTS:
------
get post likes

bookmark post
share post
*/
