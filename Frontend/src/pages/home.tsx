import React, { useState, useEffect } from 'react';
import Banner from '../components/Banner';

import Card from '../components/Card';
import { urlBackend } from '../global';
import Newsletter from '../components/Newsletter';
import Navbar from '../components/Navbar';
import { Footer } from '~/components/Footer';

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
  job_submit_date: string
  company: Company;
}

interface Company {
  company_id: string;
  company_name: string;
  company_logo_name: string;
}

const Home: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    apiGetJob("", "default", "default");
  }, []);

  const apiGetJob = async (search_word: string, job_location: string, job_salary_range: string) => {
    try {
      const response = await fetch(`${urlBackend}/job/getAllJobPublished`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          search_word: search_word,
          job_location: job_location,
          job_salary_range: job_salary_range
        })
      });
      if (response.ok) {
        const jobData = await response.json();
        for (const job of jobData) {
          const getImageResponse = await fetch(`${urlBackend}/company/getImage/${job.company.company_logo_name}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            }
          });
          if (getImageResponse.ok) {
            const imageUrl = await getImageResponse.text();
            job.company.company_logo_name = imageUrl;
          }
        }
        setJobs(jobData);
        // setIsLoading(false);
      }
    } catch (error) {
      console.log("Error registering user:", error);
    }
  }

  const handleInputChange = (searchWord: string, selectedLocation: string, selectedSalary: string) => {
    if (selectedLocation === "" && selectedSalary === "") {
      apiGetJob(searchWord, "default", "default");
    } else if (selectedLocation !== "" && selectedSalary === "") {
      apiGetJob(searchWord, selectedLocation, "default");
    } else if (selectedLocation === "" && selectedSalary !== "") {
      apiGetJob(searchWord, "default", selectedSalary);
    } else if (selectedLocation !== "" && selectedSalary !== "") {
      apiGetJob(searchWord, selectedLocation, selectedSalary);
    }
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  const paginate = (pageNumber: React.SetStateAction<number>) => setCurrentPage(pageNumber);

  return (
    <div>
      <Navbar />
      <Banner handleInputChange={handleInputChange} />
      <div className='flex flex-col bg-gray-100 sm:flex-row lg:px-24 px-4 my-10 w-full py-12 gap-8'>
        <div className='sm:w-3/4 bg-white p-4 rounded-sm '>
          {currentJobs.length > 0 ? (
            <div className='p-2 m-2'>
              {currentJobs.map(job => (
                <Card key={job.job_id} data={job} />
              ))}
            </div>
          ) : (
            <div>
              <h3 className='text-lg font-bold mb-2'>Jobs</h3>
              <p>No data found!</p>
            </div>
          )}
          <div className="flex justify-end mt-4 space-x-8">
            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className='rounded border bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white px-3 py-2'>Previous</button>
            <span className='flex items-center'>{currentPage} of {totalPages}</span>
            <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className='rounded border bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white px-3 py-2'>&nbsp;&nbsp;Next&nbsp;&nbsp;</button>
          </div>
        </div>
        <div className='sm:w-1/4 bg-white p-4 rounded'>
          <Newsletter />
        </div>
      </div>
      <Footer />
    </div>
    
  );
}

export default Home;
