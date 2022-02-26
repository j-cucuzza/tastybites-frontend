import React from 'react'
import { useDebounce } from 'use-debounce'
import { Recipe, UserMetadata, Conditions } from '../types'
import { RecipeCard, Filters, NoRecipeCard} from '.'
import * as api from '../util/api'

type RecipeListProps =
    { recipes: Recipe[]
    , onRandomButton: () => void
    , onMoreButton: (cond: any) => void
    , loggedIn: boolean
    , user: UserMetadata
    , onFavorite: (r: number, a: boolean) => void
    , disabled: boolean
    , onButton: (r: Recipe, i: number) => any
    , onDelete: (r: Recipe) => any
    , userSpecific: number
    , pulling: boolean
    , loading: boolean
    }

const RecipeList = (props: RecipeListProps) => {
    const [ cond, setCond ] = React.useState<Conditions>({ cuisine: "", diet: "", search: ""})
    const [ searchBy, setSearchBy ] = React.useState<string>("name")
    const [ debouncedValue ] = useDebounce(cond, 300)
    const [ recipes, setRecipes ] = React.useState<Recipe[]>(props.recipes)
    const [ loading, setLoading ] = React.useState(false)
    const handleInputChange = (e: any, key: string) => {
        setCond({...cond, [key]: e.target.value})
    }



    /**
     * 
     * @returns recipe cards for display, based on given filters
     */
    const renderRecipes = () => {
        if (recipes.length === 0) {
            return <section className='col'><NoRecipeCard /></section>
        }

        return recipes.filter((recipe, i, arr) => arr.findIndex(t => t.recipe_id === recipe.recipe_id) === i).map((r, i) => {
            return  <section key={i} className='col align-items-center position-relative'>
                        <RecipeCard recipe={r} onButton={ props.onButton } onDelete={props.onDelete} onFavorite={props.onFavorite} onDeleteButton={ renderDeleteButton } i={i}/>
                    </section>
        })
    }



    // this use effect is used to filter recipes that are rendered
    React.useEffect(() => {
        let tempRecipes = props.recipes


        // filter recipe based on searching by "name" or "ingredient"
        if (debouncedValue.search.length >= 3){
            if (searchBy === "name"){
                tempRecipes = tempRecipes.filter((r: Recipe) => r.name.toLowerCase().includes(debouncedValue.search.toLowerCase()))
            } else if (searchBy === "ingredient"){
                // find list of recipes with the given ingredient
                api.ingredientSearch(debouncedValue.search)
                    .then(list => {

                        // filter temp recipes based on ingredient
                        tempRecipes = tempRecipes.filter((r: Recipe) => {

                            // check if any ingredient in an api recipe contains the ingredient searched for
                            if (r.api === true){
                                r.ingredients.map((ing: any) => {
                                    if (ing.name.includes(debouncedValue.search.toLowerCase())){

                                        // append recipe id to list since api recipes wont be in the list of recipes
                                        list.recipes.push(r.recipe_id)
                                    }
                                    return true
                                })
                            }

                            // returns true if the recipe id is in the list 
                            return list.recipes.includes(r.recipe_id)
                        })

                        // update recipes at the end of the api call because it doesn't re-render otherwise
                        setRecipes(tempRecipes)
                    })
                
            }
        }


        // filter recipes by cuisine 
        if (debouncedValue.cuisine !== ""){
            tempRecipes = tempRecipes.filter((r: Recipe) => {
                if (r.api === true){
                    if (r.cuisine.some((c: string) => c === debouncedValue.cuisine)){
                        return true
                    }
                } else if( r.cuisine === debouncedValue.cuisine){
                    return true
                }
                return false
            })
        }


        // ONLY ACTIVATES IN PROFILE PAGE
        // filters by user created recipes or user favorites
        if (props.userSpecific === 1){
            tempRecipes = tempRecipes.filter((r: Recipe) => r.user === props.user.id)
        } else if (props.userSpecific === 2){
            tempRecipes = tempRecipes.filter((r: Recipe) => r.user !== props.user.id)
        } else if (props.userSpecific === 3){
            tempRecipes = tempRecipes.filter((r: Recipe) => r.privated)
        }

        // filter recipes by diet input
        if (debouncedValue.diet !== ""){
            tempRecipes = tempRecipes.filter((r: Recipe) => r[debouncedValue.diet] === true)
        }

        // update recipes
        setRecipes(tempRecipes)

    }, [props.recipes, debouncedValue, searchBy, props.userSpecific])





    // renders delete button on recipe cards
    const renderDeleteButton = (r: Recipe, i: number) => {
        if (!props.loggedIn || r.api) {
            return
        } else if (props.user.isStaff || r.user === props.user.id) {
            return <button className='delete-recipe' data-bs-toggle="modal" data-bs-target={"#deleteModal" + i.toString()}><i className="fas fa-times fa-2x "></i> </button>
        } else {
            return
        }
    }

    // get more recipes when button is pressed in filters
    const handleMoreButton = () => {
        props.onMoreButton(cond)
    }

    // get random recipes when button is pressed in filters
    const handleRandomButton = () => {
        props.onRandomButton()
    }



    return (
        <div className="container">
                <div className='row'>
                    <Filters onInputChange={handleInputChange} 
                             onSearchBy={setSearchBy} 
                             searchBy={searchBy}
                             onRandomButton={handleRandomButton}
                             onMoreButton={handleMoreButton}
                             loading={props.pulling}/>
                </div>
                <div className="row row-cols-auto cards">
                    { props.loading ? 
                    <div className='container-fluid d-flex justify-content-center spin-content p-5'>
                        <div className='spin spinner-border spinner-border-xl text-secondary p-5' role='status'>
                            <span className='sr-only'>Loading...</span>
                        </div> 
                    </div>
                    : renderRecipes() }
                </div>
        </div>)
}


export default RecipeList