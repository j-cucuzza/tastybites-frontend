# University of Mississippi Computer Science - 487

Due to the free version of Heroku and AWS being removed, the website is no longer viewable. However, the codebase is still fine. The backend is currently privated. 

## Description

This project was created for the University of Mississipi Computer Science course CSCI 487 (Senior Project), Fall 2021.
It uses the TypeScript React framework to connect to a Django backend hosted through [Heroku](https://www.heroku.com).
The Django backend is part of a private repo, for obvious reasons. 

This webapp is a recipe hosting site that is recipe-focused, and less like a "social media" than other recipe webapps. 

## Features

### API Connection
The webapp connects to the [Spoonacular](https://spoonacular.com/food-api) and pulls recipes from it to be displayed alongside the recipes inside the Django Database.

### Logins
Users can create new accounts in order to save recipes and create their own, having their own profile page to view their recipes / favorites.

### Filtering
Recipes can be filtered in real time using the Cuisine, Diet, and Ingredient / Name search features.  More recipes can be pulled from the Spoonacular API using the filters provided when clicking the "Apply Filters" button.

## Future Work / TO-DO
* Scale recipes by servings
* Rating system
* More filter options (e.g., rating system)
* User profile icons
* Add recipe "collections"
* Share private recipes with select users
