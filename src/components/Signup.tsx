import React from "react"
import { AppError } from '../types'


type SignupProps =
    { errors: AppError
    , onSignup: (data: any) => void
    }

const Signup = (props: SignupProps) => {

    // credential information
    const [creds, setCreds] = React.useState({username: "", 
                                        password: "", 
                                        email: "",
                                        first_name: "",
                                        last_name: ""})
    
    
    const handleChange = (key: any) => (event: any) => {
        setCreds({...creds, [event.target.name]: event.target.value})
    }
    
    return (
        <div className='container justify-content-center'>
            <div className="row p-3"><br /></div>
            <div className="row p-3"><br /></div>
            <h2 className='p-3 form-header d-flex flex-column'>Welcome to Tasty Bites!</h2>
            <div className=' d-flex flex-column forms p-5'>
                <div className='container align-items-center'>
                    <div className='mb-3'>
                        <label htmlFor='inputEmail' className='form-label'>Email</label>
                        <input name="email" type="email" className='form-control w-75' id='inputEmail' value={creds.email} onChange={handleChange("email")}/>
                    </div>
                    { props.errors.email ? <div className='alert alert-danger w-75' role='alert'>{props.errors.email}</div> : <></>}
                    <div className='mb-3'>
                        <label htmlFor='inputFirstName' className='form-label'>First Name</label>
                        <input name="first_name" type="text" className='form-control w-75' id='inputFirstName' value={creds.first_name} onChange={handleChange("first_name")}/>
                        
                    </div>

                    <div className='mb-3'>
                        <label htmlFor='inputLastName' className='form-label'>Last Name</label>
                        <input name="last_name" type="text" className='form-control w-75' id='inputLastName' value={creds.last_name} onChange={handleChange("last_name")}/>
                        
                    </div>

                    <div className='mb-3'>
                        <label htmlFor='inputUsername' className='form-label'>Username</label>
                        <input name="username" type="text" className='form-control w-75' id='inputUsername' value={creds.username} onChange={handleChange("username")}/>
                    </div>
                    { props.errors.username ? <div className='alert alert-danger w-75' role='alert'>{props.errors.username}</div> : <></>}

                    <div className='mb-3'>
                        <label htmlFor='inputPassword' className='form-label'>Password</label>
                        <input name="password" type="password" className='form-control w-75' id='inputPassword' value={creds.password} onChange={handleChange("password")}/>
                    </div>
                    { props.errors.password ? <div className='alert alert-danger w-75' role='alert'>{props.errors.password}</div> : <></>}
                    { props.errors.generic ? <div className='alert alert-danger w-75' role='alert'>{props.errors.generic}</div> : <></>} 
                    <button type="submit" className='btn btn-primary' value="Submit" onClick={() => props.onSignup(creds)}>Sign Up!</button>
                </div>
            </div>
            <div className='row p-3'></div>
        </div>
    )
}

export default Signup