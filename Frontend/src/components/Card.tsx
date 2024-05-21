import React, { useState } from 'react';
import { FiCalendar, FiBriefcase, FiDollarSign, FiMapPin, FiClock } from 'react-icons/fi';
import { FaRegBuilding } from "react-icons/fa";
import { useRouter } from 'next/router';

interface CardProps {
  data: {
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
  };
}

interface Company {
  company_id: string;
  company_name: string;
  company_logo_name: string;
}

const Card: React.FC<CardProps> = ({ data }) => {
  const router = useRouter();

  const {
    job_id,
    job_name,
    job_description,
    job_location,
    job_salary_range,
    job_type,
    job_expired,
    company,
  } = data;

  const handleCardClick = () => {
    const userId = sessionStorage.getItem('userId');
    if (userId) {
      router.push({
        pathname: '/job-details',
        query: { job_id: job_id }
      });
    } else {
      window.alert('Please sign in');
    }
  };

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
    <section className='card '>
      <div className="m-2 p-2 flex flex-col border-black  border items-center rounded-lg shadow md:flex-row hover:bg-gray-100">
        <img className="object-cover w-60 h-60 border border-gray-500 rounded-full" src={company.company_logo_name} alt="" />
        <div className="m-1 p-1 flex flex-col justify-between leading-normal w-full rounded ">
          <div className='text-center my-2'>
            <h4 className='text-xl flex text-left items-center gap-2 mb-1'><FaRegBuilding />{company.company_name}</h4>
            <h4 className='text-2xl font-semibold p-2 mb-2'>{job_name}</h4>
            <div className='text-primary/70 text-base grid grid-cols-2 gap-2 mb-2'>
              <span className="flex items-center gap-2 font-normal"><FiMapPin />{job_location}</span>
              <span className="flex items-center gap-2 font-normal"><FiBriefcase />{job_type}</span>
              <span className="flex items-center gap-2 font-normal"><FiDollarSign />{job_salary_range}</span>
              <span className="flex items-center gap-2 font-normal"><FiClock />{calculateRemainingText(job_expired)}</span>
            </div>

            {job_description.length > 100 ? (
              <>
                <p className="mb-3 italic text-left font-normal">{`${job_description.substring(0, 100)}...`}</p>
              </>
            ) : (
              <p className="mb-3 italic text-left font-normal">{job_description}</p>
            )}
          </div>
          <button onClick={handleCardClick} className="text-white border border-gray-500 bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 rounded p-2">View Details</button>
        </div>
      </div>

    </section>

  );
};

export default Card;
