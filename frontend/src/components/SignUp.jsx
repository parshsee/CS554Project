import React, {useContext, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {doCreateUserWithEmailAndPassword} from '../firebase/FirebaseFunctions';
import Button from '@mui/material/Button';

import { AuthContext } from '../context/AuthContext';
import SocialSignIn from './SocialSignIn';
import axios from 'axios';


function SignUp() {
  const { currentUser } = useContext(AuthContext);
  const [ pwMatch, setPwMatch] = useState('');
  const navigate = useNavigate();
  console.log("currentUser",currentUser)

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { displayName, email, passwordOne, passwordTwo } = e.target.elements;

    let nameValid = displayName.value.trim()
    if (nameValid.length === 0)
      alert(`Name cannot be an empty string or string with just spaces`);

        if(!nameValid.match(/^[a-z ,.'-]+$/gi)){
          alert(`Name shouldn't contain numbers`)
        }
        if(!(nameValid.length>1 & nameValid.length<25)){
          alert(`Name should contain atleast 2 characters and less than 26 characters`)
        }

    let emailValid = email.value.trim().toLowerCase();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(emailValid)) {
      alert("Invalid email address");
    }
    if (!emailValid.endsWith("@gmail.com")) {
      alert("Email domain must be @gmail.com");
    }
    if (!/^[^\s@]{3,}@gmail\.com$/.test(emailValid)) {
      alert("Email address must have at least 3 characters before the @gmail.com domain");
    }

    let passowrdValid = passwordOne.value
    if (!passowrdValid || passowrdValid.length < 8 || passowrdValid.includes(" ")) {
      alert(`Password must be at least 8 characters long and cannot contain empty spaces.`);
    }
    const upperCase = /[A-Z]/;
    const numberCase = /[0-9]/;
    const specialCharCase = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (
      !upperCase.test(passowrdValid) ||
      !numberCase.test(passowrdValid) ||
      !specialCharCase.test(passowrdValid)
    ) {
      alert(`Confirm Password must contain at least one uppercase character, one number, and one special character.`);
    }

    passowrdValid = passwordTwo.value
    if (!passowrdValid || passowrdValid.length < 8 || passowrdValid.includes(" ")) {
      alert(`Password must be at least 8 characters long and cannot contain empty spaces.`);
    }

    if (
      !upperCase.test(passowrdValid) ||
      !numberCase.test(passowrdValid) ||
      !specialCharCase.test(passowrdValid)
    ) {
      alert(`Password must contain at least one uppercase character, one number, and one special character.`);
    }

    if (passwordOne.value !== passwordTwo.value) {
      setPwMatch('Passwords do not match');
      alert('Passwords do not match')
      return false;
    }

    try {
      const userCreated = await doCreateUserWithEmailAndPassword(
        email.value,
        passwordOne.value,
        displayName.value
      );

      console.log('User created:', userCreated);

      const serverResponse = await axios.post('http://localhost:3000/usersData/signUpUser', {
        name: displayName.value,
        email: email.value,
        password: passwordOne.value
      });

      const insertedUserId = serverResponse.data.insertedId;
      console.log('Inserted User ID:', insertedUserId);
      if(insertedUserId){
        alert("You are now registered. Please Login to MusicMates")
        navigate('/signin');
      }

    } catch (error) {
      alert(error);
    }
  };

  // console.log("is created user", userCreated)
  // if (userCreated) {
  //   return <Navigate to='/signin' />;
  // }

  return (
    <div className='card'>
      {/* <div className='heading'>
        <h1 style={{ marginBottom: '20px' }}>Enjoy Listening Music By Signing up </h1>
      </div> */}
      <h1>Enjoy Listening Music By Signing up </h1>
      {pwMatch && <h4 className='error'>{pwMatch}</h4>}
      <form onSubmit={handleSignUp}>
        <div className='form-group'>
          {/* <label>
            Name: */}
            <br />
            <input
              className='form-control'
              required
              name='displayName'
              // type='text'
              placeholder='Enter Name'
              autoFocus={true}
            />
          {/* </label> */}
        </div>
        <br/>
        <div className='form-group'>
          {/* <label>
            Email: */}

            <input
              className='form-control'
              required
              name='email'
              type='email'
              placeholder='Enter email id'
            />
          {/* </label> */}
        </div>
        <div className='form-group'>
          {/* <label>
            Password: */}
            <br />
            <input
              className='form-control'
              id='passwordOne'
              name='passwordOne'
              type='password'
              placeholder='Enter Password'
              autoComplete='off'
              required
            />
          {/* </label> */}
        </div>
        <div className='form-group'>
          {/* <label>
            Confirm Password: */}
            <br />
            <input
              className='form-control'
              id='passwordTwo'
              name='passwordTwo'
              type='password'
              placeholder='Re-enter Password'
              autoComplete='off'
              required
            />
          {/* </label> */}
        </div>
        <br/>
        <Button 
        sx={{
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          cursor: 'pointer',
        }}
        className='button' id='submitButton' name='submitButton' type='submit'>
          Sign-Up
        </Button>
        <br/><br/>
        <Link to='/signin'>
          <Button 
          sx={{
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            cursor: 'pointer',
          }}
          variant='contained' color='secondary' type='button'>
            Already Registered? Sign In
          </Button>
        </Link>
      </form>
      <br />
      <SocialSignIn />
    </div>
  );
}

export default SignUp;