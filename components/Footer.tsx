"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail } from "lucide-react";
import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="bg-[#0b1120] text-slate-400 pt-16 pb-8 border-t border-slate-800">
      <Container>


        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12 mb-16">

          {/* Column 1: Brand & Newsletter */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center mb-6">
              <Image src="/logo-white.svg" alt="Fileinator Logo" width={180} height={40} className="w-[180px] h-auto" />
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-sm">
              The ultimate online toolkit for all your file conversion, compression, and editing needs. Secure, fast, and easy to use.
            </p>
            <div className="flex items-center gap-2 text-sm mt-4">
              <Mail className="w-4 h-4 text-slate-500" />
              <a href="mailto:infofileinator@gmail.com" className="hover:text-blue-400 transition-colors">infofileinator@gmail.com</a>
            </div>

            {/* Newsletter */}
            {/* <div>
              <h4 className="text-white font-semibold mb-3">Subscribe to our newsletter</h4>
              <div className="flex max-w-sm">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-slate-900 border border-slate-700 text-sm rounded-l-lg px-4 py-2 w-full focus:outline-none focus:border-blue-500 text-white"
                />
                <Button className="rounded-l-none rounded-r-lg px-4">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div> */}
          </div>

          {/* Column 2: Products Left */}
          <div className="col-span-1 lg:col-span-1">
            <h4 className="text-white font-semibold mb-6">Products</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/alltools?category=Image" className="hover:text-blue-400 transition-colors">Image Tools</Link></li>
              <li><Link href="/alltools?category=Video" className="hover:text-blue-400 transition-colors">Video Tools</Link></li>
              <li><Link href="/alltools?category=Utilities" className="hover:text-blue-400 transition-colors">Utilities</Link></li>
            </ul>
          </div>

          {/* Column 3: Products Right */}
          <div className="col-span-1 lg:col-span-1">
            <h4 className="text-white font-semibold mb-6">Products</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/alltools?category=PDF" className="hover:text-blue-400 transition-colors">PDF Tools</Link></li>
              <li><Link href="/alltools?category=Audio" className="hover:text-blue-400 transition-colors">Audio Tools</Link></li>
              <li><Link href="/alltools?category=AI" className="hover:text-blue-400 transition-colors">AI Tools</Link></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="col-span-1">
            <h4 className="text-white font-semibold mb-6">Company</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Reach Us</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors">About</Link></li>
              <li><Link href="/blog" className="hover:text-blue-400 transition-colors">Blogs</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>© {new Date().getFullYear()} Fileinator Inc. All rights reserved.</p>
          <div className="flex flex-wrap justify-center md:justify-end gap-4">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link>
            <Link href="/cookie-policy" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>

      </Container>
    </footer>
  );
}
