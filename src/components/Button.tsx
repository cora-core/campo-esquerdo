'use client'


import React from 'react';

type ButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    className?: string;
    scrollTo?: string;
}

export function Button({
                           children,
                           onClick,
                           variant = 'primary',
                           size = 'medium',
                           disabled = false,
                           className = '',
                           scrollTo

                       }: ButtonProps) {
    const baseStyles = 'font-medium font-bold tracking-wide rounded-none transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variants = {
        primary: 'bg-white hover:bg-gray-100 text-black border-2 border-black',
        secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500'
    };

    const sizes = {
        small: 'px-4 py-2 text-sm',
        medium: 'px-8 py-4 text-base',
        large: 'px-12 py-4 text-5xl'
    };

    const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';

    const handleClick = () => {
        if (scrollTo) {
            const lenis = window.lenis;
            if (lenis) {
                lenis.scrollTo(scrollTo, {
                    offset: 0,
                    duration: 1.5,
                    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                });
            }
        }

        if (onClick) {
            onClick();
        }
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabledStyles} ${className}`}
            onClick={handleClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
