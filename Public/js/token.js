let char = `123abcde.fmnopqlABCDE@FJKLMNOPQRSTUVWXYZ456789stuvwxyz0!#$%&ijkrgh'*+-/=?^_${'`'}{|}~`;

const generateToken = (key) => {
    let token = '';
    for (let i = 0; i < key.length; i++) {
        let index = char.indexOf(key[i]) || char.length / 2;
        let randomIndex = Math.floor(Math.random() * index);
        token += char[randomIndex] + char[index - randomIndex];
    }

    console.log(token, key);
    return token;
}

const compareToken = (token, key) => {
    console.log('token', token, 'key', key)
    let string = '';
    for (let i = 0; i < token.length; i = i + 2) {
        let index1 = char.indexOf(token[i]);
        let index2 = char.indexOf(token[i + 1]);
        string += char[index1 + index2];
    }
    console.log (string);
    return string === key;
}

//common functions


// console.log('Compare Token:', compareToken);
// send data function
// const sendData = (path, data) => {
//     fetch(path, {
//         method: 'post',
//         headers: new Headers({'Content-Type': 'application/json'}),
//         body: JSON.stringify(data)
//     }).then((res) => {
//         console.log(res); // Log the response
//         return res.json();
//     }).then(response => {
//         console.log(response);
//         processData(response);
//     }).catch(error => {
//         console.error(error); // Log any caught errors
//     });
// }
//
// const processData = (data) => {
//     loader.style.display = null;
//     if(data.alert) {
//         showAlert(data.alert);
//     } else if (data.name) {
//         location.reload();
//         //create authToken
//         console.log('Data before saving to sessionStorage:', data);
//         data.authToken = generateToken(data.email);
//         console.log('Generated token:', data.authToken);
//
//         data.authToken = generateToken(data.email);
//         sessionStorage.user = JSON.stringify(data);
//         location.replace('/');
//     }
// };
