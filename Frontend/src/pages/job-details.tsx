// pages/job-details.tsx

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ApplyFormJob from '~/components/ApplyFormJob';
import { Footer } from '~/components/Footer';
import Navbar from '~/components/Navbar';
import PageHeader from '~/components/PageHeader';
import { urlBackend } from '~/global';

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
  job_submit_date: string;
  company: Company;
}

interface Company {
  company_id: string;
  company_name: string;
  company_description: string;
  company_address: string;
  company_country: string;
  company_logo_name: string;
}

const JobDetails = () => {
  const router = useRouter();
  const { job_id } = router.query;
  const [jobDetails, setJobDetails] = useState<Job | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState(false);
  const [alreadyApply, setAlreadyApply] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      const userId = sessionStorage.getItem('userId');
      if (!userId) {
        console.error('User ID not found');
        return;
      }
      try {
        const response = await fetch(`${urlBackend}/job/getJobViaId/${job_id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          const getImageResponse = await fetch(`${urlBackend}/company/getImage/${data.company.company_logo_name}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            }
          });
          if (getImageResponse.ok) {
            const imageUrl = await getImageResponse.text();
            data.company.company_logo_name = imageUrl;
            const checkAlreadyApplyResponse = await fetch(`${urlBackend}/cv/getCvViaUserId/${userId}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            });
            if (checkAlreadyApplyResponse.ok) {
              const dataAlreadyApplyResponse = await checkAlreadyApplyResponse.json();
              for (const cv of dataAlreadyApplyResponse) {
                if (cv.job.job_id === data.job_id) {
                  setAlreadyApply(true);
                  break;
                }
              }
            }

          }
          setJobDetails(data);
        } else {
          console.error('Failed to fetch job details');
        }
      } catch (error) {
        console.error('Error fetching job details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (job_id) {
      fetchJobDetails();
    }
  }, [job_id]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!jobDetails) {
    return <div className="flex justify-center items-center h-screen">Job details not found</div>;
  }

  const jobExpiredDate = new Date(jobDetails.job_expired);
  const currentDate = new Date();
  const remainingTime = jobExpiredDate.getTime() - currentDate.getTime();
  const daysRemaining = Math.floor(remainingTime / (1000 * 60 * 60 * 24));

  const handleApplyClick = () => {
    if(daysRemaining < 0){
      alert("Job expired!!");
    }else{
    setShowModal(true);
  }
  };

  return (
    <div>
      <Navbar />
      <PageHeader title={"JOB DETAILS"} path={"Job/Job Details"} />
      <div className='flex flex-col bg-gray-100 sm:flex-row lg:px-24 px-4 my-10 w-full py-12 gap-8'>
        <div className='sm:w-full bg-white p-4 rounded-sm '>
          {showModal && <ApplyFormJob jobId={jobDetails.job_id} onClose={() => setShowModal(false)} />}

          <div className='mb-2 mt-4 p-2 border rounded border-black'>
            <div className='create-job-flex m-2 p-2  rounded'>
              <div className='w-3/12 flex justify-center ml-3' >
                <img className="object-cover w-72 h-72 border border-gray-500 rounded-full " src={jobDetails.company.company_logo_name} alt="" />
              </div>
              <div className='w-9/12 flex flex-col text-black border-black rounded p-5'>
                <h1 className='text-3xl text-center font-semibold p-2 mb-2'>{jobDetails.company.company_name}</h1>
                <p className="text-1xl text-justify text-primary mb-2"><b>Country:</b> {jobDetails.company.company_country}</p>
                <p className="text-1xl text-justify text-primary mb-2"><b>Address:</b> {jobDetails.company.company_address}</p>
                <p className="text-1xl text-justify text-primary mb-2"><b>Description:</b>
                  {
                    jobDetails.company.company_description.length > 700 ?
                      jobDetails.company.company_description.slice(0, 700) + '...' :
                      jobDetails.company.company_description
                  }
                </p>
               
              </div>
            </div>
          </div>

          <div className='mb-2 mt-4 p-2 border rounded border-black'>
            <h1 className='text-3xl text-center font-semibold p-2 mb-5'>Job Details</h1>
            <div className='grid grid-cols-2 gap-4 justify-center px-10'>
              <h3 className="text-1xl text-justify text-primary mb-2"><b>We are hiring:</b> {jobDetails.job_name}</h3>
              <h3 className="text-1xl text-justify text-primary mb-2"><b>Number of positions:</b> {jobDetails.job_number_require}</h3>
              <h3 className="text-1xl text-justify text-primary mb-2"><b>Level:</b> {jobDetails.job_level}</h3>
              <h3 className="text-1xl text-justify text-primary mb-2"><b>Experience:</b> {jobDetails.job_experience}</h3>
              <h3 className="text-1xl text-justify text-primary mb-2"><b>Location:</b> {jobDetails.job_location}</h3>
              <h3 className="text-1xl text-justify text-primary mb-2"><b>Salary range:</b> {jobDetails.job_salary_range}</h3>
              <h3 className="text-1xl text-justify text-primary mb-2"><b>Type of working:</b> {jobDetails.job_type}</h3>
              <h3 className="text-1xl text-justify text-primary mb-2"><b>Expired date:</b> {daysRemaining} days left</h3>
            </div>
            <h3 className="text-1xl text-justify text-primary mt-4 mb-2 px-10"><b>Description:</b> {jobDetails.job_description}</h3>

          </div>
          <div className='w-full my-4'>
                <div className="w-full px-3 mb-5">
                  {alreadyApply ? (
                    <button onClick={handleApplyClick} className="block w-full max-w-xs mx-auto bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white rounded-lg px-3 py-3 font-semibold">Apply Again</button>
                  ) : (
                    <button onClick={handleApplyClick} className="block w-full max-w-xs mx-auto bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white rounded-lg px-3 py-3 font-semibold">Apply Now</button>
                  )}
                </div>
              </div>
        </div >
      </div >
      <Footer/>
    </div>
  );
};

export default JobDetails;
