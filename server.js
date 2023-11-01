const express = require('express');
const admin = require('firebase-admin');
const bcrypt = require('bcrypt');
const path = require('path');
const nodemailer = require('nodemailer');
// const { upload, uploadMultiple } = require('./middleware/multer');
// const { getStorage, ref, uploadBytesResumable } = require('firebase/storage');

// require('dotenv').config();

//firebase setup
// let serviceAccount = require("./public/credentials/vfecommerceapp-firebase-adminsdk-xxxxg-301546xxxx.json");
let serviceAccount = require("./public/credentials/vfecommerceapp-firebase-adminsdk-hlvjl-301546bda8.json");
// const {initializeApp} = require("firebase/app");
// const {firebaseConfig} = require("./config/firebaseConfig");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // firebaseConfig,
});

let db = admin.firestore();

//declare static path
let staticPath = path.join(__dirname, "public");

//initializing app
const app = express();

//middlewares
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
    // } else if (!downloadImagePaths.length) {
    //     return showAlert('Upload at least one product image.');
    } else if(!sizes.length) {
        return res.json({'alert': 'Select at least one size.'});
    } else if(!actualPrice.length || !discount.length || !sellPrice.length) {
        return res.json({'alert': 'Add prices and discount.'});
    } else if(stock < 20) {
        return res.json({'alert': 'You should have at least 20 items in stock.'});
    } else if(!tags.length) {
        return res.json({'alert': 'Enter few tags to help ranking your product in search.'});
    } else if(!tac) {
        return res.json({'alert': 'You must agree to our Terms and Conditions.'});
    } else {
        let docName = `${name.toLowerCase()} - ${Math.floor(Math.random() * 5000)}`;
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

        return res.json({'alert': 'Submitted Successfully.'});
    }
})
app.get("/terms", (req, res) => {
    res.sendFile(path.join(staticPath, "terms.html"));
})
app.get("/privacy", (req, res) => {
    res.sendFile(path.join(staticPath, "privacy.html"));
})

app.post('/order', (req, res) => {
    const {order, email, add} = req.body;
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user:process.env.EMAIL,
            pass:process.env.PASSWORD
        }
    })

    const mailOption = {
        from: 'valid sender email id',
        to: email,
        subject: 'VF Shop : order Placed',
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            
                <link rel="apple-touch-icon" sizes="180x180" href="img/icons/apple-touch-icon.png">
                <link rel="icon" type="image/png" sizes="32x32" href="img/icons/favicon-32x32.png">
                <link rel="icon" type="image/png" sizes="16x16" href="img/icons/favicon-16x16.png">
                <link rel="manifest" href="img/icons/site.webmanifest">
            
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Krub:wght@500&display=swap" rel="stylesheet">
            
                <title>Document</title>
            
                <style>
                    body{
                        min-height: 90vh;
                        background: #f5f5f5;
                        font-family: 'Krub', sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    .heading{
                        text-align: center;
                        font-size: 40px;
                        width: 50%;
                        display: block;
                        line-height: 50px;
                        margin: 30px auto 60px;
                        text-transform: capitalize;
                    }
                    .heading span{
                        font-weight: 300;
                    }
                    .btn{
                        width: 200px;
                        height: 50px;
                        border-radius: 5px;
                        background: #016565;
                        color: #fff;
                        display: block;
                        margin: auto;
                        font-size: 18px;
                        text-transform: capitalize;
                    }
                    .logo{
                        height: 150px;
                        display: block;
                        margin: auto;
                    }
                </style>
            
            </head>
            <body>
                <div>
                    <img src="img/logo-green.png" class="logo" alt="">
                    <h1 class="heading">dear ${email.split('@')[0]}, <span>your order is successfully placed</span></h1>
                    <button class="btn">check status</button>
                </div>
            </body>
            </html>
            `
    }

    let docName = email + Math.floor(Math.random() * 123819287419824);
    db.collection('order').doc(docName).set(req.body)
        .then(data => {
            res.json('done');

            transporter.sendMail(mailOption, (err, info) => {
                if (err) {
                    res.json({'alert': 'Your order is placed'});

                }
            })
        })
} )

//seller route
app.get('/seller', (req, res) => {
    res.sendFile(path.join(staticPath, "seller.html"));
})

app.post('/seller', (req, res) => {
    let { name, about, address, number, tac, legit, email} = req.body;
    if(!name.length || !address.length || about.length || !number.length < 10 || !Number(number)) {
        return res.json({'alert': 'some information(s) is/are invalid'})
    } else if(!tac || !legit) {
        return  res.json({'alert': 'you must agree to our terms and conditions'})
    } else{
        // update users seller status here
        db.collection('sellers').doc(email).set(req.body)
            .then(data => {
                db.collection('user').doc(email).update({
                    seller: true
                }).then(data => {
                    res.json(true);
                })
            })
    }
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
