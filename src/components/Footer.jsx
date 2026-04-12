import React from 'react';
import { Mail, Phone, Globe, MessageCircle, Users, HeartHandshake } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <HeartHandshake className="h-6 w-6 text-primaryLight" />
              <span className="font-bold text-xl text-white">MindfulPath</span>
            </div>
            <p className="text-sm text-slate-400 mb-6 max-w-sm">
              Your mental health matters. We provide affordable and accessible counseling to help you navigate life's challenges.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Info</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-3">
                <Mail className="h-4 w-4" />
                <span>dpsychologist01@gmail.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-4 w-4" />
                <span>+91 99298 14206</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/mentalhealthwith_divya?igsh=b2sxa21tMjd5eTNh" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Globe className="h-5 w-5" title="Instagram" /></a>
              <a href="https://www.facebook.com/share/1BxduH5VQV/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><MessageCircle className="h-5 w-5" title="Facebook" /></a>
              <a href="https://www.linkedin.com/in/divya-mishra-0abb2a3b3" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Users className="h-5 w-5" title="LinkedIn" /></a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} MindfulPath. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
