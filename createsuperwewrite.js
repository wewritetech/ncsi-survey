const prompt = require('prompt-sync')({sigint: true});
const validator = require('validator');
const bcrypt = require('bcrypt');
const db = require('./config/db');
const User = require('./models/users.model');


const getEmail = async () => {
  let email = prompt('Email: ');

  const [userExists] = await User.findByEmail(email);

  if (email == '') {
    getEmail();
  }

  if (!validator.isEmail(email)) {
    console.log('Invalid email');
    email = getEmail();
  }

  if (userExists.length > 0) {
    console.log('Email already in use');
    email = getEmail();
  }
  
  // let value = email;

  return email;
}

const getPassword = () => {
  let password = prompt('Password: ', {echo: '*'});

  if (password == '') {
    password = getPassword();
  }

  if (!validator.isStrongPassword(password)) {
    console.log('Password must be 8 characters or more and must include uppercase and lowercase letters, at least a number and a symbol');
    password = getPassword();
  }

  const getconfirmPassword = (password) => {
    let confirmPassword = prompt('Confirm Password: ', {echo: '*'});
    if (password !== confirmPassword) {
        console.log('Passwords do not match');
        getconfirmPassword(password);
    }
  }

  getconfirmPassword(password);

  return password; 
}

const createSuperUser = async () => {
  let email = await getEmail();
  let password = getPassword();    

  const user = await User.save(email, await bcrypt.hash(password, 12), 'WEWRITE');

  console.log('WeWrite Superuser successfully created...');
    
  return process.exit();
}

createSuperUser();

