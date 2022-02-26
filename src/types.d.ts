export interface Indexable {
  [key: string]: any;
}

type AppError =
  { username: string
  , password: string
  , email: string
  , generic: string
  }

type Token = 
  { refresh : string
  , token: string
  }

type TokenResponse = 
  { refresh: string
  , access: string
  , user: userMetaata
  }

type UserMetadata = 
  { username: string
  , first_name: string
  , last_name: string
  , id: number
  , isStaff: boolean
  }

interface Recipe extends Indexable  
  { name: string
  , recipe_id: number
  , url: string
  , servings: number
  , ingredients: Ingredient[]
  , instructions: string[]
  , slug: string
  , api: boolean
  , user: number
  , image: any
  , gluten_free: Boolean
  , dairy_free: Boolean
  , low_carb: Boolean
  , low_calorie: Boolean
  , vegetarian: Boolean
  , vegan: Boolean
  , cuisine: any
  , privated: Boolean
  }

interface Ingredient extends Indexable
  { name: string
  , id: number
  , qty: number
  , units: string
  }

type Conditions =
  { cuisine: string
  , diet: string
  , search: string
  }

type Tags =
  { glutenFree: boolean
  , dairyFree: boolean
  , lowCarb: boolean
  , lowCalorie: boolean
  , 
  }
  
type ApiRecipe = 
  { name: string }

export {
    AppError,
    Token,
    Recipe,
    Ingredient,
    ApiRecipe,
    TokenResponse,
    UserMetadata,
    Conditions
}