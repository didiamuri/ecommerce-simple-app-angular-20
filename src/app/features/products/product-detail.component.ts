import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { Product } from '../../core/models/models';

@Component({
    selector: 'app-product-detail',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="bg-white" *ngIf="product() as p">
      <div class="pt-6">
        <nav aria-label="Breadcrumb">
          <ol role="list" class="max-w-2xl mx-auto px-4 flex items-center space-x-2 sm:px-6 lg:max-w-7xl lg:px-8">
            <li>
              <div class="flex items-center">
                <a routerLink="/products" class="mr-2 text-sm font-medium text-gray-900">Products</a>
                <svg width="16" height="20" viewBox="0 0 16 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="w-4 h-5 text-gray-300">
                  <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                </svg>
              </div>
            </li>
            <li class="text-sm">
              <a [routerLink]="['/products', p.id]" aria-current="page" class="font-medium text-gray-500 hover:text-gray-600">{{ p.title }}</a>
            </li>
          </ol>
        </nav>

        <!-- Image gallery -->
        <div class="mt-6 max-w-2xl mx-auto sm:px-6 lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-3 lg:gap-x-8">
          <div class="hidden aspect-w-3 aspect-h-4 rounded-lg overflow-hidden lg:block">
            <img [src]="p.images[0]" [alt]="p.title" class="w-full h-full object-center object-cover">
          </div>
          <div class="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
            <div class="aspect-w-3 aspect-h-2 rounded-lg overflow-hidden">
              <img [src]="p.images[1] || p.images[0]" [alt]="p.title" class="w-full h-full object-center object-cover">
            </div>
            <div class="aspect-w-3 aspect-h-2 rounded-lg overflow-hidden">
              <img [src]="p.images[2] || p.images[0]" [alt]="p.title" class="w-full h-full object-center object-cover">
            </div>
          </div>
          <div class="aspect-w-4 aspect-h-5 sm:rounded-lg sm:overflow-hidden lg:aspect-w-3 lg:aspect-h-4">
            <img [src]="p.thumbnail" [alt]="p.title" class="w-full h-full object-center object-cover">
          </div>
        </div>

        <!-- Product info -->
        <div class="max-w-2xl mx-auto pt-10 pb-16 px-4 sm:px-6 lg:max-w-7xl lg:pt-16 lg:pb-24 lg:px-8 lg:grid lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8">
          <div class="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 class="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">{{ p.title }}</h1>
          </div>

          <!-- Options -->
          <div class="mt-4 lg:mt-0 lg:row-span-3">
            <h2 class="sr-only">Product information</h2>
            <p class="text-3xl text-gray-900">\${{ p.price }}</p>

            <div class="mt-6">
              <h3 class="sr-only">Description</h3>
              <div class="text-base text-gray-700 space-y-6">
                <p>{{ p.description }}</p>
              </div>
            </div>

            <div class="mt-10">
              <button (click)="addToCart(p)" class="mt-10 w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Add to cart
              </button>
            </div>
            
            <div *ngIf="authService.isAdmin()" class="mt-4">
               <a [routerLink]="['/admin/products', p.id]" class="w-full bg-gray-200 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-gray-900 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                Edit Product (Admin)
              </a>
            </div>
          </div>

          <div class="py-10 lg:pt-6 lg:pb-16 lg:col-start-1 lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <!-- Description and details -->
            <div>
              <h3 class="sr-only">Description</h3>
              <div class="space-y-6">
                <p class="text-base text-gray-900">{{ p.description }}</p>
              </div>
            </div>

            <div class="mt-10">
              <h3 class="text-sm font-medium text-gray-900">Highlights</h3>
              <div class="mt-4">
                <ul role="list" class="pl-4 list-disc text-sm space-y-2">
                  <li class="text-gray-400"><span class="text-gray-600">Brand: {{ p.brand }}</span></li>
                  <li class="text-gray-400"><span class="text-gray-600">Category: {{ p.category }}</span></li>
                  <li class="text-gray-400"><span class="text-gray-600">Rating: {{ p.rating }}/5</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProductDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private api = inject(ApiService);
    cartService = inject(CartService);
    authService = inject(AuthService);

    product = signal<Product | null>(null);

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.api.get<Product>(`products/${id}`).subscribe({
                next: (p) => this.product.set(p),
                error: (err) => console.error(err)
            });
        }
    }

    addToCart(product: Product) {
        this.cartService.addToCart(product);
    }
}
