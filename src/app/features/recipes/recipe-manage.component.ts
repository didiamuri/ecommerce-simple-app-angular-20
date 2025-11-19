import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Recipe } from '../../core/models/models';

@Component({
    selector: 'app-recipe-manage',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-extrabold text-gray-900">Manage Recipes</h1>
      
      <div class="mt-8 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div class="md:grid md:grid-cols-3 md:gap-6">
          <div class="md:col-span-1">
            <h3 class="text-lg font-medium leading-6 text-gray-900">Add New Recipe</h3>
            <p class="mt-1 text-sm text-gray-500">
              Create a new recipe to share with the community.
            </p>
          </div>
          <div class="mt-5 md:mt-0 md:col-span-2">
            <form (ngSubmit)="onSubmit()">
              <div class="grid grid-cols-6 gap-6">
                <div class="col-span-6 sm:col-span-4">
                  <label for="name" class="block text-sm font-medium text-gray-700">Recipe Name</label>
                  <input type="text" name="name" id="name" [(ngModel)]="newRecipe.name" required
                    class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                </div>

                <div class="col-span-6 sm:col-span-3">
                  <label for="cuisine" class="block text-sm font-medium text-gray-700">Cuisine</label>
                  <input type="text" name="cuisine" id="cuisine" [(ngModel)]="newRecipe.cuisine"
                    class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                </div>

                <div class="col-span-6 sm:col-span-3">
                  <label for="difficulty" class="block text-sm font-medium text-gray-700">Difficulty</label>
                  <select id="difficulty" name="difficulty" [(ngModel)]="newRecipe.difficulty"
                    class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>
                
                <div class="col-span-6">
                   <label for="instructions" class="block text-sm font-medium text-gray-700">Instructions (one per line)</label>
                   <div class="mt-1">
                      <textarea id="instructions" name="instructions" rows="3" [(ngModel)]="instructionsText"
                        class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"></textarea>
                   </div>
                   <p class="mt-2 text-sm text-gray-500">Brief description of how to make the dish.</p>
                </div>
              </div>
              
              <div class="mt-6 flex justify-end">
                 <button type="button" class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Cancel
                 </button>
                 <button type="submit" [disabled]="isSubmitting()" class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    {{ isSubmitting() ? 'Saving...' : 'Save' }}
                 </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RecipeManageComponent {
    api = inject(ApiService);
    router = inject(Router);

    newRecipe: Partial<Recipe> = {
        name: '',
        cuisine: '',
        difficulty: 'Easy',
        instructions: []
    };

    instructionsText = '';
    isSubmitting = signal(false);

    onSubmit() {
        this.isSubmitting.set(true);
        this.newRecipe.instructions = this.instructionsText.split('\n').filter(line => line.trim() !== '');

        // Mock API call since DummyJSON add recipe might not persist or work as expected without auth
        // But we'll try to hit the endpoint
        this.api.post<Recipe>('recipes/add', this.newRecipe).subscribe({
            next: (res) => {
                console.log('Recipe added:', res);
                this.isSubmitting.set(false);
                this.router.navigate(['/recipes']);
            },
            error: (err) => {
                console.error(err);
                this.isSubmitting.set(false);
                // Fallback for demo if API fails
                alert('Failed to add recipe (API might be read-only or require auth). Check console.');
            }
        });
    }
}
