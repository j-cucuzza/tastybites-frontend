import React from 'react'
import { Link } from 'react-router-dom'
import { Recipe } from '../types'
import { FavoriteModal, DeleteModal } from '.'

type RecipeCardProps = 
{ recipe: Recipe
, onButton: (r: Recipe, i: number) => (any)
, onDeleteButton: (r: Recipe, i: number) => any
, onFavorite: (r: number, a: boolean) => void
, i: number
, onDelete: (r: Recipe) => any
}

const RecipeCard = (props: RecipeCardProps) => 
            <div>
                <FavoriteModal onFavorite={ props.onFavorite } r={props.recipe} i={props.i} />
                <DeleteModal r={props.recipe} i={props.i} onDelete={props.onDelete}/>
                <div className='card'>
                    { props.onDeleteButton(props.recipe, props.i) }
                    <img className='card-img-top' src={props.recipe.image} alt={props.recipe.name} />
                    <div className='card-body d-flex flex-column'>
                        <h3 className="card-title mb-auto recipe-card">{props.recipe.name}</h3>
                        <Link className='btn btn-secondary' to={'/recipe/' + props.recipe.slug}>View Recipe</Link>
                    </div>
                    <div className='card-footer text-center'><small className='text-muted'>{ props.onButton(props.recipe, props.i) } </small></div>
                </div>
                
            </div>
    

export default RecipeCard