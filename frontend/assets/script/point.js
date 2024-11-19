const cart = [];

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const name = button.getAttribute('data-name');
        const price = parseFloat(button.getAttribute('data-price'));
        addToCart(name, price);
        updateCartDisplay();
    });
});

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
}

function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        const listItem = document.createElement('tr');
        listItem.innerHTML = `
            <td>${item.name}</td>
            <td>₱${item.price.toFixed(2)}</td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="changeQuantity('${item.name}', -1)">-</button>
                ${item.quantity}
                <button class="btn btn-sm btn-secondary" onclick="changeQuantity('${item.name}', 1)">+</button>
            </td>
            <td>₱${(item.price * item.quantity).toFixed(2)}</td>
            <td><i class="fa-solid fa-trash delete" style="color: #f00000; cursor: pointer;" onclick="removeFromCart('${item.name}')"></i></td>
        `;
        cartItemsContainer.appendChild(listItem);
    });

    document.getElementById('total-price').innerText = total.toFixed(2);
}

function changeQuantity(name, delta) {
    const item = cart.find(item => item.name === name);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(name);
        } else {
            updateCartDisplay();
        }
    }
}

function removeFromCart(name) {
    const index = cart.findIndex(item => item.name === name);
    if (index > -1) {
        cart.splice(index, 1);
        updateCartDisplay();
    }
}
