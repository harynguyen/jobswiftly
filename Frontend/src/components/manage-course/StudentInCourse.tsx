import React, { useEffect, useState } from 'react';
import { urlBackend } from '~/global';
import { AiOutlineDelete } from 'react-icons/ai';

interface Props {
    course?: Course;
}

interface Course {
    course_id: string;
    course_name: string;
    course_start_time: string;
    course_end_time: string;
}

interface CourseStudent {
    cs_course_student_id: string;
    c_course_id: string;
    c_course_name: string;
    c_course_start_time: Date;
    c_course_end_time: Date;
    u_user_id: string;
    u_email: string;
    p_first_name: string;
    p_last_name: string;
}

const StudentInCourse: React.FC<Props> = ({ course }) => {
    const [students, setStudents] = useState<CourseStudent[]>([]);

    useEffect(() => {
        const fetchStudentsInCourse = async () => {
            try {
                const response = await fetch(`${urlBackend}/courseStudent/getAllStudentInCourse/${course?.course_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setStudents(data);
                } else {
                    console.error('Failed to fetch students in course');
                }
            } catch (error) {
                console.error('Error fetching students in course:', error);
            }
        };

        fetchStudentsInCourse();
    }, [course]);

    const handleRemoveStudent = async (studentId: string) => {
        const confirmDelete = window.confirm('Are you sure to remove this student out of the course?');
        if (!confirmDelete) {
            return;
        }
        try {
            const response = await fetch(`${urlBackend}/courseStudent/removeStudentFromCourse/${studentId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                setStudents(prevStudents => prevStudents.filter(student => student.cs_course_student_id !== studentId));
                window.alert("Removed Student Out Of The Course Successfully!!!");
            } else {
                console.error('Failed To Remove Student Out Of The Course!!!');
            }
        } catch (error) {
            console.error('Error removing student from course:', error);
        }
    };

    return (
        <div className="overflow-x-auto mb-2 mt-4 p-2 ">
            {students.length === 0 ? (
                <div>
                    <div className='mx-auto bg-white text-center max-w-5xl p-4'>
                        <p className='text-4xl text-red-600 font-bold'>No students enrolled in this course</p>
                    </div>
                </div>
            ) : (
                <table className="min-w-full divide-y rounded bg-white ">
                    <thead className=" border-b bg-indigo-500">
                        <tr className='border-b'>
                            <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Name of Student</th>
                            <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Email of Student</th>
                            <th className="px-6 py-3 text-xs font-bold text-white uppercase tracking-wider text-center">Remove Student</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 text-center">
                        {students.map((student) => (
                            <tr key={student.cs_course_student_id}>
                                <td className="px-6 py-4">{student.p_first_name + " " + student.p_last_name}</td>
                                <td className="px-6 py-4">{student.u_email}</td>
                                <td className="px-6 py-4">
                                    <button className="border border-gray-500 bg-red-600 text-white px-5 py-2 rounded" onClick={() => handleRemoveStudent(student.cs_course_student_id)}>
                                        <AiOutlineDelete />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default StudentInCourse;
