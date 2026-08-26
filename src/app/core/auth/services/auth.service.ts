import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserDataResponse } from '../../models/user-data.interface';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);

  signUp(data: object): Observable<UserDataResponse> {
    return this.httpClient.post<UserDataResponse>(`${environment.base_url}/users/signup`, data);
  }

  signIn(data: object): Observable<UserDataResponse> {
    return this.httpClient.post<UserDataResponse>(`${environment.base_url}/users/signin`, data);
  }

  signOut(): void {
    // remove the token from local storage
    localStorage.removeItem('socialToken');

    // remove the user data from local storage
    localStorage.removeItem('userData');

    // redirect/Navigate to the login page
    this.router.navigate(['/login']);
  }
}
