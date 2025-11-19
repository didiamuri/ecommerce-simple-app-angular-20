import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Recipe, RecipeResponse } from '../../core/models/models';

@Component({
    selector: 'app-recipe-list',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="bg-white">
      <div class="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center">
            <h2 class="text-3xl font-extrabold tracking-tight text-gray-900">Recipes</h2>
            <a routerLink="/recipes/manage" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                Manage Recipes
            </a>
        </div>

        <div *ngIf="isLoading()" class="flex justify-center items-center h-64">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>

        <div *ngIf="!isLoading()" class="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          <div *ngFor="let recipe of recipes()" class="group relative bg-white border border-gray-200 rounded-lg flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div class="aspect-w-3 aspect-h-2 bg-gray-200 group-hover:opacity-75 sm:aspect-none sm:h-48">
              <img [src]="recipe.image" [alt]="recipe.name" class="w-full h-full object-center object-cover sm:w-full sm:h-full">
            </div>
            <div class="flex-1 p-4 space-y-2 flex flex-col">
              <h3 class="text-xl font-semibold text-gray-900">
                {{ recipe.name }}
              </h3>
              <p class="text-sm text-gray-500">{{ recipe.cuisine }} • {{ recipe.difficulty }}</p>
              <div class="flex-1">
                 <p class="text-sm text-gray-500 line-clamp-3">
                    {{ recipe.instructions.join(' ') }}
                 </p>
              </div>
               <div class="mt-4 flex items-center justify-between">
                  <div class="flex items-center">
                     <svg class="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                     </svg>
                     <p class="ml-1 text-sm text-gray-500">{{ recipe.rating }} ({{ recipe.reviewCount }} reviews)</p>
                  </div>
                  <p class="text-sm font-medium text-gray-900">{{ recipe.caloriesPerServing }} cal</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RecipeListComponent implements OnInit {
    api = inject(ApiService);

    recipes = signal<Recipe[]>([]);
    isLoading = signal(true);

    ngOnInit() {
        this.api.get<RecipeResponse>('recipes').subscribe({
            next: (res) => {
                this.recipes.set(res.recipes);
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error(err);
                this.isLoading.set(false);
            }
        });
    }
}
