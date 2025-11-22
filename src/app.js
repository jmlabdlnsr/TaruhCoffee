document.addEventListener('alpine:init', () => {
    Alpine.data('products', () => ({
        items: [
            {id: 1, name: 'Hot Espresso', img: '1.jpg', price: 18000},
            {id: 2, name: 'Hot Split Shot', img: '1.jpg', price: 28000},
            {id: 3, name: 'Hot Magic', img: '1.jpg', price: 23000},
            {id: 4, name: 'Ice Magic', img: '1.jpg', price: 25000},
            {id: 5, name: 'Hot Pour Over', img: '1.jpg', price: 20000},
            {id: 6, name: 'Ice Pour Over', img: '1.jpg', price: 20000},
            {id: 7, name: 'Hot vanilla Latte', img: '1.jpg', price: 24000},
            {id: 8, name: 'Ice vanilla Latte', img: '1.jpg', price: 26000},
            {id: 9, name: 'Hot Caramel Latte', img: '1.jpg', price: 24000},
            {id: 10, name: 'Ice Caramel Latte', img: '1.jpg', price: 26000},
            {id: 11, name: 'lavaberry', img: '1.jpg', price: 25000},
            {id: 12, name: 'The Older', img: '1.jpg', price: 25000},
            {id: 13, name: 'Mount Blanc', img: '1.jpg', price: 25000},
            {id: 14, name: 'nagoya', img: '1.jpg', price: 23000},
            {id: 15, name: 'Hot Chocolatte', img: '1.jpg', price: 22000},
            {id: 16, name: 'Ice Chocolatte', img: '1.jpg', price: 24000},
            {id: 17, name: 'Hot Redvelvet Latte', img: '1.jpg', price: 22000},
            {id: 18, name: 'Ice Redvelvet Latte', img: '1.jpg', price: 24000},
        ]
    }));

    Alpine.store('cart', {
        items: [],
        total: 0,
        qty: 0,
        add(newItem){
            //cek apa ada barang yang sama?
            const cartItem = this.items.find((item) => item.id === newItem.id);

            //jika belum ada / cart kosong
            if(!cartItem){
                this.items.push({...newItem, qty: 1, total: newItem.price });
                this.qty++;
                this.total += newItem.price;
            }else{
                //jika barang udah ada, cek apakah beda atau sama dengan di cart
                this.items = this.items.map((item) => {
                    //jika barang beda
                    if(item.id !== newItem.id){
                        return item;
                    }else{
                        //jika barang sudah ada, tambah qty dan total nya
                        item.qty++;
                        item.total = item.price * item.qty;
                        this.qty++
                        this.total+= item.price;
                        return item;
                    }
                });
            }
        },
        remove(id){
            //ambil item yg mau di remove
            const cartItem = this.items.find((item) => item.id === id);

            //jika item lebih dari 1
            if(cartItem.qty > 1) {
                //telusuri 1 per 1
                this.items = this.items.map((item) => {
                    //jika bukan barang yg di klik
                    if(item.id !== id){
                        return item;
                    }else{
                        item.qty--;
                        item.total = item.price * item.qty;
                        this.qty--;
                        this.total -= item.price;
                        return item;
                    }
                })
            }else if(cartItem.qty === 1) {
                //jika barang sisa 1
                this.items = this.items.filter((item) => item.id !== id);
                this.qty--;
                this.total -= cartItem.price;
            }
        }
    });
});


//form validassi
const checkoutButton = document.querySelector('.checkout-button');
checkoutButton.disabled = true;

const form = document.querySelector('#checkoutForm');


form.addEventListener('keyup', function(){
    for (let i = 0; i < form.elements.length; i++){
        if(form.elements[i].value.length !== 0){
            checkoutButton.classList.remove('disabled');
            checkoutButton.classList.add('disabled');
        }else{
            return false;
        }
    }
    checkoutButton.disabled = false;
    checkoutButton.classList.remove('disabled');
});

//kirim data saat button di klik
checkoutButton.addEventListener('click', async function(e) {
    e.preventDefault();
    const formData = new FormData(form);
    const data = new URLSearchParams(formData);
    const objData = Object.fromEntries(data);
    // const message = formatMessage(objData);
    // window.open('http://wa.me/6281321550948?text=' + encodeURIComponent(message));

    //minta transaction token menggunakan ajax/fetch
    try{
        const response = await fetch('php/placeOrder.php', {
            method: 'POST',
            body: data,
        });
        const token = await response.text();
        // console.log('token');
        window.snap.pay(token);
    }catch(err){
        console.log(err.message);
    }

})

//format pesan wa
// const formatMessage = (obj) =>{
//     return `Test Data Customer
//     Nama : ${obj.name}
//     Email: ${obj.email}
//     No HP: ${obj.phoneNumber}
// Data pesanan:
// ${JSON.parse(obj.items).map((item) => `${item.name} (${item.qty} x ${rupiah(item.total)})\n`)}
// TOTAL: ${rupiah(obj.total)}`;
// }

//konversi rupiah
const rupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
};
