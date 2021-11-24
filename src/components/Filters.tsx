import React from 'react'

// type FilterProps
const Filters = (props: any) => {


    // only render get more and get random buttons when 
    const renderMore = () => {
        if (window.location.pathname !== "/profile/"){
            return <div className='row filters p-3'>
                        <div className='col-sm'>
                            <div className='row'>
                            <h4>Get More Recipes</h4>
                            <small className='text-muted'>Includes filters</small><br />
                            <div className='text-center btn-group'>
                                { props.loading ? 
                                    <button type='button'
                                        className='btn btn-secondary disabled'
                                    ><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...</button>
                                    
                                    : <button type='button' 
                                        className='btn btn-secondary'
                                        onClick={() => props.onMoreButton()}>Apply Filters</button>}
                            </div>
                            </div>
                        </div>
                        <div className='col-sm'>
                            <div className='row'>
                            <h4>Get Random Recipes</h4>
                            <small className='text-muted'>Does not include filters</small>
                            <div className='text-center btn-group'>
                                { props.loading ? 
                                    <button type='button'
                                        className='btn btn-secondary disabled'
                                    ><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...</button>
                                    
                                    :<button type='button' 
                                        className='btn btn-secondary'
                                        onClick={() => props.onRandomButton()}>Get Random</button>}
                            </div>
                            </div>
                        </div>
                    </div>
        }
    }

    return (
        <div>
            <div className='row filters p-3'>
                <div className='row pt-1 w-100'>
                    <div className='col-sm'>
                        <div className='container'>
                            <h3>Cuisine</h3>
                            <select onChange={(e) => props.onInputChange(e, 'cuisine')} className='form-select btn-outline-secondary' aria-label='select cuisine'>
                                <option></option>
                                <option value='American'>American</option>
                                <option value='Asian'>Asian</option> 
                                <option value='German'>German</option>
                                <option value='Indian'>Indian</option>
                                <option value='Italian'>Italian</option>
                                <option value='Japanese'>Japanese</option>
                                <option value='Korean'>Korean</option> 
                                <option value='Mexican'>Mexican</option> 
                                <option value='Vietnamese'>Vietnamese</option> 
                            </select>
                        </div>
                    </div>
                    <div className='col-sm'>
                        <div className='container'>
                            <h3>Diet</h3>
                            <select onChange={(e) => props.onInputChange(e, 'diet')} className='form-select btn-outline-secondary' aria-label='select cuisine'>
                                <option></option>
                                <option value='diary_free'>Dairy Free</option>
                                <option value='gluten_free'>Gluten Free</option>
                                <option value='low_carb'>Low Carb</option>
                                <option value='low_calorie'>Low Calorie</option>
                                <option value='vegan'>Vegan</option>
                                <option value='vegetarian'>Vegetarian</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className='p-1'></div>
                <div className='row p-1'>
                    <div className='col'>
                        {/* <div className='container'> */}
                            {/* <label htmlFor='' className='form-label'><h3>Search Recipes By....</h3></label> */}
                            <div className='flex-wrap ' role='toolbar'>
                                <div className='btn-group' role='group'>                            
                                    <input type='radio' className='btn-check' name='btnradio' 
                                        onChange={ () => props.onSearchBy('ingredient') }
                                        autoComplete='off'
                                        aria-label={'ingredient'} 
                                        id='ingredient'/>
                                    <label className={props.searchBy === 'ingredient' ? 'btn btn-outline-secondary active' : 'btn btn-outline-secondary'} htmlFor='ingredient'>Ingredient</label>

                                    <input type='radio' className='btn-check' name='btnradio' 
                                        onChange={ () => props.onSearchBy('name') }
                                        autoComplete='off'
                                        aria-label='name'
                                        id='name'/>
                                    <label className={props.searchBy === 'name' ? 'btn btn-outline-secondary active' : 'btn btn-outline-secondary'} htmlFor='name'>Name</label>
                                </div>
                                <div className='input-group'>
                                    <div className='input-group-text' id='btnGroupAddon'><i className='fas fa-search'></i></div>
                                    <input type='text' className='form-control' placeholder='Search' 
                                            aria-label='search bar' 
                                            aria-describedby='btnGroupAddon'
                                            onChange={(e) => props.onInputChange(e, 'search')} />
                                </div>
                            </div>
                        {/* </div> */}
                    </div>
                    
                </div>
            </div>
            
            { renderMore() }
        </div>
    )
}

export default Filters