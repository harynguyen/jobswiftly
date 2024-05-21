import React, { useState, useEffect } from 'react';

import { urlBackend } from '../global';
import Navbar from '../components/Navbar';
import { FiClock } from 'react-icons/fi';
import { FaRegBuilding } from "react-icons/fa";
import PageHeader from '~/components/PageHeader';
import { Footer } from '~/components/Footer';


interface Cv {
  cv_id: string;
  job: Job;
  user: User;
}

interface User {
  user_id: string;
}

interface Job {
  job_id: string;
  job_name: string;
  job_expired: string;
  job_description: string;
  company: Company;
}

interface Company {
  company_id: string;
  company_name: string;
  company_logo_name: string;
}

const JobApplied: React.FC = () => {
  const [cv, setCv] = useState<Cv[]>([]);

  useEffect(() => {
    apiGetCv();
  }, []);

  const apiGetCv = async () => {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found');
      return;
    }
    try {
      const response = await fetch(`${urlBackend}/cv/getAllJobAppliedViaUserId/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        for (const cv of data) {
          const getImageResponse = await fetch(`${urlBackend}/company/getImage/${cv.job.company.company_logo_name}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            }
          });
          if (getImageResponse.ok) {
            const imageUrl = await getImageResponse.text();
            cv.job.company.company_logo_name = imageUrl;
          }
        }
        setCv(data);
      }
    } catch (error) {
      console.log("Error registering user:", error);
    }
  }

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const cvPerPage = 4;

  const indexOfLastCv = currentPage * cvPerPage;
  const indexOfFirstCv = indexOfLastCv - cvPerPage;
  const currentCv = cv.slice(indexOfFirstCv, indexOfLastCv);

  const totalPages = Math.ceil(cv.length / cvPerPage);

  const paginate = (pageNumber: React.SetStateAction<number>) => setCurrentPage(pageNumber);

  function calculateRemainingText(dateReceived: string) {
    const jobExpiredDate = new Date(dateReceived);
    const currentDate = new Date();
    const remainingTime = jobExpiredDate.getTime() - currentDate.getTime();
    let daysRemaining = Math.floor(remainingTime / (1000 * 60 * 60 * 24));

    let remainingText: string;
    if (daysRemaining === 0) {
      remainingText = "Last day";
    } else if (daysRemaining < 0) {
      remainingText = "Expired";
    } else {
      remainingText = `${daysRemaining} days left`;
    }

    return remainingText;
  }

  return (
    <div>
      <Navbar />
      <PageHeader title={"JOBS APPLIED"} path={"Jobs Applied"} />
      <div className='flex flex-col bg-gray-100 sm:flex-row lg:px-24 px-4 my-10 w-full py-12 gap-8'>
        <div className='sm:w-full bg-white p-4 rounded-sm '>
          {currentCv.length > 0 ? (
            <div className='grid grid-cols-2 gap-4 justify-center'>
              {currentCv.map(cv => (
                <a key={cv.cv_id} className="m-2 p-2 flex flex-col border-black border items-center rounded-lg shadow md:flex-row hover:bg-gray-100">
                  <div className="justify-center w-full m-2 flex flex-col items-center rounded-lg">
                    <img className="object-cover w-48 h-48 rounded-full" src={cv.job.company.company_logo_name} alt="" />
                  </div>
                  <div className="flex flex-col justify-between leading-normal w-full rounded mr-2">
                    <div className='text-center my-2'>
                      <h4 className='text-1xl flex text-left items-center gap-2 mb-1'><FaRegBuilding />{cv.job.company.company_name}</h4>
                      <h4 className='text-3xl font-semibold p-2 mb-2'>{cv.job.job_name}</h4>
                      <span className="flex items-center gap-2 font-normal"><FiClock />{calculateRemainingText(cv.job.job_expired)}</span>
                      {cv.job.job_description.length > 100 ? (
                        <>
                          <p className="mb-3 italic text-left font-normal">{`${cv.job.job_description.substring(0, 100)}...`}</p>
                        </>
                      ) : (
                        <p className="mb-3 italic text-left font-normal">{cv.job.job_description}</p>
                      )}
                    </div>
                    <button className="text-white border border-gray-500 bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 rounded p-2">View Details</button>

                  </div>
                </a>

              ))}
            </div>

          ) : (
            <div>
              <h3 className='text-lg font-bold mb-2'>Job Applied</h3>
              <p>No data found!</p>
            </div>
          )}

          <div className="flex justify-end my-4 space-x-8">
            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className='rounded border bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white px-3 py-2'>Previous</button>
            <span className='font-bold flex items-center'>{currentPage} of {totalPages}</span>
            <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className='rounded border bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white px-3 py-2'>&nbsp;&nbsp;Next&nbsp;&nbsp;</button>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default JobApplied;
