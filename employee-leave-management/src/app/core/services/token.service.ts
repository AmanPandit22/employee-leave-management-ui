import { Injectable } from "@angular/core";
import { TokenPayload } from "../models/auth.model";

@Injectable({
    providedIn: "root",
})

export class TokenService {
    private readonly TOKEN_KEY = "auth_token";
    private readonly REFRESH_TOKEN_KEY = "refresh_token";

    setToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    setRefreshToken(refreshToken: string): void {
        localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    }

    getRefreshToken(): string | null {
        return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }

    removeTokens(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    }

    decodeToken(): TokenPayload | null{

        const token = this.getToken();
        if(!token){
            return null;
        }   

        try{
            const base64Url = token.split('.')[1];

            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            return JSON.parse(jsonPayload);
        }
        catch(error){
            console.error("Error decoding token:", error);
            return null;
        }
    }

    isTokenExpired(): boolean{

        const token = this.decodeToken();
        if(!token){
            return true;
        }

        const expirationDate = new Date(token.exp * 1000);
        return expirationDate < new Date();

    }

    getUserRole(): string | null{

        const token = this.decodeToken();
        return token?.role || null;
    }

    getUserId(): number | null{

        const token = this.decodeToken();
        return token?.userId || null;
    }

}