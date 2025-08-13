// animations/scrollNavigations.js
import { animate } from 'animejs'

export const slideAnimations = {
    // Button slide out - ONLY animation we keep
    slideButtonOut: (selector = '.entrar-button') => {
        return animate(selector, {
            translateX: '-100vw',
            duration: 800,
            easing: 'spring(1, 80, 10, 0)'
        })
    },

    // Simple initialization - no scroll hijacking
    initScrollNavigation: () => {
        console.log('No scroll animations - keeping it simple!')
    },

    // Utility functions (unchanged)
    slideOut: (selector, direction = 'left', duration = 600) => {
        const directions = {
            left: '-100vw',
            right: '100vw',
            up: '-100vh',
            down: '100vh'
        }

        return animate(selector, {
            translateX: direction === 'left' || direction === 'right' ? directions[direction] : 0,
            translateY: direction === 'up' || direction === 'down' ? directions[direction] : 0,
            duration,
            easing: 'spring(1, 80, 10, 0)'
        })
    },

    slideIn: (selector, direction = 'right', duration = 600, delay = 0) => {
        const fromPositions = {
            left: ['-100vw', '0vw'],
            right: ['100vw', '0vw'],
            up: ['-100vh', '0vh'],
            down: ['100vh', '0vh']
        }

        return new Promise((resolve) => {
            setTimeout(() => {
                animate(selector, {
                    translateX: direction === 'left' || direction === 'right' ? fromPositions[direction] : [0, 0],
                    translateY: direction === 'up' || direction === 'down' ? fromPositions[direction] : [0, 0],
                    duration,
                    easing: 'spring(1, 80, 10, 0)',
                    complete: resolve
                })
            }, delay)
        })
    }
}