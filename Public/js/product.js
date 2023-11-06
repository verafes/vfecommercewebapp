const productImages = document.querySelectorAll(".product-images img");
const productImageSlide = document.querySelector(".image-slider");

let activeImageSlide = 0;

productImages.forEach((item, i) => {
    item.addEventListener('click', () => {
        productImages[activeImageSlide].classList.remove('active');
        item.classList.add('active');
        productImageSlide.style.backgroundImage = `url('${item.src}')`;
        activeImageSlide = i;
    })
})

// toggle size button

const sizeBtns = document.querySelectorAll('.size-radio-btn');
let checkedBtn = 0; //current selected button
let size;

sizeBtns.forEach((item, i) => {
    item.addEventListener('click', () => {
        sizeBtns[checkedBtn].classList.remove('check');
        item.classList.add('check');
        checkedBtn = i;
        size = item.innerHTML;
    })
})

const setData = (data) => {
    let title = document.querySelector('.title');

    // setup the image
    productImages.forEach((img, i) => {
        if(data.images[i]) {
            img.src = data.images[i];
        } else {
            img.style.display = 'none';
        }
    })
    productImages[0].click();

    //setup size buttons
    sizeBtns.forEach(item => {
        if (!data.sizes.includes(item.innerHTML)){
            item.style.display = 'none';
        }
    })

    //setting up texts
    const name = document.querySelector('.product-brand');
    const shortDes = document.querySelector('.detail-short-des');
    const des = document.querySelector('.des');

    title.innerHTML += name.innerHTML = data.name;
    shortDes .innerHTML = data.des;
    des.innerHTML = data.des;

    // pricing
    const sellPrice = document.querySelector('.product-price')
    const actualPrice = document.querySelector('.product-actual-price')
    const discount = document.querySelector('.product-discount')

    sellPrice.innerHTML = `$${data.sellPrice}`;
    actualPrice.innerHTML = `$${data.sellPrice}`;
    discount.innerHTML = `( ${data.discount}% off )`;

    // wishlist and card button
    const wishListButton = document.querySelector('.wishlist-btn');
    wishListButton.addEventListener('click', () => {
        wishListButton.innerHTML = add_product_to_card_ot_wishlist('wishlist', data);
    })

    const cardBtn = document.querySelector('.card-btn');
    cardBtn.addEventListener('click', () => {
        cardBtn.innerHTML = add_product_to_card_ot_wishlist('cart', data);
    })
 }

//Fetch data
const fetchProductData = () => {
    fetch('/get-products', {
        method: 'post',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify({id: productID})
    })
    .then(res => res.json())
    .then(data => {
        setData(data);
        getProducts(data.tags[1])
        .then(data => createProductSlider(
            data, '.container-for-card-slider', 'similar product')
        )
    })
    .catch(err => {
        // location.replace('/404');
    });
}

let productID = null;
if (location.pathname != '/products') {
    productID = decodeURI(location.pathname.split('/').pop());
    console.log(productID);
    fetchProductData();
}
