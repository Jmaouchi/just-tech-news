
// this fetch will send some data to the /api/users/login endpoint and then in the backend there is another post method to check if what we sent is true or not,
// if its true then it will send a OK response, if the response is ok (means checked the email and password correctly) in the fetch request, then document.location.replace with whatever you 
// want to show them. also make sure  that in the backed post method to while its checking if the email is correct and password, add another method to save the session
// in the handlebars we can add a if login statement to show them some html they need to see 
async function loginFormHandler(event) {
  event.preventDefault();

  const email = document.querySelector('#email-login').value.trim();
  const password = document.querySelector('#password-login').value.trim();

  if (email && password) {
    const response = await fetch('/api/users/login', {
      method: 'post',
      body: JSON.stringify({
        email,
        password
      }),
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
      document.location.replace('/dashboard')
    } else {
      alert(response.statusText);
    }
  }
}


// // this fetch will send some data to the /api/users endpoint and then in the backend there is another post method to create a new user.
// in this case, we also have a method that will save the session and log the user in after he signup, then send them the template back, so he can add a comment 
async function signupFormHandler(event) {
  event.preventDefault();

  const username = document.querySelector('#username-signup').value.trim();
  const email = document.querySelector('#email-signup').value.trim();
  const password = document.querySelector('#password-signup').value.trim();
  // if the user provides all the infos, then do the post fetch 
  if (username && email && password) {
    // post the data to this endpoint to create an account, and in the backend it will be the another post to post the data to the database with a create methode
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
      // after the account is been created, reffer them to another page 
      document.location.replace('/dashboard')
    } else {
      alert(response.statusText);
    }
  }
}



document.querySelector('.login-form').addEventListener('submit', loginFormHandler);

document.querySelector('.signup-form').addEventListener('submit', signupFormHandler);
