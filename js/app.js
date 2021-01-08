    let product;
    function onLoadCartNumbers(){
      let qty = localStorage.getItem('qty');
  
      if(qty) {
          document.getElementById('numbers').textContent = qty;
      }
  }
  onLoadCartNumbers();
    const displayAllProducts = () => {
        let url = "http://localhost:3000/api/teddies/";
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            let productList = JSON.parse(xhttp.responseText);
            let display = document.getElementById("products")
                productList.forEach((product)=>{
                display.innerHTML += `<article class="product">
                <div class="img-container">
                  <img src="${product.imageUrl}" alt="product"
                  class="product-img">
                  <button class="bag-btn" data-id="1">
                    <i class="fas fa-shopping-cart"></i>
                    <a href ="single-product.html?id=${product._id}">Add cart</a>
                  </button>
                </div>
                <h3>${product.name}</h3>
                <h4>$${product.price / 100}.00</h4>
                <div class="rating">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star-half-alt"></i>
                </div>
              </article>`;

                }

                )
            }
        }
        xhttp.open("GET", url, true);
        xhttp.send();
      }
    

        displayAllProducts();


      const displaySingleProduct = (id) => {
        let productImage = document.getElementById('image');
        let productName = document.getElementById('name');
        let productPrice = document.getElementById('price');
        let productDescription = document.getElementById('description');
        let dropDownMenu = document.getElementById('customisation');
        let teddy;
        let xhttp = new XMLHttpRequest();
        let url = "http://localhost:3000/api/teddies/"+id;
        xhttp.open("GET", url);
        xhttp.onload = function() {
          if ( this.status == 200) {
          // Typical action to be performed when the document is ready:
          //if(xhttp.status === 200){
          teddy = JSON.parse(xhttp.response);
          product = teddy;
            console.log('image');
          productImage.src = teddy.imageUrl;
          productName.textContent = teddy.name;
          productDescription.textContent = teddy.description;
          productPrice.textContent =  `$${teddy.price / 100}.00`;
          product.addcart = 0;

          function addItems(){
            let customisation = object.values(teddy.colors);
            for(let i = 0; i < customisation.lenght; i++){
                let element = document.createElement('option');
                element.innerText = '' + customisation[i];
                dropDownMenu.appendChild(element);
            }
          }
        addItems();
        }
      
        
      }
      xhttp.send();
      }

        //call single product if id exist
  let url = window.location.href;
  let newURL = new URL(url);
  let id = newURL.searchParams.get('id');
  if(id!=''){
    
      displaySingleProduct(id);
  }


  //Add to cart(product)
  function addToCart(teddy){
  teddy = {
    id : teddy._id,
    qty: 1,
    price: teddy.price,
    name: teddy.name,
    image: teddy.imageUrl
  }
  if (localStorage.getItem("productsInCart") ===null) {
      localStorage.setItem('productsInCart', JSON.stringify([]));
  }

  //step to retrieve the productList in localStorage
  let productsInCart = JSON.parse(localStorage.getItem('productsInCart'));
  console.log(productsInCart.length)
  //step 2 check if the teddy is already in the list
  if (productsInCart.length == null){
    productsInCart.push(teddy);
  } else {
    //step 2a if the teddy is already in the list, then update the quantity +1
    let index = productsInCart.findIndex(o => o.id == teddy._id);
    console.log(index);
    if (index != -1) {
      productsInCart[index].qty += 1;
    } else {
          //step 2b otherwise add the teddy as a new entry
          productsInCart.push(teddy);    
    }
    localStorage.setItem('productsInCart', JSON.stringify(productsInCart))
    let qty = JSON.parse(localStorage.getItem('qty')) + 1
    localStorage.setItem('qty', JSON.stringify(qty))
    let itemNumberInCart = document.getElementById('itemNumberInCart')
    itemNumberInCart.innerHTML = qty
  
  }
   // updateCartTotal('add',1);
}
let addToCartBtn = document.getElementById('addToCart');
addToCartBtn.addEventListener('click', () => {
    addToCart(product);
})

// Display Cart Items..

const updateCartTotal = (name, price, qty) => {

  this.name = name
  this.price = price
  this.qty = qty
}

const displayCartItems = () => {
  console.log('starting');
  let cartItems = localStorage.getItem('productsInCart');
  cartItems = JSON.parse(cartItems);
  let productContainer = document.getElementById('cart-products');

  if (cartItems && productContainer) {
    console.log('cart-product')
    let output = '';
    let total = 0;
    cartItems.forEach(function(teddy) {
      output += `  <tr>
      <td>
        <div class="cart-items">
          <div class="cart-row">
          <img src="${teddy.image}">
          <div>
            <p>${teddy.name}</p>
            <small class="cart-price-input">$${teddy.price / 100}.00</small>
            <br>
            <a onclick="removeFromCart('${teddy.id}');"href="#" id="btn-danger">Remove</a>
          </div>
        </div>
      </td>
        <td><input class="cart-quantity-input" type="number" value="1"></td>
        <td  class="cart-total-price">$${teddy.price / 100}.00</td>
    </tr>  `
      total += teddy.qty * (teddy.price / 100);

    });
    productContainer.innerHTML = output;

    let displayTotal = document.getElementById('total');
    displayTotal.innerHTML = `$${total}.00`;
  }

}
//Display Cart.
displayCartItems();


let checkOut = document.getElementById('checkoutButton');
checkOut.addEventListener('click', (e) => {
    console.log('submitting');
    e.preventDefault();
    let productID = [];
    let contact = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value
    }
    if(contact.firstName != '' && contact.lastName != '' 
    &&  ValidateEmail(contact.email) != false && address != '' && city != ''){
    let productsInCart = localStorage.getItem('productsInCart');
    productsInCart = JSON.parse(productsInCart);
    productsInCart.forEach((product) => {
        productID.push(product.id)
    });
    console.log(productID);


    const xhr = new XMLHttpRequest();

// listen for load event
    xhr.onload = () => {

    // print JSON response
    if (xhr.status >= 200 && xhr.status < 300) {
        // parse JSON
        const response = xhr.responseText;
        console.log(response);
        window.location.href = 'confirmation.html?total=' + document.getElementById('total').innerHTML + '&response=' + response;
        
        
    }
};


// open request
xhr.open('POST', 'http://localhost:3000/api/teddies/order');

// set Content-Type header
xhr.setRequestHeader('Content-Type', 'application/json');


// send rquest with JSON payload
xhr.send(JSON.stringify({ contact: contact, products: productID }));
    } else {
        alert('Ensure all the fields are valid!');
    }
})

function ValidateEmail(mail) 
{
if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail))
  {
    return (true)
  }
    return (false)
}

//Remove from Cart//
const removeFromCart = (id) => {
  let list = JSON.parse(localStorage.getItem('productsInCart'));
  // step to check if the teddy is already in the list
  //step 2a  if the teddy is already in the list, then update the quantity +1
  let teddyNumber = localStorage.getItem('qty') 
  teddyNumber = parseInt(teddyNumber)
  let index = list.findIndex(o => o.id == id); 
  let productNumbers = localStorage.getItem('qty');
  productNumbers = parseInt(productNumbers);
  localStorage.setItem('qty', productNumbers - list[index].qty);
  let qty = JSON.parse(localStorage.getItem('qty'))
if (qty == null) { 
  qty = 0;
  localStorage.setItem('qty', 0);
}
let itemNumberInCart = document.getElementById('numbers')
    itemNumberInCart.innerHTML = qty
localStorage.setItem('qty', teddyNumber - 1)
  if (index != -1) {
    console.log('deleting');
    list.splice(index,1);
    console.log(list);
  }
  localStorage.setItem("productsInCart", JSON.stringify(list))

  displayCartItems();
}

