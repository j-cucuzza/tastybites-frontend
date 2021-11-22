import React from 'react'
import { Link } from 'react-router-dom'
import { LogoutModal} from '.'


type NavProps =
    { onLogout: () => void
    , loggedIn: boolean
    }
const LoggedOutNav = () =>
        <div className='navbar-nav'>
            <Link className="nav-item nav-link"  to="/" >Home</Link>
            <Link className="nav-link" to={"/login/"}>Login</Link>
            <Link className="nav-link" to={"/signup/"}>Signup</Link>
        </div>

const LoggedInNav = (props: Pick<NavProps, 'onLogout'>) => 
        <div className='navbar-nav'>
            <Link className="nav-item nav-link"  to="/" >Home</Link>
            <Link className="nav-item nav-link" to="/profile/" >Profile</Link>
            <Link className='nav-item nav-link' to='/addrecipe/'>Create New Recipe </Link>
            <a href='.' className='nav-item nav-link' data-bs-toggle="modal" data-bs-target="#logoutModal">Logout</a>
        </div>

const Nav = (props: NavProps) => {
    return (
        <div>
        <nav className='navbar navbar-expand-lg navbar-dark bg-secondary'>
            <div className='container-fluid'>
                <img src='http://localhost:8000/media/images/android-chrome-192x192.png'  alt="logo" width="30" height="24"/>
                <Link to='/' className='navbar-brand'>Tasty Bites</Link>
                
                <button className='navbar-toggler' type='button' data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className='collapse navbar-collapse' id='navbarContent'> 
                    {props.loggedIn
                    ? <LoggedInNav onLogout={props.onLogout} />
                    : <LoggedOutNav />}
                </div>
            </div>
        </nav>
            <LogoutModal onLogout={props.onLogout}/>
            
        </div>
    
    )
}
export default Nav