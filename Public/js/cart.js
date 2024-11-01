const createSmallCards = (data) => {  // create small product cards
    return `
    <div class="sm-product">
        <img src="${data.image}" class="sm-product-img" role="img" onclick="location.href = '/products/${data.id}'" alt="${data.name}">
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
        <button class="sm-delete-btn" type="button" aria-label="Remove product"><img src="../img/close.png" alt=Remove></button>
    </div>
    `;
}

let totalBill = 0;

const setProducts = (name) => {
    const element = document.querySelector(`.${name}`);
    let data = JSON.parse(localStorage.getItem(name));
    if(!data || data.length === 0) {
        element.innerHTML = `<img src="../img/empty-cart.png" class="empty-cart-img" alt="Empty cart">`;
        return
    } else {
        for(let i= 0; i < data.length; i++) {
            element.innerHTML += createSmallCards(data[i]);
            if(name == 'cart') {
                const sizeElements = document.querySelectorAll(`.wishlist-hide`);
                sizeElements.forEach((sizeElement) => {
                    sizeElement.classList.remove('wishlist-hide');
                });
                totalBill += Number(data[i].sellPrice * data[i].item);
            }
            updateBill();
        }
    }

    setupEvents(name);

    // Format prices to display two decimal places
    const priceElements = document.querySelectorAll(`.${name} .sm-price`);
    priceElements.forEach((priceElement) => {
        const currentPrice = Number(priceElement.getAttribute('data-price'));
        priceElement.innerHTML = `$${currentPrice.toFixed(2)}`;
    });

    // Hide item counter for wishlist only
    if (name === 'wishlist') {
        const itemCounters = element.querySelectorAll('.item-counter');
        itemCounters.forEach(counter => {
            counter.style.display = 'none'; // Hide the counter
        });
    }

}

const updateBill = () => {
    let billPrice = document.querySelector('.bill');
    billPrice.innerHTML = `$${Number(totalBill.toFixed(2))}`;
}

const setupEvents = (name) => {
    // setup counter event
    const counterMinus = document.querySelectorAll(`.${name} .decrement`);
    const counterPlus = document.querySelectorAll(`.${name} .increment`);
    const counts = document.querySelectorAll(`.${name} .item-count`);
    const price = document.querySelectorAll(`.${name} .sm-price`);
    const deleteBtn = document.querySelectorAll(`.${name} .sm-delete-btn`);

    let product = JSON.parse(localStorage.getItem(name));

    counts.forEach((item, i) => {
        let cost = Number(price[i].getAttribute('data-price'));

        counterMinus[i].addEventListener('click', () => {
            if(item.innerHTML > 1) {
                item.innerHTML--;
                totalBill -= Number(cost.toFixed(2));
                price[i].innerHTML = `$${(item.innerHTML * cost).toFixed(2)}`;
                if(name === 'cart'){ updateBill() }
                product[i].item = item.innerHTML;
                localStorage.setItem(name, JSON.stringify(product));
            }
        })
        counterPlus[i].addEventListener('click', () => {
            if(item.innerHTML < 10) {
                item.innerHTML++;
                totalBill += Number(cost.toFixed(2));
                price[i].innerHTML = `$${(item.innerHTML * cost).toFixed(2)}`;
                if(name === 'cart'){ updateBill() }
                product[i].item = item.innerHTML;
                localStorage.setItem(name, JSON.stringify(product));
            }
        })
    })

    deleteBtn.forEach((item, i) => {
        item.addEventListener('click', () => {
            product = product.filter((data, index) =>  index !== i);
            localStorage.setItem(name, JSON.stringify(product));
            location.reload();
        })
    })
}

setProducts('cart');
setProducts('wishlist');
