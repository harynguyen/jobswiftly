import React, { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import Navbar from '~/components/Navbar';
import { AiOutlineCheckCircle, AiOutlineDelete } from 'react-icons/ai';
import { urlBackend } from '~/global';
import JobUpdateForm from '../components/manage-job/JobUpdateForm'
import JobCreateForm from '../components/manage-job/JobCreateForm'
import { FiEdit } from 'react-icons/fi';
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
  company: Company;
}

interface Company {
  company_id: string;
  company_name: string;
}

interface User {
  email: string;
}

interface Cv {
  cv_id: string;
  cv_fileName: string;
  cv_description: string;
  job: Job;
  user: User;
}

const ManageJobs: React.FC = () => {

  const [companies, setCompanies] = useState<Company[]>([]);
  const tabs = ["Job List", "Post Job", "Update Job", "Delete Job", "Applied CV"];
  const [activeTab, setActiveTab] = useState(0);
  const [companyJobs, setCompanyJobs] = useState<Job[]>([]);
  const [filterCompany, setFilterCompany] = useState("");
  const [selectedJob, setSelectedJob] = useState("");
  const [authenticate, setAuthenticate] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cv, setCv] = useState<Cv[]>([]);

  const handleClick = (index: number) => {
    setActiveTab(index);
  };

  useEffect(() => {
    const role = sessionStorage.getItem('role');
    getAllCompany();
    if (role === "Administrator" || role === "Job Finder") {
      setAuthenticate(true);
    }
    if (role === "Administrator") {
      setIsAdmin(true);
      getAllJob();
    } else {
      getCv();
      getJobViaCompanyId("");
    }
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

  const getAllJob = async () => {
    try {
      const response = await fetch(`${urlBackend}/job/getAllJob/`, {
        method: "GET",
        headers: { 'Content-Type': 'application/json' }
      });
      if (response) {
        const data = await response.json();
        setCompanyJobs(data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const getCv = async () => {
    try {
      const userId = sessionStorage.getItem('userId');
      const response = await fetch(`${urlBackend}/job/getAllJobViaCompanyId/default/${userId}`, {
        method: "GET",
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const jobs = await response.json();
        const cvPromises = jobs.map(async (job: { job_id: string; }) => {
          const cvResponse = await fetch(`${urlBackend}/cv/getAllCvByJobId/${job.job_id}`, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
          });

          if (cvResponse.ok) {
            const cvs = await cvResponse.json();
            return cvs;
          } else {
            return [];
          }
        });

        // Wait for all CV fetches to complete
        const cvArrayNested = await Promise.all(cvPromises);

        // Flatten the nested arrays
        const cvArray = cvArrayNested.flat();

        // Update the state with the CV array
        setCv(cvArray);
        console.log(cvArray);
      } else {
        console.error('Failed to fetch jobs');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getJobViaCompanyId = async (company_id: string) => {
    try {
      const userId = sessionStorage.getItem('userId');
      if (company_id === "" || company_id === null) {
        const response = await fetch(`${urlBackend}/job/getAllJobViaCompanyId/default/${userId}`, {
          method: "GET",
          headers: { 'Content-Type': 'application/json' }
        });
        if (response) {
          const data = await response.json();
          setCompanyJobs(data);
        }
      } else {
        const response = await fetch(`${urlBackend}/job/getAllJobViaCompanyId/${company_id}/${userId}`, {
          method: "GET",
          headers: { 'Content-Type': 'application/json' }
        });
        if (response) {
          const data = await response.json();
          setCompanyJobs(data);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const handleFilterCompany = (company_id: string) => {
    getJobViaCompanyId(company_id);
    setFilterCompany(company_id);
  }

  const handleRefresh = () => {
    getJobViaCompanyId("");
  }

  const handleDelete = async (jobId: string) => {
    const confirmed = window.confirm('Are you sure to delete this job?');
    if (confirmed) {
      try {
        const response = await fetch(`${urlBackend}/job/deleteJob/${jobId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
        });

        if (response.ok) {
          window.alert('Job Deleted Successfully!!!');
          getJobViaCompanyId("");
        } else {
          console.error('Failed to delete job!!!');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  async function handleFileDownload(filename: string) {
    try {
      const response = await fetch(`${urlBackend}/cv/getFile/${filename}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error("Error downloading file:", response.statusText);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

  // Approved Or Denined Company For Admin 

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleEditClick = (index: number) => {
    setEditingIndex(index);
  };

  const updateStatus = async (index: number) => {
    try {
      const jobId = companyJobs[index]?.job_id;
      const jobStat = companyJobs[index]?.job_status;
      const response = await fetch(`${urlBackend}/job/updateJobStatus`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_id: jobId,
          job_status: jobStat
        })
      });
      if (response) {
        setEditingIndex(null);
        window.alert("Update Job Status Successfully");
        getAllJob();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const handleStatusChange = (value: string, index: number) => {
    setCompanyJobs(prevCompanyJobs => {
      const updatedCompanyJobs = [...prevCompanyJobs];
      const jobToUpdate = updatedCompanyJobs[index];
      if (jobToUpdate) {
        jobToUpdate.job_status = value;
      }
      return updatedCompanyJobs;
    });

  };

  const [expandedDescriptions, setExpandedDescriptions] = useState<{ [key: string]: boolean }>({});


  const toggleDescription = (jobId: string) => {
    setExpandedDescriptions(prevState => ({
      ...prevState,
      [jobId]: !prevState[jobId]
    }));
  };

  return (
    <div>
      <Navbar />
      <PageHeader title={"JOB MANAGEMENT"} path={"Job Management"} />
      {authenticate ? (
        <div className='flex flex-col bg-gray-100 sm:flex-row lg:px-24 px-4 my-10 w-full py-12 gap-8'>
          <div className='sm:w-full bg-white p-4 rounded-sm '>
            {isAdmin ? (
              <div>
                {companyJobs.length <= 0 ? (
                  <div className='mx-auto bg-white text-center max-w-5xl p-4'>
                    <p className='text-4xl text-red-600 font-bold'>There is no job available!!!</p>
                  </div>
                ) : (
                  <div className='m-2 p-2 border rounded border-black'>
                    <div className="overflow-x-auto mb-2 mt-4  p-2 ">
                      <table className="min-w-full divide-y border rounded bg-white ">
                        <thead className="rounded bg-indigo-500">
                          <tr className='border-b'>
                            <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Name of Job</th>
                            <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Number Of Requirement</th>
                            <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Location</th>
                            <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Company of Job</th>
                            <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Level Of Working Experiences</th>
                            <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Year Of Working Experiences</th>
                            <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Type Of Work</th>
                            <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Range of Salary</th>
                            <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Application Technologies</th>
                            <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Description of Job</th>
                            <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Deadline Of Job</th>
                            <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Status of Job</th>
                            <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Edit Status</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 text-center">
                          {companyJobs.map((job, index) => (
                            <tr key={job.job_id}>
                              <td className="px-6 py-4">{job.job_name}</td>
                              <td className="px-6 py-4">{job.job_number_require}</td>
                              <td className="px-6 py-4">{job.job_location}</td>
                              <td className="px-6 py-4">{job.company.company_name}</td>
                              <td className="px-6 py-4">{job.job_level}</td>
                              <td className="px-6 py-4">{job.job_experience}</td>
                              <td className="px-6 py-4">{job.job_type}</td>
                              <td className="px-6 py-4">{job.job_salary_range}</td>
                              <td className="px-6 py-4">{job.job_requirement_tech}</td>
                              <td className="px-6 py-4">
                                {job.job_description.length > 100 && (
                                  <div>
                                    {expandedDescriptions[job.job_id] ? (
                                      <div>{job.job_description}</div>
                                    ) : (
                                      <div>{job.job_description.substring(0, 100)}</div>
                                    )}
                                    <button onClick={() => toggleDescription(job.job_id)} className='text-blue-600'>
                                      {expandedDescriptions[job.job_id] ? "Read Less" : "Read More"}
                                    </button>
                                  </div>
                                )}
                                {job.job_description.length < 100 && (
                                  <div>
                                    {job.job_description}
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4">{new Date(job.job_expired).toLocaleDateString()}</td>
                              <td className="px-6 py-4">
                                {editingIndex === index ? (
                                  <select className='border border-gray-500 rounded px-2 py-4' value={job.job_status} onChange={(e) => handleStatusChange(e.target.value, index)}>
                                    <option value="Pending">Pending</option>
                                    <option value="Approved">Approved</option>
                                    <option value="Denied">Denied</option>
                                  </select>
                                ) : (
                                  <p>{job.job_status}</p>
                                )}
                              </td>
                              <td className="px-6 py-4 text-2xl">
                                {editingIndex === index ? (
                                  <button onClick={() => updateStatus(index)}><AiOutlineCheckCircle /></button>
                                ) : (
                                  <button onClick={() => handleEditClick(index)}><FiEdit /></button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className='mb-2 mt-4 p-2  '>
                <ul className="flex">
                  {tabs.map((tab, index) => (
                    <li key={index} className="text-black" role="presentation">
                      <button
                        onClick={() => handleClick(index)}
                        className={`border rounded-t border-black p-4  hover:bg-indigo-700  hover:text-white text-white ${index === activeTab
                          ? " text-white dark:bg-indigo-500 dark:text-white font-bold hide-bor-bot"
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
                          {companyJobs.length <= 0 ? (
                            <div>
                              <div className='mx-auto bg-white text-center max-w-5xl p-4'>
                                <p className='text-4xl text-red-600 font-bold'>There is no job available!!!</p>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className='flex justify-end px-1 my-2'>
                                <select
                                  className='text-left py-2 rounded-lg  ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500'
                                  value={filterCompany}
                                  onChange={(e) => handleFilterCompany(e.target.value)}
                                >
                                  <option selected value="">
                                    All Company
                                  </option>
                                  {companies && companies.map((company) => (
                                    <option key={company.company_id} value={company.company_id}>
                                      {company.company_name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="overflow-x-auto mb-2 mt-4 p-2 ">
                                <table className="min-w-full divide-y  rounded bg-white ">
                                  <thead className=" border-b bg-indigo-500">
                                    <tr className='border-b'>
                                      <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Name of Job</th>
                                      <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Number Of Requirement</th>
                                      <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Location</th>
                                      <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Company of Job</th>
                                      <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Level Of Working Experiences</th>
                                      <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Year Of Working Experiences</th>
                                      <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Type Of Work</th>
                                      <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Range of Salary</th>
                                      <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Application Technologies</th>
                                      <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Description of Job</th>
                                      <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Status of Job</th>
                                      <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Deadline Of Job</th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200 text-center">
                                    {companyJobs.map(job => (
                                      <tr key={job.job_id}>
                                        <td className="px-6 py-4">{job.job_name}</td>
                                        <td className="px-6 py-4">{job.job_number_require}</td>
                                        <td className="px-6 py-4">{job.job_location}</td>
                                        <td className="px-6 py-4">{job.company.company_name}</td>
                                        <td className="px-6 py-4">{job.job_level}</td>
                                        <td className="px-6 py-4">{job.job_experience}</td>
                                        <td className="px-6 py-4">{job.job_type}</td>
                                        <td className="px-6 py-4">{job.job_salary_range}</td>
                                        <td className="px-6 py-4">{job.job_requirement_tech}</td>
                                        <td className="px-6 py-4">{job.job_description}</td>
                                        <td className="px-6 py-4">{job.job_status}</td>
                                        <td className="px-6 py-4">{new Date(job.job_expired).toLocaleDateString()}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </div>

                      )}

                      {index === 1 && (
                        <div className='max-w-screen-2xl xl:px-2 '>
                          <div className='terms-content bg-white  mb-2 mt-4 p-2 w-full gap-2'>
                            <JobCreateForm refresh={handleRefresh} />
                          </div>
                        </div>
                      )}

                      {index === 2 && (
                        <div className='max-w-screen-2xl xl:px-2 '>
                          {companyJobs.length <= 0 ? (
                            <div>
                              <div className='mx-auto bg-white text-center max-w-5xl p-4'>
                                <p className='text-4xl text-red-600 font-bold'>There is no job available!!!</p>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className='flex justify-end px-1 my-2'>
                                <select
                                  className='text-left py-2 rounded-lg ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500'
                                  value={selectedJob}
                                  onChange={(e) => setSelectedJob(e.target.value)}
                                >
                                  <option disabled selected value="">
                                    Select Job To Update
                                  </option>
                                  {companyJobs && companyJobs.map((job) => (
                                    <option key={job.job_id} value={job.job_id}>
                                      {job.job_name + " - " + job.company.company_name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                {selectedJob ? (
                                  <div className='terms-content bg-white  mb-2 mt-4 p-2 w-full gap-2'>
                                    <JobUpdateForm job={companyJobs.find(job => job.job_id === selectedJob)} refresh={handleRefresh} />
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {index === 3 && (
                        <div className='max-w-screen-2xl xl:px-2 '>
                          {companyJobs.length <= 0 ? (
                            <div>
                              <div className='mx-auto bg-white text-center max-w-5xl p-4'>
                                <p className='text-4xl text-red-600 font-bold'>There is no job available!!!</p>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className='flex justify-end px-1 my-2'>
                                <select
                                  className='text-left py-2 rounded-lg ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500'
                                  value={filterCompany}
                                  onChange={(e) => handleFilterCompany(e.target.value)}
                                >
                                  <option selected value="">
                                    All Company
                                  </option>
                                  {companies && companies.map((company) => (
                                    <option key={company.company_id} value={company.company_id}>
                                      {company.company_name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="overflow-x-auto mb-2 mt-4 p-2 ">
                                <table className="min-w-full divide-y rounded bg-white ">
                                  <thead className=" border-b bg-indigo-500">
                                    <tr className='border-b'>
                                      <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Name of Job</th>
                                      <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Company of Job</th>
                                      <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Status of Job</th>
                                      <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Deadline Of Job</th>
                                      <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Action</th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200 text-center">
                                    {companyJobs.map(job => (
                                      <tr key={job.job_id}>
                                        <td className="px-6 py-4">{job.job_name}</td>
                                        <td className="px-6 py-4">{job.company.company_name}</td>
                                        <td className="px-6 py-4">{job.job_status}</td>
                                        <td className="px-6 py-4">{new Date(job.job_expired).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                          <button className="border border-gray-500 bg-red-600 text-white px-5 py-2 rounded" onClick={() => handleDelete(job.job_id)}>
                                            <AiOutlineDelete />
                                          </button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {index === 4 && (
                        <div className='max-w-screen-2xl xl:px-2 '>
                          {companyJobs.length <= 0 ? (
                            <div>
                              <div className='mx-auto bg-white text-center max-w-5xl p-4'>
                                <p className='text-4xl text-red-600 font-bold'>There is no CV available!!!</p>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="overflow-x-auto mb-2 mt-4 p-2 ">
                                <table className="min-w-full divide-y rounded bg-white ">
                                  <thead className=" border-b bg-indigo-500">
                                    <tr className='border-b'>
                                      <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Name of Job</th>
                                      <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Company of Job</th>
                                      <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Deadline Of Job</th>
                                      <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Candidate Email</th>
                                      <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Cover Letter</th>
                                      <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">CV Download</th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200 text-center">
                                    {cv.map(cv => (
                                      <tr key={cv.cv_id}>
                                        <td className="px-6 py-4">{cv.job.job_name}</td>
                                        <td className="px-6 py-4">{cv.job.company.company_name}</td>
                                        <td className="px-6 py-4">{new Date(cv.job.job_expired).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">{cv.user.email}</td>
                                        <td className="px-6 py-4">{cv.cv_description}</td>
                                        <td className="px-6 py-4">
                                          <button
                                            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-1 px-2 rounded inline-flex items-center text-sm"
                                            onClick={() => handleFileDownload(cv.cv_fileName)}
                                          >Download CV</button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div >
                  ))
                  }
                </div >
              </div >
            )}
          </div>
        </div>
      ) : (
        <div>
          <div className='mx-auto text-center max-w-5xl border border-gray-500 rounded p-4'>
            <p className='text-4xl text-red-600 font-bold'>You do not have permission to view this page!!!</p>
          </div>
        </div>
      )}
      <Footer/>
    </div>
  );

};

export default ManageJobs;
