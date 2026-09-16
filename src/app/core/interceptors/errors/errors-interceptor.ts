import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export const errorsInterceptor: HttpInterceptorFn = (req, next) => {
  const toastrService = inject(ToastrService);

  /* 
  if i want to handle errors globally with Response :
  next --> take the request and sent it to the server (lw feh hagat tanyen tb3to lehom b3den el server), el server byrod 3lya be response 
  3yz a3rf el next a3dl 3leha be m3loma a3ml pipe, pipe --> allows me to make some operations 3la el next 
  3lshan t3rf el next lw el res ele reg3 feh ay error y7slo catch error
  */
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      // logic [if response has error]
      // Display Toast Notification to the user
      toastrService.error(err.error.message, 'Social App', {
        timeOut: 2500,
        closeButton: true,
        progressBar: true,
      });

      return throwError(() => err);
    }),
  );
};
