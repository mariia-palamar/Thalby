import { guideBooks } from './data.js';

// header animation

let lastScroll = 0
const defaultOffset = 200
const header = document.querySelector('.header')
const burger = document.getElementById('burger')
const headerNav = document.querySelector('.header__nav')
const headerActions = document.querySelector('.header__actions')

const scrollPosition = () => window.pageYOffset || document.documentElement.scrollTop
const isHide = () => header.classList.contains('hide')

window.addEventListener('scroll', () => {
    if (scrollPosition() > lastScroll && !isHide() && scrollPosition() > defaultOffset) {
        header.classList.add('hide')
        burger.classList.add('hide')
        headerNav.classList.add('hide')
        headerActions.classList.add('hide')
    } else if (scrollPosition() < lastScroll && isHide()) {
        header.classList.remove('hide')
        burger.classList.remove('hide')
        headerNav.classList.remove('hide')
        headerActions.classList.remove('hide')
    }

    lastScroll = scrollPosition()
})

burger.addEventListener('click', () => {
    burger.classList.toggle('active')
    headerNav.classList.toggle('active')
    headerActions.classList.toggle('active')
})

// best sellers render

const guideList = document.querySelector('.guide__list')

guideBooks.forEach(book => {
    const guideItem = document.createElement('li')
    const guideItemImg = document.createElement('img')
    const guideItemTitle = document.createElement('h4')
    const guideItemPrice = document.createElement('p')
    const guideItemBtn = document.createElement('button')

    guideItemImg.src = book.image
    guideItemImg.alt = book.alt
    guideItemBtn.type = "button"
    guideItemTitle.textContent = book.title
    guideItemPrice.textContent = `USD ${book.price}`
    guideItemBtn.textContent = 'Add to cart'

    guideItem.classList.add('guide__item')
    guideItemImg.classList.add('guide__item-img')
    guideItemTitle.classList.add('guide__item-title', 'title')
    guideItemPrice.classList.add('guide__item-price')
    guideItemBtn.classList.add('guide__item-btn', 'underline-hover')

    guideItem.append(guideItemImg, guideItemTitle, guideItemPrice, guideItemBtn)
    guideList.appendChild(guideItem)

    guideItemBtn.addEventListener('click', () => addToCart(book))
})

// cart
const cartBtn = document.getElementById('cart')
const cartAside = document.querySelector('.cart-aside')
const closeCart = document.querySelector('.cart__close-btn')

window.addEventListener('load', () => {
    cartAside.classList.add('transition-ready')
    headerNav.classList.add('transition-ready')
    headerActions.classList.add('transition-ready')
})

cartBtn.addEventListener('click', () => cartAside.classList.toggle('active'))
closeCart.addEventListener('click', () => cartAside.classList.remove('active'))

const cart = new Map()
document.addEventListener('DOMContentLoaded', () => loadFromLocalStorage())
// loadFromLocalStorage()

function addToCart(book) {
    const id = String(book.id)
    if (cart.has(id)) {
        const item = cart.get(id)
        cart.set(id, { ...item, quantity: item.quantity + 1 })
    } else {
        cart.set(id, { ...book, quantity: 1 })
    }
    renderCart()
    itemQuantity()
    saveToLocalStorage(cart)
}

function renderCart() {
    const cartList = document.querySelector('.cart__list')
    const orderAccepted = document.querySelector('.cart-aside__order-accepted')

    if (orderAccepted) { orderAccepted.classList.add('none') }

    cartList.innerHTML = ''

    cart.forEach(item => {
        createCartItem(item, cartList)
    })

    const oldCartBottom = document.querySelector('.cart__bottom')
    if (oldCartBottom) { oldCartBottom.remove() }
    renderCartBottom(cartList, orderAccepted)

    updatedTotal()
    itemQuantity()
    isCartEmpty()
}

function createCartItem(item, cartList) {
    const cartListItem = document.createElement('li')
    const cartItemImg = document.createElement('img')
    const cartItemTop = document.createElement('div')
    const cartItemTitle = document.createElement('h5')
    const cartItemDeleteBtn = document.createElement('button')
    const deleteIcon = document.createElement('img')
    const cartItemBottom = document.createElement('div')
    const cartItemQuantity = document.createElement('div')
    const quantityBtnDecrease = document.createElement('button')
    const quantityBtnDecreaseIcon = document.createElement('img')
    const quantityInput = document.createElement('input')
    const quantityBtnIncrease = document.createElement('button')
    const quantityBtnIncreaseIcon = document.createElement('img')
    const cartItemPrice = document.createElement('span')

    cartListItem.dataset.id = item.id
    cartItemImg.src = item.image
    cartItemImg.alt = item.title
    cartItemTitle.textContent = item.title
    cartItemDeleteBtn.type = 'button'
    deleteIcon.src = './icons/delete-item-icon.svg'
    deleteIcon.alt = 'Delete item'
    quantityBtnDecrease.type = 'button'
    quantityBtnDecreaseIcon.src = item.quantity <= 1 ? './icons/decrease-icon-unactive.svg' : './icons/decrease-icon.svg'
    quantityBtnDecreaseIcon.alt = 'Decrease icon'
    quantityInput.min = 1
    quantityBtnIncreaseIcon.src = './icons/increase-icon.svg'
    quantityBtnIncreaseIcon.alt = 'Increase icon'
    quantityInput.type = 'number'
    quantityInput.value = parseInt(item.quantity)
    cartItemPrice.textContent = `$${parseFloat((item.quantity * item.price).toFixed(2))}`

    cartListItem.classList.add('cart__list-item')
    cartItemImg.classList.add('cart__item-img')
    cartItemTop.classList.add('cart__item-top')
    cartItemTitle.classList.add('cart__item-title')
    cartItemDeleteBtn.classList.add('cart__item-delete-btn')
    cartItemBottom.classList.add('cart__item-bottom')
    cartItemQuantity.classList.add('cart__item-quantity')
    quantityBtnDecrease.classList.add('quantity-btn', 'quantity-btn--decrease')
    quantityInput.classList.add('quantity-input')
    quantityBtnIncrease.classList.add('quantity-btn', 'quantity-btn--increase')
    cartItemPrice.classList.add('cart__item-price')

    cartItemTop.append(cartItemTitle, cartItemDeleteBtn)
    cartItemDeleteBtn.appendChild(deleteIcon)
    quantityBtnDecrease.appendChild(quantityBtnDecreaseIcon)
    quantityBtnIncrease.appendChild(quantityBtnIncreaseIcon)
    cartItemQuantity.append(quantityBtnDecrease, quantityInput, quantityBtnIncrease)
    cartItemBottom.append(cartItemQuantity, cartItemPrice)
    cartListItem.append(cartItemImg, cartItemTop, cartItemBottom)
    cartList.appendChild(cartListItem)
    console.log(cartList);

    quantityBtnDecrease.addEventListener('click', () => decreaseQuantity(item, quantityInput, cartItemPrice, quantityBtnDecreaseIcon))
    quantityBtnIncrease.addEventListener('click', () => increaseQuantity(item, quantityInput, cartItemPrice, quantityBtnDecreaseIcon))
    cartItemDeleteBtn.addEventListener('click', () => deleteItem(item, cartListItem))
    quantityInput.addEventListener('keydown', (e) => handleEnter(e, item, quantityInput, cartItemPrice, quantityBtnDecreaseIcon))
    quantityInput.addEventListener('input', () => changedInput(item, quantityInput, cartItemPrice, quantityBtnDecreaseIcon))
}

function updateItem(quantity, item, quantityInput, cartItemPrice, quantityBtnDecreaseIcon) {
    const id = String(item.id)
    if (isNaN(quantity) || quantity < 1) quantity = 1
    cart.set(id, { ...item, quantity })
    quantityInput.value = quantity
    cartItemPrice.textContent = `$${parseFloat((quantity * item.price).toFixed(2))}`
    quantityBtnDecreaseIcon.src = quantity <= 1 ? './icons/decrease-icon-unactive.svg' : './icons/decrease-icon.svg'
    saveToLocalStorage(cart)
}

function decreaseQuantity(item, quantityInput, cartItemPrice, quantityBtnDecreaseIcon) {
    updateItem(parseInt(quantityInput.value) - 1, item, quantityInput, cartItemPrice, quantityBtnDecreaseIcon)
    updatedTotal()
    itemQuantity()
}

function increaseQuantity(item, quantityInput, cartItemPrice, quantityBtnDecreaseIcon) {
    updateItem(parseInt(quantityInput.value) + 1, item, quantityInput, cartItemPrice, quantityBtnDecreaseIcon)
    updatedTotal()
    itemQuantity()
}

function changedInput(item, quantityInput, cartItemPrice, quantityBtnDecreaseIcon) {
    updateItem(parseInt(quantityInput.value), item, quantityInput, cartItemPrice, quantityBtnDecreaseIcon)
    updatedTotal()
}

function handleEnter(e, item, quantityInput, cartItemPrice, quantityBtnDecreaseIcon) {
    if (e.key === 'Enter') {
        e.preventDefault()
        quantityInput.blur()
        updateItem(parseInt(quantityInput.value), item, quantityInput, cartItemPrice, quantityBtnDecreaseIcon)
        itemQuantity()
        updatedTotal()
        saveToLocalStorage(cart)
    }
}

function deleteItem(item, cartListItem) {
    const id = String(item.id)
    cart.delete(id)
    cartListItem.remove()
    itemQuantity()
    updatedTotal()
    saveToLocalStorage(cart)
    isCartEmpty()
}

function renderCartBottom(cartList, orderAccepted) {
    const cartBottom = document.createElement('form')
    cartBottom.classList.add('cart__bottom')
    cartBottom.innerHTML = `<p class="cart__bottom-total"><strong>Total</strong> <span class="total-sum">$${totalSum(cart).toFixed(2)}</span></p>
            <div class="cart__bottom-agreement">
                <input type="checkbox" id="privacy-policy">
                <label for="privacy-policy">I agree to the <a href="./privacy-policy-terms.html" class="underline-hover">Terms</a> and <a href="./privacy-policy-terms.html" class="underline-hover">Privacy Policy</a>.</label>
            </div>
            <button type="button" class="cart__bottom-btn">Buy Now</button>`

    cartList.insertAdjacentElement('afterend', cartBottom)

    isCartEmpty()

    const checkbox = cartBottom.querySelector('#privacy-policy')
    const bottomBtn = cartBottom.querySelector('.cart__bottom-btn')

    isChecked(bottomBtn, checkbox)

    bottomBtn.addEventListener('click', () => {
        cartList.innerHTML = ''
        clearLocalStorage()
        cart.clear()
        itemQuantity()
        orderAccepted.classList.remove('none')
        cartBottom.classList.add('none')
    })

    checkbox.addEventListener('change', () => isChecked(bottomBtn, checkbox))
}

function isCartEmpty() {
    const emptyCart = document.querySelector('.cart-aside__empty')
    const orderAccepted = document.querySelector('.cart-aside__order-accepted')
    const cartBottom = document.querySelector('.cart__bottom')
    const cartList = document.querySelector('.cart__list')

    if (cart.size === 0) {
        emptyCart.classList.remove('none')
        if (cartBottom) cartBottom.classList.add('none')
        if (cartList) cartList.innerHTML = ''
        updatedTotal()
        clearLocalStorage()
    } else if (cart.size !== 0) {
        emptyCart.classList.add('none')
        orderAccepted.classList.add('none')
        if (cartBottom) cartBottom.classList.remove('none')
    }
}

function totalSum(cart) {
    let total = 0
    cart.forEach(item => total += item.quantity * item.price)
    return total
}

function updatedTotal() {
    const totalElement = document.querySelector('.total-sum')
    if (totalElement) totalElement.textContent = `$${totalSum(cart).toFixed(2)}`
    isCartEmpty()
}

function isChecked(bottomBtn, checkbox) {
    bottomBtn.disabled = !checkbox.checked
}

function itemQuantity() {
    const quantityContainer = document.querySelector('.quantity')
    let total = 0
    cart.forEach(item => total += item.quantity)
    total === 0 ? quantityContainer.textContent = '' : quantityContainer.textContent = parseInt(total)
}

function saveToLocalStorage(cart) {
    const cartModified = Object.fromEntries(cart)
    localStorage.setItem('data', JSON.stringify(cartModified))
}

function loadFromLocalStorage() {
    const data = localStorage.getItem('data')
    if (!data) return

    if (data) {
        const modifiedData = JSON.parse(data)
        for (const id in modifiedData) {
            cart.set(id, modifiedData[id])
        }
        renderCart()
        itemQuantity()
    }
}

function clearLocalStorage() {
    localStorage.removeItem('data')
}