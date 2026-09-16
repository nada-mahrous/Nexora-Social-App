import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProfileDataResponse } from '../../features/profile/models/profile-data.interface';
import { environment } from '../../../environments/environment';
import { BookmarksDataResponse } from '../../features/profile/models/book-mark-data.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly httpClient = inject(HttpClient);

  getMyProfile(): Observable<ProfileDataResponse> {
    return this.httpClient.get<ProfileDataResponse>(`${environment.base_url}/users/profile-data`);
  }

  getUserPosts(userId: string): Observable<any> {
    return this.httpClient.get<any>(`${environment.base_url}/users/${userId}/posts`);
  }

  getBookmarks(): Observable<BookmarksDataResponse> {
    return this.httpClient.get<BookmarksDataResponse>(`${environment.base_url}/users/bookmarks`);
  }
}

/*
change password
upload profile photo
get my profile
get bookmarks
get follow suggestions
get user profile
follow/unfollow user
get user posts(nested)
*/
