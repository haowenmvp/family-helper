import { Storage } from 'aws-amplify';
import {v4 as uuidv4} from 'uuid'
export function useS3(){
    function savetoS3(fileName) {
        if(!fileName) return;
        const [file, extension] = fileName.name.split('.');
        const mimeType = fileName.type;
        const key = 'images/lists/'+file+'_'+uuidv4()+'.'+extension;    
        const result = Storage.put(key, fileName, {
            contentType: mimeType,
            metadata:{
                app: 'family helper',
            },
        });
        console.log(result);
        return key;
    } 
    return [savetoS3];
}