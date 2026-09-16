import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/auth/services/auth.service';
//BtnLangComponent
@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule, TranslatePipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  // Error message to display to the user
  errMsg: string = '';

  // loading signal to show spinner when the form is being submitted
  loading: boolean = false;

  // Form group for the registration form
  loginForm!: FormGroup;

  // Subscription to handle the registration form submission
  loginSub$: Subscription = new Subscription();

  // Form group for the registration form
  // when the component is initialized, create the form group and form controls with validators
  ngOnInit(): void {
    this.loginFormInit();
  }

  // Initialize the registration form with form controls and validators
  loginFormInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  // Submit the registration form
  submitForm(): void {
    if (this.loginForm.valid) {
      // send data

      // show loading spinner
      this.loading = true;

      // unsubscribe from previous subscription if any
      this.loginSub$.unsubscribe();

      // Call the signUp method of the AuthService to register the user
      this.loginSub$ = this.authService.signIn(this.loginForm.value).subscribe({
        next: (res) => {
          if (res.success) {
            // save token to local storage
            localStorage.setItem('socialToken', res.data.token);
            localStorage.setItem('userData', JSON.stringify(res.data.user));

            // redirect to login page
            // programming routing to login page
            setTimeout(() => {
              this.router.navigate(['/feed']);
            }, 1000);
          }
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
          // show error message to user
          this.errMsg = err.error.message;

          // hide loading spinner
          this.loading = false;
        },
        complete: () => {
          // hide loading spinner
          this.loading = false;
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  //show password function
  showPassword(element: HTMLInputElement): void {
    if (element.type === 'password') {
      element.type = 'text';
    } else {
      element.type = 'password';
    }
  }
}
// nada55@gmail.com
// Nada123@

// create post --> comment - reply
// like & unlike --> bookmark - unbookmark

/* 
  POSTS:
  ------
  get post likes
  bookmark post
  share post
  */
