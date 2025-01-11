import React from "react";
import { SanityRunningShoe } from "../page";
import Link from "next/link";

interface ShoeCardProps {
  shoe: SanityRunningShoe;
}

const ShoeCard = ({ shoe }: ShoeCardProps) => {
  return (
    <Link href={`/shoes/${shoe.slug.current}`}>
      <div className="relative flex flex-col md:flex-row md:space-x-5 space-y-3 md:space-y-0 rounded-xl shadow-lg p-3 max-w-xs md:max-w-3xl mx-auto border border-white bg-white">
        <div className="w-full md:w-1/3 bg-white grid place-items-center">
          <img
            src={shoe.image.url}
            alt="tailwind logo"
            className="rounded-xl"
          />
        </div>
        <div className="w-full md:w-2/3 bg-white flex flex-col space-y-2 p-3">
          <div className="flex justify-between item-center">
            <p className="text-gray-500 font-medium hidden md:block">
              {shoe.shoeType.name}
            </p>

            <div className="flex gap-2">
              {shoe.category?.map((cat) => (
                <div
                  className="bg-gray-200 px-3 py-1 rounded-full text-xs font-medium text-gray-800 block"
                  key={cat.name}
                >
                  {cat.name}
                </div>
              ))}
            </div>
          </div>
          <h3 className="font-black text-gray-800 md:text-3xl text-xl">
            {`${shoe.name}${shoe.review ? " ✅" : ""}`}
          </h3>
          <div className="gap-4 hidden md:flex">
            {shoe.releaseInfo.eu && (
              <div className="flex gap-2 flex-col md:flex-row">
                <p>🇪🇺</p>
                {shoe.releaseInfo.eu?.date && (
                  <p className="text-sm font-normal text-gray-800">
                    {Intl.DateTimeFormat("en-GB", {
                      month: "numeric",
                      year: "numeric",
                    }).format(new Date(shoe.releaseInfo.eu.date))}
                  </p>
                )}
                <p className="text-sm font-black text-gray-800">
                  €{shoe.releaseInfo.eu.price}
                </p>
              </div>
            )}
            {shoe.releaseInfo.us && (
              <div className="flex gap-2 flex-col md:flex-row">
                <p>🇺🇸</p>
                {shoe.releaseInfo.us?.date && (
                  <p className="text-sm font-normal text-gray-800">
                    {Intl.DateTimeFormat("en-GB", {
                      month: "numeric",
                      year: "numeric",
                    }).format(new Date(shoe.releaseInfo.us.date))}
                  </p>
                )}
                <p className="text-sm font-black text-gray-800">
                  ${shoe.releaseInfo.us.price}
                </p>
              </div>
            )}
            {shoe.releaseInfo.pl && (
              <div className="flex gap-2 flex-col md:flex-row">
                <p>🇵🇱</p>
                {shoe.releaseInfo.pl?.date && (
                  <p className="text-sm font-normal text-gray-800">
                    {Intl.DateTimeFormat("en-GB", {
                      month: "numeric",
                      year: "numeric",
                    }).format(new Date(shoe.releaseInfo.pl.date))}
                  </p>
                )}
                <p className="text-sm font-black text-gray-800">
                  {shoe.releaseInfo.pl.price}zł
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ShoeCard;
