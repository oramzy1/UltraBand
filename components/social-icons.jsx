'use client';
import Link from "next/link";
import { Instagram, Twitter, Facebook, Youtube } from "lucide-react";
import { SiTiktok } from "react-icons/si";

export default function SocialIcons() {
  const icons = [
    { href: "https://www.instagram.com/ultraband_music/", icon: <Instagram size={20} /> },
    { href: "https://x.com/Ultrabandmusic/status/1970074599745356014?t=m3LCdtHA2KYt9sRkXFrPzA&s=19", icon: <Twitter size={20} /> },
    { href: "https://www.facebook.com/profile.php?id=61574562565003", icon: <Facebook size={20} /> },
    { href: "https://vt.tiktok.com/ZSD98AomP/", icon: <SiTiktok size={20} /> },
    { href: "https://youtube.com/@ultrabandmusic?si=y1rrDduG0SlPjB_b", icon: <Youtube size={20} /> },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center space-y-4">
      {icons.map((item, i) => (
        <Link
          key={i}
          href={item.href}
          target="_blank"
          className={`
            flex items-center justify-center w-12 h-12 
            rounded-full bg-gray-800 text-gray-300 shadow-md 
            hover:bg-purple-600 hover:text-white 
            transition-colors duration-300
            animate-[bounce_3s_infinite_${i * 100}ms]
          `}
        >
          {item.icon}
        </Link>
      ))}
    </div>
  );
}
