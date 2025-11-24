import {Routes} from '@angular/router';
import {LoginComponent} from './features/auth/login.component';
import {ProductListComponent} from './features/products/product-list.component';
import {ProductDetailComponent} from './features/products/product-detail.component';
import {CartViewComponent} from './features/cart/cart-view.component';
import {RecipeListComponent} from './features/recipes/recipe-list.component';
import {RecipeManageComponent} from './features/recipes/recipe-manage.component';

export const routes: Routes = [
    {path: '', redirectTo: 'products', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'products', component: ProductListComponent},
    {path: 'products/:id', component: ProductDetailComponent},
    {path: 'cart', component: CartViewComponent},
    {path: 'recipes', component: RecipeListComponent},
    {path: 'recipes/manage', component: RecipeManageComponent},
    // Lazy load other routes later if needed, or add them here
];
