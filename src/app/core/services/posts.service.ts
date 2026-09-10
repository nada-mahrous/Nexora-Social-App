import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PostsDataResponse } from '../models/posts-data.interface';
import { PostMutationDataResponse } from '../models/post-mutation-data.interface';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private readonly httpClient = inject(HttpClient);

  myHeaders: object = {
    headers: {
      AUTHORIZATION: `Bearer ${localStorage.getItem('socialToken')}`,
    },
  };

  getAllPosts(): Observable<PostsDataResponse> {
    return this.httpClient.get<PostsDataResponse>(`${environment.base_url}/posts`, this.myHeaders);
  }

  createPost(data: FormData): Observable<PostMutationDataResponse> {
    return this.httpClient.post<PostMutationDataResponse>(
      `${environment.base_url}/posts`,
      data,
      this.myHeaders,
    );
  }

  getSinglePost(postId: string): Observable<any> {
    return this.httpClient.get(`${environment.base_url}/posts/${postId}`, this.myHeaders);
  }

  updatePost(postId: string): Observable<any> {
    return this.httpClient.put(`${environment.base_url}/posts/${postId}`, this.myHeaders);
  }

  deletePost(postId: string): Observable<PostMutationDataResponse> {
    return this.httpClient.delete<PostMutationDataResponse>(
      `${environment.base_url}/posts/${postId}`,
      this.myHeaders,
    );
  }
}
