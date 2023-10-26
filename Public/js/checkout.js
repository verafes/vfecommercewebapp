window.onload = () => {
    if(!sessionStorage.user){
        location.replace('/login');
    }
}

const placeOrderBtn = document.querySelector('.place-order-btn');
placeOrderBtn.addEventListener('click', () => {
    let address = getAddress();
    if (address) {
        fetch('/order', {
            method: 'post',
            headers: new Headers({'Content-Type': 'application/json'}),
            body: JSON.stringify({
                order: JSON.parse(localStorage.cart),
                email: JSON.parse(sessionStorage.user).email,
                add: address,
            })
        }).then(res => res.json())
            .then(data => {
                // alert(data);
                if(data.alert == 'Your order is placed'){
                    delete localStorage.card;
                    showAlert((data.alert, 'success'));

                } else {
                    showAlert((data.alert));
                }
            })
    }
})

const getAddress = () => {
    //validation
    let address = document.querySelector('#address').value;
    let street = document.querySelector('#street').value;
    let city = document.querySelector('#city').value;
    let state = document.querySelector('#state').value;
    let zipcode = document.querySelector('#zipcode').value;
    let country = document.querySelector('#country').value;

    if(!address.length || !street.length || !city.length || !state.length || !zipcode.length || !country.length) {
        showAlert('Fill all the inputs first please');

    } else {
        return {address, street, city, state, zipcode, country};
    }
}