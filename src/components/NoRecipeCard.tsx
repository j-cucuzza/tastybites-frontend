import React from 'react'



const NoRecipeCard = () =>
    <div>
        <div className='card'>
            <img className='card-img-top' src='http://localhost:8000/media/images/no-recipes.png' alt="no recipes to display card" />
            <div className='card-body d-flex flex-column'>
                <h3 className="card-title mb-auto recipe-card">Oh no! There are no recipes with your input!</h3>
            </div>
            <div className='card-footer text-center'><small className='text-muted'>Please revise your filters, or press "Apply Filters" to try and get more.</small></div>
        </div>
        
    </div>


export default NoRecipeCard