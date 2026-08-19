import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Error message to display to the user
  errMsg: string = '';

  // loading signal to show spinner when the form is being submitted
  loading: boolean = false;

  // Form group for the registration form
  registerForm: FormGroup = new FormGroup(
    {
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      username: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email]),
      dateOfBirth: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
      ]),
      rePassword: new FormControl('', [Validators.required]),
    },
    // { updateOn: 'submit' },
  );

  // Submit the registration form
  submitForm(): void {
    if (this.registerForm.valid) {
      // send data

      // show loading spinner
      this.loading = true;

      // Call the signUp method of the AuthService to register the user
      this.authService.signUp(this.registerForm.value).subscribe({
        next: (res) => {
          if (res.success) {
            // redirect to login page
            // programming routing to login page
            setTimeout(() => {
              this.router.navigate(['/login']);
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
      this.registerForm.markAllAsTouched();
    }
  }
}
