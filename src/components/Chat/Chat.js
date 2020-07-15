import React,{useState,useEffect} from "react";
import ReactDOM from "react-dom";
import queryString from 'query-string';
import io from 'socket.io-client';

import './Chat.css';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from "../Messages/Messages";
import TextContainer from "../TextContainer/TextContainer";

let socket;
const Chat = ({ location }) => {
  const[name,setName]=useState('');
  const[room,setRoom]=useState('');
  const [users, setUsers] = useState('');
  const[message,setMessage]=useState('');
  const[messages,setMessages]=useState([]);
  const ENDPOINT='https://reactjs-chatting-application.herokuapp.com/'

useEffect(() => {
const {name,room}=queryString.parse(location.search)

socket=io(ENDPOINT)
setName(name);
setRoom(room);

socket.emit('join',{name,room},(error)=>{
  if(error){
    alert(error);
  }
});

return ()=>{
  socket.emit('disconnect');

  socket.off();
}

},[ENDPOINT,location.search]);

useEffect(()=>{
  socket.on('message',(message) =>{
     setMessages(messages =>[...messages,message])
  });
  socket.on("roomData", ({ users }) => {
    setUsers(users);
  });
  
},[]);

const sendMessage = (event) =>{
  event.preventDefault();
  
  if(message){
    socket.emit('sendMessage',message,() => setMessage(''));
  }
}
console.log(message,messages);


  return (
    <div className="outerContainer">
      <div className='container'>
      <InfoBar room={room}/>
      <Messages messages={messages} name={name}/>
      <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      <input type="file" id="img_file"
name="img_file" accept="image/x-png,image/gif,image/jpeg"
files={file} onChange={e => {
setFile(e.target.files[0])
setPlaceholder(e.target.files[0].name)
}} />
      </div>
      <TextContainer users={users}/>
    </div>
  );
};
export default Chat;
