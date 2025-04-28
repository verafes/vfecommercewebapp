window.onload = () => {
    if(!user) {
        location.replace('/login');
    }
}

const placeOrderBtn = document.querySelector('.place-order-btn');
const uniqueId = Date.now() % 1000000;
placeOrderBtn.addEventListener('click', () => {
    let address = getAddress();
    const today = new Date();
    const formattedDate = today.toISOString();
    if (address) {
        fetch('/order', {
            method: 'post',
            headers: new Headers({'Content-Type': 'application/json'}),
            body: JSON.stringify({
                id: uniqueId,
                order: JSON.parse(localStorage.cart),
                email: JSON.parse(sessionStorage.user).email,
                address: address,
                orderDate: formattedDate
            })
        }).then(res => res.json())
            .then(data => {
                if(data.alert === 'Your order is placed'){
                    delete localStorage.card;
                    localStorage.removeItem('cart');
                    showAlert(data.alert, 'success');
                    setTimeout(() => {
                        window.location.href = '/mail';
                    }, 3000);
                } else {
                    showAlert(data.alert, 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showAlert('An error occurred while placing the order', 'error');
            });
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