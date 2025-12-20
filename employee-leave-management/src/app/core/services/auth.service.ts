import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { LoginRequest, LoginResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = 'http://localhost:3000/api'; // Need to Replace with backend API URL

  private currentUserSubject = new BehaviorSubject<User | null>(null);

  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router
  ) {
    this.loadCurrentUser();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    //return this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, credentials);

    return of(this.getDummyLoginResponse(credentials)).pipe(
      tap((response) => {
        this.tokenService.setToken(response.token);
        this.tokenService.setRefreshToken(response.refreshToken);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  logout(): void {
    this.tokenService.removeTokens();
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = this.tokenService.getToken();
    return !!token && !this.tokenService.isTokenExpired();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getUserRole(): string | null {
    return this.tokenService.getUserRole();
  }

  isEmployee(): boolean {
    return this.getUserRole() === 'Employee';
  }

  isManager(): boolean {
    return this.getUserRole() === 'Manager';
  }

  private loadCurrentUser(): void {
    if (this.isAuthenticated()) {
      const token = this.tokenService.decodeToken();
      if (token) {
        //Need to fetch user details from backend application
        const user: User = {
          id: token.userId,
          employeeId: 'EMP' + token.userId.toString().padStart(4, '0'),
          FirstName: token.email.split('@')[0],
          LastName: 'User',
          email: token.email,
          role: token.role as 'Employee' | 'Manager',
          departmentId: 1,
          managerId: 0,
        };
        this.currentUserSubject.next(user);
      }
    }
  }

  private getDummyLoginResponse(credentials: LoginRequest): LoginResponse {
    // This is a dummy implementation for testing purposes.
    // Need to Replace this with actual HTTP call to backend API.

    const isManager = credentials.email.includes('manager');
    const userId = isManager ? 1 : 2;

    // Dummy JWT token payload
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const tokenPayload = btoa(
      JSON.stringify({
        sub: credentials.email,
        email: credentials.email,
        role: isManager ? 'Manager' : 'Employee',
        userId: userId,
        exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour expiration
        iat: Math.floor(Date.now() / 1000),
      })
    );

    const signature = btoa('dummy-signature');

    const token = `${header}.${tokenPayload}.${signature}`;

    return {
      token: token,
      refreshToken: 'dummy-refresh-token',
      user: {
        id: userId,
        employeeId: isManager ? 'EMP0001' : 'EMP0002',
        FirstName: isManager ? 'John' : 'Jane',
        LastName: isManager ? 'Manager' : 'Employee',
        email: credentials.email,
        role: isManager ? 'Manager' : 'Employee',
        departmentId: 1,
        managerId: 0,
      },
    };
  }
}
