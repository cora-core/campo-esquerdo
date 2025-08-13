'use client'

import { ReactNode, useEffect } from 'react'
import Lenis from 'lenis'

declare global {
    interface Window {
        lenis?: Lenis
    }
}

type SmoothScrollProviderProps = {
    children: ReactNode
}
export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
            infinite: false,
        })

        // Set up the animation loop
        function raf(time: number) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }
        requestAnimationFrame(raf)

        // Expose lenis globally for manual scroll control
        window.lenis = lenis

        // Cleanup function
        return () => {
            lenis.destroy()
        }
    }, [])

    return <>{children}</>
}
