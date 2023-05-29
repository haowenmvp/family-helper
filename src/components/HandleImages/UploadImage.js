import { Storage } from "aws-amplify";
import React, { useEffect, useRef, useState } from "react";
import { Button, Image, Header } from "semantic-ui-react";

function UploadImage(){
    const inputRef = useRef();
    const [image, setImage] = useState("https://react.semantic-ui.com/images/wireframe/image.png");
    const [fileName, setFileName] = useState();
    useEffect(() => {
        if(!fileName) return;
        const [file, extension] = fileName.name.split('.');
        const mimeType = fileName.type;
        const key = 'images/lists/'+file+'.'+extension;    
        const result = Storage.put(key, fileName, {
            contentType: mimeType,
            metadata:{
                app: 'family helper',
            },
        });
        console.log(result);
    },[fileName]);  
    function handleInputChange(e){
        const fileToUpload = e.target.files[0];
        if (!fileToUpload) return;
        const fileSampleUrl = URL.createObjectURL(fileToUpload);
        console.log(fileSampleUrl);
        setImage(fileSampleUrl);
        setFileName(fileToUpload);

    }
    return(
        <>
        <Header as="h4">Upload your image</Header>
        <Image size="large" src={image} />
        <input 
        ref={inputRef}
        type='file' 
        onChange={handleInputChange} 
        className='hide'/>
        <Button onClick={() => inputRef.current.click()} className="mt-1">Upload Image</Button>
        </>
    );
}

export default UploadImage;