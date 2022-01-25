import React, { useCallback, useContext, useRef, useState } from "react";
import { apiKey } from "../configurations/apikey";
import { GoogleMap, InfoWindow, Marker, useLoadScript } from "@react-google-maps/api"
import { baseUrl, libraries } from "../configurations/constant";
import { nodeModuleNameResolver } from "typescript";
import { Imagetextgps } from "../interfaces/imagetextgps";




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
                    position = {{lat: marker.position.latitude, lng: marker.position.longitude}}
                onClick ={ () => {
                    setSelected(marker)
                    //console.log(selected)
                }}
                />
            ))}
        
            {selected ? (
                <InfoWindow
                    position={{lat:selected.position.latitude, lng:selected.position.longitude}}
                    onCloseClick = {() => {
                        setSelected(null);
                    }}
                >
                    <div>
                        <p>{selected.raw_text}</p>
                        <p>{selected.date_saved}</p>
                        <p>{selected.date_taken}</p>
                    </div>
                </InfoWindow>
            ) : null }


        </GoogleMap>
        <Search panTo = {panTo} setMarkers = {setMarkers}/>
    </div>
          
};

function Search({panTo, setMarkers}){
    const [newKeyword, setNewKeyword] = useState<string>('');
    const [nodes, setNodes] = useState([]);

    const handleNewKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        setNewKeyword(e.target.value)
        //console.log(newKeyword)
        if (newKeyword.length>0){
            fetch(`${baseUrl}/search/${newKeyword}`)
                .then(res => res.json())
                .then(nodes=>{
                    setNodes(nodes)
                })
        }
    };

    const handleSubmit = (node) =>{
        
        
        
        const marksPos = nodes.map(node =>{
            return {
                id: node.id,
                lat: node.position.latitude,
                lng: node.position.longitude
            }
        })
        const markPos1 = node 
        //console.log(markPos1)
        panTo({
            lat: markPos1.position.latitude,
             lng: markPos1.position.longitude})
        setMarkers(nodes)
    
        //console.log(nodes)
    };

    return (
        <div>
            <div>
                Search: <input value = {newKeyword} onChange={handleNewKeywordChange}/><br />
                
            </div>
            <div>
                {
                nodes.map(node => {
                    return (
                        <a href='#'>
                           <div >
                            {node.raw_text}
                            
                            <button onClick={ () =>{handleSubmit(node)}}>submit</button>
                            </div> 
                        </a>
                        
                    )
                })
                }
            </div>
    </div>
    )
}

export default Map;