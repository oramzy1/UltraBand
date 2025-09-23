import React from "react";
import Image from "next/image";

function LoadingComponent() {
  return (
    <div className="flex justify-center items-center h-screen w-screen animate-pulse bg-black">
      <div className="relative h-[300px] w-[300px]">
        <Image
          src="/logo.png"
          alt="logo"
          fill
          priority
          sizes="300px"
          className="object-contain"
        />
      </div>
    </div>
  );
}

export default LoadingComponent;
