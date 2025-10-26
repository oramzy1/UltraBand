"use client";

import Link from "next/link";
import { Instagram, Facebook, Youtube, Twitter } from "lucide-react";
import { SiTiktok } from "react-icons/si";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 pt-14 pb-6  z-0">
      <div className="mx-auto px-9 grid grid-cols-1 md:grid-cols-4 gap-7">
        {/* Brand / Logo */}
        <div>
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 animate-pulse">
           <Image alt="Ulta Band" loading='lazy' height={120} width={120} src={'/logo.png'} /> 
          </Link>
          <p className="mt-3 text-sm text-gray-400 leading-relaxed">
            Bringing you unforgettable live music experiences - from festivals
            to private events.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-purple-400">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-purple-400">
                About
              </Link>
            </li>
            <li>
              <Link href="/gallery" className="hover:text-purple-400">
                Gallery
              </Link>
            </li>
            <li>
              <Link href="/events" className="hover:text-purple-400">
                Events
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Get in Touch
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              Email:{" "}
              <a
                href="mailto:info@ultrabandentertainment.com"
                className="hover:text-purple-400"
              >
                info@ultrabandentertainment.com
              </a>
            </li>
            <li>
              Phone:{" "}
              <a href="tel:+12817608305" className="hover:text-purple-400">
              +1 281-760-8305
              </a>
            </li>
            <li>Location: North America, United States</li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <Link
              href="https://www.instagram.com/ultraband_music/"
              target="_blank"
              className="hover:text-purple-400"
            >
              <Instagram size={22} />
            </Link>
            <Link
              href="https://x.com/Ultrabandmusic/status/1970074599745356014?t=m3LCdtHA2KYt9sRkXFrPzA&s=19"
              target="_blank"
              className="hover:text-purple-400"
            >
              <Twitter size={22} />
            </Link>
            <Link
              href="https://www.facebook.com/profile.php?id=61574562565003"
              target="_blank"
              className="hover:text-purple-400"
            >
              <Facebook size={22} />
            </Link>
            <Link
              href="https://vt.tiktok.com/ZSD98AomP/"
              target="_blank"
              className="hover:text-purple-400"
            >
              <SiTiktok size={22} />
            </Link>
            <Link
              href="https://youtube.com/@ultrabandmusic?si=y1rrDduG0SlPjB_b"
              target="_blank"
              className="hover:text-purple-400"
            >
              <Youtube size={22} />
            </Link>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mt-10 pt-6 text-center text-sm text-gray-500">
        Powered by{" "}
        <Link
          href="https://oramabo-gift-diepriye.vercel.app/"
          target="_blank"
          className="text-purple-400 hover:underline"
        >
          Oramzy
        </Link>
      </div>
    </footer>
  );
}
