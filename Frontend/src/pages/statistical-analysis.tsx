import React, { useEffect, useState, useRef } from "react";
import PageHeader from '../components/PageHeader';
import Navbar from '~/components/Navbar';
import { urlBackend } from "../global";
import Chart from 'chart.js/auto';
import { Footer } from "~/components/Footer";

interface Statistics {
  approved: number;
  total: number;
}

const StatisticalAnalysis: React.FC = () => {
  const [jobStatistics, setJobStatistics] = useState<Statistics>({ approved: 0, total: 0 });
  const [companyStatistics, setCompanyStatistics] = useState<Statistics>({ approved: 0, total: 0 });
  const [courseStatistics, setCourseStatistics] = useState<Statistics>({ approved: 0, total: 0 });

  const jobChartRef = useRef<Chart | null>(null);
  const companyChartRef = useRef<Chart | null>(null);
  const courseChartRef = useRef<Chart | null>(null);

  const jobStatisticsChartRef = useRef<HTMLCanvasElement>(null);
  const companyStatisticsChartRef = useRef<HTMLCanvasElement>(null);
  const courseStatisticsChartRef = useRef<HTMLCanvasElement>(null);
  const [authenticate, setAuthenticate] = useState(false);

  useEffect(() => {
    const role = sessionStorage.getItem('role');
    fetchJobStatistics();
    fetchCompanyStatistics();
    fetchCourseStatistics();
    if (role === "Assistant") {
      setAuthenticate(true);
    } else if (role === "Administrator") {
      setAuthenticate(false);
    }
  }, []);

  const fetchJobStatistics = async () => {
    try {
      const response = await fetch(`${urlBackend}/job/jobStatistics`);
      if (response.ok) {
        const data: Statistics = await response.json();
        setJobStatistics(data);
      }
    } catch (error) {
      console.error('Error fetching job statistics:', error);
    }
  };

  const fetchCompanyStatistics = async () => {
    try {
      const response = await fetch(`${urlBackend}/company/companyStatistics`);
      if (response.ok) {
        const data: Statistics = await response.json();
        setCompanyStatistics(data);
      }
    } catch (error) {
      console.error('Error fetching company statistics:', error);
    }
  };

  const fetchCourseStatistics = async () => {
    try {
      const response = await fetch(`${urlBackend}/courseStudent/courseStatistics`);
      if (response.ok) {
        const data: Statistics = await response.json();
        setCourseStatistics(data);
      }
    } catch (error) {
      console.error('Error fetching course statistics:', error);
    }
  };

  useEffect(() => {
    const role = sessionStorage.getItem('role');
    if (role === "Assistant") {
      if (courseStatisticsChartRef.current) {
        renderCourseStatisticsChart();
      }
    } else if (role === "Administrator") {
      if (jobStatisticsChartRef.current && companyStatisticsChartRef.current) {
        renderCompanyStatisticsChart();
        renderJobStatisticsChart();
      }
    }
  }, [jobStatistics, companyStatistics, courseStatistics]);




  const renderJobStatisticsChart = () => {
    const jobStatisticsCanvas = jobStatisticsChartRef.current;
    if (!jobStatisticsCanvas) return;

    if (jobChartRef.current) {
      jobChartRef.current.destroy();
    }

    jobChartRef.current = new Chart(jobStatisticsCanvas, {
      type: 'bar',
      data: {
        labels: ['Approved Jobs', 'Total Jobs'],
        datasets: [{
          label: 'Number Of Jobs',
          data: [jobStatistics.approved, jobStatistics.total],
          backgroundColor: [
            'rgb(99 102 241)',
            'rgb(156 163 175)'
          ],
          borderColor: [
            'rgb(99 102 241)',
            'rgb(156 163 175)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  };

  const renderCompanyStatisticsChart = () => {
    const companyStatisticsCanvas = companyStatisticsChartRef.current;
    if (!companyStatisticsCanvas) return;

    if (companyChartRef.current) {
      companyChartRef.current.destroy();
    }

    companyChartRef.current = new Chart(companyStatisticsCanvas, {
      type: 'bar',
      data: {
        labels: ['Approved Companies', 'Total Companies'],
        datasets: [{
          label: 'Number Of Companies',
          data: [companyStatistics.approved, companyStatistics.total],
          backgroundColor: [
            'rgb(99 102 241)',
            'rgb(156 163 175)'
          ],
          borderColor: [
            'rgb(99 102 241)',
            'rgb(156 163 175)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  };
  const renderCourseStatisticsChart = () => {
    const courseStatisticsCanvas = courseStatisticsChartRef.current;
    if (!courseStatisticsCanvas) return;

    if (courseChartRef.current) {
      courseChartRef.current.destroy();
    }

    courseChartRef.current = new Chart(courseStatisticsCanvas, {
      type: 'bar',
      data: {
        labels: ['Courses Have Enrolled Students', 'Total Courses'],
        datasets: [{
          label: 'Number Of Courses',
          data: [courseStatistics.approved, courseStatistics.total],
          backgroundColor: [
            'rgb(99 102 241)',
            'rgb(156 163 175)'
          ],
          borderColor: [
            'rgb(99 102 241)',
            'rgb(156 163 175)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  };

  return (
    <div>
      <Navbar />
      <PageHeader title={"STATISTICAL ANALYSIS"} path={"Statistical Analysis"} />
      <div className='flex flex-col bg-gray-100 sm:flex-row lg:px-24 px-4 my-10 w-full py-12 gap-8'>
        <div className='sm:w-full bg-white p-4 rounded-sm '>
          <div className='m-2 p-2 border rounded border-black'>
            <div className="overflow-x-auto mb-2 mt-4  p-2 ">
              <div className="gap-2 m-2 p-2">
                {authenticate === true ? (
                  <div>
                    <div>
                    <h1 className='text-3xl font-bold text-primary mb-3'>Statistic of Courses Have Students on Total Courses</h1>
                      <canvas ref={courseStatisticsChartRef} width="800" height="400"></canvas>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="mb-8">
                    <h1 className='text-3xl font-bold text-primary mb-3'>Statistic of Approved Jobs on Total Jobs</h1>
                      <canvas ref={jobStatisticsChartRef} width="800" height="400"></canvas>
                    </div>
                    <div>
                    <h1 className='text-3xl font-bold text-primary mb-3'>Statistic of Approved Companies on Total Companies</h1>
                      <canvas ref={companyStatisticsChartRef} width="800" height="400"></canvas>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default StatisticalAnalysis;