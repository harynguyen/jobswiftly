import React from 'react'
import PageHeader from '~/components/PageHeader';
import Navbar from '../components/Navbar';
import { Footer } from '~/components/Footer';

const AboutUs = () => {
    return (
        <div>
            <Navbar />
            <PageHeader title={"ABOUT US"} path={"About Us"} />
            <div className='flex flex-col bg-gray-100 sm:flex-row lg:px-24 px-4 my-10 w-full py-12 gap-8'>
                <div className='sm:w-full bg-white p-4 rounded-sm '>
                    <div className='m-2 p-2 border rounded border-black'>
                        <div className="overflow-x-auto mb-2 mt-4 p-2 ">
                            <div className='mb-10'>
                                <h1 className='text-3xl font-bold text-primary mb-3'>About JobSwiftly</h1>
                                <p className='text-1xl text-justify text-primary mb-3'>
                                    Welcome to JobSwiftly, your premier destination for seamless online recruitment and career development solutions. At JobSwiftly, we are committed to revolutionising how job seekers and employers connect in today's dynamic employment landscape. Our platform offers a comprehensive suite of features designed to empower users at every stage of their professional journey.
                                </p>
                                <div className='flex items-stretch '>
                                    <div className='md:w-5/12 flex flex-col justify-center'>
                                        <p className='text-1xl text-justify text-primary mb-3'>
                                            Whether you are a job seeker looking to explore new opportunities or an employer seeking top talent, JobSwiftly provides the tools and resources you need to succeed. From intuitive job search and filtering options to personalised soft skills courses, our platform is tailored to meet the diverse needs of today's workforce.
                                        </p>
                                        <p className='text-1xl text-justify text-primary mb-3'>
                                            At JobSwiftly, we believe in the power of collaboration and community. Our platform fosters a supportive environment where users can network, learn, and grow. With a commitment to user empowerment and continuous innovation, JobSwiftly is poised to redefine the online recruitment experience, making it faster, more innovative, and more efficient than ever before.
                                        </p>
                                        <p className='text-1xl text-justify text-primary mb-3'>
                                            Join us on this exciting journey and discover the endless possibilities that await JobSwiftly. Together, let's unlock your full potential and pave the way for a brighter future in the world of work.
                                        </p>
                                    </div>
                                    <div className='md:w-7/12 m-3 flex items-center'>
                                        <img
                                            src="/about-us.jpg"
                                            alt="Selected Avatar"
                                            className="object-cover h-full w-full"
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className='mb-10'>
                                <h1 className='text-3xl font-bold text-primary mb-3'>Get Personalised Assistance via Email</h1>
                                <p className='text-1xl text-justify text-primary mb-3'>
                                    Need assistance or have a query? Contact our dedicated team of assistants via email for prompt and personalised support. Whether you have questions about our platform, require technical assistance, or need help navigating our services, our team is here to assist you every step.
                                </p>
                                <p className='text-1xl text-justify text-primary mb-3'>
                                    Please email us at <b>assistant@jobswiftly.com</b>, and one of our friendly assistants will reply immediately. We value your feedback and are committed to providing you with the best possible experience on our platform.
                                </p>
                                <p className='text-1xl text-justify text-primary mb-3'>
                                    Don't hesitate to contact us. Your satisfaction is our priority, and we're here to help you succeed.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default AboutUs