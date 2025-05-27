'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'داشبورد' },
    { href: '/representatives', label: 'نمایندگان' },
    { href: '/invoices', label: 'فاکتورها' },
    { href: '/accounting', label: 'حسابداری' },
    { href: '/settings', label: 'تنظیمات' },
  ];

  return (
    <aside className="w-64 bg-white border-l border-gray-200 h-screen fixed top-0 right-0 p-4 flex flex-col">
      <div className="mb-8 text-xl font-bold text-black">پنل مدیریت</div>
      <nav className="flex flex-col space-y-4">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <span
              className={`block px-4 py-2 rounded text-black hover:bg-gray-100 transition cursor-pointer ${
                pathname === item.href ? 'bg-gray-200 font-semibold' : ''
              }`}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
