import { guideBooks } from './data.js';

// header animation

let lastScroll = 0
const defaultOffset = 200
const header = document.querySelector('.header')

const scrollPosition = () => window.pageYOffset || document.documentElement.scrollTop
const isHide = () => header.classList.contains('hide')

window.addEventListener('scroll', () => {
    if (scrollPosition() > lastScroll && !isHide() && scrollPosition() > defaultOffset) {
        header.classList.add('hide')

    } else if (scrollPosition() < lastScroll && isHide()) {
        header.classList.remove('hide')
    }

    lastScroll = scrollPosition()
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
cartBtn.addEventListener('click', () => cartAside.classList.toggle('active'))
closeCart.addEventListener('click', () => cartAside.classList.remove('active'))


let cart = new Map()

function addToCart(book) {
    if (cart.has(book.id)) {
        const item = cart.get(book.id)
        cart.set(book.id, { ...item, quantity: item.quantity + 1 })
    } else {
        cart.set(book.id, { ...book, quantity: 1 })
    }
    renderCart()
}

function renderCart() {
    const cartList = document.querySelector('.cart__list')
    cartList.innerHTML = ''

    if (cart.size === 0) {
        const emptyCart = document.querySelector('.cart-aside__is-empty')
        emptyCart.classList.remove('none')

    } else if (cart.size !== 0) {
        const emptyCart = document.querySelector('.cart-aside__is-empty')
        emptyCart.classList.add('none')
    }


    cart.forEach(item => {
        const cartListItem = document.createElement('li')
        const cartItemImg = document.createElement('img')
        const cartItemTop = document.createElement('div')
        const cartItemTitle = document.createElement('h5')
        const cartItemDeleteBtn = document.createElement('button')
        const cartItemBottom = document.createElement('div')
        const cartItemQuantity = document.createElement('div')
        const quantityBtnDecrease = document.createElement('button')
        const quantityBtnDecreaseIcon = document.createElement('img')
        const quantityInput = document.createElement('input')
        const quantityBtnIncrease = document.createElement('button')
        const quantityBtnIncreaseIcon = document.createElement('img')
        const cartItemPrice = document.createElement('span')

        cartItemImg.src = item.image
        cartItemImg.alt = item.title
        cartItemTitle.textContent = item.title
        cartItemDeleteBtn.src = './icons/delete-item-icon.svg'
        cartItemDeleteBtn.alt = 'Delete icon'
        quantityBtnDecrease.type = 'button'
        quantityBtnDecreaseIcon.src = item.quantity <= 1 ? './icons/decrease-icon-unactive.svg' : './icons/decrease-icon.svg'
        quantityBtnDecreaseIcon.alt = 'Decrease icon'
        quantityInput.min = 1
        quantityBtnIncreaseIcon.src = './icons/increase-icon.svg'
        quantityBtnIncreaseIcon.alt = 'Increase icon'
        quantityInput.type = 'number'
        quantityInput.value = parseInt(item.quantity)
        cartItemPrice.textContent = `${parseFloat((item.quantity * item.price).toFixed(2))}$`

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
        quantityBtnDecrease.appendChild(quantityBtnDecreaseIcon)
        quantityBtnIncrease.appendChild(quantityBtnIncreaseIcon)
        cartItemQuantity.append(quantityBtnDecrease, quantityInput, quantityBtnIncrease)
        cartItemBottom.append(cartItemQuantity, cartItemPrice)
        cartListItem.append(cartItemImg, cartItemTop, cartItemBottom)
        cartList.appendChild(cartListItem)

        function updateItem(quantity) {
            if (isNaN(quantity) || quantity < 1) quantity = 1
            cart.set(item.id, { ...item, quantity })
            quantityInput.value = quantity
            cartItemPrice.textContent = `${parseFloat((quantity * item.price).toFixed(2))}$`
            quantityBtnDecreaseIcon.src = quantity <= 1 ? './icons/decrease-icon-unactive.svg' : './icons/decrease-icon.svg'
        }

        quantityInput.addEventListener('input', () => updateItem(parseInt(quantityInput.value)))
        quantityInput.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                e.preventDefault()
                quantityInput.blur()
                updateItem(parseInt(quantityInput.value))
            }
        })
    })
}