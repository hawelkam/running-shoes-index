import Link from "next/link";
import React from "react";

interface QuickNavigationLinkProps {
  href: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
}

const QuickNavigationLink = ({
  href,
  title,
  description,
  icon,
}: QuickNavigationLinkProps) => {
  const defaultIcon = (
    <svg
      className="w-6 h-6 text-black"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      />
    </svg>
  );

  return (
    <Link
      href={href}
      className="group flex flex-col justify-center px-4 py-6 bg-gray-100 rounded-lg hover:bg-black hover:text-white transition"
    >
      <div className="flex items-center">
        <div className="bg-blue-100 p-3 rounded-full mr-4">
          {icon ?? defaultIcon}
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 group-hover:text-white">
            {title}
          </h3>
          <p className="text-sm text-gray-600 group-hover:text-white">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default QuickNavigationLink;
