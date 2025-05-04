const createSmallCards = (data) => {  // create small product cards
    return `
    <div class="sm-product">
        <img src="${data.image}" class="sm-product-img" role="img" onclick="location.href = '/products/${data.id}'" alt="${data.name.trim()}">
        <div class="sm-text">
            <p class="sm-product-name" onclick="location.href = '/products/${data.id}'">${data.name}</p>
            <p class="sm-des">${data.shortDes}</p>
            <p class="wishlist-hide size">Size: <span style="text-transform: uppercase;">${data.size}</span></p>
        </div>
        <div class="item-counter">
            <button class="counter-btn decrement" aria-label="Decrease quantity">-</button>
            <p class="item-count" title="quantity">${data.item}</p>
            <button class="counter-btn increment" aria-label="Increase quantity">+</button>
        </div>
        <p class="sm-price" data-price="${data.sellPrice}">$${(data.sellPrice * data.item).toFixed(2)}</p>
        <button class="sm-delete-btn" type="button" aria-label="Remove product"><img src="../img/close.png" alt="Remove"></button>
    </div>
    `;
}

let totalBill = 0;

const setProducts = (type) => {
    const element = document.querySelector(`.${type}`);
    let data = JSON.parse(localStorage.getItem(type));

    if (element) {
        if(data == null || (Array.isArray(data) && data.length === 0)) {
            element.innerHTML = `<img src="../img/empty-cart.png" class="empty-cart-img" alt="Empty cart">`;
            return
        } else {
            for (let i = 0; i < data.length; i++) {
                element.innerHTML += createSmallCards(data[i]);
                if(type === 'cart') {
                    const sizeElements = document.querySelectorAll(`.wishlist-hide`);
                    sizeElements.forEach((sizeElement) => {
                        sizeElement.classList.remove('wishlist-hide');
                    });
                    totalBill += Number(data[i].sellPrice * data[i].item);
                }
                // Hide item counter for wishlist only
                if (type === 'wishlist' && element) {
                    const itemCounters = element.querySelectorAll('.item-counter');
                    itemCounters.forEach(counter => {
                        counter.style.display = 'none';
                    });
                }
                updateBill();
            }
        }
    }

    setupEvents(type);

    // Format prices to display two decimal places
    const priceElements = document.querySelectorAll(`.${type} .sm-price`);
    priceElements.forEach((priceElement) => {
        const currentPrice = Number(priceElement.getAttribute('data-price'));
        priceElement.innerHTML = `$${currentPrice.toFixed(2)}`;
    });
}

const updateBill = () => {
    let billPrice = document.querySelector('.bill');
    billPrice.innerHTML = `$${Number(totalBill.toFixed(2))}`;
}

const setupEvents = (type) => {
    // setup counter event
    const counterMinus = document.querySelectorAll(`.${type} .decrement`);
    const counterPlus = document.querySelectorAll(`.${type} .increment`);
    const counts = document.querySelectorAll(`.${type} .item-count`);
    const price = document.querySelectorAll(`.${type} .sm-price`);
    const deleteBtn = document.querySelectorAll(`.${type} .sm-delete-btn`);

    let product = JSON.parse(localStorage.getItem(type));

    counts.forEach((item, i) => {
        let cost = Number(price[i].getAttribute('data-price'));

        counterMinus[i].addEventListener('click', () => {
            if(item.innerHTML > 1) {
                item.innerHTML--;
                totalBill -= Number(cost.toFixed(2));
                price[i].innerHTML = `$${(item.innerHTML * cost).toFixed(2)}`;
                if(type === 'cart'){ updateBill() }
                product[i].item = item.innerHTML;
                localStorage.setItem(type, JSON.stringify(product));
            }
        })
        counterPlus[i].addEventListener('click', () => {
            if(item.innerHTML < 10) {
                item.innerHTML++;
                totalBill += Number(cost.toFixed(2));
                price[i].innerHTML = `$${(item.innerHTML * cost).toFixed(2)}`;
                if(type === 'cart'){ updateBill() }
                product[i].item = item.innerHTML;
                localStorage.setItem(type, JSON.stringify(product));
            }
        })
    })

    deleteBtn.forEach((item, i) => {
        item.addEventListener('click', () => {
            product = product.filter((data, index) =>  index !== i);
            localStorage.setItem(type, JSON.stringify(product));
            location.reload();
        })
    })
}

setProducts('cart');
setProducts('wishlist');
