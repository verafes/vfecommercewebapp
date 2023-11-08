
let user = JSON.parse(sessionStorage.user || null);
let loader = document.querySelector('.loader');

// check if user is logged in
// window.onload = () => {
//     if(user) {
//         if(!compareToken(user.authToken)) {
//             location.replace('/login');
//         }
//     } else {
//         location.replace('/login');
//     }
// }

//calculate actual price

const actualPrice = document.querySelector('#actual-price');
const discountPercentage = document.querySelector('#discount');
const sellingPrice = document.querySelector('#sell-price');

discountPercentage.addEventListener('input', () => {
    if(discountPercentage.value > 100) {
        discountPercentage.value = 90;
    }
    let discount = actualPrice.value * discountPercentage.value / 100;
    sellingPrice.value = (actualPrice.value - discount).toFixed(2);
})

//calculate discount percentage
sellingPrice.addEventListener('input', () => {
    discountPercentage.value = Math.ceil(100 - (sellingPrice.value * 100) / actualPrice.value);
})

// upload image handle
let uploadImages = document.querySelectorAll('.fileupload');
let imagePaths = [];

// upload images to AWS storage
uploadImages.forEach((fileupload, index) => {
    fileupload.addEventListener('change', () => {
        const file = fileupload.files[0];
        let imageUrl;
        console.log(file);

        if(file.type.includes('image')) {
            //means user uploaded an image
            fetch('/s3url').then(res => res.json())
                .then(url => {
                    fetch(url, {
                        method: 'PUT',
                        headers: new Headers({'Content-Type': 'multipart/form-data'}),
                        body: file
                    }).then(res => {
                        imageUrl = url.split("?")[0];
                        imagePaths[index] = imageUrl;
                        console.log(imageUrl);
                        let label = document.querySelector(`label[for=@${fileupload.id}]
                        `);
                        label.style.backgroundImage = `url(${imageUrl})`;
                        let productImage = document.querySelector('.product-image');
                        productImage.style.backgroundImage = `url(${imageUrl})`;
                    })
                })
        } else {
            showAlert('upload image only');
        }
    })
})


//form submission
const productName = document.querySelector('#product-name');
const shortLine = document.querySelector('#product-short-des');
const des = document.querySelector('#product-des');

let sizes = [];

const stock = document.querySelector('#stock');
const tags = document.querySelector('#tags');
const tac = document.querySelector('#tac');

//buttons
const addProductBtn = document.querySelector('#add-btn');
const saveDraft = document.querySelector('#save-btn');

const storeSizes = () => {
    sizes = [];
    let sizeCheckBox = document.querySelectorAll('.size-checkbox');
    sizeCheckBox.forEach(item => {
        if(item.checked) {
            sizes.push(item.value);
        }
    })
}

const validateForm = () => {
    if (!productName.value.length) {
        return showAlert('Enter product name.');
    } else if (shortLine.value.length > 100 || shortLine.value.length < 10) {
        return showAlert('Short description must be between 10 to 100 letters long.');
    } else if (!des.value.length) {
        return showAlert('Enter detail description about the product.');
    } else if (!imagePaths.length) {
        return showAlert('Upload at least one product image.');
    } else if (!sizes.length) {
        return showAlert('Select at least one size.');
    } else if (!actualPrice.value.length || !discountPercentage.value.length || !sellingPrice.value.length) {
        return showAlert('Add prices and discount.');
    } else if (stock.value < 20) {
        return showAlert('You should have at least 20 items in stock.');
    } else if (!tags.value.length) {
        return showAlert('Enter few tags to help search your product.');
    } else if (!tac.checked) {
        return showAlert('Please ensure you agree to our Terms and Conditions.');
    }
    return true;
}

const productData = () => {
    let tagArr = tags.value.split(',');
    tagArr.forEach((item, i) => tagArr[i] = tagArr[i].trim());
    return data = {
        name: productName.value,
        shortDes: shortLine.value,
        des: des.value,
        images: imagePaths,
        sizes: sizes,
        actualPrice: actualPrice.value,
        discount: discountPercentage.value,
        sellPrice: sellingPrice.value,
        stock: stock.value,
        tags: tagArr,
        tac: tac.checked,
        email: user.email
    }
}

addProductBtn.addEventListener('click', () => {
    storeSizes();

    if(validateForm()) {
        loader.style.display = 'block';
        let data = productData();
        if(productID) {
            data.id = productID;
        }
        console.log('addProductBtn', data);
        sendData('/add-product', data);
    }
})

// save  draft button
saveDraft.addEventListener('click', () => {
    //store sizes
    storeSizes();
    //check for product name
    if(!productName.value.length){
        showAlert('Enter the product name');
    } else { // don't validate
        let data = productData();
        data.draft = true;
        if(productID) {
            data.id = productID;
        }
        sendData('/add-product', data);
    }
})

// existing product detail handle

const setFormsData = (data) => {
    productName.value = data.value;
    shortLine.value = data.shortDes;
    des.value = data.des;
    actualPrice.value = data.actualPrice;
    discountPercentage.value = data.discount;
    sellingPrice.value = data.sellPrice;
    stock.value = data.stock;
    tags.value = data.tags;

    //set up images
    imagePaths = data.images;
    imagePaths.forEach((url, i) => {
        let label = document.querySelector(`label[for=${uploadImages[i].id}]`);
        label.style.backgroundImage = `url(${url})`;
        let productImage = document.querySelector('.product-image');
        productImage.style.backgroundImage = `url(${url})`;
    })

    //setup sizes
    sizes = data.sizes;

    let sizeCheckbox = document.querySelectorAll('.size-checkbox');
    sizeCheckbox.forEach(item => {
        if (sizes.includes(item.value)) {
            item.setAttribute('checked', '');
        }
    })
}

const fetchProductData = () => {
    fetch('/get-products', {
        method: 'POST',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify({
            email: user.email,
            id: productID
        })
    }).then((res) => res.json())
        .then(data => {
            console.log(data);
            setFormsData(data);
        })
        .catch(err => {
            console.log(err);
            location.replace('seller');
        })
}

let productID = null;
if (location.pathname !== '/add-product') {
    productID = decodeURI(location.pathname.split('/').pop());

    fetchProductData();
}
