import React from 'react'


const DeleteModal = (props: any) => {
    return (
    <div className='container-fluid'>
        <div className="modal fade deleteModal" id={"deleteModal" + props.i.toString()} tabIndex={-1} aria-labelledby="deleteModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="deleteModalLabel">Delete this Recipe?</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        Are you sure you want to delete {props.r.name}?
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">No</button>
                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={() => props.onDelete(props.r)}>Yes</button>
                    </div>
                </div>
            </div>
        </div>
    </div>)
}
    


export default DeleteModal