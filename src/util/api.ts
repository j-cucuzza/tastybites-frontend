const API_ROOT = 'http://tasty-bites-app.herokuapp.com/api'

class ApiError extends Error {
  cause: string

  constructor(cause: string, err: any, ...params: any) {
    super(...params)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError)
    }

    this.name = 'ApiError'
    this.cause = cause
    this.message = err
  }

}
enum ApiErrors {
  BadToken = 'Bad Token',
  CallFailed = 'Call Failed',
  LimitExceeded = 'Limit Exceeded'
}

enum ApiMethod {
  get = 'get',
  post = 'post',
  put = 'put',
  patch = 'patch',
  delete = 'delete',
  create = 'create'
}

type RequestParams =
  { method?: ApiMethod
  , headers?: any
  , body?: any
  , authenticated?: boolean
  , multipart?: boolean
  }

const defaultRequestParams =
  { method: ApiMethod.get
  , headers: {}
  , body: {}
  , authenticated: false
  }

const callApi = ( endpoint: string, reqParams: RequestParams = defaultRequestParams ) => {
  let params = { ...defaultRequestParams, ...reqParams }
  let headers
  if(params.multipart) {
    headers = { ...params.headers }
  } else {
    headers = { 'Content-Type': 'application/json', ...params.headers }
  }
     
  

  if (params.authenticated) {
    const token = localStorage.getItem('token')

    if (!token || token.trim() === '') {
      throw new ApiError(ApiErrors.BadToken, "")
    }

    (headers as any)['Authorization'] = `JWT ${token}`
  }

  return fetch(`${API_ROOT}${endpoint}`, {
      method: params.method,
      headers,
      body: params.method !== ApiMethod.get ? (params.multipart ? params.body : JSON.stringify(params.body)) : null
    })
      .then(r => {
        if (r.ok) {
          return r.json()
        } else if (r.status === 402) {
          throw new ApiError(ApiErrors.LimitExceeded, "")
        }
        let err;
        r.json().then().then(json =>{
          err = json
        })
        throw new ApiError(ApiErrors.CallFailed, err)
      })
}




/* authentication calls */
const login = (username: string, password: string) =>
  callApi('/token/obtain/', {
    method: ApiMethod.post,
    body: { username, password },
    authenticated: false
  })

const logout = (token: any) =>
  callApi('/blacklist/', { method: ApiMethod.post, authenticated: true, body: {refresh: token}})

const refreshToken = () =>
  callApi('/token/refresh/', { authenticated: true })

const signup = (data: any) =>
  callApi('/users/', { method: ApiMethod.post, headers: {'Content-Type': 'application/json'}, body: data})




/* user calls */
const getCurrentUser = () =>
  callApi('/current_user/', { authenticated: true })

const getUserRecipes = () =>
  callApi('/user_recipes/', { authenticated: true })





/* recipe calls */
const getRecipe = (id: number) =>
  callApi(`/recipe/get/${id}/`)

const getRecipeList = () =>
  callApi('/recipes/')

const getIngredients = (id: number) =>
  callApi(`/ingredients/?id=${id}`)

const addFullRecipe = (f: FormData) =>
  callApi('/createrecipe/', { method: ApiMethod.post, multipart: true, authenticated: true, body: f})

const deleteRecipe = (id: number, s: boolean, user: number) =>
  callApi('/deleterecipe/', { method: ApiMethod.delete, authenticated: true, body: {staff: s, id: id, user: user}})

const recipeTags = () =>
  callApi('/recipetags/')

const ingredientSearch = (ingredient: string) =>
  callApi(`/ingredientsearch/?ing=${ingredient}`)



/* favorites */
const addFavorite = (r: number, u: number, api: boolean) => {
  callApi('/favorite/', { method: ApiMethod.post, authenticated: true, body: {recipe_id: r, user: u, api: api}})
}
const removeFavorite = (r: number, u: number, api: boolean) =>
  callApi(`/favorite/`, { method: ApiMethod.delete, authenticated: true, body: {recipe_id: r, user: u, api: api}})





/* External API Calls */
const getRandom = () =>
  callApi(`/spoon/random/`)

const getApiRecipe = (id: number) =>
  callApi(`/spoon/recipe/?id=${id}`)

const getFavoritesList = () =>
  callApi('/spoon/favorites/', { authenticated: true})

const searchSpoon = (cond: {search: string, cuisine: string, diet: string}) => {
  let queryString = ""
  if (cond.search !== ""){
    queryString += 'query=' + cond.search + '&'
  }

  if(cond.diet === "low_calorie") {
    queryString += 'maxCalories=600&'
  } else if (cond.diet === "low_carb") {
    queryString += 'maxCarbs=50&'
  } else if (cond.diet !== "") {
    queryString += 'diet=' + cond.diet + '&'
  }

  if (cond.cuisine !== "") {
    queryString += 'cuisine=' + cond.cuisine + '&'
  }

  return callApi("/spoon/recipesearch/?" + queryString, { body: {query: queryString}})
}


export {
  ApiError,
  ApiErrors,
  login,
  logout,
  refreshToken,
  getCurrentUser,
  getUserRecipes,
  getRandom,
  getRecipe,
  getRecipeList,
  getIngredients,
  getApiRecipe,
  addFavorite,
  signup,
  getFavoritesList,
  removeFavorite,
  addFullRecipe,
  deleteRecipe,
  recipeTags,
  ingredientSearch,
  searchSpoon
}