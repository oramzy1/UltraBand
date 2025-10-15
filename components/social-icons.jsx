// 'use client';
// import { motion, AnimatePresence } from "framer-motion";
// import Link from "next/link";
// import { useState } from "react";
// import { Instagram, Twitter, Facebook, Youtube, Plus } from "lucide-react";
// import { SiTiktok } from "react-icons/si";

// export default function SocialIcons() {
//   const [open, setOpen] = useState(false);

//   const icons = [
//     { href: "https://www.instagram.com/ultraband_music/", icon: <Instagram size={20} /> },
//     { href: "https://x.com/Ultrabandmusic/status/1970074599745356014?t=m3LCdtHA2KYt9sRkXFrPzA&s=19", icon: <Twitter size={20} /> },
//     { href: "https://www.facebook.com/profile.php?id=61574562565003", icon: <Facebook size={20} /> },
//     { href: "https://vt.tiktok.com/ZSD98AomP/", icon: <SiTiktok size={20} /> },
//     { href: "https://youtube.com/@ultrabandmusic?si=y1rrDduG0SlPjB_b", icon: <Youtube size={20} /> },
//   ];

//   return (
//     <div 
//       className="fixed bottom-6 right-6 z-50 flex flex-col items-center space-y-4 group"
//       onMouseEnter={() => setOpen(true)}
//       onMouseLeave={() => setOpen(false)}
//     >
//       {/* Main Button */}
//       <button
//         className="
//           flex items-center justify-center w-14 h-14 rounded-full 
//           bg-purple-600 text-white shadow-lg hover:bg-purple-700 
//           transition-all duration-300
//         "
//         onClick={() => setOpen(!open)}
//       >
//         <span className="font-semibold text-lg"><Plus/></span>
//       </button>

//       {/* Animated Social Icons */}
//       <AnimatePresence>
//         {open && (
//           icons.map((item, i) => (
//             <motion.div
//               key={i}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: 20 }}
//               transition={{ delay: i * 0.05, duration: 0.3 }}
//             >
//               <Link
//                 href={item.href}
//                 target="_blank"
//                 className={`
//                   flex items-center justify-center w-12 h-12 rounded-full 
//                   bg-gray-800 text-gray-300 shadow-md hover:bg-purple-600 hover:text-white 
//                   transition-colors duration-300 animate-[bounce_3s_infinite_${i * 100}ms]
//                 `}
//               >
//                 {item.icon}
//               </Link>
//             </motion.div>
//           ))
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }




'use client';
import { useState } from "react";
import Link from "next/link";
import { Instagram, Twitter, Facebook, Youtube, Plus } from "lucide-react";
import { SiTiktok } from "react-icons/si";

export default function SocialIcons() {
  const [isOpen, setIsOpen] = useState(false);

  const icons = [
    { href: "https://www.instagram.com/ultraband_music/", icon: <Instagram size={20} /> },
    { href: "https://x.com/Ultrabandmusic/status/1970074599745356014?t=m3LCdtHA2KYt9sRkXFrPzA&s=19", icon: <Twitter size={20} /> },
    { href: "https://www.facebook.com/profile.php?id=61574562565003", icon: <Facebook size={20} /> },
    { href: "https://vt.tiktok.com/ZSD98AomP/", icon: <SiTiktok size={20} /> },
    { href: "https://youtube.com/@ultrabandmusic?si=y1rrDduG0SlPjB_b", icon: <Youtube size={20} /> },
  ];

  return (
    <div 
    onMouseEnter={() => setIsOpen(true)}
    onMouseLeave={() => setIsOpen(false)}
    className="fixed bottom-6 right-6 z-50 flex flex-col items-center space-y-4">
      {/* Social Icons */}
      <div
        className={`flex flex-col items-center space-y-4 transition-all duration-500 ${
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5 pointer-events-none"
        }`}
      >
        {icons.map((item, i) => (
          <Link
            key={i}
            href={item.href}
            target="_blank"
            className={`flex items-center justify-center w-12 h-12 rounded-full bg-gray-800 text-gray-300 shadow-md 
              hover:bg-purple-600 hover:text-white transition-all duration-300
              ${isOpen ? `animate-[fadeIn_0.5s_ease_${i * 0.1}s_forwards]` : ""}
            `}
            style={{
              opacity: isOpen ? 1 : 0,
              transform: isOpen ? "translateY(0)" : "translateY(20px)",
            }}
          >
            {item.icon}
          </Link>
        ))}
      </div>

      {/* Plus Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center w-14 h-14 rounded-full 
        bg-purple-600 text-white shadow-lg transition-transform duration-500
        hover:bg-purple-700 ${isOpen ? "rotate-45" : ""}
        animate-float`}
      >
        <Plus size={24} />
      </button>

      {/* Elegant Floating Animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
