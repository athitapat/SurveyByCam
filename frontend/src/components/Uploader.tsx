
import React, { Component, useState } from 'react';
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
	const [imgProcessedState, imgProcessedSetState] = useState<imgProcessedFile>({file: '',imageProcessedUrl: ''});
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
			
			imgProcessedSetState({
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
		imgProcessedSetState({
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
	$imagePreview = (null);
	}
	// console.log($imagePreview)

	let {imageProcessedUrl} = imgProcessedState
	let $imageProcessed = null;
	
	if (imageProcessedUrl) {
		const path = baseUrl + imageProcessedUrl
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
		
		</form>
		{ $imagePreview ? 
			<div>
			<div className="imgPreview">
				{$imagePreview}
				
			</div> 
			<button className="submitButton" 
			type="submit" 
			onClick={(e)=>handleUpload(e)}>Upload</button>
			</div>
			: null
		}
		
		{/* <div className="imgBoxingPreview">
		{$imageProcessed}
		</div> */}
		
		{ $imagePreview ?
			<div className='exteactedTextBox'>
				<ul>
					{textsState.map((item, pos)=>(
						<li key={pos}>{item[0]}</li>
					))}
				</ul>
			</div>
			: null
		}
		
		{/* <div>
			{poscheck}
		</div> */}
		

	</div>
	)
}


export default Uploader;