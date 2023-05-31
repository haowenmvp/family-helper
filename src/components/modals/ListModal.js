import React, { useState } from "react";
import { Modal,Form,Button } from "semantic-ui-react";
import {API, graphqlOperation}  from 'aws-amplify';
import { createList, updateList } from '../../graphql/mutations';
import UploadImage from "../HandleImages/UploadImage";
import { useS3 } from "../../hooks/useS3";


function ListModal({state, dispatch}){
    const [uploadToS3] = useS3();
    const [fileToUpload, setFileToUpload] = useState();

    async function saveList(){
        const imageKey = uploadToS3(fileToUpload); 
        const {title, description} = state;
        const result = await API.graphql(graphqlOperation(createList, {input:{title, description, imageKey}}));
        dispatch({type:'CLOSE_MODAL'});
        console.log('Save the data with result', result);
    }

    async function changeList(){
        const {id, title, description} = state;
        const result = await API.graphql(graphqlOperation(updateList, {input:{id, title, description}}));
        dispatch({type:'CLOSE_MODAL'});
        console.log('edit the data with result', result);
    }

    function getSelectedFile(fileName){
        setFileToUpload(fileName);
    }
    return(
    <Modal open={state.isModalOpen} dimmer='blurring'>
        <Modal.Header>{state.modalType === 'add' ? 'Create':'EDIT'} your list</Modal.Header>
            <Modal.Content>
                <Form>
                    <Form.Input label="Title" placeholder="My pretty list" error={
                        true ? false: {content:'please add a name to your list'}}
                        value={state.title}
                    onChange={(e)=> dispatch({type:"TITLE_CHANGED", value:e.target.value})}
                    ></Form.Input>
                    <Form.TextArea value={state.descritption} 
                    onChange={(e) =>dispatch({type:'DESCRIPTION_CHANGED', value:e.target.value})} label='Description' placeholder="things that my pretty lists is about"></Form.TextArea>
                    <UploadImage getSelectedFile= {getSelectedFile}/>
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button negative onClick={()=>dispatch({type:'CLOSE_MODAL'})}>Cancel</Button>
                <Button positive onClick={state.modalType === 'add' ? saveList:changeList}>{state.modalType === 'add' ? 'Save':'Update'}</Button>
            </Modal.Actions>
    </Modal>
    )
}

export default ListModal