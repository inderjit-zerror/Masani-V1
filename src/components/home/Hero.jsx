import React from 'react'

const Hero = () => {
  return (
    <div className='w-full h-screen BgPrimery relative flex justify-center items-center overflow-hidden'>

      {/* PARENT CONTAINER: Added 'group' for hover effects and '[perspective:1000px]' for 3D space */}
      <div className='relative w-[90vw] sm:w-1/4 aspect-square [perspective:1000px] group'>

        {/* TOP */}
        {/* Added: origin-bottom, transition, and transform rotateX */}
        <div className='w-full h-fit absolute bottom-[100%] left-1/2 -translate-x-1/2 z-30 origin-bottom transition-transform duration-700 ease-in-out [transform:rotateX(-180deg)]'>
          <img src="/images/Card-Top-Part.svg" alt="TOP" className='w-full object-cover object-center' />
        </div>

        {/* CENTER */}
        <div className='w-full aspect-square absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10'>
          <img src="/images/Card-Middel-Part.svg" alt="CENTER" className='w-full h-full object-cover object-center' />
        </div>

        {/* BOTTOM */}
        {/* Added: origin-top, transition, and transform rotateX */}
        <div className='w-full h-fit absolute top-[100%] left-1/2 -translate-x-1/2 z-20 origin-top transition-transform duration-700 ease-in-out [transform:rotateX(180deg)] '>
          <img src="/images/Card-Bottom-Part.png" alt="BOTTOM" className='w-full object-cover object-center' />
        </div>

      </div>

    </div>
  )
}

export default Hero