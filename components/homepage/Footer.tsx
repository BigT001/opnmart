'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'About',
      links: [
        { label: 'About Us', href: '#' },
        { label: 'Blog', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Press', href: '#' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '#' },
        { label: 'Contact Us', href: '#' },
        { label: 'Status', href: '#' },
        { label: 'Documentation', href: '#' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Service', href: '#' },
        { label: 'Cookie Policy', href: '#' },
        { label: 'Compliance', href: '#' },
      ],
    },
    {
      title: 'Sellers',
      links: [
        { label: 'Seller Center', href: '#' },
        { label: 'Seller Policies', href: '#' },
        { label: 'Seller Tools', href: '#' },
        { label: 'Developer API', href: '#' },
      ],
    },
  ];

  return (
    <footer className="col-span-full bg-gradient-to-b from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-950 border-t border-gray-200 dark:border-zinc-800 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Links and Bottom */}
        <div className="border-t border-gray-200 dark:border-zinc-800 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            {/* Left - Logo and Social */}
            <div className="flex items-center gap-6">
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-green-600 to-cyan-600 bg-clip-text text-transparent">
                  OpnMart
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Your trusted marketplace
                </p>
              </div>
            </div>

            {/* Right - Copyright and Additional Info */}
            <div className="text-center sm:text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                © {currentYear} OpnMart. All rights reserved.
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Made with ❤️ for sellers and buyers
              </p>
            </div>
          </div>

          {/* Payment Methods and Trust Badges */}
          <div className="mt-8 flex flex-wrap justify-center items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
            <span>✅ Secure Transactions</span>
            <span className="hidden sm:inline">•</span>
            <span>🛡️ Buyer Protection</span>
            <span className="hidden sm:inline">•</span>
            <span>⚡ Fast Shipping</span>
            <span className="hidden sm:inline">•</span>
            <span>💬 24/7 Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
