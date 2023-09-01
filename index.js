document.addEventListener('DOMContentLoaded', function() {

  let loggedUserId = 0

 //Login form and text boxes
    const logForm = document.getElementById("login");
    const logFormEmail = document.getElementById("login-email");
    const logFormPass = document.getElementById("login-pass");

 //Create form and user boxes
    const createForm = document.getElementById("create-account");
    const createFormEmail = document.getElementById("create-email");
    const createFormPass = document.getElementById("create-pass");
    const createFormImage = document.getElementById("create-photo")

  //update form and user boxes
    const updateForm = document.getElementById("update-password");
    const updateFormEmail = document.getElementById("update-email");
    const updateFormOldPass = document.getElementById("update-oldpass");
    const updateFormNewPass = document.getElementById("update-newpass");
    const updateFormCheckNewPass = document.getElementById("update-checknewpass");

  //We will need to delete this whole div, and show the others after logging in

  const divToDelete = document.getElementById("div-to-Delete");

 //Submit Events:
  //Login 
  logForm.addEventListener("submit", event => {
    event.preventDefault();

    const logEmail = logFormEmail.value;
    const logPass = logFormPass.value;

    fetch("http://localhost:3000/users")
    .then(resp => resp.json())
    .then(allUser => {
        console.log(allUser.length);

        let userFound = false; 

        for (let i = 0; i < allUser.length; i++) {

            if (logEmail === allUser[i].user_email && logPass === allUser[i].password) {  
                
                loggedUserId = (1+i)
                userFound = true;
                break;
            }
        }
        if (!userFound) {
            alert('Incorrect Email or Password');
            logFormPass.value = "";
        } else {
          alert(`User found, ID: ${loggedUserId}`)
          logFormEmail.value = "";
          logFormPass.value = "";
          startWeb(loggedUserId);
        };
    });
  }); 

 //Submit Events:
  //Create account
  createForm.addEventListener("submit", event => {
    event.preventDefault();

    const createEmail = createFormEmail.value;
    const createPass = createFormPass.value;
    const createphoto = createFormImage.value;

    if (createEmail.trim() == "") {
      alert("You need an email");
      location.reload()
    } 
    else if (createPass.trim() == "" ) {
      alert("At least 1 character for your password");
      location.reload()
    }
    else if (createPass.trim().length < createPass.length) {
      alert("Password can not contain spaces");
      location.reload()
    } 
    
    else {
  
    fetch("http://localhost:3000/users")
    .then(resp => resp.json())
    .then(allUser => {
        console.log(allUser.length);

        let freename = true; 

        for (let i = 0; i < allUser.length; i++) {

            if (createEmail === allUser[i].user_email) {              
                freename = false;
                break;
            }
        }
        if (!freename) {
            alert('Email in already use');
            createFormEmail.value = "";
            createFormPass.value = "";
            createFormImage.value = "";
        } else {         
          const newUser = {
            id:"",
            user_email: createEmail ,
            password: createPass,
            user_photo: createphoto,
            user_music: []
          }
          fetch(`http://localhost:3000/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
            })
            .then(response => response.json())
            .then(newdataadded => {
              createFormEmail.value = "";
              createFormPass.value = "";
              createFormImage.value = "";
              alert('Account created');
            });
        };
    });
  }
  }); 

  //Submit Events:
  //Update Password
  updateForm.addEventListener("submit", event => {
    event.preventDefault();

    const updateEmail= updateFormEmail.value;
    const updateOldPass= updateFormOldPass.value;
    const updateNewPass= updateFormNewPass.value;
    const updateCheckNewPass= updateFormCheckNewPass.value;


    fetch("http://localhost:3000/users")
    .then(resp => resp.json())
    .then(allUser => {
        console.log(allUser.length);

        let userFound = false; 

        for (let i = 0; i < allUser.length; i++) {

            if (updateEmail === allUser[i].user_email && updateOldPass === allUser[i].password) {  
                
                loggedUserId = (1+i)
                userFound = true;
                break;
            }
        }
        if (!userFound) {
            alert('Incorrect Email or Old Password');
            updateFormOldPass.value = "";
            updateFormNewPass.value = "";
            updateFormCheckNewPass.value = "";
        } else {
          alert(`User and old pasword found`)   
              
          if ((updateNewPass === updateCheckNewPass) && (updateNewPass.trim() !== "") && (updateNewPass.trim().length <= updateNewPass.length)) {
          
            let userupdate = {
              password : updateNewPass
            }

            fetch(`http://localhost:3000/users/${loggedUserId}`, {
            method: 'PATCH',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(userupdate)
            })
            .then(response => {
                location.reload()
            })
          } else {
            alert('New passwords do not match')
            updateFormOldPass.value = "";
            updateFormNewPass.value = "";
            updateFormCheckNewPass.value = "";
          }          
        };
    });
  }); 

  
  //Function
  //Start Web page (when logged)
    function startWeb(a) {

    }
  
});
