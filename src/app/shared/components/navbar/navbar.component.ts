import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [RouterLink, RouterLinkActive, CommonModule],
    template: `
    <nav class="bg-white shadow-md sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <a routerLink="/" class="text-2xl font-bold text-indigo-600 tracking-tighter">Zando</a>
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <a routerLink="/products" routerLinkActive="border-indigo-500 text-gray-900" class="border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200">
                Products
              </a>
              <a routerLink="/recipes" routerLinkActive="border-indigo-500 text-gray-900" class="border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200">
                Recipes
              </a>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <a routerLink="/cart" class="relative p-2 text-gray-400 hover:text-gray-500 transition-colors duration-200">
              <span class="sr-only">View cart</span>
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span *ngIf="cartService.totalItems() > 0" class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                {{ cartService.totalItems() }}
              </span>
            </a>

            <ng-container *ngIf="authService.currentUser() as user; else loginBtn">
              <div class="flex items-center space-x-3">
                <img [src]="user.image" alt="User avatar" class="h-8 w-8 rounded-full border border-gray-200">
                <span class="text-sm font-medium text-gray-700 hidden md:block">{{ user.firstName }}</span>
                <button (click)="authService.logout()" class="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors duration-200">
                  Logout
                </button>
              </div>
            </ng-container>
            <ng-template #loginBtn>
              <a routerLink="/login" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 shadow-sm">
                Sign in
              </a>
            </ng-template>
          </div>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
    authService = inject(AuthService);
    cartService = inject(CartService);
}
