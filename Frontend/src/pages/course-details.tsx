// pages/job-details.tsx

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Footer } from '~/components/Footer';
import Navbar from '~/components/Navbar';
import PageHeader from '~/components/PageHeader';
import { urlBackend } from '~/global';

interface Course {
  course_id: string;
  course_name: string;
  course_start_time: string;
  course_end_time: string;
}

const CourseDetails = () => {
  const router = useRouter();
  const { course_id } = router.query;
  const [courseDetails, setCourseDetails] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  // const [courseStatus, setCourseStatus] = useState("");

  useEffect(() => {
    const fetchCourseDetails = async () => {
      const userId = sessionStorage.getItem('userId');
      if (!userId) {
        console.error('User ID not found');
        return;
      }
      try {
        const response = await fetch(`${urlBackend}/course/getCourseViaCourseId/${course_id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          setCourseDetails(data);
        } else {
          console.error('Failed to fetch course details');
        }
      } catch (error) {
        console.error('Error fetching course details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (course_id) {
      fetchCourseDetails();
    }
  }, [course_id]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!courseDetails) {
    return <div className="flex justify-center items-center h-screen">Course details not found</div>;
  }

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

    // Default return value
    return "";
  };

  const checkStatButton = (startTime: string, endTime: string) => {
    const currentDate = new Date();
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    // Check if current date is before start time
    if (currentDate < startDate) {
      const timeDiff = startDate.getTime() - currentDate.getTime();
      const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return <div className="w-full px-3 mb-5">
        <button onClick={handleApplyClick} className="block w-full max-w-xs mx-auto text-white border border-gray-500 bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 rounded p-2">Enroll On This Course Now</button>
      </div>
    }

    // Check if current date is between start time and end time
    if (currentDate >= startDate && currentDate <= endDate) {
      return <div className="w-full px-3 mb-5">
        <button disabled className="block w-full max-w-xs mx-auto text-white border border-gray-500 bg-indigo-500  rounded p-2">Cannot Enroll On This Course Anymore!</button>
      </div>
    }

    // Check if current date is after end time
    if (currentDate > endDate) {
      return <div className="w-full px-3 mb-5">
        <button disabled className="block w-full max-w-xs mx-auto text-white border border-gray-500 bg-indigo-500  rounded p-2">Cannot Enroll On This Course Anymore!</button>
      </div>
    }
  };

  const handleApplyClick = async () => {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found');
      return;
    }
    try {
      const response = await fetch(`${urlBackend}/courseStudent/createCourseStudent/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          course_id: course_id,
          user_id: userId
        })
      });
      if (response.ok) {
        window.alert("Enroll Successfully!");
      } else {
        const data = await response.json();
        window.alert(data.message);
      }
    } catch (error) {
      console.error('Error fetching course details:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <PageHeader title={"COURSE DETAILS"} path={"Course/Course Details"} />
      <div className='flex flex-col bg-gray-100 sm:flex-row lg:px-24 px-4 my-10 w-full py-12 gap-8'>
        <div className='sm:w-full bg-white p-4 rounded-sm '>
          <div className='mb-2 mt-4 p-2 border rounded border-black'>
            <div className='w-full flex flex-col text-black  rounded p-2'>
              <p className="text-4xl text-center font-semibold p-2 mb-2">{courseDetails.course_name}</p>
              <p className="text-2xl p-2 mb-2"><b>Course Start Time:</b> {convertTime(courseDetails.course_start_time)}</p>
              <p className="text-2xl p-2 mb-2"><b>Course End Time:</b> {convertTime(courseDetails.course_end_time)}</p>
              <p className="text-2xl p-2 mb-2"><b>Course Status:</b> {checkCourseStatus(courseDetails.course_start_time, courseDetails.course_end_time)}</p>
              <div className='w-full my-5'>
                {checkStatButton(courseDetails.course_start_time, courseDetails.course_end_time)}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default CourseDetails;
