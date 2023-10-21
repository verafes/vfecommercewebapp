const express = require('express');
const admin = require('firebase-admin');
const bcrypt = require('bcrypt');
const path = require('path');
// const { upload, uploadMultiple } = require('./middleware/multer');
// const { getStorage, ref, uploadBytesResumable } = require('firebase/storage');

// require('dotenv').config();

let serviceAccount = require("./public/credentials/vfecommerseapp-firebase-adminsdk-t8kpe-9406b359b8.json");
// const {initializeApp} = require("firebase/app");
// const {firebaseConfig} = require("./config/firebaseConfig");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // firebaseConfig,
});

let db = admin.firestore();

let staticPath = path.join(__dirname, "public");

const app = express();
app.use(express.static(staticPath));
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
})
app.get("/signup", (req, res) => {
    res.sendFile(path.join(staticPath, "signup.html"));
})
app.post("/signup", (req, res) => {
    console.log(req.body);

    let { name, email, password, phoneNumber, tac, notification } = req.body;
    //response validation
    if(name.length < 3) {
        return res.json({'alert': 'Name must be at least 3 letters long.'});
    } else if(!email.length) {
        return res.json({'alert': 'Please enter email address.'});
    } else if(password.length < 8) {
        return res.json({'alert': 'Password must be at least 8 symbols long.'});
    } else if(!phoneNumber.length) {
        return res.json({'alert': 'Please enter phone number.'});
    } else if(!Number(phoneNumber) || phoneNumber.length < 10) {
        return res.json({'alert': 'Invalid phone number.'});
    } else if(!tac) {
        return res.json({'alert': 'Please agree to the terms and conditions.'});
    }
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
app.get("/product", (req, res) => {
    res.sendFile(path.join(staticPath, "product.html"));
})
app.get("/search", (req, res) => {
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
app.get("/add-product", (req, res) => {
    res.sendFile(path.join(staticPath, "addProduct.html"));
})

app.post("/add-product", (req, res) => {
    let { name, shortDes, des, sizes, actualPrice, discount, sellPrice, stock,
    tags, tac } = req.body;

    if(!name.length) {
        return res.json({'alert': 'Enter product name.'});
    } else if(shortDes.length > 100 || shortDes.length < 10) {
        return res.json({'alert': 'Short line must be between 10 to 100 letters long.'});
    } else if(!des.length) {
        return res.json({'alert': 'Enter detail description about the product.'});
    }
    else if(!sizes.length) {
        return res.json({'alert': 'Select at least one size.'});
    } else if(!actualPrice.length || !discount.length || !sellPrice.length) {
        return res.json({'alert': 'Add prices and discount.'});
    } else if(stock < 20) {
        return res.json({'alert': 'You should have at least 20 items in stock.'});
    } else if(!tags.length) {
        return res.json({'alert': 'Enter few tags to help ranking your product in search.'});
    } else if(!tac) {
        return res.json({'alert': 'You must agree to our Terms and Conditions.'});
    }

    let docName = `${name.toLowerCase()} - ${Math.floor(Math.random() * 5000)}`;
    db
        .collection('products')
        .doc(docName)
        .set(req.body)
        .then(data => {
            res.json({'product': name});
        })
        .catch(err => {
            return res.json({'alert': 'Some error occurred.Try again.'});
        })
})
app.get("/404", (req, res) => {
    res.sendFile(path.join(staticPath, "404.html"));
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
