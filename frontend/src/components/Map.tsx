import React, { useCallback, useContext, useRef, useState } from "react";
import { apiKey } from "../configurations-secret/apikey";
import { GoogleMap, InfoWindow, Marker, useLoadScript } from "@react-google-maps/api"
import { baseUrl, libraries } from "../configurations/constant";
import '../CSSsource/Search.css'
import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
} from "@reach/combobox"
import "@reach/combobox/styles.css"



const mapContainerStyle = {
    width: '100vw',
    height: '100vh',
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
            // @ts-ignore
            mapRef.current.setZoom(17);
            
    }, []);
    
    if (loadError) return null//"Error loading maps";
    if(!isLoaded) return null//"Loading Maps";

    return <div>

        <Search panTo = {panTo} setMarkers = {setMarkers} setSelected = {setSelected}/>
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
                        <div className="imgPopUpContainer">
                            <img src={`${baseUrl}${selected.boxing_path}`} className = "imgPopUp"></img>
                        </div>
                        
                        <p>{selected.raw_text}</p>
                        <p>saved date {selected.date_saved}</p>
                        <p>taken date {selected.date_taken}</p>
                    </div>
                </InfoWindow>
            ) : null }


        </GoogleMap>
        
        
    </div>
          
};

function Search({panTo, setMarkers, setSelected}){
    const [newKeyword, setNewKeyword] = useState<string>('');
    const [nodes, setNodes] = useState([]);
    const [detailVisible, setDetailVisible] = useState<boolean>(false)

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
        else{
            setNodes([])
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
        setSelected(markPos1)
    
        //console.log(nodes)
    };

    function  getHighlightedText(text, highlight) {
        // Split on highlight term and include term into parts, ignore case
        const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
        return (
            <div>
                <span> { parts.map((part, i) => 
                    <span key={i} style = {part.toLowerCase() === highlight.toLowerCase() ? {color: "red"} : {} }>
                         { part }
                    </span>)
                    }       
                </span>;
            </div>
        )
    }

    function getHeaderText(text, highlight){
        // Split on highlight term and include term into parts, ignore case
        const texts = text.split(new RegExp(` `, 'gi'));
        const headers = texts.filter(eachText =>{
            //console.log(eachText.raw_text.toLowerCase().includes(obj.toLowerCase()))
            return eachText.toLowerCase().includes(highlight.toLowerCase())
          }) 
        return (
            <div>
                <h3>{headers.map((header, i) => <span key = {i}>{header} </span>)}</h3>
            </div>
        )
    }

    const handleDetailVisibleToggle = () =>{
        if(!detailVisible){
            setDetailVisible(true)
        }else {
            setDetailVisible(false)
        }
    }

    return (
        <div className="searchBox">
            <Combobox
                onSelect={(address)=>{
                    console.log(address);
                }}
            >
                <ComboboxInput 
                    value={newKeyword}
                    onChange = {handleNewKeywordChange}
                    placeholder = "Search..."
                />
                <div>
                    <ComboboxPopover>
                        <div className="results">
                        {
                            nodes.map(node => {
                                return (    
                                    <a href="#" onClick={()=>{handleSubmit(node)}} className ="resultBlock">
                                        <div key={node.id} className = "card" >
                                            {getHeaderText(node.raw_text, newKeyword)}
                                            <a>{node.address}</a>
                                        <div className="imgResultContainer">
                                            <img  src={`${baseUrl}${node.boxing_path}`} className = "imgResult"/>
                                        </div>
                                        
                                        <button onClick={ handleDetailVisibleToggle}>
                                            {!detailVisible ? 'more detail': 'less detail'}
                                        </button>
                                        { detailVisible &&
                                            (
                                                <p>{getHighlightedText(node.raw_text, newKeyword)}</p>
                                            )
                                        }
                                        </div>  
                                    </a>
                                )
                            })
                        }
                        </div>
                    </ComboboxPopover>
                </div>
                
                
            </Combobox>
        </div>
        
            
            
        // <div>
        //     <div >
        //         Search: <input value = {newKeyword} onChange={handleNewKeywordChange}/><br />
                
        //     </div>
        //     <div className="scroll-div">
        //         <div className="results">
        //             {
        //             nodes.map(node => {
        //                 return (       
        //                         <div key={node.id} className = "card" >
        //                             <a href="#" onClick={()=>{handleSubmit(node)}}>
        //                                 {getHeaderText(node.raw_text, newKeyword)}
        //                             </a>
        //                         <a>{node.address}</a>
        //                             <button onClick={ handleDetailVisibleToggle}>
        //                                 {!detailVisible ? 'more detail': 'less detail'}
        //                             </button>
        //                             { detailVisible &&
        //                                 (
        //                                     <p>{getHighlightedText(node.raw_text, newKeyword)}</p>
        //                                 )
        //                             }
        //                         </div>  
        //                 )
        //             })
        //             }
        //         </div>    
        //     </div>
            
        // </div>
    )
}

export default Map;