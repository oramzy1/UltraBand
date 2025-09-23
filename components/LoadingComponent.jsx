import React from 'react'
import Image from "next/image";

function LoadingComponent() {
  return (
    <div className='flex justify-center items-center h-screen w-screen animate-pulse'>
            <Image
                src="/logo.png"
                height={300}
                width={300}
                alt="logo"
                priority={false}
                loading="lazy"
        />
    </div>
  )
}

export default LoadingComponent