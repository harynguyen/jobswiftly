import React, { useEffect, useRef, useState } from "react";
import PageHeader from '../components/PageHeader';
import Navbar from '~/components/Navbar';
import { urlBackend } from "../global";
import { Footer } from "~/components/Footer";

interface User {
    user_id: string;
    email: string;
    password: string;
    role: Role;
}

interface Role {
    role_id: string;
    role_name: string;
}

const ManageAccount: React.FC = () => {

    const [userList, setUserList] = useState<User[]>([]);
    const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
    const [createClicked, setCreateClicked] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newRole, setNewRole] = useState("");
    const [roles, setRoles] = useState<Role[]>([]);


    useEffect(() => {
        getAllUser();
        getAllRole();
    }, []);


    const handleCreate = () => {
        setCreateClicked(true);
    };

    const handleCancel = () => {
        setCreateClicked(false);
    };

    const handleEditRole = (index: number) => {
        setEditingRowIndex(index);
    };

    const handleCancelEditRole = () => {
        setEditingRowIndex(null);
    };

    const handlePasswordChange = (password: string, index: number) => {
        if (password !== "" || password !== null) {
            setUserList(prevUserList => {
                const updatedUserList = [...prevUserList];
                const userToUpdate = updatedUserList[index];
                if (userToUpdate) {
                    updatedUserList[index] = {
                        ...userToUpdate,
                        password: password,
                    };
                }
                return updatedUserList;
            });
        };
    };

    const handleStopEditRole = (user_id: string, password: string, roleName: string) => {
        const emailPattern = /.+@[^@]+\..+/;
        setEditingRowIndex(null);
        //   const hashPassword = MD5(password).toString();
        updateAccountRole(user_id, password, roleName);

    };

    const handleRoleChange = (roleName: string, index: number) => {
        setUserList(prevUserList => {
            const updatedUserList = [...prevUserList];
            const userToUpdate = updatedUserList[index];
            if (userToUpdate) {
                userToUpdate.role.role_name = roleName; // Update the role_name directly
            }
            return updatedUserList;
        });
    };


    const updateAccountRole = async (user_id: string, password: string, role_name: string) => {
        try {
            const response = await fetch(`${urlBackend}/users/updateUser`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: user_id,
                    password: password,
                    role_name: role_name
                })
            });
            if (response.ok) {
                window.alert("Account Updated Successfully!!!");
                setEditingRowIndex(null);
                console.log(user_id);
                console.log(role_name);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            window.alert("Update account unsuccessfully due to some error!!");
        }
    }

    const handleSubmit = async () => {
        try {
            const emailPattern = /.+@[^@]+\..+/;

            if (!emailPattern.test(newEmail)) {
                window.alert("Invalid email format. Please enter a valid email address.");
            } else {
                // const hashPassword = MD5(newPassword).toString();
                if (!newPassword || !newEmail) {
                    window.alert("Please enter enough information.");
                } else {
                    const response = await fetch(`${urlBackend}/users/adminRegister/`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            password: newPassword,
                            email: newEmail,
                            role_id: newRole,
                        })
                    });
                    if (response.ok) {
                        setCreateClicked(false);
                        getAllUser();
                    } else {
                        console.log("Cancelled.");
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }

    const handleDeleteAccount = async (user: User) => {
        // Display an alert to confirm deletion
        if (window.confirm(`Are you sure to delete the account for ${user.email}?`)) {
            try {
                const response = await fetch(`${urlBackend}/users/deleteUser/${user.user_id}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (response.ok) {
                    setEditingRowIndex(null);
                    getAllUser();
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
            console.log(`Deleting account for ${user.email}...`);
        } else {
            console.log("Deletion cancelled.");
        }
    }

    const getAllUser = async () => {
        try {
            const response = await fetch(`${urlBackend}/users/getAllUserWithRole`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data = await response.json();
                setUserList(data);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }

    const getAllRole = async () => {
        try {
            const response = await fetch(`${urlBackend}/role/getRoles`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data = await response.json();
                setRoles(data);
                setNewRole(data[0].role_id);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }

    return (
        <div>
            <Navbar />
            <PageHeader title={"ACCOUNT MANAGEMENT"} path={"Account Management"} />
            <div className='flex flex-col bg-gray-100 sm:flex-row lg:px-24 px-4 my-10 w-full py-12 gap-8'>
                <div className='sm:w-full bg-white p-4 rounded-sm '>
                    <div className='m-2 p-2 border rounded border-black'>
                        <div className="flex justify-end m-2 p-2">
                            {createClicked ? (
                                <div className="inline-flex space-x-2">
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={newEmail}
                                        onChange={(e) => setNewEmail(e.target.value)}
                                        className="border py-1.5 pl-8 pr-4 rounded ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500"
                                    />
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="border py-1.5 pl-8 pr-4 rounded ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500"
                                    />
                                    <select
                                        value={newRole}
                                        onChange={(e) => setNewRole(e.target.value)}
                                        className="border  rounded ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500"
                                    >
                                        {roles.map((role) => (
                                            <option key={role.role_id} value={role.role_id}>
                                                {role.role_name}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={handleSubmit}
                                        className="py-2 px-5 border rounded bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white"
                                    >
                                        Create
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="py-2 px-5 border rounded text-base hover:bg-gray-100 focus:bg-gray-100"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={handleCreate}
                                    className="bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Create New Account
                                </button>
                            )}
                        </div>
                        <div className="overflow-x-auto mb-2 p-2 ">
                            <table className="min-w-full divide-y border rounded bg-white ">
                                <thead className="rounded bg-indigo-500">
                                    <tr className='border-b'>
                                        <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Email of Account</th>
                                        <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Password of Account</th>
                                        <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Role of Account</th>
                                        <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 text-center">
                                    {userList.map((user, index) => (
                                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                            <td className="px-6 py-4">{user.email}</td>
                                            <td className="px-6 py-4">
                                                {editingRowIndex === index ? (
                                                    <input
                                                        type="text"
                                                        onChange={(e) => handlePasswordChange(e.target.value, index)}
                                                        className="create-job-input pl-10 pr-3 py-2 rounded-lg ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500"
                                                    />
                                                ) : (
                                                    <div>***************</div>
                                                )}
                                            </td>
                                            <td className="px-4 py-2 text-center border-b border-gray-300">
                                                {editingRowIndex === index ? (
                                                    <select
                                                        value={user.role.role_name}
                                                        onChange={(e) => handleRoleChange(e.target.value, index)}
                                                        className="create-job-input pl-10 pr-3 py-2 rounded-lg ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500"
                                                    >
                                                        {roles.map((role) => (
                                                            <option key={role.role_id} value={role.role_name}>{role.role_name}</option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    user.role.role_name
                                                )}
                                            </td>
                                            <td className="px-4 py-2 text-center border-b border-gray-300">
                                                {editingRowIndex === index ? (
                                                    <div>
                                                        <button
                                                            onClick={() => handleStopEditRole(user.user_id, user.password, user.role.role_name)}
                                                            className="mr-2 text-gray-600 hover:text-black focus:outline-none"
                                                        >
                                                            <svg
                                                                className="w-5 h-5 mt-2"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M5 13l4 4L19 7"
                                                                />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={handleCancelEditRole}
                                                            className="mr-2 text-gray-600 hover:text-black focus:outline-none"
                                                        >
                                                            <svg
                                                                className="w-5 h-5 mt-2"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M7.127 22.562l-7.127 1.438 1.438-7.128 5.689 5.69zm1.414-1.414l11.228-11.225-5.69-5.692-11.227 11.227 5.689 5.69zm9.768-21.148l-2.816 2.817 5.691 5.691 2.816-2.819-5.691-5.689z"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <button
                                                            onClick={() => handleEditRole(index)}
                                                            className="mr-2 text-gray-600 hover:text-black focus:outline-none"
                                                        >
                                                            <svg
                                                                className="w-5 h-5 mt-2"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M7.127 22.562l-7.127 1.438 1.438-7.128 5.689 5.69zm1.414-1.414l11.228-11.225-5.69-5.692-11.227 11.227 5.689 5.69zm9.768-21.148l-2.816 2.817 5.691 5.691 2.816-2.819-5.691-5.689z"
                                                                />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteAccount(user)}
                                                            className="text-gray-600 hover:text-black focus:outline-none"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-6 w-6"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M6 18L18 6M6 6l12 12"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ManageAccount;
