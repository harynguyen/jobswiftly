import React, { useEffect, useState } from 'react';
import { ActionMeta, MultiValue } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { urlBackend } from '~/global';

interface FormJob {
    job_id: string;
    job_name: string;
    job_number_require: number;
    job_description: string;
    job_requirement_tech: { value: string; label: string }[];
    job_location: { value: string; label: string }[];
    job_salary_range: string;
    job_level: string;
    job_type: string;
    job_experience: string;
    job_expired: string;
    company_id: string;
    userId: string;
}

interface Job {
    job_id: string;
    job_name: string;
    job_number_require: number;
    job_description: string;
    job_requirement_tech: string;
    job_location: string;
    job_salary_range: string;
    job_level: string;
    job_type: string;
    job_experience: string;
    job_status: string;
    job_expired: string;
    company: Company;
}

interface Company {
    company_id: string;
    company_name: string;
}

interface JobCreateFormProps {
    job?: Job;
    refresh: () => void;
}

interface CustomErrors {
    job_name?: string;
    job_number_require?: string;
    job_description?: string;
    job_salary_range?: string;
    job_level?: string;
    job_type?: string;
    job_experience?: string;
    job_expired?: string;
    company_id?: string;
    job_location?: string;
    job_requirement_tech?: string;
}

const JobUpdateForm: React.FC<JobCreateFormProps> = ({ job, refresh }) => {
    const [formData, setFormData] = useState<FormJob>(() => {
        const userId = sessionStorage.getItem('userId') || "";
        // Convert job_requirement_tech and job_location to arrays of { value: string; label: string }
        const convertedJobRequirementTech = job?.job_requirement_tech.split(',').map(tech => ({ value: tech.trim(), label: tech.trim() })) || [];
        const convertedJobLocation = job?.job_location.split(',').map(location => ({ value: location.trim(), label: location.trim() })) || [];
        return {
            job_id: job?.job_id || "",
            job_name: job?.job_name || "",
            job_number_require: job?.job_number_require || 0,
            job_description: job?.job_description || "",
            job_requirement_tech: convertedJobRequirementTech,
            job_location: convertedJobLocation,
            job_salary_range: job?.job_salary_range || "",
            job_level: job?.job_level || "",
            job_type: job?.job_type || "",
            job_experience: job?.job_experience || "",
            job_expired: job?.job_expired || "",
            company_id: job?.company.company_id || "",
            userId: userId,
        };
    });

    useEffect(() => {
        // Update form data when job prop changes
        if (job) {
            const userId = sessionStorage.getItem('userId') || '';
            const convertedJobRequirementTech = job.job_requirement_tech.split(',').map(tech => ({ value: tech.trim(), label: tech.trim() }));
            const convertedJobLocation = job.job_location.split(',').map(location => ({ value: location.trim(), label: location.trim() }));
            setFormData({
                job_id: job.job_id || '',
                job_name: job.job_name || '',
                job_number_require: job.job_number_require || 0,
                job_description: job.job_description || '',
                job_requirement_tech: convertedJobRequirementTech,
                job_location: convertedJobLocation,
                job_salary_range: job.job_salary_range || '',
                job_level: job.job_level || '',
                job_type: job.job_type || '',
                job_experience: job.job_experience || '',
                job_expired: job.job_expired || '',
                company_id: job.company.company_id || '',
                userId: userId,
            });
            setSelectedOptionTechnologies(convertedJobRequirementTech);
            setSelectedOptionLocations(convertedJobLocation);
        }
    }, [job]);

    const [selectedOptionTechnologies, setSelectedOptionTechnologies] = useState<{ value: string; label: string }[] | null>(
        job?.job_requirement_tech
            ? job.job_requirement_tech.split(',').map(tech => ({ value: tech.trim(), label: tech.trim() }))
            : null
    );
    const [selectedOptionLocations, setSelectedOptionLocations] = useState<{ value: string; label: string }[] | null>(
        job?.job_location
            ? job.job_location.split(',').map(location => ({ value: location.trim(), label: location.trim() }))
            : null
    );

    const [companies, setCompanies] = useState<Company[]>([]);
    const [errors, setErrors] = useState<Partial<CustomErrors>>({});

    const validateForm = () => {
        const errors: Partial<CustomErrors> = {};
        if (!formData.job_name) errors.job_name = "Job name is required";
        if (formData.job_number_require <= 0) errors.job_number_require = "Number of requirement must be greater than 0";
        if (!formData.job_description) errors.job_description = "Job description is required";
        if (!formData.job_salary_range) errors.job_salary_range = "Salary range is required";
        if (!formData.job_level) errors.job_level = "Level is required";
        if (!formData.job_type) errors.job_type = "Type of work is required";
        if (!formData.job_experience) errors.job_experience = "Experience is required";
        if (!formData.job_expired) errors.job_expired = "Deadline is required";
        if (!formData.company_id) errors.company_id = "Company is required";
        if (!selectedOptionLocations || selectedOptionLocations.length === 0) errors.job_location = "Location is required";
        if (!selectedOptionTechnologies || selectedOptionTechnologies.length === 0) errors.job_requirement_tech = "Technologies are required";
        setErrors(errors);
        setTimeout(() => {
            setErrors({});
        }, 3000);
        return Object.keys(errors).length === 0;
    };

    const handleJobSubmission = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const userId = sessionStorage.getItem('userId');

        // Check if userId exists
        if (!userId) {
            alert("User ID not found");
            return;
        }

        if (!validateForm()) return;


        const data: FormJob = {
            ...formData,
            job_requirement_tech: selectedOptionTechnologies || [],
            job_location: selectedOptionLocations || [],
            userId: userId,
            job_id: ""
        };
        if (job) {
            data.job_id = job.job_id;
        }

        try {
            const response = await fetch(`${urlBackend}/job/updateJob`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                window.alert("Job Updated Successfully!!!");
                refresh();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        getAllCompany();
    }, []);

    const getAllCompany = async () => {
        try {
            const userId = sessionStorage.getItem('userId');
            const response = await fetch(`${urlBackend}/company/getAllCompany/${userId}`, {
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });
            if (response) {
                const data = await response.json();
                setCompanies(data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const optionLocations = [
        { value: "Ha Noi", label: "Ha Noi" },
        { value: "Da Nang", label: "Da Nang" },
        { value: "Ho Chi Minh", label: "Ho Chi Minh" },
        { value: "Can Tho", label: "Can Tho" },
    ];

    const optionTechnologies = [
        { value: "Python", label: "Python" },
        { value: "JavaScript", label: "JavaScript" },
        { value: "Java", label: "Java" },
        { value: "C#", label: "C#" },
        { value: "C++", label: "C++" },
        { value: "Swift", label: "Swift" },
        { value: "Go (Golang)", label: "Go (Golang)" },
        { value: "HTML/CSS", label: "HTML/CSS" },
        { value: "React.js", label: "React.js" },
        { value: "Angular", label: "Angular" },
        { value: "Vue.js", label: "Vue.js" },
        { value: "Bootstrap", label: "Bootstrap" },
        { value: "SQL (Structured Query Language)", label: "SQL (Structured Query Language)" },
        { value: "MySQL", label: "MySQL" },
        { value: "PostgreSQL", label: "PostgreSQL" },
        { value: "MongoDB", label: "MongoDB" },
        { value: "Amazon Web Services (AWS)", label: "Amazon Web Services (AWS)" },
        { value: "Microsoft Azure", label: "Microsoft Azure" },
        { value: "Google Cloud Platform (GCP)", label: "Google Cloud Platform (GCP)" },
        { value: "Firewalls", label: "Firewalls" },
        { value: "Intrusion Detection Systems (IDS) and Intrusion Prevention Systems (IPS)", label: "Intrusion Detection Systems (IDS) and Intrusion Prevention Systems (IPS)" },
        { value: "Endpoint Protection", label: "Endpoint Protection" },
        { value: "Security Information and Event Management (SIEM)", label: "Security Information and Event Management (SIEM)" },
    ]

    const handleLocationsChange = (newValue: MultiValue<{ value: string; label: string; }>, actionMeta: ActionMeta<{ value: string; label: string; }>) => {
        setSelectedOptionLocations(Array.from(newValue));
    };

    const handleTechnologiesChange = (newValue: MultiValue<{ value: string; label: string; }>, actionMeta: ActionMeta<{ value: string; label: string; }>) => {
        setSelectedOptionTechnologies(Array.from(newValue));
    };


    return (
        <form onSubmit={handleJobSubmission} className='p-2 m-2'>
            <div className='create-job-flex m-1 p-1'>
                <div className='lg:w-5/12 w-full'>
                    <label className='block font-semibold'>Title of Job:</label>
                    <input type="text" className='create-job-input pl-10 pr-3 py-2 rounded-lg ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500' placeholder="Ex: Web developer" value={formData.job_name} onChange={(e) => setFormData({ ...formData, job_name: e.target.value })} />
                    {errors.job_name && <p className="text-xs font-semibold text-red-500">* {errors.job_name}</p>}
                </div>

                <div className='lg:w-3/12 w-full'>
                    <label className='block font-semibold'>Number of Requirement:</label>
                    <input type="number" className='create-job-input pl-10 pr-3 py-2 rounded-lg ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500' placeholder="Ex: 01" value={formData.job_number_require} onChange={(e) => setFormData({ ...formData, job_number_require: parseInt(e.target.value) })} />
                    {errors.job_number_require && <p className="text-xs font-semibold text-red-500">* {errors.job_number_require}</p>}
                </div>

                <div className='lg:w-4/12 w-full'>
                    <label className='block font-semibold'>Location:</label>
                    <CreatableSelect
                        isMulti
                        value={selectedOptionLocations}
                        onChange={handleLocationsChange}
                        options={optionLocations}
                        className='create-job-input pl-10 pr-3 py-2 rounded-lg ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500'
                    />
                    {errors.job_location && <p className="text-xs font-semibold text-red-500">* {errors.job_location}</p>}
                </div>
            </div>

            <div className='create-job-flex m-1 p-1'>
                <div className='lg:w-1/3 w-full'>
                    <label className='block font-semibold'>Company:</label>
                    <select
                        className='create-job-input pl-10 pr-3 py-2 rounded-lg ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500'
                        value={formData.company_id}
                        onChange={(e) => setFormData({ ...formData, company_id: e.target.value })}
                    >
                        <option disabled selected value="">
                            Select Company
                        </option>
                        {companies && companies.map((company) => (
                            <option key={company.company_id} value={company.company_id}>
                                {company.company_name}
                            </option>
                        ))}
                    </select>
                    {errors.company_id && <p className="text-xs font-semibold text-red-500">* {errors.company_id}</p>}
                </div>

                <div className='lg:w-1/3 w-full'>
                    <label className='block font-semibold'>Level of Working Experience:</label>
                    <select className='create-job-input pl-10 pr-3 py-2 rounded-lg ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500' value={formData.job_level} onChange={(e) => setFormData({ ...formData, job_level: e.target.value })}>
                        <option disabled selected value="">Select the year of woking experience</option>
                        <option value="Intern">Intern</option>
                        <option value="Fresher">Fresher</option>
                        <option value="Junior">Junior</option>
                        <option value="Middle">Middle</option>
                        <option value="Senior">Senior</option>
                        <option value="Executive">Executive</option>
                        <option value="Expert">Expert</option>
                    </select>
                    {errors.job_level && <p className="text-xs font-semibold text-red-500">* {errors.job_level}</p>}
                </div>

                <div className='lg:w-1/3 w-full'>
                    <label className='block font-semibold'>Year of Working Experience:</label>
                    <select className='create-job-input pl-10 pr-3 py-2 rounded-lg ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500' value={formData.job_experience} onChange={(e) => setFormData({ ...formData, job_experience: e.target.value })}>
                        <option disabled selected value="">Select the year of woking experience</option>
                        <option value="1 year">1 year</option>
                        <option value="2 years">2 years</option>
                        <option value="3 years">3 years</option>
                        <option value="4 years">4 years</option>
                        <option value="5 years">5 years</option>
                        <option value="Over 5 years">Over 5 years</option>
                    </select>
                    {errors.job_experience && <p className="text-xs font-semibold text-red-500">* {errors.job_experience}</p>}
                </div>
            </div>

            <div className='create-job-flex m-1 p-1'>
                <div className='lg:w-1/2 w-full'>
                    <label className='block font-semibold'>Type of Work:</label>
                    <select className='create-job-input pl-10 pr-3 py-2 rounded-lg ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500' value={formData.job_type} onChange={(e) => setFormData({ ...formData, job_type: e.target.value })}>
                        <option disabled selected value="">Select the type of work</option>
                        <option value="Full-time Employment">Full-time Employment</option>
                        <option value="Part-time Employment">Part-time Employment</option>
                        <option value="Freelancing/Contracting">Freelancing/Contracting</option>
                        <option value="Remote Work">Remote Work</option>
                        <option value="Gig Economy">Gig Economy</option>
                        <option value="Entrepreneurship">Entrepreneurship</option>
                        <option value="Internships">Internships</option>
                        <option value="Volunteer Work">Volunteer Work</option>
                    </select>
                    {errors.job_type && <p className="text-xs font-semibold text-red-500">* {errors.job_type}</p>}
                </div>

                <div className='lg:w-1/2 w-full'>
                    <label className='block font-semibold'>Range of Salary:</label>
                    <select className='create-job-input pl-10 pr-3 py-2 rounded-lg ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500' value={formData.job_salary_range} onChange={(e) => setFormData({ ...formData, job_salary_range: e.target.value })}>
                        <option disabled selected value="">Select the range of work</option>
                        <option value="Under 1,000$">Under 1,000$</option>
                        <option value="Under 2,000$">Under 2,000$</option>
                        <option value="Under 3,000$">Under 3,000$</option>
                        <option value="Under 4,000$">Under 4,000$</option>
                        <option value="Under 5,000$">Under 5,000$</option>
                        <option value="Over 5,000$">Over 5,000$</option>
                        <option value="Wage Agreement">Wage Agreement</option>
                    </select>
                    {errors.job_salary_range && <p className="text-xs font-semibold text-red-500">* {errors.job_salary_range}</p>}
                </div>
            </div>

            <div className='create-job-flex m-1 p-1'>
                <div className='w-full '>
                    <label className='block font-semibold'>Application Technologies:</label>
                    <CreatableSelect
                        isMulti
                        value={selectedOptionTechnologies}
                        onChange={handleTechnologiesChange}
                        options={optionTechnologies}
                        className='create-job-input pl-10 pr-3 py-2 rounded-lg ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500'
                    />
                    {errors.job_requirement_tech && <p className="text-xs font-semibold text-red-500">* {errors.job_requirement_tech}</p>}
                </div>
            </div>

            <div className='create-job-flex m-1 p-1'>
                <div className='w-full '>
                    <label className='block font-semibold'>Job Description:</label>
                    <textarea className='create-job-input pl-10 pr-3 py-2 rounded-lg ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500' rows={6} placeholder='Job Description' value={formData.job_description} onChange={(e) => setFormData({ ...formData, job_description: e.target.value })} />
                    {errors.job_description && <p className="text-xs font-semibold text-red-500">* {errors.job_description}</p>}
                </div>
            </div>

            <div className='create-job-flex m-1 p-1'>
                <div className='w-full '>
                    <label className='block font-semibold'>Deadline of Job:</label>
                    <input type="date" className='create-job-input pl-10 pr-3 py-2 rounded-lg ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500' value={formData.job_expired} onChange={(e) => setFormData({ ...formData, job_expired: e.target.value })} />
                    {errors.job_expired && <p className="text-xs font-semibold text-red-500">* {errors.job_expired}</p>}
                </div>
            </div>

            <div className='w-full m-1 p-1'>
                <div className="w-full">
                    <button className="block w-full max-w-xs mx-auto bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white rounded-lg px-3 py-3 font-semibold">Update Job</button>
                </div>
            </div>
        </form>
    );
};

export default JobUpdateForm;
