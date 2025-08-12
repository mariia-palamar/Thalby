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