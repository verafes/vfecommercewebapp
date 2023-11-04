
let user = JSON.parse(sessionStorage.user || null);
let loader = document.querySelector('.loader');

// check if user is logged in
window.onload = () => {
    if(user) {
        if(!compareToken(user.authToken)) {
            location.replace('/login');
        }
    } else {
        location.replace('/seller');
    }
}

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
const safeDraft = document.querySelector('#save-btn');

const storeSizes = () => {
    sizes = [];
    let sizeCheckBox = document.querySelectorAll('.size-checkbox');
    sizeCheckBox.forEach(item => {
        if(item.checked) {
            sizes.push(item.value);
        }
    })
}

let imagePaths = [];

const validateForm = () => {
    if (!productName.value.length) {
        return showAlert('Enter product name.');
    } else if (shortLine.value.length > 100 || shortLine.value.length < 10) {
        return showAlert('Short description must be between 10 to 100 letters long.');
    } else if (!des.value.length) {
        return showAlert('Enter detail description about the product.');
    // } else if (!images.length) {
    //     return showAlert('Upload at least one product image.');
    } else if (!sizes.length) {
        return showAlert('Select at least one size.');
    } else if (!actualPrice.value.length || !discountPercentage.value.length || !sellingPrice.value.length) {
        return showAlert('Add prices and discount.');
    } else if (stock.value < 20) {
        return showAlert('You should have at least 20 items in stock.');
    } else if (!tags.value.length) {
        return showAlert('Enter few tags to help search your product.');
    } else if (!tac.checked) {
        showAlert('You must agree to our Terms and Conditions.');
    }
    return true;
}

const productData = () => {
    return {
        name: productName.value,
        shortDes: shortLine.value,
        des: des.value,
        images: imagePaths,
        sizes: sizes,
        actualPrice: actualPrice.value,
        discount: discountPercentage.value,
        sellPrice: sellingPrice.value,
        stock: stock.value,
        tags: tags.value,
        tac: tac.checked,
        email: user.email
    }
}

addProductBtn.addEventListener('click', () => {
    storeSizes();
    console.log('storeSizes', sizes);

    if(validateForm()) {
        loader.style.display = 'block';
        let data = productData();
        console.log('addProductBtn', data);
        sendData('/add-product', data);
    }
})

// save  draft button
saveDraft.addEventListener('click', () => {
    //store sizes
    storeSizes();
    //check for product name
    if(productName.value.length){
        showAlert('Enter product name');

    } else { // don't validate
        let data = productData();
        data.draft = true;
        sendData('/add-product', data);
    }
})

const sendData = (path, data) => {
    fetch(path, {
        method: 'post',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify(data)
    }).then((res) => res.json())
        .then((response) => {
            console.log('sendData', response)
            processData(response);
        });
};

const showAlert = (msg) => {
    let alertBox = document.querySelector('.alert-box');
    let alertMsg = document.querySelector('.alert-msg');
    let alertImg = document.querySelector('.alert-img');
    alertMsg.innerHTML = msg;
    alertBox.classList.add('show');
    if (alert.type === 'success') {
        alertImg.src = `img/success.png`;
        alertMsg.style.color = "#0ab50a";
    } else { // means it is an error
        alertImg.src = `img/error.png`;
        alertMsg.style.color = null;
    }
    alertBox.classList.remove('show');
    setTimeout(() => {
        alertBox.classList.remove('show');
    }, 3000);
    return false;
};

const processData = (data) => {
    loader.style.display = null;
    if(data.alert) {
        showAlert(data.alert);
    } else if (data.name) {
        // create authToken
        data.authToken = generateToken(data.email);
        sessionStorage.user = JSON.stringify(data);
        location.replace('/');
    } else if (data === true) {
        console.log('processData', data)
        // let user = JSON.parse(sessionStorage.user);
        // user.seller = true;
        // sessionStorage.user = JSON.stringify(user);
        location.reload()
    } else if(data.product) {
        location.href = '/seller';
    }
};

// upload image handle
let uploadImages = document.querySelectorAll('.file-upload');
let fileUploadLabel = document.querySelector('.upload-image');
const formElem = document.querySelector('form');

//debugging url
// fetch('/s3url').then(res => res.json()).then(url => console.log(url));
// AWS storage
uploadImages.forEach((fileupload, index) => {
    fileupload.addEventListener('change', async (e) => {
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
        } else showAlert('upload image only');
    })
})

//upload images to firebase storage -> comment when using AWS s3
uploadImages.forEach((fileupload, index) => {
    fileupload.addEventListener('change', async (e) => {
        const file = fileupload.files[0];
        let imageUrl;
        console.log(file);

        if(file.type.includes('image')) {
            fetch('/get-product', {
                method: 'POST',
                headers: new Headers({'Content-Type': 'multipart/form-data'}),
                body: {'img': file}
            }).then(res => {
                // imageUrl = url.toString();
                console.log(res);
            })
        }

        if (fileupload.files && fileupload.files.length > 0) {
            let fileName = '';
            if (fileupload.files.length === 1) {
                fileName = fileupload.files[0].name;
            } else {
                fileName = fileupload.files.length + ' files selected';
            }
            fileUploadLabel.textContent = fileName;
        } else {
            fileUploadLabel.textContent = 'Select Files';
        }

        console.log("file submitting");

        e.preventDefault();
        await fetch('/upload', {
                method: 'POST',
                body: new FormData(formElem),
            }).then(response => {
                //document.querySelector('p').textContent = "Successfully uploaded to drive";
                // document.getElementById("myButton").style.backgroundColor = "green"
                //document.getElementById('fileInputLabel').textContent = "Select Files";
               // document.querySelector('p').style.display = 'block';
                console.log(response);
            }).catch(error => {
               // document.querySelector('p').textContent = "Was not uploaded" + error;
                //document.querySelector('p').style.display = 'block';
                console.error(error);
            });
        });

    });
