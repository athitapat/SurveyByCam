import axios from 'axios';
import React, { Component, useState } from 'react';
import { textSpanContainsPosition } from 'typescript';
import { baseUrl } from '../configurations/constant';
import '../CSSsource/Uploader.css';

type UploaderProps = {
	message?: string;
};

type imgFile = {
	file: any
	imagePreviewUrl: any
}

type imgProcessedFile = {
	file: any
	imageProcessedUrl: string
}

type position = {
        "latitude_ref": string,
        "latitude": number,
        "logitude_ref": string,
        "longitude": number
}

const Uploader = (props: UploaderProps) =>{
	const [imgState, imgSetState] = useState<imgFile>({file: '',imagePreviewUrl: ''});
	const [imgProcessedState, imgPeocessedSetState] = useState<imgProcessedFile>({file: '',imageProcessedUrl: ''});
	const [textsState, textsSetState] = useState<any[]>([])
	const [posState, posSetState] = useState<any>('')

	const handleUpload =  (e) => {
		e.preventDefault();
		const fd = new FormData();
		fd.append('image', imgState.file);
		console.log('handle uploading-', imgState.file);
		const config = {
			headers: {
				'content-type': 'multipart/form-data'
			},
		};
		try{
			fetch(`${baseUrl}/image`, {
				method: "POST",
				body: fd,
			});
			alert('uploaded')
		
		}catch (err){
			console.log(err)
		}
		const source = new EventSource(`${baseUrl}/events`);
		source.onmessage = ({ data }) => {
			const dataJson = JSON.parse(data)
			console.log('New message', dataJson.position);
			
			imgPeocessedSetState({
				file: dataJson.path,
				imageProcessedUrl: dataJson.boxing_path//'../Images/testing_cropped-1641219355253_boxing.jpg'//dataJson.boxing_path
			})
			// console.log(imgProcessedState.imageProcessedUrl)
			alert('image processed');
			textsSetState(dataJson.texts)
			posSetState(dataJson.position.latitude + dataJson.position.latitude_ref + ' ' + dataJson.position.longitude + dataJson.position.longitude_ref)
			
			source.close()
			
		}

	}

	const handleImageChange = (e:React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
	  	let reader = new FileReader();
		if (e.target.files){
			let file = e.target.files[0];
			console.log(file)
			reader.onloadend = () => {
				imgSetState({
					file: file,
					imagePreviewUrl: reader.result
			});
		}
		reader.readAsDataURL(file)
		}
		imgPeocessedSetState({
			file: '',
			imageProcessedUrl: ''
		})
		textsSetState([])
		posSetState('')
	}



	let {imagePreviewUrl} = imgState;
	let $imagePreview = null;
	if (imagePreviewUrl) {
	$imagePreview = (<img src={imagePreviewUrl} />);

	} else {
	$imagePreview = (<div className="previewText">Please select an Image</div>);
	}
	// console.log($imagePreview)

	let {imageProcessedUrl} = imgProcessedState
	let $imageProcessed = null;
	
	if (imageProcessedUrl) {
		const path = process.env.PUBLIC_URL + imageProcessedUrl
		console.log('path type', typeof(path), path)
		$imageProcessed = (<img src={path}  />);
	} else {
		$imageProcessed = (<div className="previewText">Processed Image</div>);
	}
	let poscheck = posState
	let $postag = null;
	if (poscheck){
		$postag = (<div> {poscheck}</div>)
	}
	else{
		$postag = (<div></div>)
	}


	return (
	<div className="previewComponent">
		<form onSubmit={(e)=>handleUpload(e)}>
		<input className="fileInput" 
			type="file" 
			onChange={(e)=>handleImageChange(e)} />
		<button className="submitButton" 
			type="submit" 
			onClick={(e)=>handleUpload(e)}>Upload</button>
		</form>
		<div className="imgPreview">
		{$imagePreview}
		</div>
		<div className="imgBoxingPreview">
		{$imageProcessed}
		</div>
		<div className='extractedText'>
			<ul>
				{textsState.map((item)=>(
					<li>{item}</li>
				))}
			</ul>
		</div>
		<div>
			{poscheck}
		</div>
		

	</div>
	)
}


export default Uploader;