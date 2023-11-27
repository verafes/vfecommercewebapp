const express = require('express');
const admin = require('firebase-admin');
const bcrypt = require('bcrypt');
const path = require('path');
const nodemailer = require('nodemailer');

//firebase setup
// let serviceAccount = require("./public/credentials/secret-file.json");
let serviceAccount = require("./public/credentials/vfecommerceapp-firebase-adminsdk-hlvjl-301546bda8.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

let db = admin.firestore();

// aws config
const aws = require('aws-sdk');
const {S3Client} = require("@aws-sdk/client-s3");
const dotenv = require('dotenv');

dotenv.config();
const storage = admin.storage();

// aws parameters
const region = "us-west-2";
const bucketName = "vfecommerceapp";
const accessKeyID = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY_ID;

aws.config.update({
    region: region,
    accessKeyID: accessKeyID,
    secretAccessKey: secretAccessKey
})
//init s3
const s3 = new aws.S3();

//generate image upload link
async function generateURL(){
    let date = new Date();
    let id = parseInt(Math.random() * 10000000000);

    const imageName = `${id}${date.getTime()}`
    const params = ({
        Bucket: bucketName,
        Key: imageName,
        Expires: 300,
        ContentType: 'image/*'
    })
    try {
        const uploadUrl = await s3.getSignedUrlPromise('putObject', params);
        return uploadUrl;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

//declare static path
let staticPath = path.join(__dirname, "public");

//initializing app express.js
const app = express();

//middlewares
app.use(express.static(staticPath));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.get("/", (req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
})
app.get("/signup", (req, res) => {
    res.sendFile(path.join(staticPath, "signup.html"));
})
app.post("/signup", (req, res) => {

    let { name, email, password, number, tac, notification } = req.body;
    //form response validation
    if(name.length < 3) {
        return res.json({'alert': 'Name must be at least 3 letters long.'});
    } else if(!email.length) {
        return res.json({'alert': 'Please enter email address.'});
    } else if(password.length < 8) {
        return res.json({'alert': 'Password must be at least 8 symbols long.'});
    } else if(!number.length) {
        return res.json({'alert': 'Please enter phone number.'});
    } else if(isNaN(number) || number.length < 10) {
        return res.json({'alert': 'Invalid phone number. Please enter a valid one'});
    } else if(!tac) {
        return res.json({'alert': 'Please agree to the terms and conditions.'});
    }
    //store user in db
    db.collection('users').doc(email).get()
        .then(user => {
            if(user.exists) {
                return res.json({'alert': 'Email address is already exists. Please login or enter another email.'});
            } else {
                //encrypt password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        req.body.password = hash;
                        db.collection('users')
                            .doc(email)
                            .set(req.body)
                            .then(data => {
                                res.json({
                                    name: req.body.name,
                                    email: req.body.email,
                                    seller: req.body.seller
                                })
                            })
                    })
                })
            }
        })
})
// login page
app.get("/login", (req, res) => {
    res.sendFile(path.join(staticPath, "login.html"));
})

app.post("/login", (req, res) => {
    let { email, password} = req.body;
    if (!email || !password) {
        showAlert('Please fill out all the inputs.');
    }

    db.collection('users').doc(email).get()
        .then(user => {
            if(!user.exists){
                return res.json({'alert': 'user does not exists'})
            } else {
                bcrypt.compare(password, user.data().password, (err, result) => {
                    if(result){
                        let data = user.data();
                        return res.json({
                            name: data.name,
                            email: data.email,
                            seller: data.seller
                        })
                    } else {
                        return res.json({'alert': 'Email or password is incorrect'});
                    }
                })
            }
        })
})

//seller route
app.get('/seller', (req, res) => {
    res.sendFile(path.join(staticPath, "seller.html"));
})

app.post('/seller', (req, res) => {
    console.log('Received POST request to /seller:', req.body);
    let { name, about, address, number, tac, legit, email} = req.body;
    if(!name.length || !address.length || !about.length || number.length < 10 || !Number(number)) {
        return res.json({'alert': 'some information(s) is/are invalid'})
    } else if(!tac || !legit) {
        return  res.json({'alert': 'you must agree to our terms and conditions'})
    } else{
        // update users seller status here
        db.collection('sellers').doc(email).set(req.body)
            .then(data => {
                db.collection('users').doc(email).update({
                    seller: true
                }).then(data => {
                    res.json(true);
                })
            })
    }
})

app.get("/product", (req, res) => {
    res.sendFile(path.join(staticPath, "product.html"));
})
app.get("/women", (req, res) => {
    res.sendFile(path.join(staticPath, "women.html"));
})
app.get("/men", (req, res) => {
    res.sendFile(path.join(staticPath, "men.html"));
})
app.get("/shoes", (req, res) => {
    res.sendFile(path.join(staticPath, "shoes.html"));
})
app.get("/accessories", (req, res) => {
    res.sendFile(path.join(staticPath, "accessories.html"));
})
app.get("/search", (req, res) => {
    res.sendFile(path.join(staticPath, "search.html"));
})
app.get("/add-product", (req, res) => {
    res.sendFile(path.join(staticPath, "addProduct.html"));
})

app.get("/add-product/:id", (req, res) => {
    res.sendFile(path.join(staticPath, "addProduct.html"));
})

// get img upload link
app.get("/s3url", (req, res) => {
    generateURL().then(url => res.json(url));
})

app.post("/add-product", (req, res) => {
    let { name, shortDes, des, sizes, images, actualPrice, discount, sellPrice, stock,
    tags, tac, email, draft, id } = req.body;
    if (!draft) {
        if (!name.length) {
            return res.json({'alert': 'Enter product name.'});
        } else if (shortDes.length > 100 || shortDes.length < 10) {
            return res.json({'alert': 'Short line must be between 10 to 100 letters long.'});
        } else if (!des.length) {
            return res.json({'alert': 'Enter detail description about the product.'});
        } else if (!images.length) { //downloadImagePaths
            return showAlert('Upload at least one product image.');
        } else if (!sizes.length) {
            return res.json({'alert': 'Select at least one size.'});
        } else if (!actualPrice.length || !discount.length || !sellPrice.length) {
            return res.json({'alert': 'Add prices and discount.'});
        } else if (stock < 20) {
            return res.json({'alert': 'You should have at least 20 items in stock.'});
        } else if (!tags.length) {
            return res.json({'alert': 'Enter few tags to help ranking your product in search.'});
        } else if (!tac) {
            return res.json({'alert': 'You must agree to our Terms and Conditions.'});
        }
    }
    //add product
    let docName = id === undefined ? `${name.toLowerCase()} - ${Math.floor(Math.random() * 5000)}` : id;
    db
        .collection('products')
        .doc(docName)
        .set(req.body)
        .then(data => {
            res.json({'product': name});
        })
        .catch(err => {
            return res.json({'alert': 'Some error occurred. Try again.'});
        })
})

//get products
app.post('/get-products', (req, res) => {
    let {email, id, tag} = req.body;

    let docRef;
    if(id) {
        docRef = db.collection('products').doc(id);
    } else if(tag){
        docRef = db.collection('products').where('tags', 'array-contains', tag);
    } else if (email) {
        docRef = db.collection('products').where('email', '==', email);
    } else {
        return res.status(400).json({ message: 'Invalid request' });
    }

    docRef.get()
        .then(products=> {
            if(products.empty){
                return res.json('no products');
            }
            let productsArr = [];
            if (id) {
                return res.json(products.data());
            } else {
                products.forEach(item => {
                    let data = item.data();
                    data.id = item.id;
                    productsArr.push(data);
                })
                return res.json(productsArr);
            }
        })
})
app.post('/delete-product', (req, res) => {
    let {id} = req.body;

    db.collection('products').doc(id).delete()
        .then(data => {
            res.json('success');
        }).catch(err => {
        res.json('err');
    })
})

app.get("/products/:id", (req, res) => {
    res.sendFile(path.join(staticPath, "product.html"));
})

app.get('/search/:key', (req, res) => {
    res.sendFile(path.join(staticPath, "search.html"));
})

app.get("/cart", (req, res) => {
    res.sendFile(path.join(staticPath, "cart.html"));
})

app.get("/checkout", (req, res) => {
    res.sendFile(path.join(staticPath, "checkout.html"));
})
app.get("/mail", (req, res) => {
    res.sendFile(path.join(staticPath, "mail.html"));
})
app.post('/order', (req, res) => {
    const {order, email, add} = req.body;

    let docName = email + Math.floor(Math.random() * 123819287419824);
    db.collection('order').doc(docName).set(req.body)
        .then(data => {
            // res.json('done');
            res.json({'alert': 'Your order is placed'});
        })
} )
app.get("/terms", (req, res) => {
    res.sendFile(path.join(staticPath, "terms.html"));
})
app.get("/privacy", (req, res) => {
    res.sendFile(path.join(staticPath, "privacy.html"));
})
app.get("/404", (req, res) => {
    res.sendFile(path.join(staticPath, "404.html"));
})
app.use((req, res) => {
    res.redirect('/404');
})
app.listen(process.env.PORT || 3000, () => {
    console.log('Server running on port 3000')
})
