import React from 'react'

type ModalProps =
    { onLogout: () => void
    }


// this modal is used to ask for confirmation about logout
const LogoutModal = (props: ModalProps) => 
    <div className="modal fade" id="logoutModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Leaving?</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    Are you sure you want to log out?
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">No</button>
                    <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={props.onLogout}>Yes</button>
                </div>
            </div>
        </div>
    </div>

export default LogoutModal