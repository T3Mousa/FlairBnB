import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { addNewSpot } from "../../store/spots";
import './CreateSpotForm.css'

function CreateSpotForm() {
    const dispatch = useDispatch()
    // const spotData = useSelector(state => state?.spotsReducer)
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [country, setCountry] = useState('')
    const [lat, setLat] = useState(90)
    const [lng, setLng] = useState(180)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [previewImageUrl, setPreviewImageUrl] = useState('')
    const [image1Url, setImage1Url] = useState('')
    const [image2Url, setImage2Url] = useState('')
    const [image3Url, setImage3Url] = useState('')
    const [image4Url, setImage4Url] = useState('')

    const [errors, setErrors] = useState({})
    const history = useHistory()

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({})

        const spotInfo = {
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price,
            imagesArray: [
                previewImageUrl,
                image1Url,
                image2Url,
                image3Url,
                image4Url
            ]
        };

        let errorsObj = {}
        if (!country) errorsObj.country = "Country is required"
        if (!address) errorsObj.address = "Address is required"
        if (!city) errorsObj.city = "City is required"
        if (!state) errorsObj.state = "State is required"
        if (!lat) errorsObj.lat = "Latitude is required"
        if (!lng) errorsObj.lng = "Longitude is required"
        if (description.length < 30) errorsObj.description = "Description needs a minimum of 30 characters"
        if (!name) errorsObj.name = "Name is required"
        if (!price) errorsObj.price = "Price is required"
        if (!previewImageUrl) errorsObj.previewImageUrl = "Preview image is required."
        if (previewImageUrl && (!previewImageUrl.endsWith('.png') && !previewImageUrl.endsWith('.jpg') && !previewImageUrl.endsWith('.jpeg'))) errorsObj.previewImageUrl = "Image URL must end in .png, .jpg, or .jpeg"
        if (image1Url && !image1Url.endsWith('.png') && !image1Url.endsWith('.jpg') && !image1Url.endsWith('.jpeg')) errorsObj.image1Url = "Image URL must end in .png, .jpg, or .jpeg"
        if (image2Url && !image2Url.endsWith('.png') && !image2Url.endsWith('.jpg') && !image2Url.endsWith('.jpeg')) errorsObj.image2Url = "Image URL must end in .png, .jpg, or .jpeg"
        if (image3Url && !image3Url.endsWith('.png') && !image3Url.endsWith('.jpg') && !image3Url.endsWith('.jpeg')) errorsObj.image3Url = "Image URL must end in .png, .jpg, or .jpeg"
        if (image4Url && !image4Url.endsWith('.png') && !image4Url.endsWith('.jpg') && !image4Url.endsWith('.jpeg')) errorsObj.image4Url = "Image URL must end in .png, .jpg, or .jpeg"


        // let newSpot = await dispatch(addNewSpot(spotInfo, spotInfo.imagesArray));
        // console.log(newSpot?.country)
        // console.log(newSpot.id)
        if (Object.values(errorsObj).length) {
            // console.log(errorsObj)
            setErrors(errorsObj)
        } else {
            // history.push('/')
            let newSpot = await dispatch(addNewSpot(spotInfo, spotInfo.imagesArray));
            history.push(`/spots/${newSpot?.id}`);
        }

    }

    return (
        <form className="createSpotForm" onSubmit={handleSubmit}>
            {/* <div className="createSpotForm"> */}
            <div className="heading">
                <h2>Create a New Spot</h2>
                <h3>Where's your spot located?</h3>
                <p>Guests will only get your exact address once they booked a reservation.</p>
            </div>
            {/* <div className="country"> */}
            <label>Country <span className='errors'>{errors.country && `${errors.country}`}</span>
                <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Country"
                />
            </label>
            {/* </div> */}
            {/* <div className="address"> */}
            <label>Street Address <span className='errors'>{errors.address && `${errors.address}`}</span>
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Address"
                />
            </label>
            {/* </div> */}
            <div className="cityState">
                <label className="city">City <span className='errors'>{errors.city && `${errors.city}`}</span>
                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="City"
                    />
                </label>

                <label className="state">State <span className='errors'>{errors.state && `${errors.state}`}</span>
                    <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="STATE"
                    />
                </label>
            </div>
            <div className="latLong">
                <label>Latitude  <span className='errors'>{errors.lat && `${errors.lat}`}</span>
                    <input
                        type="number"
                        defaultValue={90}
                        onChange={(e) => setLat(e.target.defaultValue)}
                        placeholder="Latitude"
                    />
                </label>
                <label>Longitude  <span className='errors'>{errors.lng && `${errors.lng}`}</span>
                    <input
                        type="number"
                        defaultValue={180}
                        onChange={(e) => setLng(e.target.defaultValue)}
                        placeholder="Longitude"
                    />
                </label>
            </div>
            <hr className="sectionDivider" />
            <div className="description">
                <h3>Describe your place to guests</h3>
                <p>
                    Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.
                </p>
                <label>
                    <textarea
                        className="descriptionBox"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Please write at least 30 characters"
                    />
                </label>
                <span className='errors'>{errors.description && `${errors.description}`}</span>
            </div>
            <hr className="sectionDivider" />
            <div className="name">
                <h3>Create a title for your spot</h3>
                <p>
                    Catch guests' attention with a spot title that highlights what makes your place special.
                </p>
                <label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name of your spot"
                    />
                    <span className='errors'>{errors.name && `${errors.name}`}</span>
                </label>
            </div>
            <hr className="sectionDivider" />
            <div className="price">
                <h3>Set a base price for your spot</h3>
                <p>
                    Competitive pricing can help your listing stand out and rank higher in search results.
                </p>
                <label>
                    $ <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Price per night (USD)"
                    />
                </label>
                <span className='errors'>
                    {errors.price && `${errors.price}`}
                </span>
            </div>
            <hr className="sectionDivider" />
            <div className="images">
                <h3>Liven up your spot with photos</h3>
                <p>
                    Submit a link to at least one photo to publish your spot.
                </p>
                <label>
                    <input
                        type='text'
                        value={previewImageUrl}
                        onChange={(e) => setPreviewImageUrl(e.target.value)}
                        placeholder="Preview Image Url"
                    />
                    <span className='errors'>
                        {errors.previewImageUrl && `${errors.previewImageUrl}`}
                    </span>
                    <input
                        type='text'
                        value={image1Url}
                        onChange={(e) => setImage1Url(e.target.value)}
                        placeholder="Image Url"
                    />
                    <span className='errors'>
                        {errors.image1Url && `${errors.image1Url}`}
                    </span>
                    <input
                        type='text'
                        value={image2Url}
                        onChange={(e) => setImage2Url(e.target.value)}
                        placeholder="Image Url"
                    />
                    <span className='errors'>
                        {errors.image2Url && `${errors.image2Url}`}
                    </span>
                    <input
                        type='text'
                        value={image3Url}
                        onChange={(e) => setImage3Url(e.target.value)}
                        placeholder="Image Url"
                    />
                    <span className='errors'>
                        {errors.image3Url && `${errors.image3Url}`}
                    </span>
                    <input
                        type='text'
                        value={image4Url}
                        onChange={(e) => setImage4Url(e.target.value)}
                        placeholder="Image Url"
                    />
                    <span className='errors'>
                        {errors.image4Url && `${errors.image4Url}`}
                    </span>
                </label>
            </div>
            <hr className="sectionDivider" />

            <button className="createSpotButton" type='submit'>Create Spot</button>
            {/* </div > */}
        </form >
    )
}

export default CreateSpotForm;
