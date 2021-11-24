import React from 'react'
import { Link } from 'react-router-dom'
import { useDebounce } from 'use-debounce'
import { Recipe, UserMetadata, Conditions } from '../types'
import { RecipeCard, Filters, RecipeList } from '.'
import * as api from '../util/api'


type HomeProps =
    { recipes: Recipe[]
    , userRecipes: Recipe[]
    , loggedIn: boolean
    , user: UserMetadata
    , onFavorite: (r: number, a: boolean) => void
    , onRandomButton: () => void
    , onMoreButton: (cond: any) => void
    , disabled: boolean
    , onButton: (r: Recipe, i: number) => any
    , onDelete: (r: Recipe) => any
    , pulling: boolean
    }

const Home = (props: HomeProps) => {
    return (
        <div>
            <div className='home-banner'>

                <div className='text-light home-greeting'>
                    <div className='position-absolute text-center top-50 start-50 translate-middle'>
                        <p><b>Welcome to Tasty Bites</b>,</p>
                        <p>Your Digital Cookbook</p>
                    </div>
                </div>
            </div>
            <div className="row p-3"><br /></div>
            <div className="container-fluid">
                <div className='container'>
                    <div className='row'>
                        <RecipeList recipes={props.recipes}
                                    loggedIn={props.loggedIn} 
                                    user={props.user} 
                                    onFavorite={props.onFavorite} 
                                    onDelete={props.onDelete} 
                                    disabled={props.disabled} 
                                    onButton={props.onButton}
                                    onRandomButton={props.onRandomButton}
                                    onMoreButton={props.onMoreButton}
                                    userSpecific={0}
                                    pulling={props.pulling}/>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Home