# University of Mississippi Computer Science - 487

This frontend is hosted through [surge](https://surge.sh) and viewable [here](tastybites.surge.sh).

## Description

This project was created for the University of Mississipi Computer Science course CSCI 487 (Senior Project), Fall 2021.
It uses the TypeScript React framework to connect to a Django backend hosted through [Heroku](https://www.heroku.com).
The Django backend is part of a private repo, for obvious reasons. 

## Features

### API Connection
The website connects to the [Spoonacular](https://spoonacular.com/food-api) and pulls recipes from it to be displayed alongside the recipes inside the Django Database

### Logins
Users can create new accounts in order to save recipes and create their own, having their own profile page to view their recipes / favorites.

### Filtering
Recipes can be filtered in real time using the Cuisine, Diet, and Ingredient / Name search features.  More recipes can be pulled from the Spoonacular API using the filters provided when clicking the "Apply Filters" button.

## Future Work / TO-DO
* Display servings
* Scale recipes by servings
* Rating system
* More filter options (e.g., rating system)
* User profile icons