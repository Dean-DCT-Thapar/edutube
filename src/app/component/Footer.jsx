import React from 'react';
import Link from 'next/link';
import EmailOutlined from '@mui/icons-material/EmailOutlined';
import PhoneOutlined from '@mui/icons-material/PhoneOutlined';
import LocationOnOutlined from '@mui/icons-material/LocationOnOutlined';
import FacebookOutlined from '@mui/icons-material/FacebookOutlined';
import Twitter from '@mui/icons-material/Twitter';
import LinkedIn from '@mui/icons-material/LinkedIn';
import Instagram from '@mui/icons-material/Instagram';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Search Courses', href: '/browse' },
      { label: 'Watch History', href: '/watchHistory' },
      { label: 'Profile', href: '/profile' },
      { label: 'Teachers', href: '/teachers' },
      { label: 'Browse All Courses', href: '/browse' },
    ],
  };

  const socialLinks = [
    { icon: FacebookOutlined, href: 'https://www.facebook.com/officialTIET/', label: 'Facebook' },
    { icon: Twitter, href: 'https://x.com/TIETofficial', label: 'Twitter' },
    { icon: LinkedIn, href: 'https://www.linkedin.com/school/tietofficial/', label: 'LinkedIn' },
    { icon: Instagram, href: 'https://www.instagram.com/tietofficial/', label: 'Instagram' },
  ];

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Brand section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src='/footerLogo.png' 
                alt="Thapar University Logo"
                className="h-12 w-auto"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div>
                <h3 className="font-bold text-lg text-primary-800">EduTube</h3>
                <p className="text-sm text-gray-600">Digital Learning</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              Empowering Thapar University students with cutting-edge digital learning experiences. 
              Access courses, track progress, and excel in your academic journey.
            </p>
            
            {/* Social links */}
            <div className="flex space-x-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-primary-100 hover:text-primary-700 transition-colors duration-200"
                    aria-label={social.label}
                  >
                    <Icon className="text-sm" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Platform links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-gray-600 hover:text-primary-700 text-sm transition-colors duration-200 flex items-center"
                  >
                    <span className="w-2 h-2 bg-primary-400 rounded-full mr-3"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Contact Information</h4>
            
            {/* Contact info */}
            <div className="space-y-3">
              <div className="flex items-start space-x-3 text-sm text-gray-600">
                <LocationOnOutlined className="text-base mt-0.5 text-primary-600" />
                <div>
                  <div className="font-medium text-gray-900">Thapar University</div>
                  <div>Patiala, Punjab, India</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <EmailOutlined className="text-base text-primary-600" />
                <a href="mailto:support@edutube.thapar.edu" className="hover:text-primary-700 transition-colors">
                  support@edutube.thapar.edu
                </a>
              </div>
            </div>

            {/* University Info */}
            <div className="mt-6 p-4 bg-primary-50 rounded-lg">
              <div className="text-sm text-primary-800 font-medium">Academic Excellence</div>
              <div className="text-xs text-primary-700 mt-1">
                Fostering innovation and learning since 1956
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <div className="text-sm text-gray-600">
              © {currentYear} Thapar University. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <span>Made with ❤️ for Thapar Students</span>
              <div className="flex items-center space-x-1">
                <span>Powered by</span>
                <span className="font-semibold text-primary-700">DCMS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;