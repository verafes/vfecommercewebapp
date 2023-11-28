const setupSlidingEffect = () => {
    const productContainers = [...document.querySelectorAll('.product-container')];
    const nxtBtn = [...document.querySelectorAll('.nxt-btn')];
    const preBtn = [...document.querySelectorAll('.pre-btn')];

    productContainers.forEach((item, i) => {
        let containerDimensions = item.getBoundingClientRect();
        let containerWidth = containerDimensions.width;

        nxtBtn[i].addEventListener('click', () => {
            item.scrollLeft += containerWidth;
        })

        preBtn[i].addEventListener('click', () => {
            item.scrollLeft -= containerWidth;
        })
    })
};

//fetching product cards
const getProducts = (tag) => {
    return fetch('/get-products', {
        method: "post",
        headers: new Headers({"Content-Type": "application/json"}),
        body: JSON.stringify({tag: tag})
    })
        .then(res => res.json())
        .then(data => {
            return data;
        })
}

// create product slider
const createProductSlider = (data, parent, title) => {
    let slideContainer = document.querySelector(`${parent}`);

    slideContainer.innerHTML += `
    <section class="product">
        <h2 class="product-category">${title}</h2>
        <button class="pre-btn"><img src="../img/arrow.png" alt=""></button>
        <button class="nxt-btn"><img src="../img/arrow.png" alt=""></button>
        ${createProductCards(data)}
    </section>
    `
    setupSlidingEffect();
}

const createProductCards = (data, parent) => {
    // here parent is for search product
    let start = '<div class="product-container">';
    let middle = ''; // this will contain card HTML
    let end = '</div>';

    for(let i= 0; i < data.length; i++){
        let imgSrc = data[i].images && data[i].images.length > 0 ? data[i].images[0] : '../img/no-image.png';

        if(data[i].id != decodeURI(location.pathname.split('/').pop())) {
            middle += `
            <div class="product-card">
                <div class="product-image">
                    <span class="discount-tag">${data[i].discount || '20'}% off</span>
                    <img src="${imgSrc}" class="product-thumb" alt="" onclick="location.href = '/products/${data[i].id}'">
                    <button class="card-btn wishlist-btn" onclick="add_product_to_cart_or_wishlist(
                        'wishlist', ${JSON.stringify(data[i]).replace(/"/g, '&quot;')})">Add to Wishlist</button>
                    <button class="card-btn cart-btn" onclick="location.href = '/products/${data[i].id}'">Add to Cart</button>
                </div>
                <div class="product-info" onclick="location.href = '/products/${data[i].id}'">
                    <h2 class="product-brand">${data[i].name || 'Brand Name'}</h2>
                    <p class="product-short-des">${data[i].shortDes || 'Short Description'}</p>
                    <span class="price">$${data[i].sellPrice || '80'}</span><span class="actual-price">$${data[i].actualPrice || '120'}</span>

                </div>
            </div>
            `
        }
    }

    if(parent) {
        let cardContainer = document.querySelector(parent);
        cardContainer.innerHTML = start + middle + end;
    } else {
        return start + middle + end;
    }
}

// Function to update item count
const updateItemCount = (type, index, newCount) => {
    const itemCounterElements = document.querySelectorAll('.item-counter');
    const countErrorMsg = document.querySelector('.count-error-msg');

    if (index >= 0 && index < itemCounterElements.length) {
        const itemCountElement = itemCounterElements[index].querySelector('.item-count');

        if (itemCountElement) {
            itemCountElement.textContent = newCount;
            countErrorMsg.style.display = 'none';
        } else {
            console.error('item-count element not found');
        }
    }
};

const add_product_to_cart_or_wishlist = (type, product, size) => {
    let data = JSON.parse(localStorage.getItem(type));
    if(data == null) {
        data = [];
    }

    const existingProductIndex = data.findIndex((item) => {
        return item.name === product.name;
    });

    if (existingProductIndex !== -1 ) {
        // Product exists in cart
        const existingProduct = data[existingProductIndex];

        if (existingProduct.item < 10) { // Check if count is less than 10 before incrementing
            existingProduct.item++;
            updateItemCount(existingProductIndex, existingProduct.item);
            localStorage.setItem(type, JSON.stringify(data));
            return `Add to ${type}`;
        } else {
            console.log('Count exceeds the limit (10)');
            updateItemCount(existingProductIndex, existingProduct.item); // Update count display even when limit is reached
            const countErrorMsg = document.querySelector('.count-error-msg');
            countErrorMsg.textContent = `You can only add 10 amount of this item to your ${type}.`;
            countErrorMsg.style.display = 'block';
            return `Add to ${type}`;
        }
    }
    if (type === 'cart') {
        const sizeButtons = document.querySelectorAll('input[type="radio"][name="size"]');
        let sizeSelected = false;
        let selectedSize;
        sizeButtons.forEach((button) => {
            if (button.checked) {
                sizeSelected = true;
                selectedSize = button.value;
            }
            return selectedSize;
        });

        const errorMsg = document.querySelector('.size-error-msg');
        if (!sizeSelected) {
            errorMsg.style.display = 'block';
            return `Add to ${type}`;
        } else {
            sizeSelected = true;
            errorMsg.style.display = 'none';
        }
    }
    product = {
        item: 1,
        name: product.name,
        sellPrice: product.sellPrice,
        size: size || null,
        shortDes: product.shortDes,
        image: product.images[0]
    }
    data.push(product);
    localStorage.setItem(type, JSON.stringify(data));
    return 'Added';
}