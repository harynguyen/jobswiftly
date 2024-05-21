import React, { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import Navbar from '~/components/Navbar';
import { urlBackend } from '~/global';
import { Footer } from '~/components/Footer';


interface Profile {
    profile_id: string;
    first_name: string;
    last_name: string;
    dob: string;
    phone_number: string;
    avatar: string;
}

const Profile: React.FC = () => {
    const [imageFile, setImageFiles] = useState<File | null | undefined>(null);
    const [formData, setFormData] = useState<Profile>({
        profile_id: "",
        first_name: "",
        last_name: '',
        dob: '',
        phone_number: '',
        avatar: ''
    });

    useEffect(() => {
        getProfile();
    }, []);

    const getProfile = async () => {
        try {
            const userId = sessionStorage.getItem('userId');
            const response = await fetch(`${urlBackend}/profile/getProfileByUserId/${userId}`, {
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });
            if (response) {
                const data = await response.json();
                if (data.avatar !== "") {
                    const getImageResponse = await fetch(`${urlBackend}/profile/getImage/${data.avatar}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        }
                    });
                    if (getImageResponse.ok) {
                        const imageUrl = await getImageResponse.text();
                        data.avatar = imageUrl;
                    }
                }
                setFormData(data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const userId = sessionStorage.getItem('userId');
        if (!userId) {
            console.error('User ID not found');
            return;
        }

        const formDataCreate = new FormData();
        formDataCreate.append("profile_id", formData.profile_id);
        formDataCreate.append("first_name", formData.first_name);
        formDataCreate.append("last_name", formData.last_name);
        formDataCreate.append("phone_number", formData.phone_number);
        formDataCreate.append("dob", formData.dob);
        if (imageFile) {
            formDataCreate.append("imageFile", imageFile as Blob);
        }

        try {
            const response = await fetch(`${urlBackend}/profile/updateProfile`, {
                method: 'POST',
                body: formDataCreate
            });

            if (response.ok) {
                window.alert('Profile update successfully!');
                const data = await response.json();
                if (imageFile) {
                    setFormData(prevState => ({
                        ...prevState,
                        avatar: URL.createObjectURL(imageFile),
                    }));

                    setImageFiles(null);
                }
            } else {
                window.alert('Failed to update profile.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg') {
                setImageFiles(file);
            } else {
                window.alert('Only PNG and JPG files are allowed.');
                event.target.value = '';
            }
        }
    };

    return (
        <div>
            <Navbar />
            <PageHeader title={"Profile"} path={"Profile"} />
            <div className='flex flex-col bg-gray-100 sm:flex-row lg:px-24 px-4 my-10 w-full py-12 gap-8'>
                <div className='sm:w-full bg-white p-4 rounded-sm '>
                    <div className='m-2 p-2 border rounded border-black'>
                        <form className="mx-auto " onSubmit={handleFormSubmit}>
                            <div className='create-job-flex m-2 p-2  rounded'>
                                <div className="lg:w-6/12 w-full">
                                    <label htmlFor="first_name" className="block ">First Name:</label>
                                    <input type="text" id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:outline-none ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500" />
                                </div>
                                <div className="lg:w-6/12 w-full">
                                    <label htmlFor="last_name" className="block  ">Last Name:</label>
                                    <input type="text" id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:outline-none ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500" />
                                </div>
                            </div>
                            <div className='create-job-flex m-2 p-2  rounded'>
                                <div className=" lg:w-6/12 w-full">
                                    <label htmlFor="dob" className="block ">Date Of Birth:</label>
                                    <input type="date" id="dob" name="dob" value={formData.dob} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:outline-none ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500" />
                                </div>
                                <div className="lg:w-6/12 w-full">
                                    <label htmlFor="phone_number" className="block ">Phone Number:</label>
                                    <input type="number" id="phone_number" name="phone_number" value={formData.phone_number} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:outline-none ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500" />
                                </div>
                            </div>
                            <div className='create-job-flex m-2 p-2  rounded'>
                                <div className="mb-4 lg:w-12/12 w-full">
                                    <label htmlFor="company_logo_name" className="block">Import Profile Picture:</label>
                                    <input type="file" id="company_logo_name" name="company_logo_name" accept=".png, .jpg, .jpeg" onChange={handleFileChange} className="w-full px-4 py-2 border rounded-md focus:outline-none ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500" multiple={false} />
                                </div>
                            </div>
                            <div className='create-job-flex m-2 p-2 rounded'>
                                {imageFile && (
                                    <div>
                                        <label className="block">New Avatar:</label>
                                        <div className='flex justify-center ml-3'>
                                            <img
                                                src={URL.createObjectURL(imageFile)}
                                                alt="New Avatar"
                                                className="object-cover w-240 h-240 border border-gray-500 rounded-full"
                                                style={{ maxWidth: '240px', maxHeight: '240px', objectFit: 'cover' }}
                                            />
                                        </div>
                                    </div>

                                )}
                                {formData.avatar ? (
                                    <div>
                                        <label className="block">Current Avatar:</label>
                                        <div className='flex justify-center ml-3'>
                                            <img
                                                src={formData.avatar}
                                                alt="Selected Avatar"
                                                className="object-cover w-240 h-240 border border-gray-500 rounded-full"
                                                style={{ maxWidth: '240px', maxHeight: '240px', objectFit: 'cover' }}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block mb-1">Default Avatar:</label>
                                        <div className='flex justify-center ml-3'>
                                            <img
                                                src="/avt.png"
                                                alt="Default Avatar"
                                                className="object-cover w-240 h-240 border border-gray-500 rounded-full"
                                                style={{ maxWidth: '240px', maxHeight: '240px', objectFit: 'cover' }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className='w-full my-5'>
                                <div className="w-full px-3 mb-5">
                                    <button className="block w-full max-w-xs mx-auto bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white rounded-lg px-3 py-3 font-semibold">Update</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Profile;
