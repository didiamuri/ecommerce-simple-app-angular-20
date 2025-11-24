import {Component, inject, signal, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {ApiService} from '../../core/services/api.service';
import {CartService} from '../../core/services/cart.service';
import {Product, ProductResponse} from '../../core/models/models';

@Component({
    selector: 'app-product-list',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
        <div class="bg-white">
            <div class="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
                <h2 class="text-2xl font-extrabold tracking-tight text-gray-900">Products</h2>

                <div *ngIf="isLoading()" class="flex justify-center items-center h-64">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>

                <div *ngIf="!isLoading()"
                     class="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    <div *ngFor="let product of products()" class="group relative">
                        <div
                            class="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
                            <img [src]="product.thumbnail" [alt]="product.title"
                                 class="w-full h-full object-center object-cover lg:w-full lg:h-full">
                        </div>
                        <div class="mt-4 flex justify-between">
                            <div>
                                <h3 class="text-sm text-gray-700">
                                    <a [routerLink]="['/products', product.id]">
                                        <span aria-hidden="true" class="absolute inset-0"></span>
                                        {{ product.title }}
                                    </a>
                                </h3>
                                <p class="mt-1 text-sm text-gray-500">{{ product.category }}</p>
                            </div>
                            <p class="text-sm font-medium text-gray-900">\${{ product.price }}</p>
                        </div>
                        <div class="mt-2">
                            <button (click)="addToCart($event, product)"
                                    class="w-full bg-indigo-600 border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 relative z-10">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class ProductListComponent implements OnInit {
    api = inject(ApiService);
    cartService = inject(CartService);

    products = signal<Product[]>([]);
    isLoading = signal(true);

    ngOnInit() {
        this.api.get<ProductResponse>('products').subscribe({
            next: (res) => {
                this.products.set(res.products);
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error(err);
                this.isLoading.set(false);
            }
        });
    }

    addToCart(event: Event, product: Product) {
        event.stopPropagation();
        event.preventDefault();
        this.cartService.addToCart(product);
    }
}
