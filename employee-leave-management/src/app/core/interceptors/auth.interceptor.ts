import { AuthService } from "../services/auth.service";
import { TokenService } from "../services/token.service";
import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, throwError } from "rxjs";

export const authInterceptor: HttpInterceptorFn = (req, next) => {

    const tokenService = inject(TokenService);

    const authService = inject(AuthService);

    const token = tokenService.getToken();

    if (token && !tokenService.isTokenExpired()) {

        req = req.clone({

            setHeaders: {

                Authorization: `Bearer ${token}`

            }

        });

    }

    return next(req).pipe(

        catchError((error) => {

            if (error.status === 401) {

                authService.logout();

            }

            return throwError(() => error);

        })

    );

};
