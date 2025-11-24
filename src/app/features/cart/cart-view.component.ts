import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

@Component({
    selector: 'app-cart-view',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
        <div class="bg-white">
            <div class="max-w-2xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                <h1 class="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">Shopping Cart</h1>

                <div *ngIf="cartService.cartItems().length === 0" class="mt-12 text-center">
                    <p class="text-lg text-gray-500">Your cart is empty.</p>
                    <a routerLink="/products"
                       class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
                        Continue Shopping
                    </a>
                </div>

                <form *ngIf="cartService.cartItems().length > 0"
                      class="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
                    <section aria-labelledby="cart-heading" class="lg:col-span-7">
                        <h2 id="cart-heading" class="sr-only">Items in your shopping cart</h2>

                        <ul role="list" class="border-t border-b border-gray-200 divide-y divide-gray-200">
                            <li *ngFor="let item of cartService.cartItems()" class="flex py-6 sm:py-10">
                                <div class="flex-shrink-0">
                                    <img [src]="item.thumbnail" [alt]="item.title"
                                         class="w-24 h-24 rounded-md object-center object-cover sm:w-48 sm:h-48">
                                </div>

                                <div class="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                                    <div class="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                                        <div>
                                            <div class="flex justify-between">
                                                <h3 class="text-sm">
                                                    <a [routerLink]="['/products', item.id]"
                                                       class="font-medium text-gray-700 hover:text-gray-800">
                                                        {{ item.title }}
                                                    </a>
                                                </h3>
                                            </div>
                                            <p class="mt-1 text-sm font-medium text-gray-900">\${{ item.price }}</p>
                                        </div>

                                        <div class="mt-4 sm:mt-0 sm:pr-9">
                                            <label [for]="'quantity-' + item.id"
                                                   class="sr-only">Quantity, {{ item.title }}</label>
                                            <select [id]="'quantity-' + item.id" [name]="'quantity-' + item.id"
                                                    [value]="item.quantity"
                                                    (change)="updateQuantity(item.id, $any($event.target).value)"
                                                    class="max-w-full rounded-md border border-gray-300 py-1.5 text-base leading-5 font-medium text-gray-700 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                                <option value="4">4</option>
                                                <option value="5">5</option>
                                                <option value="6">6</option>
                                                <option value="7">7</option>
                                                <option value="8">8</option>
                                            </select>

                                            <div class="absolute top-0 right-0">
                                                <button type="button" (click)="cartService.removeFromCart(item.id)"
                                                        class="-m-2 p-2 inline-flex text-gray-400 hover:text-gray-500">
                                                    <span class="sr-only">Remove</span>
                                                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg"
                                                         viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                        <path fill-rule="evenodd"
                                                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                              clip-rule="evenodd"/>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </section>

                    <!-- Order summary -->
                    <section aria-labelledby="summary-heading"
                             class="mt-16 bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5">
                        <h2 id="summary-heading" class="text-lg font-medium text-gray-900">Order summary</h2>

                        <dl class="mt-6 space-y-4">
                            <div class="flex items-center justify-between">
                                <dt class="text-sm text-gray-600">Subtotal</dt>
                                <dd class="text-sm font-medium text-gray-900">
                                    \${{ cartService.totalPrice() | number:'1.2-2' }}
                                </dd>
                            </div>
                            <div class="border-t border-gray-200 pt-4 flex items-center justify-between">
                                <dt class="text-base font-medium text-gray-900">Order total</dt>
                                <dd class="text-base font-medium text-gray-900">
                                    \${{ cartService.totalPrice() | number:'1.2-2' }}
                                </dd>
                            </div>
                        </dl>

                        <div class="mt-6">
                            <button type="button"
                                    class="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Checkout
                            </button>
                        </div>
                    </section>
                </form>
            </div>
        </div>
    `
})
export class CartViewComponent {
    cartService = inject(CartService);

    updateQuantity(id: number, quantity: string) {
        this.cartService.updateQuantity(id, parseInt(quantity, 10));
    }
}
