// select inputs
const submitBtn = document.querySelector('.submit-btn');
const name = document.querySelector('#name');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const number = document.querySelector('#number');
const tac = document.querySelector('#terms-and-cond');
const notification = document.querySelector('#notification');

submitBtn.addEventListener('click', () => {
    if(name.value.length < 3){
        showAlert('Name must be 3 letters long.');
    } else if(!email.value.length){
        showAlert('Enter your email.');
    } else if(!password.value.length) {
        showAlert('Password should be 8 letters long.');
    } else if(!number.value.length) {
        showAlert('Enter your phone number.');
    } else if(Number(number.value) || number.value.length < 10 ) {
        showAlert('Invalid number, please enter valid one.');
    } else if(tac.checked) {
        showAlert('You must agree to our Terms and Conditions.');
    }
})

// alert function
const showAlert = (msg) => {
    let alertBox = document.querySelector('.alert-box');
    let alertMsg = document.querySelector('.alert-bmsg');
    alertMsg.innerHTML = msg;
    alertBox.classList.add('show');
    setTimeout(() => {
        alertBox.classList.remove('show');
    }, 3000);
}