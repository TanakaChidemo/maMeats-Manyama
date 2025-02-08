import React from 'react';
const composeSVG = <svg width="800px" height="800px" viewBox="0 0 32 32" id="i-compose" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentcolor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
<path d="M27 15 L27 30 2 30 2 5 17 5 M30 6 L26 2 9 19 7 25 13 23 Z M22 6 L26 10 Z M9 19 L13 23 Z" />
</svg>;



const ComposeIcon = () => {
  return (
    <div className="flex items-center justify-center w-12 m-2 h-12 text-blue-600 hover:text-blue-900 mb-4 " onClick={() => alert("Define a route for this iconXXX")}>
    {composeSVG}
    </div>
  );
};

export default ComposeIcon;
