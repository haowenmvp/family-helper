import './App.css';
import {Amplify, API, graphqlOperation}  from 'aws-amplify';
import awsConfig from './aws-exports';
import {AmplifyAuthenticator, AmplifySignOut} from '@aws-amplify/ui-react-v1';
import {listLists} from  "./graphql/queries";
import { useEffect, useReducer, useState } from 'react';
import 'semantic-ui-css/semantic.min.css';
import MainHeader from './components/headers/MainHeader';
import Lists from './components/Lists/Lists';
import ListModal from './components/modals/ListModal';
import { Button, Container, Icon } from 'semantic-ui-react';
import { deleteList } from './graphql/mutations';
import { onCreateList, onDeleteList, onUpdateList} from './graphql/subscriptions';
Amplify.configure(awsConfig);





function App() {


  const [lists, setLists] = useState([]);
  
  const initialState = {
    id:'',
    title: '',
    description:'',
    lists:[],
    isModalOpen:false,
    modalType:''
  }
  
  function listReducer(state=initialState, action){
    let newList;
    switch(action.type){
      case 'DESCRIPTION_CHANGED':
        return {...state, description:action.value};
      case 'TITLE_CHANGED':
        return {...state, title:action.value};
      case 'UPDATE_LIST':
        return {...state, lists:[action.value, ...state.lists]};
      case 'OPEN_MODAL':
        return {...state, isModalOpen:true, modalType:'add'};
      case 'CLOSE_MODAL':
        return {...state, isModalOpen:false, title:'', description:'', id:''};
      case 'DELETE_LIST':
        deleteListByid(action.value);
        console.log(action.value);
        return {...state};
      case 'DELETE_LIST_RESULT':
        newList = state.lists.filter(item => item.id !== action.value);
        return {...state, lists:newList}; //什么意思
      case 'UPDATE_LIST_RESULT':
        const index = state.lists.findIndex(item => item.id === action.value.id);
        newList = [...state.lists];
        delete action.value.children;
        delete action.value.listItems;
        newList[index] = action.value;
        console.log('update value hahahah');
        console.log(newList[index]);
        console.log(lists);
        return {...state, lists:newList};
      case 'EDIT_LIST':
        const newValue = {...action.value};
        delete newValue.children;
        delete newValue.listItems;
        delete newValue.dispatch;
        console.log(newValue);
        console.log('iamking');
        return {...state, isModalOpen:true, title: newValue.title, description:newValue.description, modalType:'edit', id:newValue.id};
      default:
        console.log("Default action for:", action);
        return state;
    }
  }
  
  async function deleteListByid(id){
    console.log('what the fuck');
    const result = await API.graphql(graphqlOperation(deleteList, {input:{id}}));
    console.log('deleted', result);
  }
  
  const [state, dispatch] = useReducer(listReducer, initialState);

  async function fetchList(){
    const {data} = await API.graphql(graphqlOperation(listLists));
    setLists(data.listLists.items);
    console.log(data)
  }

  useEffect(() => {
    fetchList();
  }, []); 


  useEffect(() => {
    const createListSub = 
    API
    .graphql(graphqlOperation(onCreateList))
    .subscribe({
      next:({provider, value}) => {
        console.log(value);
        console.log('update some value');
        console.log([value.data.onCreateList]);
        dispatch({type:'UPDATE_LIST', value:[value.data.onCreateList]});
      },
    });
    const updateListSub = 
    API
    .graphql(graphqlOperation(onUpdateList))
    .subscribe({
      next:({provider, value}) => {
        console.log(value);
        console.log('update some value');
        console.log([value.data.onUpdateList]);
        dispatch({type:'UPDATE_LIST_RESULT', value:[value.data.onUpdateList]});
      },
    });
    const deleteListSub = 
    API
    .graphql(graphqlOperation(onDeleteList))
    .subscribe({
      next:({provider, value}) => {
        console.log(value);
        console.log('detele some value');
        dispatch({type:'DELETE_LIST_RESULT', value:value.data.onDeleteList.id});
      },
    });
    return () => {
      createListSub.unsubscribe();
      deleteListSub.unsubscribe();
      updateListSub.unsubscribe();
    }
  },[]);


  return (
    <AmplifyAuthenticator>
      
      <Container style={{height: '100vh'}}>
        <AmplifySignOut />
        <Button className='floatingButton' onClick={() => dispatch({type:'OPEN_MODAL'})}>
          <Icon name='plus' className='floatingButton_icon'/>
        </Button>
        <div className="App">
          <MainHeader />
          <Lists lists = {lists} dispatch={dispatch}/> 
        </div> 
      </Container>
      <ListModal state={state} dispatch={dispatch} />
    </AmplifyAuthenticator>
  );
}

export default App;
