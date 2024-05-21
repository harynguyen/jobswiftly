import React, { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import Navbar from '~/components/Navbar';
import { AiOutlineDelete } from 'react-icons/ai';
import { urlBackend } from '~/global';
import CourseCreateForm from '~/components/manage-course/CourseCreateForm';
import CourseUpdateForm from '~/components/manage-course/CourseUpdateForm';
import StudentInCourse from '~/components/manage-course/StudentInCourse';
import { Footer } from '~/components/Footer';


interface Course {
  course_id: string;
  course_name: string;
  course_start_time: string;
  course_end_time: string;
}

const ManageCourses: React.FC = () => {

  const tabs = ["Course List", "Post New Course", "Update Course", "Delete Course", "Student In Course"];
  const [activeTab, setActiveTab] = useState(0);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [authenticate, setAuthenticate] = useState(false);

  const handleClick = (index: number) => {
    setActiveTab(index);
  };

  useEffect(() => {
    const role = sessionStorage.getItem('role');
    getAllCourse();
    if (role === "Assistant") {
      setAuthenticate(true);
    }
  }, []);

  const getAllCourse = async () => {
    try {
      const response = await fetch(`${urlBackend}/course/getAllCourses`, {
        method: "GET",
        headers: { 'Content-Type': 'application/json' }
      });
      if (response) {
        const data = await response.json();
        setCourses(data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const handleRefresh = () => {
    getAllCourse();
  }

  const handleDelete = async (courseId: string) => {
    const confirmed = window.confirm('Are you sure to delete this course?');
    if (confirmed) {
      try {
        const response = await fetch(`${urlBackend}/course/deleteCourse/${courseId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
        });

        if (response.ok) {
          window.alert('Course Deleted Successfully!!!');
          getAllCourse();
        } else {
          console.error('Failed To Delete Course!!!');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

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
      const daysLeft = Math.floor(timeDiff / (1000 * 3600 * 24));
      let remainingTime = '';

      if (daysLeft > 0) {
        remainingTime += `${daysLeft} days `;
      }

      const hoursLeft = Math.floor((timeDiff % (1000 * 3600 * 24)) / (1000 * 3600));
      if (hoursLeft > 0) {
        remainingTime += `${hoursLeft} hours `;
      }

      const minutesLeft = Math.floor((timeDiff % (1000 * 3600)) / (1000 * 60));
      if (minutesLeft > 0) {
        remainingTime += `${minutesLeft} minutes `;
      }

      const secondsLeft = Math.floor((timeDiff % (1000 * 60)) / 1000);
      if (secondsLeft > 0) {
        remainingTime += `${secondsLeft} seconds left`;
      }

      return remainingTime.trim() || "Less than a second left";
    }

    // Check if current date is between start time and end time
    if (currentDate >= startDate && currentDate <= endDate) {
      return <span className='text-green-600'>In Progress...</span>;
    }

    // Check if current date is after end time
    if (currentDate > endDate) {
      return <span className='text-red-600'>Ended</span>;
    }
  };

  return (
    <div>
      <Navbar />
      <PageHeader title={"COURSE MANAGEMENT"} path={"Course Management"} />
      {authenticate ? (
        <div className='flex flex-col bg-gray-100 sm:flex-row lg:px-24 px-4 my-10 w-full py-12 gap-8'>
          <div className='sm:w-full bg-white p-4 rounded-sm '>
            <div className='mb-2 mt-4 p-2  '>
              <ul className="flex">
                {tabs.map((tab, index) => (
                  <li key={index} className="" role="presentation">
                    <button
                      onClick={() => handleClick(index)}
                      className={`border rounded-t border-black p-4  hover:bg-indigo-700  hover:text-white text-white ${index === activeTab
                        ? "text-white dark:bg-indigo-500 dark:text-white font-bold hide-bor-bot"
                        : "bg-white  text-white dark:text-black hide-bor-bot"
                        }`}
                      type="button"
                      role="tab"
                      aria-selected={index === activeTab}
                    >
                      {tab}
                    </button>
                  </li>
                ))}
              </ul>
              <div className='border rounded-b border-black bg-gray-100'>
                {tabs.map((tab, index) => (
                  <div
                    key={index}
                    className={`mb-4 ${activeTab === index ? "block" : "hidden"}`}
                  >
                    {index === 0 && (
                      <div className='max-w-screen-2xl xl:px-2 '>
                        {courses.length <= 0 ? (
                          <div>
                            <div className='mx-auto bg-white text-center max-w-5xl p-4'>
                              <p className='text-4xl text-red-600 font-bold'>There is no course available!!!</p>
                            </div>
                          </div>
                        ) : (
                          <div className="overflow-x-auto mb-2 mt-4 p-2 ">
                            <table className="min-w-full divide-y  rounded bg-white ">
                              <thead className=" border-b bg-indigo-500">
                                <tr className='border-b'>
                                  <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Name of Course</th>
                                  <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Start Time of Course</th>
                                  <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">End Time of Course</th>
                                  <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Status of Course</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200 text-center">
                                {courses.map(course => (
                                  <tr key={course.course_id}>
                                    <td className="px-6 py-4">{course.course_name}</td>
                                    <td className="px-6 py-4">{convertTime(course.course_start_time)}</td>
                                    <td className="px-6 py-4">{convertTime(course.course_end_time)}</td>
                                    <td className="px-6 py-4">{checkCourseStatus(course.course_start_time, course.course_end_time)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}

                    {index === 1 && (
                      <div className='max-w-screen-2xl xl:px-2 '>
                        <div className='terms-content bg-white  mb-2 mt-4 p-2 w-full gap-2'>
                          <CourseCreateForm refresh={handleRefresh} />
                        </div>
                      </div>
                    )}

                    {index === 2 && (
                      <div className='max-w-screen-2xl xl:px-2 '>
                        {courses.length <= 0 ? (
                          <div>
                            <div className='mx-auto bg-white text-center max-w-5xl p-4'>
                              <p className='text-4xl text-red-600 font-bold'>There is no courses available!!!</p>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className='flex justify-end px-1 my-2'>
                              <select
                                className='text-left py-2 rounded-lg ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500'
                                value={selectedCourse}
                                onChange={(e) => setSelectedCourse(e.target.value)}
                              >
                                <option disabled selected value="">
                                  Select Course To Update
                                </option>
                                {courses && courses.map((course) => (
                                  <option key={course.course_id} value={course.course_id}>
                                    {course.course_name} - Status: {checkCourseStatus(course.course_start_time, course.course_end_time)}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              {selectedCourse ? (
                                <div className='terms-content bg-white  mb-2 mt-4 p-2 w-full gap-2'>
                                  <CourseUpdateForm course={courses.find(course => course.course_id === selectedCourse)} refresh={handleRefresh} />
                                </div>
                              ) : null}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {index === 3 && (
                      <div className='max-w-screen-2xl xl:px-2 '>
                        {courses.length <= 0 ? (
                          <div>
                            <div className='mx-auto bg-white text-center max-w-5xl p-4'>
                              <p className='text-4xl text-red-600 font-bold'>There is no courses available!!!</p>
                            </div>
                          </div>
                        ) : (
                          <div className="overflow-x-auto mb-2 mt-4 p-2 ">
                            <table className="min-w-full divide-y rounded bg-white ">
                              <thead className=" border-b bg-indigo-500">
                                <tr className='border-b'>
                                  <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Name of Course</th>
                                  <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Start Time of Course</th>
                                  <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">End Time of Course</th>
                                  <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Status of Course</th>
                                  <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Action</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200 text-center">
                                {courses.map(course => (
                                  <tr key={course.course_id}>
                                    <td className="px-6 py-4">{course.course_name}</td>
                                    <td className="px-6 py-4">{convertTime(course.course_start_time)}</td>
                                    <td className="px-6 py-4">{convertTime(course.course_end_time)}</td>
                                    <td className="px-6 py-4">{checkCourseStatus(course.course_start_time, course.course_end_time)}</td>
                                    <td className="px-6 py-4">
                                      <button className="border border-gray-500 bg-red-600 text-white px-5 py-2 rounded" onClick={() => handleDelete(course.course_id)}>
                                        <AiOutlineDelete />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}

                    {index === 4 && (
                      <div className='max-w-screen-2xl xl:px-2 '>
                        <div>
                          {courses.length <= 0 ? (
                            <div>
                              <div className='mx-auto bg-white text-center max-w-5xl p-4'>
                                <p className='text-4xl text-red-600 font-bold'>There is no courses available!!!</p>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className='flex justify-end my-2'>
                                <select
                                  className='text-center py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500'
                                  value={selectedCourse}
                                  onChange={(e) => setSelectedCourse(e.target.value)}
                                >
                                  <option disabled selected value="">
                                    Select Course To View
                                  </option>
                                  {courses && courses.map((course) => (
                                    <option key={course.course_id} value={course.course_id}>
                                      {course.course_name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                {selectedCourse ? (
                                  <div>
                                    <StudentInCourse course={courses.find(course => course.course_id === selectedCourse)} />
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div >
                ))
                }
              </div >
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className='mx-auto text-center max-w-5xl border border-gray-500 rounded p-4'>
            <p className='text-4xl text-red-600 font-bold'>You do not have permission to view this page!!!</p>
          </div>

        </div>
      )}
      <Footer />
    </div>

  );

};

export default ManageCourses;
