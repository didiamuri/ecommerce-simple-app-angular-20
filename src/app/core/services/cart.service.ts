import {Injectable, signal, computed} from '@angular/core';
import {Product, CartItem} from '../models/models';

@Injectable({
    providedIn: 'root',
})
export class CartService {
    private readonly cartItemsSignal = signal<CartItem[]>([]);

    readonly cartItems = this.cartItemsSignal.asReadonly();

    readonly totalItems = computed(() =>
        this.cartItemsSignal().reduce((acc, item) => acc + item.quantity, 0)
    );

    readonly totalPrice = computed(() =>
        this.cartItemsSignal().reduce((acc, item) => acc + item.total, 0)
    );

    addToCart(product: Product) {
        this.cartItemsSignal.update((items) => {
            const existingItem = items.find((item) => item.id === product.id);

            if (existingItem) {
                return items.map((item) =>
                    item.id === product.id
                        ? {
                            ...item,
                            quantity: item.quantity + 1,
                            total: (item.quantity + 1) * item.price,
                        }
                        : item
                );
            }

            const newItem: CartItem = {
                id: product.id,
                title: product.title,
                price: product.price,
                quantity: 1,
                total: product.price,
                discountPercentage: product.discountPercentage,
                discountedPrice: product.price * (1 - product.discountPercentage / 100),
                thumbnail: product.thumbnail,
            };

            return [...items, newItem];
        });
    }

    removeFromCart(productId: number) {
        this.cartItemsSignal.update((items) =>
            items.filter((item) => item.id !== productId)
        );
    }

    updateQuantity(productId: number, quantity: number) {
        if (quantity <= 0) {
            this.removeFromCart(productId);
            return;
        }

        this.cartItemsSignal.update((items) =>
            items.map((item) =>
                item.id === productId
                    ? {...item, quantity, total: quantity * item.price}
                    : item
            )
        );
    }

    clearCart() {
        this.cartItemsSignal.set([]);
    }
}
