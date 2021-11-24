import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useDebounce } from 'use-debounce'
import { Recipe, UserMetadata, Conditions } from '../types'
import { RecipeCard, Filters, RecipeList } from '.'
import * as api from '../util/api'


type ProfileParams =
    { loggedIn: boolean
    , user: UserMetadata
    , userRecipes: Recipe[]
    , onFavorite: (r: number, a: boolean) => void
    , onRandomButton: () => void
    , onMoreButton: (cond: any) => void
    , disabled: boolean
    , onButton: (r: Recipe, i: number) => any
    , onDelete: (r: Recipe) => any
    }

const Profile = (props: ProfileParams) => {
    const history = useHistory()
    const [ recipes, setRecipes ] = React.useState(props.userRecipes)
    const [ filter, setFilter] = React.useState(0)

    // go to login / homepage if user is not logged in
    React.useEffect(() => {
        if (props.loggedIn && localStorage.getItem('token')) {
            // api.getCurrentUser()
            //     .then(response => setProfile(response))
        } else {
            history.push('/login/')
        }
    },[])


    // update recipes when filter option changed (user recipes versus user favorites)
    // React.useEffect(() => {
    //     let tempRecipes = props.userRecipes

    //     if (filter === 1){
    //         tempRecipes = tempRecipes.filter((r: Recipe) => r.user === props.user.id)
    //     } else if (filter === 2){
    //         tempRecipes = tempRecipes.filter((r: Recipe) => r.user !== props.user.id)
    //     }

    //     setRecipes(tempRecipes)
    // }, [])

    return (
        <div className='container-fluid'>
            <div className="row p-3"><br /></div>
            {/* <div className="row p-3 mx-auto position-relative justify-content-md-left"> */}
                <div className='container row position-relative profile-info'>
                    <div className='col-3 p-4'>
                        <img width='100px' height='100px' src="https://d2i7h2wv1n9itn.cloudfront.net/media/img/bev.png" alt='profile icon'/>
                    </div>
                    <div className='col-sm p-4 user-info'>
                        <div className='text-muted'>Welcome,</div>
                        <h1>{props.user.first_name + ' ' + props.user.last_name}</h1>
                        <p className='text-muted'>@{props.user.username}</p>
                    </div>
                    <div className='row text-center p-3'>
                        <div className='btn-group' role='group'>                            
                            <input type='radio' className='btn-check' name='btnradio' 
                                onChange={ () => setFilter(1) }
                                autoComplete='off'
                                aria-label='my recipes button' 
                                id='myrecipes'/>
                            <label className='btn btn-outline-secondary' htmlFor='myrecipes'>My Recipes</label>

                            <input type='radio' className='btn-check' name='btnradio' 
                                onChange={ () => setFilter(2) }
                                autoComplete='off'
                                aria-label='my favorites button'
                                id='favorites'/>
                            <label className='btn btn-outline-secondary' htmlFor='favorites'>My Favorites</label>
                        </div>
                    </div>
                </div>

                
            {/* </div> */}
            {/* <div className='row filters favs-own text-center p-3'>
                    <div className='btn-group' role='group'>                            
                        <input type='radio' className='btn-check' name='btnradio' 
                            // onChange={ () => props.onSearchBy('ingredient') }
                            autoComplete='off'
                            aria-label='my recipes button' 
                            id='myrecipes'/>
                        <label className='btn btn-outline-secondary' htmlFor='myrecipes'>My Recipes</label>

                        <input type='radio' className='btn-check' name='btnradio' 
                            // onChange={ () => props.onSearchBy('name') }
                            autoComplete='off'
                            aria-label='my favorites button'
                            id='favorites'/>
                        <label className='btn btn-outline-secondary' htmlFor='favorites'>My Favorites</label>
                    </div>
                </div> */}
            
            <div className="container">
                <div className="row">
                    <RecipeList recipes={recipes} 
                                loggedIn={props.loggedIn} 
                                user={props.user}
                                onFavorite={props.onFavorite} 
                                onDelete={props.onDelete} 
                                disabled={props.disabled} 
                                onButton={props.onButton}
                                userSpecific={filter}
                                onRandomButton={props.onRandomButton}
                                onMoreButton={props.onMoreButton}
                                pulling={false}
                                />
                </div>
            </div>
        </div>
    )
}

export default Profile