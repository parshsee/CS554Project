import { users } from "../config/mongoCollection.js";
import bcrypt from "bcrypt";
import validator from '../validation.js';
import { ObjectId } from "mongodb";

const signUpUser = async (name, email, password) => {
    console.log("signupuser")
    // name = validator.validName(name, 'Name');
    // email = validator.checkString(email, 'Email');
    // email = validator.validateEmailId(email);
    // password = validator.checkString(password, 'Password');
    // password = validator.validPassword(password);
    // confirmPassword = validator.checkString(confirmPassword, 'Confirm Password')
    // confirmPassword = validator.validPassword(confirmPassword);

    const salt = await bcrypt.genSalt(10);
    const passwords = await bcrypt.hash(password, salt);
    // const confirmPasswords = await bcrypt.hash(confirmPassword, salt);
    
    // if (password !== confirmPassword) {
    //   throw 'Password and Confirm password should match'
    // }

    const userCollection = await users();

    // const user = await userCollection.findOne({email: email})
    // if(user){
    //   throw `You are already registered. Please login to MusicMates.`
    // }
    let info = {
      name: name,
      email: email,
      password:passwords
    };

    const insertInfo = await userCollection.insertOne(info);
    return insertInfo
  };

const createUser = async (name, email) => {
    // if(!helper.validName(name)){
    //    throw [400,"Name provided is not valid"]
    // }
    // if(!helper.validUserName(username)){
    //    throw [400,"Username is not valid! The username must be alphanumeric and at least 5 characters long."]
    // }
    // if(!helper.validPassword(password)){
    //    throw [400,"Password is not valid! The password should be 8 characters minimum, with at least one lowercase letter, one uppercase letter, one number and one special character contained in it."]
    // }
    const allUsers = await getAllUsers();
    //  if (allUsers.length !== 0) {
    //    allUsers.forEach((user) => {
    //      if (user.username === helper.trimString(username))
    //        throw [400,"An account is already created with the provided username"];
    //    });
    //  }
     
    //  const hashedPassword = await bcryptjs.hash(password, saltRounds);
     let newUser = {
       name:name,
       email:email,
       password: ""       
     }
     const userCollection = await users();
     const insertInfo = await userCollection.insertOne(newUser);
     if (insertInfo.insertedCount === 0) throw [500,"Could not add user."];
   
     const newId = insertInfo.insertedId;
     const userDetail = await getUserById(newId.toString());
   
     return userDetail;
   };

const getAllUsers = async () => {
    const userCollection = await users();
    const userList = await userCollection.find({}).toArray();
    if (userList.length === 0) return [];
    return userList;
};
  
const getUserById = async (id) => {
    
    id = id.trim();
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: new ObjectId(id) });
    if (!user) throw [404,"user with that id does not exist"];
    return user;
};

const getUserByEmailForLogin = async (email) => {
    
  const userCollection = await users();
  const user = await userCollection.findOne({ email: email });
  
  
  return user;
};

const getUserByEmail = async (email) => {
    
    const userCollection = await getAllUsers();;
    let user = null;

    userCollection.forEach(user => {
        if(user.email == email){
            return user;
        }
    });
    console.log("User Found");
    
    return user;
};

export{
    signUpUser,
    createUser,
    getAllUsers,
    getUserById,
    getUserByEmailForLogin,
    getUserByEmail
}