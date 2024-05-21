import React, { useState } from 'react';
import { urlBackend } from '~/global';

interface CompanyUpdateFormProps {
    company?: Company;
    refresh: () => void;
}

interface FormData {
    company_id: string;
    company_name: string;
    company_address: string;
    company_size: string;
    company_country: string;
    company_work_date_range: string;
    company_description: string;
    company_status: string;
    company_logo_name: string;
    user_id: string | null;
}

interface Company {
    company_id: string;
    company_name: string;
    company_address: string;
    company_size: string;
    company_country: string;
    company_work_date_range: string;
    company_description: string;
    company_status: string;
    company_logo_name: string;
}

const UpdateCompanyForm: React.FC<CompanyUpdateFormProps> = ({ company, refresh }) => {
    const [formData, setFormData] = useState<FormData>({
        company_id: company ? company.company_id : "",
        company_name: company ? company.company_name : "",
        company_address: company ? company.company_address : '',
        company_size: company ? company.company_size : '',
        company_country: company ? company.company_country : '',
        company_work_date_range: company ? company.company_work_date_range : '',
        company_description: company ? company.company_description : '',
        company_status: company ? company.company_status : '',
        company_logo_name: company ? company.company_logo_name : '',
        user_id: "",
    });
    const [imageFile, setImageFiles] = useState<File | null | undefined>(null);

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const userId = sessionStorage.getItem('userId');
        if (!userId) {
            // Handle case where userId is null
            console.error('User ID not found');
            return;
        }

        const formDataCreate = new FormData();
        formDataCreate.append("company_id", formData.company_id);
        formDataCreate.append("company_name", formData.company_name);
        formDataCreate.append("company_address", formData.company_address);
        formDataCreate.append("company_size", formData.company_size);
        formDataCreate.append("company_country", formData.company_country);
        formDataCreate.append("company_work_date_range", formData.company_work_date_range);
        formDataCreate.append("company_description", formData.company_description);
        if (imageFile) {
            formDataCreate.append("imageFile", imageFile as Blob);
        }
        formDataCreate.append("user_id", userId);

        try {
            const response = await fetch(`${urlBackend}/company/updateCompany`, {
                method: 'POST',
                body: formDataCreate
            });

            if (response.ok) {
                window.alert('Company Updated Successfully!!!');
                const data = await response.json();
                if(imageFile)
                setFormData({
                    company_id: data.company_id,
                    company_name: data.company_name,
                    company_address: data.company_address,
                    company_size: data.company_size,
                    company_country: data.company_country,
                    company_work_date_range: data.company_work_date_range,
                    company_description: data.ompany_description,
                    company_status: data.company_status,
                    company_logo_name: "",
                    user_id: "",
                });
                
                refresh();
            } else {
                window.alert('Failed To Update Company!!!');
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
<form className='p-2 m-2' onSubmit={handleFormSubmit}>
            <div className='create-job-flex m-1 p-1'>
                <div className="lg:w-4/12 w-full">
                    <label htmlFor="company_name" className="block font-semibold">Name of Company:</label>
                    <input type="text" id="company_name" name="company_name" placeholder='Ex: Unilever' value={formData.company_name} onChange={handleChange} className='create-job-input pl-10 pr-3 py-2 rounded-lg ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500'/>
                </div>
                <div className="lg:w-4/12 w-full">
                    <label htmlFor="company_address" className="block font-semibold">Address of Company:</label>
                    <input type="text" id="company_address" placeholder='Ex: Ho Chi Minh' name="company_address" value={formData.company_address} onChange={handleChange} className='create-job-input pl-10 pr-3 py-2 rounded-lg ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500'/>
                </div>
                <div className="lg:w-4/12 w-full">
                    <label htmlFor="company_size" className="block font-semibold">Size of Company:</label>
                    <input type="text" id="company_size" placeholder='Ex: More than 100 employees ' name="company_size" value={formData.company_size} onChange={handleChange} className='create-job-input pl-10 pr-3 py-2 rounded-lg ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500'/>
                </div>
            </div>

            <div className='create-job-flex m-1 p-1'>
                <div className="mb-4m lg:w-6/12 w-full">
                    <label htmlFor="company_country" className="block font-semibold">Country of Company:</label>
                    <input type="text" id="company_country" placeholder='Ex: London' name="company_country" value={formData.company_country} onChange={handleChange} className='create-job-input pl-10 pr-3 py-2 rounded-lg ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500'/>
                </div>
                <div className="mb-4m lg:w-6/12 w-full">
                    <label htmlFor="company_work_date_range" className="block font-semibold">Work Date Range:</label>
                    <input type="text" id="company_work_date_range" placeholder='Ex: 20 days per month' name="company_work_date_range" value={formData.company_work_date_range} onChange={handleChange} className='create-job-input pl-10 pr-3 py-2 rounded-lg ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500' />
                </div>
            </div>

            <div className='create-job-flex m-1 p-1'>
                <div className="lg:w-4/12 w-full">
                    <label htmlFor="company_logo_name" className="block font-semibold">Logo of Company:</label>
                    <input type="file" id="company_logo_name" name="company_logo_name" accept=".png, .jpg, .jpeg" onChange={handleFileChange} className='create-job-input pl-10 pr-3 py-2 rounded-lg ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500' multiple={false} />
                </div>
                <div className="lg:w-8/12 w-full">
                    <label htmlFor="company_description" className="block font-semibold">Description of Company:</label>
                    <textarea id="company_description" placeholder='Describe the company here' name="company_description" value={formData.company_description} onChange={handleChange} className='create-job-input pl-10 pr-3 py-2 rounded-lg ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500'/>
                </div>
            </div>
            {imageFile && (
                <div className='create-job-flex m-1 p-1'>
                    <div className="w-full ">
                        <label className="block items-center font-semibold">Logo Preview:</label>
                        <img
                            src={URL.createObjectURL(imageFile)}
                            alt="Selected Logo"
                            className="object-cover w-240 h-240 border border-gray-500"
                            style={{ maxWidth: '360px', maxHeight: '360px', objectFit: 'cover' }}
                        />
                    </div>
                </div>
            )}
            <div className='w-full my-5'>
                <div className="w-full px-3 mb-5">
                    <button className="block w-full max-w-xs mx-auto bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white rounded-lg px-3 py-3 font-semibold">Update Company</button>
                </div>
            </div>
        </form >
    );
};

export default UpdateCompanyForm;
