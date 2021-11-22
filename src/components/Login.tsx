import React from "react";
import { AppError } from '../types'

type Creds = 
 { username: string
 , password: string
 }

type LoginProps =
 { onLogin: (ur: string, pw: string) => void 
 , errors: AppError
 }

const Login = (props: LoginProps) => {
    const [creds, setCreds] = React.useState<Creds>({username: "", password: ""})

    const handleLogin = () =>
        props.onLogin(creds.username, creds.password)

    const handleChangeCreds = (key: string) => (e: any) => {
        setCreds({...creds, [e.target.name]: e.target.value})
    }

    return (
        <div className='container mx-auto justify-content-center'>
            <div className="row p-3"><br /></div>
            <div className="row p-3"><br /></div>
            <h2 className='p-3 form-header d-flex flex-column'>Glad to see you back! Login here.</h2>
            <div className='forms login-form p-5'>
                <div className='container align-items-center'>
                    <div className='mb-3'>
                        <label htmlFor='inputUsername' className='form-label'>Username</label>
                        <input name="username" id='inputUsername' className='form-control w-75' type="text" value={creds.username} onChange={handleChangeCreds("username")} />
                    </div>

                    <div className='mb-3'>
                        <label htmlFor='inputPassword' className='form-label'>Password</label>
                        <input name="password" id='inputPassword' className='form-control w-75' type="password" value={creds.password} onChange={handleChangeCreds("password")} />
                    </div>
                    { props.errors.generic ? <div className='alert alert-danger w-75' role='alert'>{props.errors.generic}</div> : <></>} 
                    <button type="submit" className='btn btn-primary' value="Login" onClick={handleLogin}>Login</button>
                </div>
            </div>
        </div>
    )
}

export default Login