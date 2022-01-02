import React, { Component, useState } from 'react';
import '../CSSsource/Uploader.css';

type UploaderProps = {
	message?: string;
};

type imgFile = {
	file: File
	imagePreviewUrl: any
}

const Uploader = (props: UploaderProps) =>{
	const [state, setState] = useState<imgFile>({file: '',imagePreviewUrl: ''});


	const handleSubmit = (e:React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
 	  // TODO: do something with -> this.state.file
		alert(e.target.files)
 		console.log('handle uploading-', state.file);
	}

	const handleImageChange = (e:React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
  
	  	let reader = new FileReader();
		if (e.target){
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

  
	//reader.readAsDataURL(file)

	let {imagePreviewUrl} = state;
	let $imagePreview = null;
	if (imagePreviewUrl) {
	$imagePreview = (<img src={imagePreviewUrl} />);
	} else {
	$imagePreview = (<div className="previewText">Please select an Image</div>);
	}

	return (
	<div className="previewComponent">
		<form onSubmit={(e)=>handleSubmit(e)}>
		<input className="fileInput" 
			type="file" 
			onChange={(e)=>handleImageChange(e)} />
		<button className="submitButton" 
			type="submit" 
			onClick={(e)=>handleSubmit(e)}>Upload</button>
		</form>
		<div className="imgPreview">
		{$imagePreview}
		</div>
	</div>
	)
	


}

// class Uploader extends React.Component {
// 	constructor(props) {
// 	  super(props);
// 	  this.state = {file: '',imagePreviewUrl: ''};
// 	}
  
// 	_handleSubmit(e) {
// 	  e.preventDefault();
// 	  // TODO: do something with -> this.state.file
// 	  console.log('handle uploading-', this.state.file);
// 	}
  
// 	_handleImageChange(e) {
// 	  e.preventDefault();
  
// 	  let reader = new FileReader();
// 	  let file = e.target.files[0];
  
// 	  reader.onloadend = () => {
// 		this.setState({
// 		  file: file,
// 		  imagePreviewUrl: reader.result
// 		});
// 	  }
  
// 	  reader.readAsDataURL(file)
// 	}
  
// 	render() {
// 	  let {imagePreviewUrl} = this.state;
// 	  let $imagePreview = null;
// 	  if (imagePreviewUrl) {
// 		$imagePreview = (<img src={imagePreviewUrl} />);
// 	  } else {
// 		$imagePreview = (<div className="previewText">Please select an Image</div>);
// 	  }
  
// 	  return (
// 		<div className="previewComponent">
// 		  <form onSubmit={(e)=>this._handleSubmit(e)}>
// 			<input className="fileInput" 
// 			  type="file" 
// 			  onChange={(e)=>this._handleImageChange(e)} />
// 			<button className="submitButton" 
// 			  type="submit" 
// 			  onClick={(e)=>this._handleSubmit(e)}>Upload</button>
// 		  </form>
// 		  <div className="imgPreview">
// 			{$imagePreview}
// 		  </div>
// 		</div>
// 	  )
// 	}
//   }

export default Uploader;