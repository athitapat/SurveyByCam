import React, { useContext, useState } from "react";
import { apiKey } from "../configurations/apikey";
import { GoogleMap, withScriptjs, withGoogleMap, Marker } from "react-google-maps"
import { baseUrl } from "../configurations/constant";
import { nodeModuleNameResolver } from "typescript";
import { Imagetextgps } from "../interfaces/imagetextgps";

function Map() {

    return (
        <GoogleMap 
            defaultZoom={15} 
            defaultCenter={{lat: 13.851070, lng:100.577710}}
        >
        <Marker 
        position = {{
                    lat: 13.851070,
                    lng: 100.577710
                }}
        />
        {/* {nodes.map(pos => (
            <Marker 
                key = {pos.id}
                position = {{
                    lat: pos.position.latitude,
                    lng: pos.position.longitude
                }}
            />
        ))} */}
        </GoogleMap>
    )
}

const WrappedMap = withScriptjs(withGoogleMap(Map));


const Search = () => {
    
    const [newKeyword, setNewKeyword] = useState<string>('');
    const [nodes, setNodes] = useState<any>([{
        position : {
            latitude: 13.851070,
            longitude: 100.577710
        }
    },]);

    

    const handleNewKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        setNewKeyword(e.target.value)
    };

    const handleSubmit = () =>{
        fetch(`${baseUrl}/search/${newKeyword}`)
            .then(res => res.json())
            .then(nodes=>{
                setNodes(nodes)
            })
        console.log(nodes)
    };

    return (
        <div>
            <div style={{width: '50vw', height: '50vh'}}>
            <WrappedMap 
                    googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,place&key=${apiKey}`}
                    loadingElement={<div style = {{height: "100%"}} />}
                    containerElement={<div style = {{height: "100%"}} />}
                    mapElement={<div style = {{height: "100%"}} />}
                />

            
            </div>
            <div>
                Search: <input value = {newKeyword} onChange={handleNewKeywordChange}/><br />
                <button onClick={handleSubmit}>submit</button>
            </div>
            
        </div>
    )
}

export default Search;