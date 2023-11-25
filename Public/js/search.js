const searchKey = decodeURI(location.pathname.split('/').pop());

const searchSpanElement = document.querySelector('#search-key');

if (searchSpanElement) {
    // Check if the search key is empty
    if (!searchKey || !searchKey.trim()) {
        searchSpanElement.innerHTML = '"". <br> No search input provided. Please provide a valid search input.';
    } else {
        // Clean the search key
        const cleanedSearchKeys = cleanKeywords(searchKey);
        searchSpanElement.innerHTML = cleanedSearchKeys.join(' ');

        // get products by multiple keywords
        if (cleanedSearchKeys.length > 0) {
            const productPromises = [];
            for (let i = 0; i < cleanedSearchKeys.length; i++) {
                for (let j = i + 1; j <= cleanedSearchKeys.length; j++) {
                    const keyword = cleanedSearchKeys.slice(i, j).join(' ');
                    productPromises.push(getProducts(keyword));
                }
            }

            Promise.all(productPromises)
                .then(productsByKeyword => {
                    const combinedProducts = mergeAndFilterProducts(productsByKeyword.flat());

                    if (combinedProducts === null) {
                        searchSpanElement.innerHTML = `"${searchKey}". <br> No products found. Please refine your search.`;
                    } else {
                        createProductCards(combinedProducts, '.card-container');
                    }
                })
                .catch(error => {
                    searchSpanElement.innerHTML = 'An error occurred while fetching or filtering products.';
                });
        } else {
            // Clear the product container if the search key is empty OR awkward
            const cardContainer = document.querySelector('.card-container');
            cardContainer.innerHTML = '';
        }
    }
}

searchResult = [];
let tempResult = [];
// let tempResult = "";
let keyWords = searchBox.value;

function cleanKeywords(string) {
    return string
        .trim()
        .toLowerCase()
        .replace(/[!"%&#]/g, '')
        .replace(/[^0-9A-Za-z_\u0400-\u04FF.' ]/gi,  match => {
            if (match === "'s") { // Preserve 's as a suffix -> men's -> men's
                return match;
            }
            return ' ';  // Replace other non-word characters with space //A.W.A.K.E => awake
        })
        .split(/\s+/)
        .filter(word => word !== '' && word.length >= 3);
}

function cleanTags(tags) {
    tags = tags.trim().toLowerCase();
    const arrTags = tags.split(/\s+/);
    arrTags.forEach((tag) => {
        const index = arrTags.indexOf(tag);
        tag = tag
            .replace(/[^0-9A-Za-z_\u0400-\u04FF]/gi, ' ') //A.W.A.K.E => awake
            .replace(/\s+/g, ' ');
        arrTags[index] = tag;
    })

    return arrTags;
}

function mergeAndFilterProducts(products) {
    const uniqueProducts = [];
    const uniqueProductIds = new Set();

    products.forEach(product => {
        if (product !== 'no products' && !uniqueProductIds.has(product.id)) {
            uniqueProductIds.add(product.id);
            uniqueProducts.push(product);
        }
    });
    console.log('uniqueProducts', uniqueProducts)
    return uniqueProducts.length > 0 ? uniqueProducts : null;
}

function getSearchResult(keyWords, data) {
    const id = data.id;
    let tags = data.tags.toString();
    tags = cleanTags(tags);

    keyWords.forEach((keyWord) => {
        console.log('keyword', keyWord)
        if(keyWord.length > 2) {
            tags.forEach((tag) => {
                console.log('tag', tag);
                if (tag.includes(keyWord)) {
                    console.log('Yes');
                    console.log('tempResult= ', tempResult);
                    if(!tempResult.includes(id)) {
                        tempResult += id + " ";
                        // tempResult.push(id);
                        console.log('tempResult= ', tempResult);

                        searchResult.push(data);
                        console.log('searchResult= ', searchResult);
                    }
                }
            })
        }
    })
    return searchResult
}

// getSearchResult((keyWords), data);
// console.log('searchResult= ', searchResult);