import Link from "next/link";
import { SanityBrand } from "../page";

interface IProps {
  brand: SanityBrand;
}

export default function BrandCard({ brand }: IProps) {
  return (
    <div className="flex flex-col items-center text-center gap-4 p-4 max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      {brand.image && (
        <a href="#">
          <img className="rounded-t-lg" src={`${brand.image.url}`} alt="" />
        </a>
      )}
      <h5 className="hover:underline">
        <Link href={`/${brand.slug.current}`}>
          <h2 className="text-2xl font-bold">{brand.name}</h2>
        </Link>
      </h5>
      <a
        href="#"
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Read more
        <svg
          className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 10"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M1 5h12m0 0L9 1m4 4L9 9"
          />
        </svg>
      </a>
    </div>
  );
}
