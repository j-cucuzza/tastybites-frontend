import React from 'react'

const Footer = () =>
    <footer className='text-light text-center bg-secondary translate-bottom footer'>
        <div className='container p-2'>
            <a className="btn btn-outline-light btn-floating m-1" href="https://www.linkedin.com/in/justin-cucuzza-446609196/" role="button"><i className="fab fa-linkedin-in"></i></a>
            <a className="btn btn-outline-light btn-floating m-1" href="https://github.com/d1ppingsauce" role="button"><i className="fab fa-github"></i></a>
        </div>
        <div className='text-center p-1 text-light bg-dark'>
            <i>CSCI 487, Fall 2021</i>
        </div>
    </footer>

export default Footer