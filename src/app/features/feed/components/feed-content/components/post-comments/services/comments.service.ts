import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../../../environments/environment';
import { CommentsDataResponse } from '../models/comments-data.interface';
import { CommentsMutationDataResponse } from '../models/comments-mutation-data.interface';
import { CommentLikeResponse } from '../models/comment-like.interface';
import { CommentRepliesResponse } from '../models/comment-replies.interface';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private readonly httpClient = inject(HttpClient);

  // myHeaders: object = {
  //   headers: {
  //     AUTHORIZATION: `Bearer ${localStorage.getItem('socialToken')}`,
  //   },
  // };

  getPostComments(postId: string): Observable<CommentsDataResponse> {
    return this.httpClient.get<CommentsDataResponse>(
      `${environment.base_url}/posts/${postId}/comments?page=1&limit=10`,
    );
  }

  createComment(postId: string, data: FormData): Observable<CommentsMutationDataResponse> {
    return this.httpClient.post<CommentsMutationDataResponse>(
      `${environment.base_url}/posts/${postId}/comments`,
      data,
    );
  }

  updateComment(
    postId: string,
    commentId: string,
    data: object,
  ): Observable<CommentsMutationDataResponse> {
    return this.httpClient.put<CommentsMutationDataResponse>(
      `${environment.base_url}/posts/${postId}/comments/${commentId}`,
      data,
    );
  }

  deleteComment(postId: string, commentId: string): Observable<CommentsMutationDataResponse> {
    return this.httpClient.delete<CommentsMutationDataResponse>(
      `${environment.base_url}/posts/${postId}/comments/${commentId}`,
    );
  }

  likeUnlikeComment(postId: string, commentId: string): Observable<CommentLikeResponse> {
    return this.httpClient.put<CommentLikeResponse>(
      `${environment.base_url}/posts/${postId}/comments/${commentId}/like`,
      {},
    );
  }

  getCommentReplies(postId: string, commentId: string): Observable<CommentRepliesResponse> {
    return this.httpClient.get<CommentRepliesResponse>(
      `${environment.base_url}/posts/${postId}/comments/${commentId}/replies?page=1&limit=10`,
    );
  }

  createReply(
    postId: string,
    commentId: string,
    data: FormData,
  ): Observable<CommentsMutationDataResponse> {
    return this.httpClient.post<CommentsMutationDataResponse>(
      `${environment.base_url}/posts/${postId}/comments/${commentId}/replies`,
      data,
    );
  }
}

/* 
  comments:
  ------
  get post comments
  create comment
  update comment
  delete comment
  like/unlike comment
  get comments replies
  create reply
  

  */

/* 
  comments:
  ------
  get post comments

  
  bookmark post
  share post
  */
