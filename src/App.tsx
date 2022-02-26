/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { Footer, Form, Home, Login, Nav, Profile, Recipe, Signup } from './components';
import { AppError, Conditions, Recipe as RecipeType, Token, UserMetadata } from './types';
import * as api from './util/api';

const App = () => {
  const history = useHistory()

  /**
   * 
   * 
   * create state hooks
   * 
   * 
   */

  // page is currently loading, pulling recipes from database
  const [ loading, setLoading ] = React.useState<boolean>(true)

  // user is logged in
  const [ loggedIn, setLoggedIn ] = React.useState<boolean>(false)

  // user profile information
  const [ profile, setProfile ] = React.useState<UserMetadata>({
    username: "",
    first_name: "",
    last_name: "",
    id: 0,
    isStaff: false
  })

  // errors for login / signup page
  const [ errors, setErrors ] = React.useState<AppError>({
    username: "",
    password: "",
    email: "",
    generic: ""
  })

  // might not need to include token in state
  const [ token, setToken ] = React.useState<Token>({ refresh: '', token: '' })

  // page recipes
  const [ recipes, setRecipes ] = React.useState<RecipeType[]>([])

  // user recipes
  // kept separate due to possibility for private recipes
  // might could just query database for privated recipes when viewing profile page
  const [ userRecipes, setUserRecipes ] = React.useState<RecipeType[]>([])

  // disable button when pressed to prevent pressing too many times
  const [ disabled, setDisabled ] = React.useState<boolean>(true)

  // api errors
  const [ apiErr, setApiErr ] = React.useState<boolean>(false)

  // uploading new recipe, disable button in the meantime
  const [ uploading, setUploading ] = React.useState(false)

  // pulling new recipes from the spoonacular api (getRandom and getMore)
  const [ pulling, setPulling ] = React.useState(false)

  // conditions to prevent users from repeatedly pressing the "get more" button without changing their filters
  const [ tempCond, setTempCond ] = React.useState<Conditions>({cuisine: '', diet: '', search: ''})




/**
 * 
 * 
 * 
 * 
 * AUTHENTICATION FUNCTIONS
 * 
 * these functions handle setting up the tokens, logging in users, creating accounts,
 * and setting up the initial state.
 * 
 * 
 */

  // initialize profile information
  const setupToken = (tokenResponse: any) => {
    let logIn = false
    // set profile when initially logging in, else set with information from current user
    if (localStorage.getItem('token') === "undefined" || !localStorage.getItem('token')){
      logIn = true
      localStorage.setItem('token', tokenResponse.access)
      localStorage.setItem('refresh', tokenResponse.refresh)
      setToken({ token: tokenResponse.access, refresh: tokenResponse.refresh })
    
      setProfile({  username: tokenResponse.user.username
              , first_name: tokenResponse.user.first_name
              , last_name: tokenResponse.user.last_name
              , id: tokenResponse.user.id
              , isStaff: tokenResponse.user.is_staff})
    } else {
      setProfile({  username: tokenResponse.username
        , first_name: tokenResponse.first_name
        , last_name: tokenResponse.last_name
        , id: tokenResponse.id
        , isStaff: tokenResponse.is_staff})
    }
    // errors for login / signup form
    setErrors({ username: '', password: '', email: '', generic: ' '})
    

    // get user recipes
    api.getUserRecipes()
    .then(list => {
      // list.map((r: RecipeType) => 
      //   setUserRecipes(userRecipes => [ ...userRecipes, r])
      // )
      setUserRecipes(list.map((recipe: any) =>  {
        return formatRecipe(recipe)}) )
        // setLoggedIn(true)

    })


    // get user favorites from spoonacular api
    api.getFavoritesList()
        .then(list => {
          if (Array.isArray(list)){
            list.map((r: RecipeType) => 
            setUserRecipes(userRecipes => [ ...userRecipes, r])
            )
            setLoggedIn(true)

          } else {
            // return error information for the api call
            console.log(list)
            setLoggedIn(true)

          }
      })
    if (logIn) {
      history.push('/')
    }
  }




  // function for log in
  const handleLogin = (un: string, pw: string) => {
    setLoading(true)
    api.login(un,pw)
      .then(response => {
        setupToken(response)
        setLoading(false)
      })
      .catch((e: api.ApiError) => {
        setErrors({ ...errors, generic: 'Invalid username or password.'})
        setLoading(false)
      })
  }




  // function for log out
  const handleLogout = () => {
    // blacklist token
    api.logout(localStorage.getItem("refresh"))

    // remove tokens from storage
    localStorage.removeItem('token')
    localStorage.removeItem('refresh')
    
    // reset state
    setProfile({username: "",first_name: "",last_name: "",id: 0, isStaff: false})
    setToken({ token: '', refresh: ''})
    setUserRecipes([])

    // remove privated recipes
    setRecipes(recipes.filter((recipe) =>!recipe.privated))

    setErrors({ username: "", password: "", email: "", generic: "" })
    setLoggedIn(false)
    history.push("/")
  }




  
  // function for signup
  const handleSignup = (data: any) => {
    setLoading(true)
    // ensure that the user-submitted form data is correct and usable
    if (data.first_name === ""  ||
        data.last_name === ""){
          setErrors({ ...errors, generic: "Please ensure all fields are filled out."})
    } else if (data.password.length < 8) {
      setErrors({ ...errors, password: "Please ensure your password is at least 8 characters."}) 
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email)){
      setErrors({ ...errors, email: "Please enter a valid email."})
    } else {

      // call api to create user account
      api.signup(data)
      .then(json => {
        // store tokens in localstorage
        localStorage.setItem('refresh', json.token.refresh)
        localStorage.setItem('token', json.token.token)

        // initialize profile
        setProfile({
          username: json.username,
          first_name: json.first_name,
          last_name: json.last_name,
          id: json.id,
          isStaff: json.is_staff
        })
        setLoggedIn(true)

        // reset errors for signup
        setErrors({ username: "", password: "", email: "", generic: "" })
        history.push('/profile/')
        setLoading(false)
      }).catch(error => {
        if (typeof error.then === "function"){
            error.then((json: any) =>{
                // set errors
                setErrors({...errors, 
                            username: json.username ? json.username : "",
                            password: json.password ? json.password : "",
                            email: json.email ? json.email : ""})
            })
        } else {
            // log unknown error
            console.log(JSON.stringify(error))
        }
        setLoading(false)
        
    })
    }
    
  }


/**
 * 
 * 
 * 
 * 
 * ADD / REMOVE FAVORITES AND UPDATE USER RECIPES
 * 
 * 
 * 
 * 
 */ 
  // add or remove favorites.  r: recipe id, a: api (true if from external api, false if not)
  const handleFavorites = (r: number, a: boolean) => {
    // disallow rapid clicking of button to prevent too many calls to api
    if (!disabled) {
        return;
    } else {
      // check if user already has recipe in favorites and remove on button press, else add recipe to favorites
      if(userRecipes.some((ur: RecipeType) => ur.recipe_id === r)){
        setDisabled(false)
        api.removeFavorite(r, profile.id, a)
        setUserRecipes(userRecipes => userRecipes.filter((recipe: RecipeType) => recipe.recipe_id !== r))
        setDisabled(true)
      } else {
        setDisabled(false)
        api.addFavorite(r, profile.id, a)
        const temp: any = recipes.find(recipe => recipe.recipe_id === r)
        setUserRecipes(userRecipes => [...userRecipes, temp])
        setDisabled(true)
      }
    }
  }

  // create new recipe
  const handleAddRecipe = (file: any, recipe: RecipeType, e: any) => {
    setUploading(true)
    const data = new FormData();
    data.append('recipe', JSON.stringify(recipe))
    data.append('image', file[0])
    api.addFullRecipe(data)
      .then(json => {
          let newRecipe = formatRecipe(json)
          setRecipes([newRecipe, ...recipes])
          setUserRecipes([newRecipe,...userRecipes])
          setUploading(false)
          history.push('/')
      }).catch((e: api.ApiError) => {
        console.log(e)
        alert("There was a problem uploading your recipe.  Please try again and ensure all fields are filled out properly.")
        setUploading(false)
        // handle error
      })
  }



  /**
   * 
   * 
   * 
   * The following functions are included in this file in order to re-render some parts of state
   * 
   * 
   * 
  */
  // renders favorite button on recipe cards
  // included to prevent having to pass down 'handle favorites' along with other functions
  const renderButton = (r: RecipeType, i: number) => {
    if (!loggedIn){
        return;
    } else if (r.user === profile.id) {
        if(r.privated) {
          return 'Only you can see this recipe you privated.'
        } else {
          return 'You made this!'
        }
    }
    const desc = userRecipes.some((ur: RecipeType) => ur.recipe_id === r.recipe_id) ? 'Remove Favorite' : 'Favorite'
    if (r.api && desc === 'Remove Favorite'){
      return (
        <button type='button' className='btn btn-warning' data-bs-toggle="modal" data-bs-target={"#favoriteModal" + i.toString()} disabled={!disabled}>{desc}</button>
      )
    } else {
      return (
        <button className='btn btn-warning' disabled={!disabled} onClick={() => handleFavorites(r.recipe_id, r.api)}>{desc}</button>
      )
    }
    
  }

  // delete recipe
  // included in this top level to re-render state to remove the deleted recipe
  const handleDeleteRecipe = (r: RecipeType) => {
    if (!profile.isStaff && r.user !== profile.id) {
      return
    } else {
      // console.log("staff == " + profile.isStaff + ", trying to delete " + r.name + " and their id is " + profile.id + " and the recipe user is " + r.user)
      api.deleteRecipe(r.recipe_id, profile.isStaff, profile.id)
        .then(json => {
          // console.log(json)
          setRecipes(recipes => recipes.filter((recipe: RecipeType) => recipe.recipe_id !== r.recipe_id))
          setUserRecipes(recipes => recipes.filter((recipe: RecipeType) => recipe.recipe_id !== r.recipe_id))
        })
        .catch((e: api.ApiError) => {
          alert("There was a problem deleting this recipe.")
          console.log(e)
        })
    }
  }


  // FILTER COMPONENT
  // get random recipes when button is pressed in filters
  const handleRandomButton = () => {
    setPulling(true)
    api.getRandom()
        .then(response => {
            if(Array.isArray(response)){
                response.map((r: RecipeType) => setRecipes(recipes => [ r, ...recipes]))
                setPulling(false)
            } else {
                alert("We are unable to get more recipes at this time.")
                setPulling(false)
            }
        })
        .catch((e: any) => {
          alert("There was a problem fetching the recipes.  Please try again.")
          setPulling(false)
        })
  }

  // get more recipes when button is pressed in filters
  const handleMoreButton = (cond: Conditions) => {
    setPulling(true)

    if (cond.search === "" && cond.cuisine === "" && cond.diet === ""){
      alert("Please add some filters before you try to get new recipes!")
      setPulling(false)
    } else if (tempCond.cuisine === cond.cuisine && tempCond.diet === cond.diet && tempCond.search === cond.search){
      alert("Please change a filter before trying to get new recipes.")
      setPulling(false)
    } else {
      api.searchSpoon(cond)
        .then(response => {
          response.map((r: RecipeType) => setRecipes(recipes => [r, ...recipes]))
          setPulling(false)
        })
        .catch((e: any) => {
          alert("There was a problem fetching the recipes.  Please try again.")
          setPulling(false)
        })
      setTempCond({search: cond.search, cuisine: cond.cuisine, diet: cond.diet})
    }
  }






  // format recipe tag recipes to fit with recipe type
  // makes it easy to access attributes
  const formatRecipe = (recipe: any) => {
    return {
      name: recipe.recipe_id.name,
      recipe_id: recipe.recipe_id.recipe_id,
      url: recipe.recipe_id.url,
      servings: recipe.recipe_id.servings,
      instructions: recipe.recipe_id.instructions,
      ingredients: [],
      slug: recipe.recipe_id.slug,
      api: recipe.recipe_id.api,
      user: recipe.recipe_id.user,
      image: recipe.recipe_id.image,
      gluten_free: recipe.gluten_free,
      dairy_free: recipe.dairy_free,
      low_carb: recipe.low_carb,
      low_calorie: recipe.low_calorie,
      vegetarian: recipe.vegetarian,
      vegan: recipe.vegan,
      cuisine: recipe.cuisine,
      privated: recipe.recipe_id.privated
    }
  }



/**
 * 
 * 
 * 
 * 
 * USE EFFECT (RERENDER INFORMATION)
 * 
 * 
 * 
 * 
 */ 
  React.useEffect(() => {
    const localToken = localStorage.getItem('token')


    // user has logged in previously
    if (localToken) {
      // token is available locally, attempt to verify
      api.getCurrentUser()
        .then(response => {
          setupToken(response)
        })
        .catch((e: api.ApiError) => {
          // logout if an error is found, for now
          handleLogout()
        })
    }


    // get recipe tags
    api.recipeTags()
      .then(list => 
          setRecipes(list.map((recipe: any) =>  {
            return formatRecipe(recipe)})
            .filter((recipe: RecipeType) => !(recipe.privated && recipe.user !== profile.id))
          ) 
        )
    
    // get a random set of recipes from spoonacular api
    api.getRandom()
      .then(response => {
        if(Array.isArray(response)){
          response.map((r: RecipeType) =>
          setRecipes(recipes => [...recipes, r])
          )
          setLoading(false)
        } else {
          setApiErr(true)
          setLoading(false)
        }
        
      })
      .catch((e: api.ApiError) => {
        console.log(e)
      })
  }, [])








  return (
    <> { loading 
      ? <div className='page'>
          <div className='container-fluid d-flex justify-content-center spin-content'>
              <div className='spin spinner-border spinner-border-xl text-secondary' role='status'>
                  <span className='sr-only'>Loading...</span>
              </div> 
          </div>
        </div> 
      : <div className='page'>
          <Nav loggedIn={loggedIn} onLogout={handleLogout} />
          
          <div className='body'>
          
          {apiErr ? <div className='recipe-error alert alert-danger alert-dismissible fade show w-50 container translate-middle top-50 start-50' role='alert'>
                          <strong>We're so sorry.</strong> Some recipes aren't available at this time. This may include some favorited recipes.
                          <button type='button' className='btn-close' data-bs-dismiss='alert' aria-label='Close'></button>
                      </div> 
                    : <></>}
            


            <Switch>
              <Route exact path='/login/'>
                <Login onLogin={handleLogin} errors={errors} />
              </Route>
              <Route exact path='/addrecipe/'>
                <Form user={profile} onAddRecipe={handleAddRecipe} uploading={uploading}/>
              </Route>
              <Route exact path='/signup/'>
                <Signup errors={errors} onSignup={handleSignup}/>
              </Route>
              <Route exact path='/recipe/:slug/'>
                <Recipe recipes={recipes}/>
              </Route>
              <Route exact path='/profile/'>
                <Profile loggedIn={loggedIn} 
                         loading={loading}
                         user={profile} 
                         onDelete={handleDeleteRecipe} 
                         onFavorite={handleFavorites} 
                         disabled={disabled} 
                         onButton={renderButton}
                         userRecipes={userRecipes}
                         onRandomButton={handleRandomButton}
                         onMoreButton={handleMoreButton}/>
              </Route>
              <Route exact path='/'>
                <Home recipes={recipes} 
                      loggedIn={loggedIn} 
                      onDelete={handleDeleteRecipe} 
                      user={profile} 
                      onButton={renderButton} 
                      userRecipes={userRecipes} 
                      onFavorite={handleFavorites} 
                      disabled={disabled}
                      onRandomButton={handleRandomButton}
                      onMoreButton={handleMoreButton}
                      pulling={pulling}
                      loading={loading}/>
              </Route>
            </Switch>
          </div>
          <Footer />
        </div>
      }
    </>
  )
}

export default App;

