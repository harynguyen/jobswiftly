import { useState } from 'react';
import { urlBackend } from '~/global';

interface ApplyFormJobProps {
    jobId: string;
    onClose: () => void;
}

const ApplyFormJob: React.FC<ApplyFormJobProps> = ({ jobId, onClose }) => {
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [letter, setLetter] = useState('');

    const handleSubmit = async () => {
        try {
            // Perform validation here
            const userId = sessionStorage.getItem('userId');
            if (!userId) {
                // Handle case where userId is null
                console.error('User ID not found');
                return;
            }
            const formData = new FormData();
            formData.append('job_id', jobId);
            formData.append('cv_description', letter);
            formData.append('user_id', userId);
            if (cvFile) {
                formData.append('CvFile', cvFile as Blob);
            }

            const response = await fetch(`${urlBackend}/cv/createCv`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                window.alert("Job Applied Successfully!!!");
                onClose();
            } else {
                const data = await response.json();
                window.alert(data.message);
            }
        } catch (error) {
            console.error('Error submitting application:', error);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.type === 'application/pdf') {
                setCvFile(file);
            } else {
                window.alert('Only PDF files are allowed.');
                event.target.value = '';
            }
        }
    };

    return (
        <div className="fixed top-0 left-0 z-100 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-75">
            <div className="bg-white rounded-lg w-full p-8 max-w-lg">
                <h2 className="text-3xl text-center font-semibold ">Apply this Job</h2>
                <p className=' mb-4'>Fill all required information to apply this job!</p>
                <label className=' mt-2 text-sm'>Import your CV (PDF only):</label>
                <input type="file" accept=".pdf" onChange={handleFileChange} className="w-full px-4 py-3 border rounded-md ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 mb-4" multiple={false} /> 
                <label className='mt-2 text-sm'>Write letter for HR:</label>
                <textarea className="w-full h-32 border ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg px-4 py-3" placeholder="Letter to HR here!" value={letter} onChange={(e) => setLetter(e.target.value)} /> 
                <div className="flex justify-between mt-2">
                    <button className="py-2 px-5 border rounded text-base hover:bg-gray-100 focus:bg-gray-100" onClick={onClose}>Cancel</button> 
                    <button className="py-2 px-5 border rounded bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white" onClick={handleSubmit}>Submit</button> 
                </div>
            </div>
        </div>

    );
};

export default ApplyFormJob;
