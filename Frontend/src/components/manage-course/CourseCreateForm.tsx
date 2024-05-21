import React, { useState } from 'react';
import { urlBackend } from '~/global';

interface FormData {
    course_name: string;
    course_start_time: string;
    course_end_time: string;
}

interface CourseCreateFormProps {
    refresh: () => void;
}

interface CustomErrors {
    course_name?: string;
    course_start_time?: string;
    course_end_time?: string;
    start_end?: string;
}

const CourseCreateForm: React.FC<CourseCreateFormProps> = ({ refresh }) => {
    const [formData, setFormData] = useState<FormData>({
        course_name: "",
        course_start_time: "",
        course_end_time: "",
    });

    const [errors, setErrors] = useState<Partial<CustomErrors>>({});

    const validateForm = () => {
        const errors: Partial<CustomErrors> = {};
        if (!formData.course_name) errors.course_name = "Course name is required";
        if (!formData.course_start_time) errors.course_start_time = "Course start time is required";
        if (!formData.course_end_time) errors.course_end_time = "Course end time required";
        if (formData.course_start_time >= formData.course_end_time) errors.start_end = "Start time must be greater than end time";
        setErrors(errors);
        setTimeout(() => {
            setErrors({});
        }, 3000);
        return Object.keys(errors).length === 0;
    };

    const handleCourseSubmission = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validateForm()) return;

        const data: FormData = {
            course_name: formData.course_name || "",
            course_start_time: formData.course_start_time || "",
            course_end_time: formData.course_end_time || "",
        };

        try {
            const response = await fetch(`${urlBackend}/course/createCourse`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                window.alert("Post New Course Successfully!!!");
                refresh();
                resetFormData();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const resetFormData = () => {
        setFormData({
            course_name: "",
            course_start_time: "",
            course_end_time: "",
        });
    };


    return (
        <form onSubmit={handleCourseSubmission} className='p-2 m-2'>
            <div className='create-job-flex m-1 p-1'>
                <div className='w-full'>
                    <label className='block font-semibold'>Name of Course:</label>
                    <input type="text" className='create-job-input pl-10 pr-3 py-2 rounded-lg ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500' placeholder="Ex: Course A" value={formData.course_name} onChange={(e) => setFormData({ ...formData, course_name: e.target.value })} />
                    {errors.course_name && <p className="text-xs font-semibold text-red-500">* {errors.course_name}</p>}
                </div>
            </div>
            <div className='create-job-flex m-1 p-1'>
                <div className='lg:w-6/12 w-full'>
                    <label className='block font-semibold'>Start Time of Course:</label>
                    <input type="datetime-local" className='create-job-input pl-10 pr-3 py-2 rounded-lg ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500' value={formData.course_start_time} onChange={(e) => setFormData({ ...formData, course_start_time: e.target.value })} />
                    {errors.course_start_time && <p className="text-xs font-semibold text-red-500">* {errors.course_start_time}</p>}
                    {errors.start_end && <p className="text-xs font-semibold text-red-500">* {errors.start_end}</p>}
                </div>
                <div className='lg:w-6/12 w-full'>
                    <label className='block font-semibold'>End Time of Course:</label>
                    <input type="datetime-local" className='create-job-input pl-10 pr-3 py-2 rounded-lg ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500' value={formData.course_end_time} onChange={(e) => setFormData({ ...formData, course_end_time: e.target.value })} />
                    {errors.course_end_time && <p className="text-xs font-semibold text-red-500">* {errors.course_end_time}</p>}
                </div>
            </div>
            <div className='w-full m-1 p-1'>
                <div className="w-full">
                    <button className="block w-full max-w-xs mx-auto bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white rounded-lg px-3 py-3 font-semibold">Post Course</button>
                </div>
            </div>
        </form>
    );
};

export default CourseCreateForm;
