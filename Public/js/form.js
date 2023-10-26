const loader = document.querySelector('.loader');
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
        showAlert('Please enter your email.');
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
})

// send data function
const sendData = (path, data) => {
    fetch(path, {
        method: 'post',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify(data)
    }).then((res) => res.json())
        .then(response => {
            console.log(response);
            processData(response);
        })
}

const processData = (data) => {
    loader.style.display = null;
    if(data.alert) {
        showAlert(data.alert);
    } else if (data == true) {
        console.log(data);
        location.reload();
    }
};
// alert function
const showAlert = (msg) => {
    let alertBox = document.querySelector('.alert-box');
    let alertMsg = document.querySelector('.alert-msg');
    alertMsg.innerHTML = msg;
    alertBox.classList.add('show');
    setTimeout(() => {
        alertBox.classList.remove('show');
    }, 3000);
}