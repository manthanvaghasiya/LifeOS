import React from 'react';

const Skeleton = ({ className }) => {
  return (
    <div className={`bg-gray-200 animate-pulse rounded-xl ${className}`}></div>
  );
};

export default Skeleton;