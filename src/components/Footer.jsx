import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, HeartHandshake, ArrowRight } from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Therapy Services', path: '/therapy' },
    { name: 'Career Counseling', path: '/career' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  const socials = [
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/mentalhealthwith_divya?igsh=b2sxa21tMjd5eTNh',
      path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.848 0-3.204.012-3.584.07-4.849.149-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.058-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
    },
    {
      name: 'WhatsApp',
      url: 'https://wa.me/919929814206',
      path: 'M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.588-5.946 0-6.556 5.332-11.888 11.888-11.888 3.176 0 6.161 1.237 8.404 3.48s3.484 5.229 3.484 8.405c0 6.556-5.332 11.89-11.888 11.89-2.015 0-4.001-.51-5.761-1.479l-6.126 1.7zm6.75-3.165c1.51.93 3.587 1.448 5.135 1.448 5.479 0 9.936-4.458 9.936-9.937 0-2.652-1.034-5.147-2.91-7.025-1.875-1.875-4.37-2.909-7.026-2.909-5.479 0-9.937 4.459-9.937 9.937 0 1.934.566 3.824 1.636 5.432l-.993 3.626 3.73-.973zm11.374-5.111c-.312-.156-1.848-.911-2.135-1.015-.287-.104-.496-.156-.705.156-.208.312-.807 1.015-1.001 1.222-.194.208-.389.232-.701.076-.312-.156-1.318-.485-2.511-1.547-.928-.828-1.554-1.85-1.736-2.162-.182-.312-.019-.481.137-.636.141-.14.312-.364.468-.546.156-.182.208-.312.312-.52.104-.208.052-.39-.026-.546-.078-.156-.705-1.7-.965-2.327-.253-.612-.511-.53-.705-.54-.182-.01-.39-.012-.598-.012s-.546.078-.832.39c-.286.312-1.092 1.066-1.092 2.6s1.118 3.016 1.274 3.224c.156.182 2.199 3.357 5.327 4.704.743.321 1.323.512 1.774.656.747.237 1.427.203 1.964.123.599-.089 1.848-.756 2.108-1.484.26-.728.26-1.353.182-1.484-.077-.13-.286-.208-.598-.364z',
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/share/1BxduH5VQV/',
      path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/divya-mishra-0abb2a3b3',
      path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
    },
  ];

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-5">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <HeartHandshake className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-lg text-white leading-tight">Mental Health</p>
                <p className="text-primary text-sm font-semibold">with Divya Mishra</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-6 max-w-sm leading-relaxed">
              Professional counseling grounded in clinical expertise and human empathy. 
              We make mental wellness accessible, confidential, and transformative.
            </p>
            <Link
              to="/book"
              className="inline-flex items-center bg-primary hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-900/20 group"
            >
              Book a Session
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-slate-400 hover:text-white transition-colors hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Contact</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3">
                <Phone className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <a href="tel:+919929814206" className="text-slate-400 hover:text-white transition-colors">
                  +91 99298 14206
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Mail className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <a href="mailto:dpsychologist01@gmail.com" className="text-slate-400 hover:text-white transition-colors break-all">
                  dpsychologist01@gmail.com
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-slate-400">Varanasi, Uttar Pradesh, India</span>
              </li>
            </ul>

            {/* Social Icons */}
            <div className="flex gap-3 mt-6">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-white/5 hover:bg-primary rounded-xl flex items-center justify-center transition-all hover:scale-110"
                  title={social.name}
                >
                  <svg className="h-4 w-4 fill-current text-slate-400 hover:text-white" viewBox="0 0 24 24">
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Mental Health with Divya Mishra. All rights reserved.</p>
          <p className="italic">Rooted in India, healing the world 🌿</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
