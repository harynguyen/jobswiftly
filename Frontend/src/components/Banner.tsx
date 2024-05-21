import React, { ChangeEvent, FormEvent, useState } from 'react';
import { FiMapPin, FiSearch } from "react-icons/fi";

interface BannerProps {
    handleInputChange: (searchWord: string, selectedLocation: string, selectedSalary: string) => void;
}

const Banner: React.FC<BannerProps> = ({ handleInputChange }) => {
    const [searchWord, setSearchWord] = useState<string>("");
    const [selectedLocation, setSelectedLocation] = useState<string>("");
    const [selectedSalary, setSelectedSalary] = useState<string>("");

    const handleSubmit = (event: FormEvent, formType: string) => {
        event.preventDefault();
        handleInputChange(searchWord, selectedLocation, selectedSalary);

    };

    return (
        <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4 md:py-20 py-14 bg-white">
            <h1 className="text-5xl font-bold text-primary mb-3">Find your <span className="text-indigo-500">new job</span> today</h1>
            <p className="text-lg text-black/70 mb-8">Thousands of jobs in the computer, engineering, and technology sectors are waiting for you.</p>

            <p className="text-lg text-black/70 mt-8">Find your jobs here:</p>
            <form onSubmit={(event) => handleSubmit(event, "search")} className="flex justify-start md:flex-row flex-col md:gap-0 gap-4">
                <div className="flex md:rounded-e-none rounded shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 md:w-10/12 w-full">
                    <input
                        type="text"
                        name="title"
                        id="title"
                        placeholder="What position are you looking for ?"
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-8 pr-4 text-gray-900 placeholder:text-gray-400 focus:right-0 sm:text-sm sm:leading-6"
                        onChange={(event) => setSearchWord(event.target.value)}
                        value={searchWord}
                    />
                    <FiSearch className="absolute mt-2.5 ml-2 text-gray-400" />
                </div>
                <button type="submit" className="bg-indigo-500 py-2 hover:bg-indigo-700 focus:bg-indigo-700 px-8 text-white md:rounded-s-none rounded">Search</button>
            </form>
            <p className="text-lg text-black/70 mt-8">Or you can filter jobs by using:</p>
            <form onSubmit={(event) => handleSubmit(event, "filter")} className="flex justify-start md:flex-row flex-col md:gap-0 gap-4">
                <div className="flex md:rounded-e-none  rounded shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset md:w-10/12 w-full">
                    <select
                        className="create-job-input border rounded ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 w-full"
                        value={selectedLocation}
                        onChange={(event) => setSelectedLocation(event.target.value)}
                    >
                        <option disabled value="">Location</option>
                        <option value="Ha Noi">Ha Noi</option>
                        <option value="Da Nang">Da Nang</option>
                        <option value="Ho Chi Minh">Ho Chi Minh</option>
                        <option value="Can Tho">Can Tho</option>
                        <option value="Other">Other</option>
                    </select>
                    <select
                        className="create-job-input border rounded ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 w-full"
                        value={selectedSalary}
                        onChange={(event) => setSelectedSalary(event.target.value)}
                    >
                        <option disabled value="">Range of salary</option>
                        <option value="Under 1,000$">Under 1,000$</option>
                        <option value="Under 2,000$">Under 2,000$</option>
                        <option value="Under 3,000$">Under 3,000$</option>
                        <option value="Under 4,000$">Under 4,000$</option>
                        <option value="Under 5,000$">Under 5,000$</option>
                        <option value="Over 5,000$">Over 5,000$</option>
                        <option value="Wage Agreement">Wage Agreement</option>
                    </select>
                </div>
                <button type="submit" className="bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 py-2 px-8 text-white md:rounded-s-none rounded">&nbsp;&nbsp;Filter&nbsp;</button>
            </form>
        </div>
    );
};

export default Banner;
