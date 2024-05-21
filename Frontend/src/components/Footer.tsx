import React from 'react'

export const Footer = () => {
    return (
        <div className="max-w-screen-2xl bg-white container mx-auto flex items-center justify-center mb-8">
            <div className='flex flex-col items-center justify-center '>
                <div>
                    <a className="flex items-center gap-2 text-2xl text-black">
                        <span className='text-indigo-500'><b>JobSwiftly</b></span>
                    </a>
                </div>
                <div>
                    <p className="text-base text-center text-gray-500">Copyright © 2024 JobSwiftly. All Rights Reserved.</p>
                </div>
            </div>
        </div>
    )
}
