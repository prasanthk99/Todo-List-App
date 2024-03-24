import { useEffect, useRef, useState } from 'react';
import '../Assets/styles/todolist.css';

function Todolist() {
 const [todolists, setTodolists] = useState([]);
 const [updateMode, setUpdateMode] = useState(false);
 const [selectedId, setSelectedId] = useState(0);


 const todoinput = useRef("");

 const fetchTodoList = ()=>{
    fetch('https://jsonplaceholder.typicode.com/todos')
    .then((response) => response.json())
    .then((json) => {console.log(json);setTodolists(json)});
 }

 useEffect(()=>{
    fetchTodoList();
    console.log(todolists)
 },[])

 //Function to Add Item
 function addItem(e){
  e.preventDefault();
  const value = todoinput.current.value;
  if(value!=""){
    fetch('https://jsonplaceholder.typicode.com/todos', {
      method: 'POST',
      body: JSON.stringify({
        title: value,
        body: 'add Item',
        userId: 1,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
    .then((response) => response.json())
    .then((json) =>   setTodolists((prevLists)=>[json,...prevLists]));
    todoinput.current.value="";
  }else{
    console.error("Error: Input cannot be Empty.");
  }
 }

 //Function to Delete Item
 function deleteItem(id){
  fetch('https://jsonplaceholder.typicode.com/todos/'+id, {
    method: 'DELETE',
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Failed to delete item with ID ${id}`);
    }
    // Filter out the deleted item from the state
    setTodolists((prevLists) => prevLists.filter((item) => item.id !== id));
  })
  .catch((error) => {
    console.error(error);
  });

  if(updateMode && selectedId==id){
    setUpdateMode(false);
    todoinput.current.value="";
  }

 }

 //Function to Select Item to update
 function selectedItem(id){
  setSelectedId(id);
  setUpdateMode(true);
  const selectedItem = todolists.find((item) => item.id === id);
  // Pre-fill the update input with the current title
  todoinput.current.value = selectedItem.title;
 }

 //Function to Update Item
 function updateItem(e){
  e.preventDefault();
  const updatedTitle = todoinput.current.value;
  if(updatedTitle!=""){
    fetch(`https://jsonplaceholder.typicode.com/todos/${selectedId}`, {
      method: 'PUT',
      body: JSON.stringify({
        title: updatedTitle,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
    .then((response) => {
      // Update the state with the modified item
      setTodolists((prevLists) =>
        prevLists.map((item) =>
          item.id === selectedId ? { ...item, title: updatedTitle } : item
        )
      );
      todoinput.current.value="";
      setUpdateMode(false);
    })
    .catch((error) => {
      console.error(error);
    });
  }else{
    console.error("Error: Input cannot be Empty.");
  }
 }

  return (
    <div className="Todolist">
      <h1>Todolist</h1>
      <form className='todolist-form'>
        <input placeholder='add item' ref={todoinput} required/>
        {!updateMode?(
          <button onClick={addItem} type='submit'>Add Item</button>
        ):
        (
          <button onClick={updateItem} type='submit'>Update Item</button>
        )}
      </form>
      <div className='lists'>
        {todolists.map((list)=>(
          <div className='todoCard' key={list.id}>
            <h3>{list.title}</h3>
            <div className='card-btn'>
              <button onClick={()=>selectedItem(list.id)}>Update</button>
              <button onClick={()=>deleteItem(list.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Todolist;
