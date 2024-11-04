const setupSlidingEffect = () => {
    const sliderContainers = document.querySelectorAll('.slider-container');

    sliderContainers.forEach(container => {
        const productContainer = container.querySelector('.product-container');
        const nxtBtn = container.querySelector('.nxt-btn');
        const preBtn = container.querySelector('.pre-btn');

        if (productContainer && nxtBtn && preBtn) {
            let containerDimensions = productContainer.getBoundingClientRect();
            let containerWidth = containerDimensions.width;

            nxtBtn.addEventListener('click', () => {
                productContainer.scrollLeft += containerWidth;
            });

            preBtn.addEventListener('click', () => {
                productContainer.scrollLeft -= containerWidth;
            });
        }
    });
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

// Create slider or products cards with combined data
const createMultiTagsCardsAndSliders = (tagArr, parent, title) => {
    const processedProducts = new Set();
    const promises = tagArr.map(tag => getProducts(tag));

    Promise.all(promises)
        .then(dataArray => {
            const combinedData = [].concat(...dataArray); // Combine fetched data
            // Filter out duplicates based on product ID
            const uniqueData = combinedData.filter(product => {
                if (!processedProducts.has(product.id)) {
                    processedProducts.add(product.id);
                    return true;
                }
                return false;
            });
            const section = document.querySelector(parent);
            const sectionClass = section ? section.classList.contains('card-container') ? 'card-container' : 'slider-container' : null;
            if (sectionClass === 'card-container') {
                createProductCards(uniqueData, parent, title);
            } else if (sectionClass === 'slider-container') {
                createProductSlider(uniqueData, parent, title);
            }
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });
};

// create product slider
const createProductSlider = (data, parent, title) => {
    let slideContainer = document.querySelector(`${parent}`);

    slideContainer.innerHTML += `
    <section class="product">
        <h2 class="product-category">${title}</h2>
        <button class="pre-btn" aria-label="Previous" type="button" ><img src="../img/arrow.png" alt="Previous"></button>
        <button class="nxt-btn" aria-label="Next" type="button" ><img src="../img/arrow.png" alt="Next"></button>
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

        if(data[i].id !== decodeURI(location.pathname.split('/').pop())) {
            middle += `
            <div class="product-card">
                <div class="product-image">
                    <span class="discount-tag">${data[i].discount || '20'}% off</span>
                    <img src="${imgSrc}" class="product-thumb" aria-label="product images" alt="${data[i].name}" onclick="location.href = '/products/${data[i].id}'">
                    <button class="card-btn wishlist-btn" role="button" type="submit" onclick="add_product_to_cart_or_wishlist(
                        'wishlist', ${JSON.stringify(data[i]).replace(/"/g, '&quot;')})">Add to Wishlist</button>
                    <button class="card-btn cart-btn" type="button" onclick="location.href = '/products/${data[i].id}'">Add to Cart</button>
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
const countErrorMsg = document.querySelector('.count-error-msg');
const updateItemCount = (type, index, newCount) => {
    const itemCounterElements = document.querySelectorAll('.item-counter');

    if (index >= 0 && index < itemCounterElements.length) {
        const itemCountElement = itemCounterElements[index].querySelector('.item-count');
        console.log("! itemCountElement el", itemCountElement)
        if (itemCountElement) {
            itemCountElement.textContent = newCount;
            countErrorMsg.style.display = 'none';
        } else {
            console.error('item-count element not found');
        }
    }
};

const add_product_to_cart_or_wishlist = (type, product, size) => {
    console.log("product", product, size)
    let data = JSON.parse(localStorage.getItem(type));
    if(data == null) {
        data = [];
    }
    console.log("data in", type, data)

    // select size
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
        // display warning msg of selecting size
        const errorMsg = document.querySelector('.size-error-msg');
        if (!sizeSelected) {
            errorMsg.style.display = 'block';
            return `Add to ${type}`;
        } else {
            sizeSelected = true;
            errorMsg.style.display = 'none';
        }
    }

    // Find if the product with the same name and size already exists in the cart
    const existingProductIndex = data.findIndex((item) => {
        return item.name === product.name && (type === 'cart' ? item.size === size : true);
    });

    if (existingProductIndex !== -1 ) {
        // Product exists in cart
        const existingProduct = data[existingProductIndex];

        // For cart, increase item count if under limit
        if (existingProduct.item < 10) {
            if (existingProduct.item === 1) {
                // Check if the product is 'wishlist'
                if (type === 'wishlist') {
                    alert('Already in Wishlist.');
                    return `Add to ${type}`;
                }
            }

            existingProduct.item++;
            updateItemCount(existingProductIndex, existingProduct.item);
            localStorage.setItem(type, JSON.stringify(data));
            return `Add to ${type}`;
        } else {
            // display msg of limit (10) is reached
            countErrorMsg.textContent = `You can only add 10 amount of this item to your ${type}.`;
            countErrorMsg.style.display = 'block';
            // Hide the message after 3 seconds
            setTimeout(() => {
                countErrorMsg.style.display = 'none';
            }, 3000);
            return `Add to ${type}`;
        }
    }
    else {
        // Add new product to the cart or wishlist
        product = {
            item: 1,
            name: product.name,
            sellPrice: product.sellPrice,
            size: size || null,
            shortDes: product.shortDes,
            image: product.images[0],
            id: product.id
        }
        data.push(product);
        localStorage.setItem(type, JSON.stringify(data));
    }
    // Update both buttons' text to 'Added' temporarily
    const button = (type === 'cart') ? document.querySelector('.cart-btn') : document.querySelector('.wishlist-btn');
    button.textContent = 'Added';
    setTimeout(() => {
        // Revert button text after 3 seconds
        button.textContent = (type === 'cart') ? 'Add to Cart' : 'Add to Wishlist';
    }, 2000);

    if (type === 'wishlist') {
        alert('Added to Wishlist');
    }

    return 'Added';
}