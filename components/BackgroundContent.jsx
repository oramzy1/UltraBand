import React from 'react'
import Image from "next/image";

function BackgroundContent() {
  return (
    <div>
         {/* Background elements */}
      <div className="pointer-events-none fixed opacity-5  dark:opacity-5 -bottom-3 -right-6 w-64 h-64 bg-blue-100 rounded-full -z-50"></div>
      <div className="pointer-events-none fixed opacity-5  dark:opacity-5 -bottom-5 -left-6 w-56 h-56 bg-blue-100 rounded-full -z-50"></div>
      <div className="pointer-events-none fixed opacity-5  dark:opacity-5 top-16 right-6 w-32 h-32 bg-purple-100 rounded-full -z-50"></div>
      <div className="pointer-events-none fixed opacity-5  dark:opacity-5 top-36 left-6 w-32 h-32 bg-red-100 rounded-full -z-50"></div>
      {/* <div className="pointer-events-none fixed  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 opacity-20 rounded-full -z-10 flex items-center justify-center">
      <Image
                src="/logo.png"
                height={300}
                width={300}
                alt="logo"
                priority={false}
                loading="lazy"
        />
      </div> */}

    </div>
  )
}

export default BackgroundContent