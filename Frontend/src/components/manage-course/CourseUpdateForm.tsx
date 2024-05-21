import React, { useEffect, useState } from 'react';
import { urlBackend } from '~/global';

interface FormData {
    course_id: string;
    course_name: string;
    course_start_time: string;
    course_end_time: string;
}

interface Course {
    course_id: string;
    course_name: string;
    course_start_time: string;
    course_end_time: string;
}

interface CourseCreateFormProps {
    course?: Course;
    refresh: () => void;
}

interface CustomErrors {
    course_name?: string;
    course_start_time?: string;
    course_end_time?: string;
    start_end?: string;
}

const CourseUpdateForm: React.FC<CourseCreateFormProps> = ({ course, refresh }) => {
    const [formData, setFormData] = useState<FormData>({
        course_id: course?.course_id || "",
        course_name: course?.course_name || "",
        course_start_time: course?.course_start_time || "",
        course_end_time: course?.course_end_time || ""
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

        try {
            const response = await fetch(`${urlBackend}/course/updateCourse/`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                window.alert("Course Updated Successfully!!!");
                refresh();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };


    const formatStringToDateTimeLocal = (dateTimeString: string) => {
        const date = new Date(dateTimeString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    useEffect(() => {
        if (course) {
            const formattedStartTime = formatStringToDateTimeLocal(course.course_start_time);
            const formattedEndTime = formatStringToDateTimeLocal(course.course_end_time);
            setFormData({
                course_id: course.course_id,
                course_name: course.course_name,
                course_start_time: formattedStartTime,
                course_end_time: formattedEndTime
            });
        }
    }, [course]);

    return (
        <form onSubmit={handleCourseSubmission} className='m-2 p-2'>
            <div className='create-job-flex m-1 p-1'>
                <div className='lg:w-12/12 w-full'>
                    <label className='block font-semibold'>Title of Course:</label>
                    <input type="text" className='create-job-input pl-10 pr-3 py-2 rounded-lg ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500' placeholder="Ex: Web developer" value={formData.course_name} onChange={(e) => setFormData({ ...formData, course_name: e.target.value })} />
                    {errors.course_name && <p className="text-xs font-semibold text-red-500">* {errors.course_name}</p>}
                </div>
            </div>
            <div className='create-job-flex m-1 p-1'>
                <div className='lg:w-6/12 w-full'>
                    <label className='block font-semibold'>Start Time of Course:</label>
                    <input type="datetime-local" className='create-job-input pl-10 pr-3 py-2 rounded-lg ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500' value={formData.course_start_time} onChange={(e) => setFormData({ ...formData, course_start_time: e.target.value })} />
                    {errors.course_start_time && <p className="text-xs font-semibold text-red-500">* {errors.course_start_time}</p>}
                </div>
                <div className='lg:w-6/12 w-full'>
                    <label className='block font-semibold'>End Time of Course:</label>
                    <input type="datetime-local" className='create-job-input pl-10 pr-3 py-2 rounded-lg ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500' value={formData.course_end_time} onChange={(e) => setFormData({ ...formData, course_end_time: e.target.value })} />
                    {errors.course_end_time && <p className="text-xs font-semibold text-red-500">* {errors.course_end_time}</p>}
                </div>
            </div>
            <div className='w-full m-1 p-1'>
                <div className="w-full">
                    <button className="block w-full max-w-xs mx-auto bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white rounded-lg px-3 py-3 font-semibold">Update Course</button>
                </div>
            </div>
        </form>
    );
};

export default CourseUpdateForm;
