import React, { useEffect, useState } from 'react'
import { useJsApiLoader, GoogleMap } from "@react-google-maps/api"
const GoogleMapsModal = (props) => {
    const [lat, setLat] = useState(props.lat || 28.698997);
    const [lng, setLng] = useState(props.lng || 77.138420);
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
    })

    const handlePos = (e) => {
        setLat(e.latLng.lat());
        setLng(e.latLng.lng());
    }

    useEffect(() => {
        props?.onChange({ lat, lng })
    }, [lat, lng])
    if (!isLoaded) {
        return <h1>Loading Maps.....</h1>
    }
    return (
        <div style={{ paddingBottom: "1rem" }}>
            <GoogleMap center={{ lat, lng }} zoom={15} mapContainerStyle={{ width: "100%", height: "500px" }} onClick={e => handlePos(e)}>
            </GoogleMap>
        </div>
    )
}

export default GoogleMapsModal