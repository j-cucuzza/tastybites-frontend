import React from 'react'


const FavoriteModal = (props: any) => {
    return (
    <div className='container-fluid'>
        <div className="modal fade favoriteModal" id={"favoriteModal" + props.i.toString()} tabIndex={-1} aria-labelledby="favoriteModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="favoriteModalLabel">Removing A Favorite?</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        Are you sure you want to remove this recipe? This type of recipe is not made by users, you might not be able to find it easily again.
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">No</button>
                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={() => props.onFavorite(props.r.recipe_id, props.r.api)}>Yes</button>
                    </div>
                </div>
            </div>
        </div>
    </div>)
}
    


export default FavoriteModal