import React, { useContext } from 'react';
import SocialSignIn from './SocialSignIn';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { doPasswordReset, doSignInWithEmailAndPassword } from '../firebase/FirebaseFunctions';
import Button from '@mui/material/Button';

function SignIn() {
  const { currentUser } = useContext(AuthContext);

  const handleLogin = async (event) => {
    event.preventDefault();
    let { email, password } = event.target.elements;

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

    let passowrdValid = password.value
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
      alert(`Password must contain at least one uppercase character, one number, and one special character.`);
    }

    try {
      await doSignInWithEmailAndPassword(email.value, password.value);
      await axios.post('http://localhost:3000/usersData/login', {
        email: email.value,
      });

      // console.log('login server response:', serverResponse);
      // await client.set('userId', JSON.stringify(serverResponse.data)); // assuming you have userId defined somewhere
    } catch (error) {
      alert(error);
    }
  };

  const passwordReset = (event) => {
    event.preventDefault();
    let email = document.getElementById('email').value;
    if (email) {
      doPasswordReset(email);
      alert('Password reset email was sent');
    } else {
      alert('Please enter an email address below before you click the forgot password link');
    }
  };

  if (currentUser) {
    return <Navigate to='/dashboard' />;
  }

  return (
    <div>
      <div className='card'>
        <h1>Log-In to Music Mates</h1>
        <form className='form' onSubmit={handleLogin}>
          <div className='form-group'>
            <label>
              Email Address:
              <br />
              <input
                className='form-control'
                name='email'
                id='email'
                type='email'
                placeholder='Email'
                required
                autoFocus={true}
              />
            </label>
          </div>
          <br />
          <div className='form-group'>
            <label>
              Password:
              <br />
              <input
                className='form-control'
                name='password'
                type='password'
                placeholder='Password'
                autoComplete='off'
                required
              />
            </label>
          </div>

          <br/>
          <Button className='button' type='submit'>
            Log in
          </Button>

          <Button className='forgotPassword' onClick={passwordReset}>
            Forgot Password
          </Button>
        </form>

        <br />
        <Link to='/signup'>
          <Button 
          sx={{
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            cursor: 'pointer',
          }}
          variant='contained' color='secondary' type='button'>
            Not a Member? Sign Up
          </Button>
        </Link>
        <br/>
        <br/>
        <SocialSignIn />
      </div>
    </div>
  );
}

export default SignIn;
