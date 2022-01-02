import axios from 'axios';
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

const Uploader = (props: UploaderProps) =>{
	const [state, setState] = useState<imgFile>({file: '',imagePreviewUrl: ''});


	const handleUpload =  (e:React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		const fd = new FormData();
		fd.append('image', state.file, state.imagePreviewUrl);
		
		const config = {
			headers: {
				'content-type': 'multipart/form-data'
			},
		};
		try{
			fetch(`http://localhost:3000/image`, {
				method: "POST",
				body: fd,
			});
			
		}catch (err){
			console.log(err)
		}

		// axios.post(`${baseUrl}/image?file`, fd, config)
		// 	.then(res => {
		// 		alert('uploaded')
		// 		console.log(res);
		// 	});

 		console.log('handle uploading-', state.file);
	}

	const handleImageChange = (e:React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
	  	let reader = new FileReader();
		if (e.target.files){
			let file = e.target.files[0];
	
			reader.onloadend = () => {
				setState({
					file: file,
					imagePreviewUrl: reader.result
			});
		}
		reader.readAsDataURL(file)
		}
	}

	let {imagePreviewUrl} = state;
	let $imagePreview = null;
	if (imagePreviewUrl) {
	$imagePreview = (<img src={imagePreviewUrl} />);
	} else {
	$imagePreview = (<div className="previewText">Please select an Image</div>);
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
	</div>
	)
}


export default Uploader;