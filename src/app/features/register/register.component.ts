import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/auth/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  // Error message to display to the user
  errMsg: string = '';

  // loading signal to show spinner when the form is being submitted
  loading: boolean = false;

  // Form group for the registration form
  registerForm!: FormGroup;

  // Subscription to handle the registration form submission
  registerSub$: Subscription = new Subscription();

  // Form group for the registration form
  // when the component is initialized, create the form group and form controls with validators
  ngOnInit(): void {
    this.registerFormInit();
  }

  // Initialize the registration form with form controls and validators
  registerFormInit(): void {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(3)]],
        username: [''],
        email: ['', [Validators.required, Validators.email]],
        dateOfBirth: ['', [Validators.required]],
        gender: ['', [Validators.required]],
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
          ],
        ],
        rePassword: ['', [Validators.required]],
        terms: [false, Validators.requiredTrue],
      }, // { updateOn: 'submit' },
      { validators: [this.confirmPassword] },
    );
  }

  // Submit the registration form
  submitForm(): void {
    if (this.registerForm.valid) {
      // send data

      // show loading spinner
      this.loading = true;

      // unsubscribe from previous subscription if any
      this.registerSub$.unsubscribe();

      // destructure the form value to remove the terms field before sending it to the backend
      const { terms, ...registerData } = this.registerForm.value;

      // Call the signUp method of the AuthService to register the user
      this.registerSub$ = this.authService.signUp(registerData).subscribe({
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

  // custom validator to check if password and rePassword match
  confirmPassword(group: AbstractControl) {
    // check if pass !== rePass ----> set an error in rePass control [mismatch]
    // if pass == rePass ----> return null

    const password = group.get('password')?.value;
    const rePassword = group.get('rePassword')?.value;

    if (password !== rePassword && rePassword !== '') {
      group.get('rePassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    } else {
      return null;
    }
  }

  // show/hide password function
  showPassword(element: HTMLInputElement): void {
    if (element.type === 'password') {
      element.type = 'text';
    } else {
      element.type = 'password';
    }
  }
}
