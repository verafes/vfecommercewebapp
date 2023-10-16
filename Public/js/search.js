const searchKey = decodeURI(location.pathname)

const searchSpanElement = document.querySelector('#search-key');
searchSpanElement.innerHTML = searchKey;

getProducts(searchKey).then(data => createProductCards(data, '.card-container'));
