import React from 'react';

const Card = ({val}) => {
  return (
    <div className='bg-blue-100 m-10 w-32 h-32 rounded-3xl flex flex-col items-center justify-center drop-shadow-lg'>
        <h1 className='font-semibold text-[#1F51FF]'>Current Value</h1>
        <h1 className="text-6xl font-semibold text-[#1F51FF]">{val}</h1>
    </div>
  );
}

export default Card;