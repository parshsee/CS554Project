import React from 'react';
import  {doSocialSignIn} from '../firebase/FirebaseFunctions';
import axios from 'axios';

const SocialSignIn = () => {
  const socialSignOn = async () => {
    try {
       await doSocialSignIn();
      const user = JSON.parse(localStorage.getItem('user'));
      console.log(user);
      const userData = {
        name: user.displayName || 'Default Name',
        email: user.email
      };

      console.log("Entering user data to database");
        
      await axios.post('http://localhost:3000/usersData/signup', userData);
      await axios.post('http://localhost:3000/usersData/login', {
        email: user.email,
      });

    } catch (error) {
      alert(error);
    }
  };
  return (
    <div>
      <img
        onClick={() => socialSignOn()}
        alt='google signin'
        src='/imgs/btn_google_signin.png'
      />
    </div>
  );
};

export default SocialSignIn;
