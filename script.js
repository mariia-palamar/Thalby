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