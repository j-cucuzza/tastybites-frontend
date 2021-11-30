import React from 'react'
import { useHistory } from 'react-router-dom'
import { Recipe, Ingredient, UserMetadata } from '../types'
import slug from '../util/slug'

type FormProps =
    { user: UserMetadata
    , onAddRecipe: (file: any, recipe: Recipe, e: any) => (void)
    , uploading: boolean
    }

const Form = (props: FormProps) => {
    const history = useHistory()
    const defaultIngredient = {
        name: '',
        id: -1,
        qty: 0,
        units: ''
    }
    const [ ingredientInputs, setIngredientInputs ]  = React.useState(['ingredient-0'])
    const [ instructionInputs, setInstructionInputs ] = React.useState(['instruction-0'])
    const [ ingredients, setIngredients ] = React.useState<Ingredient[]>([defaultIngredient])
    const [ errors, setErrors ] = React.useState({
        name: false,
        ingredients: false,
        instructions: false,
        cuisine: false,
        image: false,
        servings: false,
    })
    const [ file, setFile ] = React.useState<any>(null)
    const [ recipe, setRecipe ] = React.useState<Recipe>({
        name: "",
        recipe_id: -1,
        url: "http://tastybites.surge.sh",
        servings: 0,
        ingredients: [],
        instructions: [],
        slug: "",
        api: false,
        user: props.user.id,
        image: null
        , gluten_free: false
        , dairy_free: false
        , low_carb: false
        , low_calorie: false
        , vegetarian: false
        , vegan: false
        , cuisine: ""
    })


/**
 * 
 * 
 * 
 * 
 * ADD / REMOVE FORM INPUTS
 * 
 * 
 * 
 * 
 */
    // add input for ingredients
    const addIngredientInput = () => {
        let input = "ingredient-" + ingredientInputs.length
        setIngredientInputs([...ingredientInputs, input])
        setIngredients([...ingredients, defaultIngredient])
    }


    // add input for instructions
    const addInstructionInput = () => {
        let input = "instruction-" + instructionInputs.length
        setInstructionInputs([...instructionInputs, input])
    }


    // new ingredient input
    const ingredientInput = (key: string, i: number) => 
        (<div className='input-group mb-2'>
            <input type='number' className='form-control' key={ i.toString()  + '-qty'} id={ i.toString() + '-qty' } onChange={ handleIngredientListChange("qty", i)} name='quantity' min='0' step='0.25' placeholder='amount'/>
            <input type='text' className='form-control' key={ i.toString() + '-units'} id={ i.toString() + '-units' } onChange={ handleIngredientListChange("units", i)}name='unit' placeholder='unit'/>
            <input type='text' className='form-control' key={ i.toString() + '-ingredient'} id={ i.toString() + '-ingredient' } onChange={ handleIngredientListChange("name", i)}name='ingredients[]' placeholder='name'/>
        </div>)


    // new instruction input
    const instructionInput = (key: string, i: number) => 
    (<div>
        <input type='text' className='form-control mb-2' key={ i.toString() } id={ i.toString() } onChange={ handleInstructionListChange(i)} name='instructions[]' placeholder='Combine dry ingredients...'/>
    </div>)


    // remove added inputs and delete from state
    const removeInput = (key: string, list: string[]) => {
        if (list.length === 1) return
        if (key === "ingredient") {
            setIngredientInputs(list.slice(0,-1))
            setIngredients(ingredients.slice(0,-1))
            if (list.length === recipe.ingredients.length) {
                setRecipe({ ...recipe, ingredients: recipe.ingredients.slice(0,-1)})
            }
        } else {
            setInstructionInputs(list.slice(0,-1))
            if (list.length === recipe.instructions.length) {
                setRecipe({ ...recipe, instructions: recipe.instructions.slice(0,-1)})
            }
        }
        
    }



/**
 * 
 * 
 * 
 * 
 * CREATE RECIPE ON FORM INPUTS
 * 
 * 
 * 
 * 
 */
    /**
     * 
     * @param index / index in instruction list to change 
     * @returns 
     */
    const handleInstructionListChange = (index: number) => (e: any) => {
        let updatedInputs = recipe.instructions
        updatedInputs[index] = e.target.value
        setRecipe({ ...recipe, instructions: updatedInputs})
        setErrors({...errors, instructions: false})
    }

    
    /**
     * 
     * @param key / key in ingredient state to change
     * @param index / index of ingredient item to change
     * @returns 
     */
    const handleIngredientListChange = (key: string, index: number) => (e: any) => {
        setIngredients(ingredients.map((item) => {
            if (ingredients.indexOf(item) === index) {
                return {
                    ...item,
                    [key]: e.target.value
                }
            }
            return item
        }))
        setErrors({...errors, ingredients: false})
    }

    // UPDATE RECIPE WHEN INGREDIENTS CHANGE
    React.useEffect(() => {
        setRecipe({ ...recipe, ingredients: ingredients})
    }, [ingredients])


    // HANDLE GENERIC CHANGE
    /**
     * 
     * @param key / item in recipe state to change (e.g., servings, name, etc.)
     * @returns 
     */
    const handleInputChange = (key: string) => (e: any) => {
        setRecipe({...recipe, [key]: e.target.value})
        setErrors({...errors, [key]: false})
        // generate slug
        if (key === 'name') {
            setRecipe({...recipe, name: e.target.value, slug: props.user.id + "-" + slug(e.target.value)})
        }
        if (key === 'servings') {
            setRecipe({...recipe, servings: parseInt(e.target.value)})
        }
    }


    /**
     * 
     * validate form inputs
     * 
     */
    const validateForm = () =>{
        let err = false
        
        if (recipe.name === ""){
            setErrors({...errors, name: true})
            err = true
        } else if (recipe.cuisine === ""){
            setErrors({...errors, cuisine: true})
            err = true
        } else if (recipe.servings === 0 || isNaN(recipe.servings)) {
            setErrors({...errors, servings: true})
            err = true
        } else if (file === null){
            setErrors({...errors, image: true})
            err = true
        } else if (recipe.ingredients.length === 0 || recipe.ingredients.some(i => i.name === "" || i.qty === 0 || i.units === "")){
            setErrors({...errors, ingredients: true})
            err = true
        } else if (recipe.instructions.length === 0 || recipe.instructions.some(i => i === "")){
            setErrors({...errors, instructions: true})
            err = true
        } else if (file === null) {
            setErrors({...errors, image: true})
            err = true
        }
        
        return err

    }



    /**
     * 
     * @param image / image file to be uploaded, taken from file input
     */
    const validateImage = (image: any) => {
        console.log(image[0].type)
        if(image[0].type === "image/png" || image[0].type === "image/jpeg") {
            setFile(image)
            setErrors({...errors, image: false})
        } else {
            alert("Please provide a .jpg or .png file")
            setFile('')
            setErrors({...errors, image: true})
        }
    }



/**
 * 
 * 
 * 
 * 
 * POST RECIPE TO DATABASE
 * 
 * 
 * 
 * 
 */ 
    const createRecipe = (e: any) => {
        e.preventDefault()
        if(!validateForm()){
            props.onAddRecipe(file, recipe, e)
        } else {
            alert('Please ensure all required data is filled out.')
        }
        
    }



    return (
        <div className='container'>
            <div className="row p-3"><br /></div>
            <h2 className='p-3 form-header text-center'>Create a new recipe here!</h2>
            <div className='forms p-5'>
                <form onSubmit={createRecipe}>
                    <label htmlFor='recipeName' className='form-label'>Recipe Name</label>
                    <input type='text'
                        className='form-control'
                        id='recipeName'
                        name='name'
                        placeholder='Snickerdoodle Cookies' 
                        onChange={ handleInputChange('name')}/>

                    { errors.name ? <div><br /><div className='alert alert-danger w-75' role='alert'>Please enter a valid name.</div></div> : <></>}

                    <hr />
                    <label htmlFor='recipe-image' className='form-label'>Recipe Image</label><br />
                    <small className='text-muted'>Must be a .png or a .jpg file</small>
                    <input type='file' 
                        className='form-control'
                        accept='.png,.jpg' 
                        aria-label="recipe-image"
                        onChange={ (e: any) => validateImage(e.target.files)}/>

                    { errors.image ? <div><br /><div className='alert alert-danger w-75' role='alert'>Please select a valid image (.png or .jpg).</div></div> : <></>}

                    <hr />
                    <label htmlFor='cuisine' className='form-label'>Cuisine</label><br/>
                    <select onChange={handleInputChange('cuisine')} className='form-select ' aria-label='select cuisine'>
                                <option></option>
                                <option value='American'>American</option>
                                <option value='Asian'>Asian</option> 
                                <option value='French'>French</option>
                                <option value='German'>German</option>
                                <option value='Indian'>Indian</option>
                                <option value='Italian'>Italian</option>
                                <option value='Japanese'>Japanese</option>
                                <option value='Korean'>Korean</option> 
                                <option value='Mexican'>Mexican</option> 
                                <option value='Vietnamese'>Vietnamese</option> 
                            </select>

                    { errors.cuisine ? <div><br /><div className='alert alert-danger w-75' role='alert'>Please select a cuisine.</div></div> : <></>}

                    <hr />
                    <label htmlFor='diet' className='form-label'>Diet</label><br/>
                    <small className='text-muted'>Optional</small>
                        <div className='text-center'>
                            <div className="flex-wrap text-center btn-group btn-group-lg" role="group" aria-label="Basic checkbox toggle button group">
                                <input type="checkbox" onClick={() => setRecipe({ ...recipe, dairy_free: !recipe.dairy_free})} className="btn-check" id="dairy_free" autoComplete="off"/>
                                <label className="btn btn-outline-secondary" htmlFor="dairy_free">Dairy Free</label>

                                <input type="checkbox" onClick={() => setRecipe({ ...recipe, gluten_free: !recipe.gluten_free})} className="btn-check" id="gluten_free" autoComplete="off"/>
                                <label className="btn btn-outline-secondary" htmlFor="gluten_free">Gluten Free</label>

                                <input type="checkbox" onClick={() => setRecipe({ ...recipe, low_calorie: !recipe.low_calorie})} className="btn-check" id="low_calorie" autoComplete="off"/>
                                <label className="btn btn-outline-secondary" htmlFor="low_calorie">Low Calorie</label>
                                
                                <input type="checkbox" onClick={() => setRecipe({ ...recipe, low_carb: !recipe.low_carb})} className="btn-check" id="low_carb" autoComplete="off"/>
                                <label className="btn btn-outline-secondary" htmlFor="low_carb">Low Carb</label>

                                <input type="checkbox" onClick={() => setRecipe({ ...recipe, vegetarian: !recipe.vegetarian})} className="btn-check" id="vegetarian" autoComplete="off"/>
                                <label className="btn btn-outline-secondary" htmlFor="vegetarian">Vegetarian</label>
                                
                                <input type="checkbox" onClick={() => setRecipe({ ...recipe, vegan: !recipe.vegan})} className="btn-check" id="vegan" autoComplete="off"/>
                                <label className="btn btn-outline-secondary" htmlFor="vegan">Vegan</label>
                            </div>
                        </div>
                    <hr />
                    <label htmlFor='servings' className='form-label'>Servings</label>
                    <input type='number'
                        className='form-control'
                        id='servings'
                        name='servings'
                        placeholder='4'
                        min={1}
                        onChange={ handleInputChange('servings')}/>

                    { errors.servings ? <div><br /><div className='alert alert-danger w-75' role='alert'>Please enter a valid number.</div></div> : <></>}

                    <hr />
                    <label htmlFor='ingredients' className='form-label'>Ingredients</label>
                    <div id='ingredients'>
                        { ingredientInputs.map((inputId, index) => ingredientInput(inputId, index)) }
                        <div className='btn-group' role='group'>
                            <input type="button" className='btn btn-outline-secondary' onClick={ addIngredientInput } id="addIngredient" value="Add More" />
                            <input type="button" className='btn btn-outline-secondary' onClick={() => removeInput('ingredient', ingredientInputs) } id="removeIngredient" value="Remove" />
                        </div>
                    </div>

                    { errors.ingredients ? <div><br /><div className='alert alert-danger w-75' role='alert'>Please ensure all fields are filled.</div></div> : <></>}

                    <hr />
                    <label htmlFor='instructions' className='form-label'>Instructions</label>
                    <div id='instructions'>
                        { instructionInputs.map((inputId, index) => instructionInput(inputId, index)) }
                        <div className='btn-group' role='group'>
                            <input type="button" className='btn btn-outline-secondary' onClick={ addInstructionInput } id="addInstruction" value="Add More" />
                            <input type="button" className='btn btn-outline-secondary' onClick={() => removeInput('instructions', instructionInputs) } id="removeInstruction" value="Remove" />
                        </div>
                    </div>

                    { errors.instructions ? <div><br /><div className='alert alert-danger w-75' role='alert'>Please ensure all fields are filled.</div></div> : <></>}

                    <hr />
                    <label htmlFor='source' className='form-label'>Source</label><br/>
                    <small className='text-muted'>Enter the website this recipe is from, if applicable</small>
                    <input type="text" className='form-control' id='source' placeholder='http...' />
                    
                    <hr />
                    <div className='text-center'>
                        { props.uploading ?  <button type="submit" className='btn btn-primary disabled' value="Create Recipe"><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...</button>
                            : <button type="submit" className='btn btn-primary' value="Create Recipe">Create Recipe</button>}
                    </div>
                </form>
            </div>
        </div>)
}

export default Form