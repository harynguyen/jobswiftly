import React, { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import Navbar from '~/components/Navbar';
import { AiOutlineCheckCircle, AiOutlineDelete } from 'react-icons/ai';
import { urlBackend } from '~/global';
import CompanyCreateForm from '~/components/manage-company/CompanyCreateForm';
import UpdateCompanyForm from '~/components/manage-company/UpdateCompanyForm';
import { FiEdit } from 'react-icons/fi';
import { Footer } from '~/components/Footer';

interface Company {
  company_id: string;
  company_name: string;
  company_address: string;
  company_size: string,
  company_country: string,
  company_work_date_range: string,
  company_description: string,
  company_logo_name: string,
  company_status: string,
  user: User;
}

interface User {
  user_id: string;
}
// const toggleDescription = (: string) => {
//   setExpandedDescriptions(prevState => ({
//     ...prevState,
//     [jobId]: !prevState[jobId]
//   }));
// };

// const [expandedDescriptions, setExpandedDescriptions] = useState<{ [key: string]: boolean }>({});

const ManageCompany: React.FC = () => {

  const [companies, setCompanies] = useState<Company[]>([]);
  const tabs = ["Company List", "Add Company", "Update Company", "Delete Company"];
  const [activeTab, setActiveTab] = useState(0);
  const [filterCompany, setFilterCompany] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [authenticate, setAuthenticate] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleClick = (index: number) => {
    setActiveTab(index);
  };

  useEffect(() => {
    const role = sessionStorage.getItem('role');
    if (role === "Administrator" || role === "Job Finder") {
      setAuthenticate(true);
    }
    if (role === "Administrator") {
      setIsAdmin(true);
      getAllCompany(true);
    } else {
      getAllCompany(false);
    }
  }, []);


  const getAllCompany = async (Admin: boolean) => {
    try {
      const userId = sessionStorage.getItem('userId');
      if (Admin === false) {
        const response = await fetch(`${urlBackend}/company/getAllCompanyManage/${userId}`, {
          method: "GET",
          headers: { 'Content-Type': 'application/json' }
        });
        if (response) {
          const companyData = await response.json();
          for (const company of companyData) {
            const getImageResponse = await fetch(`${urlBackend}/company/getImage/${company.company_logo_name}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              }
            });
            if (getImageResponse.ok) {
              const imageUrl = await getImageResponse.text();
              company.company_logo_name = imageUrl;
            }
          }
          setCompanies(companyData);
        }
      } else {
        const response = await fetch(`${urlBackend}/company/getAllCompanyNonUser`, {
          method: "GET",
          headers: { 'Content-Type': 'application/json' }
        });
        if (response) {
          const companyData = await response.json();
          for (const company of companyData) {
            const getImageResponse = await fetch(`${urlBackend}/company/getImage/${company.company_logo_name}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              }
            });
            if (getImageResponse.ok) {
              const imageUrl = await getImageResponse.text();
              company.company_logo_name = imageUrl;
            }
          }
          setCompanies(companyData);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const handleRefresh = () => {
    getAllCompany(false);
  }

  const handleFilterCompany = (company_id: string) => {
    setFilterCompany(company_id);
  }

  const handleDelete = async (companyId: string) => {
    const confirmed = window.confirm('Are you sure to delete this company?');
    if (confirmed) {
      try {
        const response = await fetch(`${urlBackend}/company/deleteCompany/${companyId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
        });

        if (response.ok) {
          window.alert('Company Deleted Successfully!!!');
        } else {
          console.error('Failed To Delete Company!!!');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  // Approved Or Denined Company For Admin 
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleEditClick = (index: number) => {
    setEditingIndex(index);
  };

  const updateStatus = async (index: number) => {
    try {
      const comId = companies[index]?.company_id;
      const comStat = companies[index]?.company_status;
      const response = await fetch(`${urlBackend}/company/updateCompanyStatus`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_id: comId,
          company_status: comStat
        })
      });
      if (response) {
        setEditingIndex(null);
        window.alert("Update Status Successfully");
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const handleStatusChange = (value: string, index: number) => {
    setCompanies(prevCompanies => {
      const updatedCompanies = [...prevCompanies];
      const companyToUpdate = updatedCompanies[index];
      if (companyToUpdate) {
        companyToUpdate.company_status = value;
      }
      return updatedCompanies;
    });

  };


  return (
    <div>
      <Navbar />
      <PageHeader title={"COMPANY MANAGEMENT"} path={"Company Management"} />
      {authenticate ? (
        <div className='flex flex-col bg-gray-100 sm:flex-row lg:px-24 px-4 my-10 w-full py-12 gap-8'>
          <div className='sm:w-full bg-white p-4 rounded-sm '>
            {isAdmin ? (
              <div>
                {companies.length <= 0 ? (
                  <div className='mx-auto bg-white text-center max-w-5xl p-4'>
                    <p className='text-4xl text-red-600 font-bold'>There is no company available!!!</p>
                  </div>
                ) : (
                  <div className='m-2 p-2 border rounded border-black'>
                    <div className="overflow-x-auto mb-2 mt-4  p-2 ">
                      <table className="min-w-full divide-y border rounded bg-white ">
                        <thead className="rounded bg-indigo-500">
                          <tr className='border-b'>
                            <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Name of Company</th>
                            <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Address of Company</th>
                            <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Size of Company</th>
                            <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Country of Company</th>
                            <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Work Date Range</th>
                            <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Description of Company</th>
                            <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Logo of Company</th>
                            <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Status of Company</th>
                            <th className="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider text-center">Edit Status</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 text-center">
                          {companies.map((company, index) => (
                            <tr key={company.company_id}>
                              <td className="px-6 py-4">{company.company_name}</td>
                              <td className="px-6 py-4">{company.company_address}</td>
                              <td className="px-6 py-4">{company.company_size}</td>
                              <td className="px-6 py-4">{company.company_country}</td>
                              <td className="px-6 py-4">{company.company_work_date_range}</td>
                              <td className="px-6 py-4">{company.company_description}</td>
                              <td className="px-6 py-4"><img
                                src={company.company_logo_name}
                                alt={company.company_name}
                                className="object-cover w-240 h-240 border border-gray-500"
                                style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
                              />
                              </td>
                              <td className="px-6 py-4">
                                {editingIndex === index ? (
                                  <select className='border border-gray-500 rounded px-2 py-4' value={company.company_status} onChange={(e) => handleStatusChange(e.target.value, index)}>
                                    <option value="Pending">Pending</option>
                                    <option value="Approved">Approved</option>
                                    <option value="Denined">Denined</option>
                                  </select>
                                ) : (
                                  <p>{company.company_status}</p>
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
                          {companies.length <= 0 ? (
                            <div>
                              <div className='mx-auto bg-white text-center max-w-5xl p-4'>
                                <p className='text-4xl text-red-600 font-bold'>There is no company available!!!</p>
                              </div>
                            </div>
                          ) : (
                            <div className="overflow-x-auto mb-2 mt-4 p-2 ">
                              <table className="min-w-full divide-y  rounded bg-white ">
                                <thead className=" border-b bg-indigo-500">
                                  <tr className='border-b'>
                                    <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Name of Company</th>
                                    <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Address of Company</th>
                                    <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Size of Company</th>
                                    <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Country of Company</th>
                                    <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Work Date Range</th>
                                    <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Description of Company</th>
                                    <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Logo of Company</th>
                                    <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Status of Company</th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 items-center text-center">
                                  {companies.map(company => (
                                    <tr key={company.company_id}>
                                      <td className="px-6 py-4">{company.company_name}</td>
                                      <td className="px-6 py-4">{company.company_address}</td>
                                      <td className="px-6 py-4">{company.company_size}</td>
                                      <td className="px-6 py-4">{company.company_country}</td>
                                      <td className="px-6 py-4">{company.company_work_date_range}</td>
                                      <td className="px-6 py-4">{company.company_description}</td>
                                      <td className="px-6 py-4 flex justify-center items-center">
                                        <img
                                          src={company.company_logo_name}
                                          alt={company.company_name}
                                          className="object-cover w-240 h-240 border border-gray-500 "
                                          style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
                                        />
                                      </td>
                                      <td className="px-6 py-4">{company.company_status}</td>
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
                            <CompanyCreateForm refresh={handleRefresh} />
                          </div>
                        </div>
                      )}

                      {index === 2 && (
                        <div className='max-w-screen-2xl xl:px-2 '>
                          {companies.length <= 0 ? (
                            <div>
                              <div className='mx-auto bg-white text-center max-w-5xl p-4'>
                                <p className='text-4xl text-red-600 font-bold'>There is no company available!!!</p>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className='flex justify-end px-1 my-2'>
                                <select
                                  className='text-left py-2 rounded-lg ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500'
                                  value={selectedCompany}
                                  onChange={(e) => setSelectedCompany(e.target.value)}
                                >
                                  <option disabled selected value="">
                                    Select Company To Update
                                  </option>
                                  {companies && companies.map((company) => (
                                    <option key={company.company_id} value={company.company_id}>
                                      {company.company_name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                {selectedCompany ? (
                                  <div className='terms-content bg-white  mb-2 mt-4 p-2 w-full gap-2'>
                                    <UpdateCompanyForm company={companies.find(company => company.company_id === selectedCompany)} refresh={handleRefresh} />
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {index === 3 && (
                        <div className='max-w-screen-2xl xl:px-2 '>
                          {companies.length <= 0 ? (
                            <div>
                              <div className='mx-auto bg-white text-center max-w-5xl p-4'>
                                <p className='text-4xl text-red-600 font-bold'>There is no company available!!!</p>
                              </div>
                            </div>
                          ) : (
                            <div className="overflow-x-auto mb-2 mt-4 p-2 ">
                              <table className="min-w-full divide-y rounded bg-white ">
                                <thead className=" border-b bg-indigo-500">
                                  <tr className='border-b'>
                                    <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Company Name</th>
                                    <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Status</th>
                                    <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Action</th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 text-center">
                                  {companies.map(company => (
                                    <tr key={company.company_id}>
                                      <td className="px-6 py-4">{company.company_name}</td>
                                      <td className="px-6 py-4">{company.company_status}</td>
                                      <td className="px-6 py-4">
                                        <button className="border border-gray-500 bg-red-600 text-white px-5 py-2 rounded" onClick={() => handleDelete(company.company_id)}>
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
                    </div >
                  ))
                  }
                </div >
              </div>
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

export default ManageCompany;
