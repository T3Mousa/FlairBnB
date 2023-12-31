import { csrfFetch } from "./csrf";
import { getSpotDetails } from "./spotDetails";
import { getAllSpots } from "./spots";

const GET_USER_SPOTS = "userSpots/GET_USER_SPOTS"
const REMOVE_SPOT = "userSpots/REMOVE_SPOT"
const UPDATE_SPOT = "userSpots/UPDATE_SPOT"
const UPDATE_SPOT_IMAGE = "userSpots/UPDATE_SPOT_IMAGE"

const userSpots = (spots) => ({
    type: GET_USER_SPOTS,
    spots
})

const removeSpot = (spotId) => ({
    type: REMOVE_SPOT,
    spotId,
});

const updateSpot = (spot) => ({
    type: UPDATE_SPOT,
    spot
})

const updateSpotImages = (spot, images) => ({
    type: UPDATE_SPOT_IMAGE,
    spot,
    images
})

export const getUserSpots = (user) => async (dispatch) => {
    const response = await csrfFetch('/api/spots/current-user')

    const userSpotData = await response.json()
    console.log(user)
    console.log(userSpotData)
    const userSpotDataArray = userSpotData.Spots
    console.log(userSpotDataArray)
    dispatch(userSpots(userSpotDataArray))
}

export const deleteSpot = (spotId) => async (dispatch) => {
    console.log(spotId)
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE'
    });
    // const spot = await response.json()
    dispatch(removeSpot(spotId))
}

export const editSpot = (spotData, imageData) => async (dispatch) => {
    spotData.lat = 90
    spotData.lng = 180
    const response = await csrfFetch(`/api/spots/${+spotData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(spotData)
    });
    if (response.ok) {
        const updatedSpot = await response.json()
        dispatch(addUpdatedSpotImages(updatedSpot, imageData))
        console.log(updatedSpot)
        console.log(imageData)
        return updatedSpot
    }
}

export const addUpdatedSpotImages = (spot, images) => async (dispatch) => {
    // const [...{ url, preview }] = images
    spot.SpotImages = []
    console.log(images, "this is the images array")
    if (images.length) {
        for (let i = 0; i < images.length; i++) {

            if (images[i] !== '') {
                const response = await csrfFetch(`/api/spots/${spot.id}/images`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        url: images[i],
                        preview: false
                    })
                });
                const newImageInfo = await response.json()
                spot.SpotImages.push(newImageInfo)
            }
        }
        console.log(spot.SpotImages)
    }
    if (spot.id) {
        dispatch(updateSpot(spot))
        dispatch(getSpotDetails(spot.id))
        return spot.id
    }
}


const initialState = {}

const userSpotsReducer = (state = initialState, action) => {
    let newState = { ...state }
    switch (action.type) {
        case GET_USER_SPOTS:
            let userSpotsState = {}
            action.spots.forEach((spot) => userSpotsState[spot.id] = spot)
            // console.log(action.spots)
            return userSpotsState;
        case REMOVE_SPOT:
            delete newState[action.spotId];
            return newState;
        case UPDATE_SPOT:
            newState[action.spot.id] = { ...newState[action.spot.id], ...action.spot.id }
            return newState
        default:
            return newState;
    }
}

export default userSpotsReducer;
