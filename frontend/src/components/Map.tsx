import React, { useCallback, useContext, useRef, useState } from "react";
import { apiKey } from "../configurations/apikey";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api"
import { baseUrl } from "../configurations/constant";
import { nodeModuleNameResolver } from "typescript";
import { Imagetextgps } from "../interfaces/imagetextgps";



const libraries = ["places"];
const mapContainerStyle = {
    width: '50vw',
    height: '50vh',
}
const center  = {
    lat: 13.851070,
    lng: 100.577710
}

const Map = () => {
    
    const {isLoaded, loadError} = useLoadScript({
        googleMapsApiKey: apiKey,
        // @ts-ignore
        libraries,
        

    });

    const [markers, setMarkers] = useState([]);
    const [selected, setSelected] = useState(null);

    const mapRef = useRef();
    const onMapLoad = useCallback((map) => {
        mapRef.current = map;
    }, []);
    const panTo = useCallback(({lat, lng}) => {
        if (mapRef.current)
            // @ts-ignore
            mapRef.current.panTo({lat,lng}); 
            
    }, []);
    
    if (loadError) return null//"Error loading maps";
    if(!isLoaded) return null//"Loading Maps";

    return <div>
        <GoogleMap 
        mapContainerStyle={mapContainerStyle}
        zoom ={15}
        center = {center}
        onLoad = {onMapLoad}
        >
            {markers.map(marker => (
                <Marker
                    key = {marker.id}
                    position = {{lat: marker.lat, lng: marker.lng}}
                />
            ))}
        </GoogleMap>
        <Search panTo = {panTo} setMarkers = {setMarkers}/>
    </div>
          
};

function Search({panTo, setMarkers}){
    const [newKeyword, setNewKeyword] = useState<string>('');
    const handleNewKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        setNewKeyword(e.target.value)
        console.log(newKeyword)
        if (newKeyword.length>0){
            fetch(`${baseUrl}/search/${newKeyword}`)
                .then(res => res.json())
                .then(nodes=>{
                    console.log(nodes)
                })
        }
    };

    const handleSubmit = () =>{
        
        
        panTo({lat: 13.851070,
            lng: 100.677710})
        setMarkers([{id:1,lat: 13.851070,
            lng: 100.677710}, {id:2,lat: 13.861070,
                lng: 100.677710}])
        //console.log(nodes)
    };
    return (
        <div>
        Search: <input value = {newKeyword} onChange={handleNewKeywordChange}/><br />
        <button onClick={handleSubmit}>submit</button>
    </div>
    )
}

export default Map;