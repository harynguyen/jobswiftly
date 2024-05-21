import React, { useRef } from 'react';
import { IoMailUnreadOutline } from "react-icons/io5";
import { urlBackend } from '~/global';

const Newsletter: React.FC = () => {
    const email = useRef<null | HTMLInputElement>(null);
    const handleOnClick = async () => {
        const emailValue = email.current?.value;
        if(emailValue)
        sendEmail(emailValue, "Jobswifty System - New Letter", "Thank you for trusting and use our service, we will send you notification about job available soon!!");
    }
    const sendEmail = async (recipientEmail: string, subject: string, message: string) => {
        try {
            console.log("email called");
            const response = await fetch(`${urlBackend}/email/send/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    recipientEmail: recipientEmail,
                    subject: subject,
                    message: message,
                })
            });
            if (response.ok) {
                console.log("Send email success!");
                window.alert("Thank you for providing your email, we will get in touch with you soon!!");
            }
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <div className='space-y-20'>
            <div>
                <h3 className='text-lg font-bold mb-2 flex items-center'><IoMailUnreadOutline />&nbsp;E-mail me for new jobs!</h3>
                <p className='text-primary/75 text-base mb-2'>Input your e-mail here to get new job notifications!</p>
                <div className='w-full space-y-4'>
                    <input type='email' name='email' id='email' ref={email} placeholder='email@mail.com' className='w-full py-2 pl-3 border rounded md:rounded-e-none ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500' />
                    <button onClick={handleOnClick} className='w-full block py-2 pl-3 border focus:outline-none bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 rounded text-white cursor-pointer font-semibold text-center'> Submit </button>
                </div>
            </div>

        </div>
    );
}

export default Newsletter;
