
import apiKey from './apiKey.js';
const recipeForm = document.getElementById('Recipe-form');

//search recipe in spoonacular
function spoonacularRecipeSearch(){
    const recipe = document.querySelector('#search').value;
    fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${recipe}`)
        .then(resp => resp.json())
        .then(recipeData => recipeSearch(recipeData))
        .catch(error => console.log(error))
}; 

function recipeSearch(recipeData){
    const recipeList = document.querySelector('#recipe-list');
    recipeList.innerHTML ='';
    recipeData.results.forEach(recipe =>{
        const recipeItem = document.createElement('li');

        // A separate API call to get the recipe information and extract the ingredients and preparation steps
        fetch(`https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${apiKey}`)
            .then(resp => resp.json())
            .then(recipeInfo => {
                let ingredientList = '';
                for (let i = 0; i < recipeInfo.extendedIngredients.length; i++) {
                    const ingredient = recipeInfo.extendedIngredients[i].original;
                    ingredientList += `<li>${ingredient}</li>`;
                }

                let preparationSteps = '';
                for (let i = 0; i < recipeInfo.analyzedInstructions.length; i++) {
                    const steps = recipeInfo.analyzedInstructions[i].steps;
                    for (let j = 0; j < steps.length; j++) {
                        const step = steps[j].step;
                        preparationSteps += `<li>${step}</li>`;
                    }
                }

                recipeItem.innerHTML = `
                    <h2>${recipe.title}</h2>
                    <img class="recipe-image" src="${recipe.image}" alt="${recipe.title}">
                    <p><strong>Ingredients:</strong></p>
                    <ul>${ingredientList}</ul>
                    <p><strong>Preparation:</strong></p>
                    <ol>${preparationSteps}</ol>
                    <p><a href="${recipeInfo.spoonacularSourceUrl}" target="_blank">Click here for full recipe instructions</a></p>
                `;
            })
            .catch(error => console.log(error));

        recipeList.appendChild(recipeItem);
    })
}

document.addEventListener('DOMContentLoaded', () => {
    recipeForm.addEventListener('submit', (event) => {
        event.preventDefault(); // prevent the default form submission behavior
        spoonacularRecipeSearch();
    });
});

// return recipe
spoonacularRecipeSearch();




