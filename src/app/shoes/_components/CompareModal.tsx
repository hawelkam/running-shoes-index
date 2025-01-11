"use client";

import { useState } from "react";
import { SanityRunningShoe } from "../page";

interface ModalProps {
  shoe: SanityRunningShoe;
}

const ComparisonColumn = ({ shoe }: ModalProps) => {
  return (
    <div className="lg:w-1/2 lg:mt-px w-full mb-10 lg:mb-0 border-2 border-gray-300 lg:border-none rounded-lg lg:rounded-none">
      <div className="px-2 text-center h-48 flex flex-col items-center justify-center">
        <h3 className="tracking-widest">{shoe.name}</h3>
        <img src={shoe.image.url} alt="tailwind logo" className="rounded-xl" />
      </div>
      <p className="bg-gray-100 text-gray-600 h-12 text-center px-2 flex items-center -mt-px justify-center border-t border-gray-300">
        {shoe.category?.map((cat) => cat.name).join(", ")}
      </p>
      <div className="text-gray-600 text-center h-24 flex flex-col gap-2 items-center justify-center">
        {shoe.releaseInfo.eu?.price && (
          <div>{`🇪🇺 €${shoe.releaseInfo.eu?.price}`}</div>
        )}
        {shoe.releaseInfo.us?.price && (
          <div>{`🇺🇸 $${shoe.releaseInfo.us?.price}`}</div>
        )}
        {shoe.releaseInfo.pl?.price && (
          <div>{`🇵🇱 ${shoe.releaseInfo.pl?.price}zł`}</div>
        )}
      </div>
      <div className="bg-gray-100 text-gray-600 text-center h-24 flex flex-col gap-2 items-center justify-center">
        {shoe.releaseInfo.eu?.date && (
          <div>{`🇪🇺 ${Intl.DateTimeFormat("en-GB", {
            month: "short",
            year: "numeric",
          }).format(new Date(shoe.releaseInfo.eu.date))}`}</div>
        )}
        {shoe.releaseInfo.us?.date && (
          <div>{`🇺🇸 ${Intl.DateTimeFormat("en-GB", {
            month: "short",
            year: "numeric",
          }).format(new Date(shoe.releaseInfo.us.date))}`}</div>
        )}
        {shoe.releaseInfo.pl?.date && (
          <div>{`🇵🇱 ${Intl.DateTimeFormat("en-GB", {
            month: "short",
            year: "numeric",
          }).format(new Date(shoe.releaseInfo.pl.date))}`}</div>
        )}
      </div>
      <p className="h-12 text-gray-600 px-6 text-center leading-relaxed flex items-center justify-center">
        {shoe.specs.m?.weight && `M: ${shoe.specs.m?.weight}g`}
        {shoe.specs.w?.weight && ` | W: ${shoe.specs.w?.weight}g`}
      </p>
      <p className="bg-gray-100 text-gray-600 text-center h-12 flex items-center justify-center">
        {shoe.specs.m?.drop}mm
      </p>
      <p className="text-gray-600 text-center h-12 flex items-center justify-center">
        {shoe.specs.m?.heelStack && `M: ${shoe.specs.m?.heelStack}mm`}
        {shoe.specs.w?.heelStack && ` | W: ${shoe.specs.w?.heelStack}mm`}
      </p>
      <p className="bg-gray-100 text-gray-600 text-center h-12 flex items-center justify-center">
        {shoe.stability}
      </p>
      <p className="text-gray-600 text-center h-12 flex items-center justify-center">
        {shoe.specs.upper?.map((cat) => cat.name).join(", ")}
      </p>
      <p className="bg-gray-100 text-gray-600 text-center h-12 flex items-center justify-center">
        {shoe.specs.foam?.map((cat) => cat.name).join(", ")}
      </p>
      <p className="text-gray-600 text-center h-12 flex items-center justify-center">
        {shoe.specs.plate}
      </p>
      <p className="bg-gray-100 text-gray-600 text-center h-12 flex items-center justify-center">
        {shoe.specs.outsole?.map((cat) => cat.name).join(", ")}
      </p>
      <p className="text-gray-600 text-center h-12 flex items-center justify-center">
        {shoe.notes}
      </p>
    </div>
  );
};

const CompareModal = ({ shoe }: ModalProps) => {
  const [isOpened, setIsOpened] = useState(false);
  return (
    <>
      <button
        className="focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 text-base flex items-center justify-center leading-none text-white bg-gray-800 w-full py-4 hover:bg-gray-700 focus:outline-none gap-2"
        onClick={() => setIsOpened(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#e8eaed"
        >
          <path d="m320-160-56-57 103-103H80v-80h287L264-503l56-57 200 200-200 200Zm320-240L440-600l200-200 56 57-103 103h287v80H593l103 103-56 57Z" />
        </svg>
        Compare with previous version
      </button>
      {isOpened && (
        <div
          className="relative z-10"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0 bg-gray-500/75 transition-opacity"
            aria-hidden="true"
          ></div>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <section className="text-gray-700 body-font overflow-hidden border-t border-gray-200 w-full">
                      <div className="container px-5 py-24 mx-auto flex flex-wrap">
                        <div className="lg:w-1/5 mt-48 hidden lg:block">
                          <div className="mt-px border-t border-gray-300 border-b border-l rounded-tl-lg rounded-bl-lg overflow-hidden">
                            <p className="bg-gray-100 text-gray-900 h-12 text-center px-4 flex items-center justify-start -mt-px">
                              Category
                            </p>
                            <p className="text-gray-900 h-24 text-center px-4 flex items-center justify-start">
                              Price
                            </p>
                            <p className="bg-gray-100 text-gray-900 h-24 text-center px-4 flex items-center justify-start">
                              Release date
                            </p>
                            <p className="text-gray-900 h-12 text-center px-4 flex items-center justify-start">
                              Weight
                            </p>
                            <p className="bg-gray-100 text-gray-900 h-12 text-center px-4 flex items-center justify-start">
                              Drop
                            </p>
                            <p className="text-gray-900 h-12 text-center px-4 flex items-center justify-start">
                              Heel stack
                            </p>
                            <p className="bg-gray-100 text-gray-900 h-12 text-center px-4 flex items-center justify-start">
                              Stability
                            </p>
                            <p className="text-gray-900 h-12 text-center px-4 flex items-center justify-start">
                              Upper
                            </p>
                            <p className="bg-gray-100 text-gray-900 h-12 text-center px-4 flex items-center justify-start">
                              Foam
                            </p>
                            <p className="text-gray-900 h-12 text-center px-4 flex items-center justify-start">
                              Plate
                            </p>
                            <p className="bg-gray-100 text-gray-900 h-12 text-center px-4 flex items-center justify-start">
                              Outsole
                            </p>
                            <p className="text-gray-900 h-12 text-center px-4 flex items-center justify-start">
                              Notes
                            </p>
                          </div>
                        </div>
                        <div className="flex lg:w-3/4 w-full flex-wrap lg:border border-gray-300 rounded-lg">
                          <ComparisonColumn
                            shoe={shoe.previousVersion as SanityRunningShoe}
                          />
                          <ComparisonColumn shoe={shoe} />
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    onClick={() => setIsOpened(false)}
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CompareModal;
