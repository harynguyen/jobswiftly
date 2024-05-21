import React, { useState, useEffect } from 'react';
// import { FaXmark, FaBarsStaggered } from "react-icons/fa";
import { useRouter } from 'next/router';
import { FaXmark, FaBarsStaggered } from "react-icons/fa6";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [roleName, setRoleName] = useState<string | null>(null);
  const router = useRouter(); // Get the router object

  useEffect(() => {
    // Retrieve role name from local storage
    const storedRoleName = sessionStorage.getItem('role');
    console.log(storedRoleName);
    setRoleName(storedRoleName);
    setIsMenuOpen(false);
  }, []);

  const handleMenuToggler = () => {
    setIsMenuOpen(!isMenuOpen);
  }

  const handleSignOut = () => {
    sessionStorage.clear();
    setRoleName(null);
    router.push('/sign-in');
  }

  const handleSignIn = () => {
    router.push('/sign-in');
  }
  const handleSignUp = () => {
    router.push('/sign-up');
  }

  const guestPages = ["Home", "Course", "About Us"];
  const jobSeekerPages = ["Home", "Jobs Applied", "Course", "Profile", "About Us"];
  const jobFinderPages = ["Course", "Job Management", "Company Management", "Profile", "About Us"];
  const assistantPages = ["Course Management", "Statistical Analysis", "Profile", "About Us"];
  const administratorPages = ["Job Management", "Company Management", "Account Management", "Statistical Analysis", "Profile", "About Us"];

  const getNavItems = () => {
    switch (roleName) {
      case "Job Seeker":
        return jobSeekerPages;
      case "Job Finder":
        return jobFinderPages;
      case "Assistant":
        return assistantPages;
      case "Administrator":
        return administratorPages;
      default:
        return guestPages;
    }
  }

  // Function to check if a navigation item is active based on its href
  const isActiveNavItem = (href: string) => {
    return router.pathname === href;
  }

  return (
    <header className="max-w-screen-2xl container mx-auto xl:px-24 px-5 bg-white border-b-2 border-gray-100">
      <nav className="flex justify-between items-center py-4">
        <a className="flex items-center gap-2 text-2xl text-black">
          <span className='text-indigo-500'><b>JobSwiftly</b></span>
        </a>
        <button className="menu-toggle" onClick={handleMenuToggler}>
        </button>
        <ul className={`hidden md:flex gap-12 items-center  ${isMenuOpen ? 'text-primary' : ''}`}>
          {getNavItems().map((item, index) => (
            <li key={index} className="text-base hover:text-indigo-500 focus:text-indigo-500">
              <a href={`/${item.toLowerCase().replace(/\s+/g, '-')}`} className={`text-base ${isActiveNavItem(`/${item.toLowerCase().replace(/\s+/g, '-')}`) ? 'text-indigo-500 font-bold' : ''}`}>
                {item}
              </a>
            </li>
          ))}
        </ul>
        {roleName ? (
          <div className='text-base text-primary font-medium space-x-5 hidden lg:block'>
            <button className="py-2 px-5 border rounded bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white text-base" onClick={handleSignOut}>Sign Out</button>
          </div>
        ) : (
          <div className='text-base text-primary font-medium space-x-5 hidden lg:block'>
            <button className="py-2 px-5 border rounded text-base hover:bg-gray-100 focus:bg-gray-100" onClick={handleSignUp}>Sign Up</button>
            <button className="py-2 px-5 border rounded bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white" onClick={handleSignIn}>Sign In</button>
          </div>
        )}

        <div className='md:hidden block'>
          <button onClick={handleMenuToggler}>
            {isMenuOpen ? <FaXmark className="w-5 h-5 text-primary" /> : <FaBarsStaggered className="w-5 h-5 text-primary" />}
          </button>
        </div>
      </nav>


      <div className={`px-4 bg-gray-800 py-5 rounded-sm ${isMenuOpen ? "" : "hidden"}`}>
        <ul>
          {getNavItems().map((item, index) => (
            <li key={index} className="text-white hover:text-indigo-500 focus:text-indigo-500">
              <a href={`/${item.toLowerCase().replace(/\s+/g, '-')}`} className={`text-base ${isActiveNavItem(`/${item.toLowerCase().replace(/\s+/g, '-')}`) ? 'text-indigo-500 font-bold' : ''}`}>
                {item}
              </a>
            </li>
          ))}
        </ul>
        {roleName ? (
          <ul className='mt-2'>
            <li className="py-2 px-5 border text-base text-primary font-medium space-x-5 lg:block rounded bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white"><a onClick={handleSignOut} className='text-base'>Sign Out</a></li>
          </ul>
        ) : (
          <ul className='mt-2'>
            <li className="py-2 mb-2 px-5 border text-white text-primary font-medium space-x-5 lg:block rounded hover:text-black hover:bg-gray-100 focus:bg-gray-100"><a onClick={handleSignUp} className='text-base'>Sign Up</a></li>
            <li className="py-2 px-5 border text-base text-primary font-medium space-x-5 lg:block rounded bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white"><a onClick={handleSignIn} className='text-base'>Sign In</a></li>
          </ul>
        )}


      </div>
    </header >
  );
}

export default Navbar;
