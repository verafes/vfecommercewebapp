const createNav = () => {
    let nav = document.querySelector('.navbar');

    nav.innerHTML = `
        <div class="nav">
            <a href="/">
                <img src="img/logo-green.png" class="brand-logo" alt="">
            </a>
            <div class="nav-items">
                <div class="search">
                    <input type="text" class="search-box" placeholder="search brand product">
                    <button class="search-btn" data-search-btn-id="search-btn" onclick="window.location.href = '/search'">search</button>
                </div>
                <a href="#"><img src="img/user.png" alt=""></a>
                <a href="/cart"><img src="img/cart.png" alt=""></a>
            </div> 
        </div>
        <ul class="links-container">
            <li class="link-item"><a href="/" class="link">home</a></li>
            <li class="link-item"><a href="/women" class="link">women</a></li>
            <li class="link-item"><a href="/men" class="link">men</a></li>
            <li class="link-item"><a href="/accessories" class="link">accessories</a></li>
            <li class="link-item"><a href="#footer-about" class="link">about</a></li>
        </ul>
    `;
}

createNav();

// login functionality

const userImageButton = document.querySelector('#user-img');
const userPopup = document.querySelector('.login-logout-popup');
const popuptext = document.querySelector('.account-info');
const actionBtn = document.querySelector('#user-btn');

userImageButton.addEventListener('click', () => {
    userPopup.classList.toggle('hide');
})

window.onload = () => {
    let user = JSON.parse(sessionStorage.user || null);
    if(user != null) {
        popuptext.innerHTML = `log in as, ${user.name}`;
        actionBtn.innerHTML = 'log out';
        actionBtn.addEventListener('click', () => {
            sessionStorage.clear();
            location.reload();
        })
    } else {
        //user is logged out
        popuptext.innerHTML = 'log in to place order';
        actionBtn.innerHTML = 'log in';
        actionBtn.addEventListener('click', () => {
            location.href = '/login';
        })
    }
}
// search box

const searchBtn = document.querySelector('.search-btn');
const searchBox = document.querySelector('.search-box');
searchBtn.addEventListener('click', () => {
    if(searchBox.value.length) {
        location.href = `/search/${searchBox.value}`;
    }
})

