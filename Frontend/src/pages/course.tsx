import React, { useState, useEffect } from 'react';

import { urlBackend } from '../global';
import Navbar from '../components/Navbar';
import { FiCalendar, FiClock } from 'react-icons/fi';
import PageHeader from '~/components/PageHeader';
import router from 'next/router';
import { Footer } from '~/components/Footer';

interface Course {
  course_id: string;
  course_name: string;
  course_start_time: string;
  course_end_time: string;
}

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    apiGetCourse();
  }, []);

  const apiGetCourse = async () => {
    try {
      const response = await fetch(`${urlBackend}/course/getAllCourses`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      }
    } catch (error) {
      console.log("Error registering user:", error);
    }
  }

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 4;

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentCourse = courses.slice(indexOfFirstJob, indexOfLastJob);

  const totalPages = Math.ceil(courses.length / jobsPerPage);

  const paginate = (pageNumber: React.SetStateAction<number>) => setCurrentPage(pageNumber);

  const convertTime = (time: string) => {
    const dateTime = new Date(time);
    const day = dateTime.getDate().toString().padStart(2, '0');
    const month = (dateTime.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, so add 1
    const year = dateTime.getFullYear().toString();
    const hours = dateTime.getHours().toString().padStart(2, '0');
    const minutes = dateTime.getMinutes().toString().padStart(2, '0');
    const seconds = dateTime.getSeconds().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }

  const checkCourseStatus = (startTime: string, endTime: string) => {
    const currentDate = new Date();
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    // Check if current date is before start time
    if (currentDate < startDate) {
      const timeDiff = startDate.getTime() - currentDate.getTime();
      const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return `${daysLeft} days left`;
    }

    // Check if current date is between start time and end time
    if (currentDate >= startDate && currentDate <= endDate) {
      return "Starting";
    }

    // Check if current date is after end time
    if (currentDate > endDate) {
      return "Ended";
    }
  };

  const handleCardClick = (course_id: string) => {
    const userId = sessionStorage.getItem('userId');
    if (userId) {
      router.push({
        pathname: '/course-details',
        query: { course_id: course_id }
      });
    } else {
      window.alert('Please sign in');
    }
  }

  return (
    <div>
      <Navbar />
      <PageHeader title={"COURSE"} path={"Course"} />
      <div className='flex flex-col bg-gray-100 sm:flex-row lg:px-24 px-4 my-10 w-full py-12 gap-8'>
        <div className='sm:w-full bg-white p-4 rounded-sm '>
          {currentCourse.length > 0 ? (
            <div className='grid grid-cols-2 gap-4 justify-center'>
              {currentCourse.map(course => (
                <div key={course.course_id} className="m-2 p-2 flex flex-col border-black border items-center rounded-lg shadow md:flex-row hover:bg-gray-100">
                  <div className="m-1 p-1 flex flex-col justify-between leading-normal w-full rounded ">
                    <div className='text-center my-2'>
                      <h4 className='text-2xl font-semibold p-2 mb-2'>{course.course_name}</h4>
                      <span className="flex items-center gap-2 font-normal"><FiCalendar /> Start At: {convertTime(course.course_start_time)}</span>
                      <span className="flex items-center gap-2 font-normal"><FiCalendar /> End At:&nbsp;&nbsp; {convertTime(course.course_end_time)}</span>
                      <span className="flex items-center gap-2 font-normal"><FiClock />{checkCourseStatus(course.course_start_time, course.course_end_time)}</span>
                    </div>
                    <button onClick={() => handleCardClick(course.course_id)} className="text-white border border-gray-500 bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 rounded p-2">View Details</button>
                  </div>
                </div>
              ))}
            </div>


          ) : (
            <div>
              <h3 className='text-lg font-bold mb-2'>Courses</h3>
              <p>No data found!</p>
            </div>
          )}
          <div className="flex justify-end my-4 space-x-8">
            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className='rounded border bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white px-3 py-2'>Previous</button>
            <span className=' flex items-center'>{currentPage} of {totalPages}</span>
            <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className='rounded border bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white px-3 py-2'>&nbsp;&nbsp;Next&nbsp;&nbsp;</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Courses;
