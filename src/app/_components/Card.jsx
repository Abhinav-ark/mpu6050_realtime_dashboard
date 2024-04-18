import React from 'react';

const Card = ({val,type,bg,text}) => {
  return (
    <div className={`${bg} m-10 w-32 h-32 rounded-3xl flex flex-col items-center justify-center drop-shadow-lg`}>
        <h1 className={`font-semibold ${text}`}>Current {type}</h1>
        <h1 className={`text-5xl font-semibold ${text}`}>{val}</h1>
    </div>
  );
}

export default Card;