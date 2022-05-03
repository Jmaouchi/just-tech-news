// this function will handle yhe login 
async function loginFormHandler(event) {
  event.preventDefault();

  const email = document.querySelector('#email-login').value.trim();
  const password = document.querySelector('#password-login').value.trim();

  if (email && password) {
    // this data will go directly to the api/users/login endpoint and then we have to have a post request in the backend as well, that will
    // get the data and try to post it to  the database, and fineOne that has the same data in the database.
    // if yes the backend we decide what te return, an HTML templete or json data (most of the time if its a login, it will resnder an html
    // page to get them logged in.) 
    const response = await fetch('/api/users/login', {
      method: 'post',
      body: JSON.stringify({
        email,
        password
      }),
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
      document.location.replace('/');
    } else {
      alert(response.statusText);
    }
  }
}


// // this function will handle yhe signUp to a new account 
async function signupFormHandler(event) {
  event.preventDefault();

  const username = document.querySelector('#username-signup').value.trim();
  const email = document.querySelector('#email-signup').value.trim();
  const password = document.querySelector('#password-signup').value.trim();

  if (username && email && password) {
    // this will send data to the api/users route that will store it in the users table, this will work cause we do have an api in the backend
    // that is made for storing that data in the db and sending data response to the user with a get request 
    const response = await fetch('/api/users', {
      method: 'post',
      body: JSON.stringify({
        username,
        email,
        password
      }),
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
      // if the response if OK then send them back the HTML templet with their infos 
      document.location.replace('/');
    } else {
      alert(response.statusText);
    }
  }
}

document.querySelector('.login-form').addEventListener('submit', loginFormHandler);

document.querySelector('.signup-form').addEventListener('submit', signupFormHandler);
