
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

const sendData = (path, data) => {
    fetch(path, {
        method: 'post',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify(data)
    }).then((res) => res.json())
        .then((response) => {
            console.log(response)
            processData(response);
        });
};

const showAlert = (msg) => {
    let alertBox = document.querySelector('.alert-box');
    let alertMsg = document.querySelector('.alert-msg');
    let alertImg = document.querySelector('.alert-img');
    alertMsg.innerHTML = msg;
    // alertBox.classList.add('show');
    if (type === 'success') {
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
    } else if (data == true) {
        // let user = JSON.parse(sessionStorage.user);
        // user.seller = true;
        // sessionStorage.user = JSON.stringify(user);
        location.reload()
    }
};

// upload image handle
let uploadImages = document.querySelectorAll('.file-upload');
let fileUploadLabel = document.querySelector('.upload-image');
const formElem = document.querySelector('form');

//debugging url
// fetch('/s3url').then(res => res.json()).then(url => console.log(url));

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
        } else showAlert('upload immge only');
    })
})

uploadImages.forEach((fileupload, index) => {
    fileupload.addEventListener('change', async (e) => {
        const file = fileupload.files[0];
        let imageUrl;
        console.log(file);

        if(file.type.includes('image')) {
            fetch('http://localhost:3000/add-product', {
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
