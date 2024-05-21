import React from 'react';

interface PageHeaderProps {
    title: string;
    path: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, path }) => {
    return (
        <div className='py-16 mt-3 bg-white rounded flex items-center justify-center'>
            <div>
                <h2 className='text-3xl text-indigo-500 font-bold mb-1 text-center'>{title}</h2>
                <p className='text-sm text-center'>
                    <a href="/">Home</a>
                     /{path}
                </p>
            </div>
        </div>
    );
}

export default PageHeader;
