// Toggle class active untuk shopping cart
const shoppingCart = document.querySelector('.shopping-cart');
document.querySelector('#shopping-cart-button').onclick = (e) => {
  shoppingCart.classList.toggle('active');
  e.preventDefault();
};

// Klik di luar elemen
const sc = document.querySelector('#shopping-cart-button');

document.addEventListener('click', function (e) {
  if (
    !sc.contains(e.target) &&
    !shoppingCart.contains(e.target) &&
    !e.target.closest('#add') &&
    !e.target.closest('#remove')
  ) {
    shoppingCart.classList.remove('active');
  }
});

