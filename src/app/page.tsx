// app/page.tsx - Clean static layout with proper header hierarchy
'use client'

import { useState } from 'react'
import { Button } from '@/components/Button'
import { slideAnimations } from '@/animations/scrollNavigations'

export default function Home() {
    const [showSections, setShowSections] = useState(false)

    const handleEntrarClick = async () => {
        // Animate button sliding out
        slideAnimations.slideButtonOut()

        // Show the horizontal sections after button slides out
        setTimeout(() => {
            setShowSections(true)

            // Simple initialization (no complex scroll logic)
            setTimeout(() => {
                console.log('Sections loaded - keeping it simple!')
                slideAnimations.initScrollNavigation()
            }, 200)
        }, 800)
    }

    return (
        <div className="relative">
            {/* Hero section with Entrar button */}
            <section className="relative h-screen flex items-center justify-center bg-white overflow-hidden">
                <Button
                    size={'large'}
                    onClick={handleEntrarClick}
                    className="entrar-button"
                >
                    ENTRAR
                </Button>
            </section>

            {/* Static horizontal sections */}
            {showSections && (
                <>
                    {/* Headers - completely separate from scrolling content */}
                    <div className="fixed top-0 left-0 w-full z-50">
                        {/* Vertical divider line - spans full viewport height */}
                        <div className="absolute top-0 w-0.5 h-screen bg-black z-20" style={{ left: 'calc(100vw - 10vw)' }}></div>

                        {/* Global header bar - spans entire width */}
                        <div className="w-full bg-white border-b border-black relative">
                            <div className="flex items-center justify-between px-8 py-4">
                                <span className="text-black font-bold text-lg tracking-wide bg-white px-2">CAMPO ESQUERDO 2025</span>
                                <span className="text-black font-bold text-lg tracking-wide bg-white px-2">MAM-RJ / MUSEU DE ARTE MODERNA</span>
                            </div>
                        </div>

                        {/* Floating navigation bar - shows current section */}
                        <div className="w-full bg-white border-b border-black relative z-10">
                            <div className="flex items-center px-8 py-4">
                                <div className="bg-white px-0 py-2">
                                    <span className="text-black font-bold text-xl tracking-wide bg-white px-2 relative z-30">SITE</span>
                                </div>
                                {/* Show SOBRE when it's visible */}
                                <div className="bg-white px-0 py-2 ml-auto">
                                    <span className="text-black font-bold text-xl tracking-wide bg-white px-2 relative z-30">SOBRE</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content area - separate container */}
                    <div className="fixed top-32 left-0 w-full h-[calc(100vh-8rem)] overflow-hidden z-10">
                        <div
                            className="horizontal-container flex w-[200vw] h-full"
                            style={{ transform: 'translateX(-10vw)' }}
                        >
                            {/* Site section - 100vw wide */}
                            <section className="w-screen h-full flex items-center justify-center bg-white relative flex-shrink-0">
                                {/* Main content */}
                                <div className="max-w-4xl mx-auto px-8 text-center">
                                    <h2 className="text-4xl font-bold mb-8 text-black">Site</h2>
                                    <p className="text-xl text-gray-700 leading-relaxed">
                                        Welcome to Campo Esquerdo 2025. This is the static SITE section.
                                    </p>
                                </div>
                            </section>

                            {/* Sobre section - 100vw wide */}
                            <section className="w-screen h-full flex bg-gray-50 relative flex-shrink-0">
                                {/* Left side - sketches/drawings area */}
                                <div className="w-1/2 p-8 overflow-hidden">
                                    <div className="w-full h-full bg-gray-100 border border-gray-300 flex items-center justify-center">
                                        <span className="text-gray-500">Abstract sketches/drawings area</span>
                                    </div>
                                </div>

                                {/* Right side - content area */}
                                <div className="w-1/2 p-8 border-l-2 border-black">
                                    <div className="mb-8">
                                        <h3 className="text-2xl font-bold mb-4 text-black">FASE II</h3>
                                        <p className="text-base text-gray-700 leading-relaxed mb-6">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
                                        </p>
                                        <p className="text-base text-gray-700 leading-relaxed mb-6">
                                            Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.
                                        </p>
                                        <p className="text-base text-gray-700 leading-relaxed">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.
                                        </p>
                                    </div>

                                    <Button
                                        size={'large'}
                                        onClick={() => window.location.reload()}
                                        className="mt-8"
                                    >
                                        Voltar
                                    </Button>
                                </div>
                            </section>
                        </div>
                    </div>
                </>
            )}

            {/* Spacer sections for scroll - simple scroll area */}
            {showSections && (
                <>
                    <section className="h-screen bg-transparent"></section>
                    <section className="h-screen bg-transparent"></section>
                    <section className="h-screen bg-transparent"></section>
                </>
            )}
        </div>
    )
}