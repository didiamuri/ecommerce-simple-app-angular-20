import {Injectable, signal, inject, computed} from '@angular/core';
import {Router} from '@angular/router';
import {ApiService} from './api.service';
import {LoginResponse, User} from '../models/models';
import {tap} from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly api = inject(ApiService);
    private readonly router = inject(Router);

    private readonly currentUserSignal = signal<User | null>(this.getUserFromStorage());
    readonly currentUser = this.currentUserSignal.asReadonly();
    readonly isLoggedIn = computed(() => !!this.currentUserSignal());
    readonly isAdmin = computed(() => true); // Mock admin check, in real app check role

    login(username: string, password: string) {
        return this.api
            .post<LoginResponse>('auth/login', {username, password})
            .pipe(
                tap((user) => {
                    this.currentUserSignal.set(user);
                    localStorage.setItem('user', JSON.stringify(user));
                    this.router.navigate(['/']);
                })
            );
    }

    logout() {
        this.currentUserSignal.set(null);
        localStorage.removeItem('user');
        this.router.navigate(['/login']);
    }

    private getUserFromStorage(): User | null {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }
}
