
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import { AuthContext } from '../context/AuthContext';
import '../App.css';
import CreateRoomModal from './createRoomModal';
import axios from 'axios';
import SignOut from './SignOut'; 


function Dashboard() {
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleModalClose = () => {
    setModalOpen(false);
  };
  const { currentUser } = useContext(AuthContext);

  console.log('my current user set is:::')
  console.log(currentUser)
  const [accessToken, setAccessToken] = useState(undefined);
  const [loading, setLoading] = useState(false);

  const [roomCode, setRoomCode] = useState('');

  const handleRoomCodeChange = (event) => {
    setRoomCode(event.target.value);
  };

  const handleJoinRoom = async () => {
    // Implement the logic to join the room using the room code
    console.log('go to room detail')
    

    try {
      const response = await axios.get(`http://localhost:3000/rooms/${roomCode}`);
  const room = response.data;
  console.log('room is::::')
  console.log(room)

  
  navigate(`/rooms/${roomCode}`);
  



  } catch (error) {
      console.log(error)
      alert(error)
  }
    
  };

  const handleCreateRoom = () => {
    // Implement the logic to create a new room
    console.log('create room button tapped')
    setModalOpen(true);
  };


  const spotifySignOn = async () => {
    try {
      const { data } = await axios.get('http://localhost:3000/users/login');
      window.location.href = data;
      setLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  const spotifyLogout = async () => {
    try {
      const { data } = await axios.get('http://localhost:3000/usersData/logout');
      //setAccessToken(undefined);
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const urlAccessToken = urlSearchParams.get('access_token');
    setAccessToken(urlAccessToken);

    if (!urlAccessToken) {
      spotifySignOn();
    }
  }, []); 

  useEffect(() => {
    if (accessToken) {
      window.localStorage.setItem('access_token', accessToken);
    }
  }, [accessToken]);

  return (
    <div className='card'>
      <h1>Music Mates</h1>
      <h2>Welcome back, {currentUser && currentUser.displayName}!</h2>
      <p>It's great to see you again.</p>
      <Button className="create-room-button" onClick={handleCreateRoom}>Create Room</Button>
      <CreateRoomModal currentUser={currentUser} isOpen={isModalOpen} onClose={handleModalClose} />
      <div className="room-code-input">
        <label>Have a room code? Join a room with it:</label>
        <input type="text" value={roomCode} onChange={handleRoomCodeChange} />
        <Button onClick={handleJoinRoom}>Join</Button>
      </div>
      
      <h2>
        Hello {currentUser && currentUser.displayName}, this is the Protected Home page
      </h2>
      {/* {!accessToken && (
        <img
          onClick={() => spotifySignOn()}
          alt='spotify signin'
          src='/imgs/btn_spotify_signin.png'
        />
      )} */}
      {accessToken && (
        <>
          <h5>Wanna Logout? Click Below</h5>
          {/* <img
            onClick={() => spotifyLogout()}
            alt='spotify signin'
            src='/imgs/btn_spotify_logout.png'
          /> */}
          <SignOut />
        </>
      )}
      
    </div>
  );
}

export default Dashboard;