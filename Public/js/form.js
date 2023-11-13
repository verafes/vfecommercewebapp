window.onload = () => { // redirect to home page if user is logged in
    if (sessionStorage.user) {
        user = JSON.parse(sessionStorage.user);
        if (compareToken(user.authToken, user.email)) {
            location.replace('/');
        }
    }
}

const loader = document.querySelector('.loader');
// select inputs
const submitBtn = document.querySelector('.submit-btn');
const name = document.querySelector('#name') || null;
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const number = document.querySelector('#number') || null;
const tac = document.querySelector('#terms-and-cond') || null;
const notification = document.querySelector('#notification') || null;

submitBtn.addEventListener('click', () => {
    if (name != null) { //sign in page
        if(name.value.length < 3){
            showAlert('Name must be 3 letters long.');
        } else if(!email.value.length){
            showAlert('Please enter your email.');
        } else if (!/^\S+@\S+\.\S+$/.test(email.value)) {
            showAlert('Invalid email address. Please enter a valid one.');
        } else if(!password.value.length) {
            showAlert('Password should be 8 letters long.');
        } else if(!number.value.length) {
            showAlert('Please enter your phone number.');
        } else if(isNaN(number.value) || number.value.length < 10 ) {
            showAlert('Invalid phone number, please enter a valid one.');
        } else if(!tac.checked) {
            showAlert('Please agree to our Terms and Conditions.');
        } else {
            // submit form
            loader.style.display = 'block';
            sendData('/signup', {
                name: name.value,
                email: email.value,
                password: password.value,
                number: number.value,
                tac: tac.checked,
                notification: notification.checked,
                seller: false
            })
        }
    } else {
        // login page
        if(!email.value.length || !password.value.length){
            showAlert('Please fill out all the inputs.');
        } else if (!/^\S+@\S+\.\S+$/.test(email.value)) {
            showAlert('Invalid email address.');
        } else {
            loader.style.display = 'block';
            sendData('/login', {
                email: email.value,
                password: password.value
            })
        }
    }
})

