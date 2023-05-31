import { Storage } from "aws-amplify";
import React, { useEffect, useState } from "react";
import { Item, Icon, Dimmer, Image, Loader } from "semantic-ui-react";

function List(props){
    const {id, title,description, imageKey, createdAt, dispatch} = props;
    const [imageurl, setImageUrl] =  useState(
        "https://react.semantic-ui.com/images/wireframe/image.png"
    )

    const [isLoading, setisLoading] = useState(true);
    async function fetchImageurl(){
        const imageUrl = await Storage.get(imageKey);
        setImageUrl(imageUrl);
        setisLoading(false);
    }

    useEffect(()=>{
        if(imageKey){
            return fetchImageurl();
        }
        setisLoading(false);
    },[]);
    const content = <Loader/>
    return (
        <Item>
            <Dimmer.Dimmable dimmed={isLoading} dimmer={{active:isLoading, content}} as={Image} size='tiny' src={imageurl}></Dimmer.Dimmable>
            {/* <Item.Image size="tiny" src={imageurl}/> */}
            <Item.Content>
                <Item.Header>{title}</Item.Header>
                <Item.Description>{description}</Item.Description>
                <Item.Extra>
                    {new Date(createdAt).toDateString()}
                    <Icon name='edit' className="ml-3" onClick={() => dispatch({type:'EDIT_LIST', value:props})}/>
                    <Icon name='trash' onClick={() => dispatch({type:'DELETE_LIST', value:id})}/>
                </Item.Extra>
            </Item.Content>
        </Item>
    );
}

export default List;