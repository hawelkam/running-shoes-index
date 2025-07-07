"use client";

import { Button } from "antd";
import { useState } from "react";

import { SanityRunningShoe } from "@/types/RunningShoe";
import {
  prepareHeightInMM,
  prepareListDividedByComma,
  preparePriceInfo,
  prepareWeight,
} from "@/utils/helpers";

interface ModalProps {
  shoe: SanityRunningShoe;
}

const CompareModal = ({ shoe }: ModalProps) => {
  const [isOpened, setIsOpened] = useState(false);
  return (
    shoe.previousVersion && (
      <>
        <Button type="primary" onClick={() => setIsOpened(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#e8eaed"
          >
            <path d="m320-160-56-57 103-103H80v-80h287L264-503l56-57 200 200-200 200Zm320-240L440-600l200-200 56 57-103 103h287v80H593l103 103-56 57Z" />
          </svg>
          Compare Models
        </Button>
        <div
          id="comparisonModal"
          className={`fixed inset-0 bg-black bg-opacity-50 z-50 ${isOpened ? "flex" : "hidden"} items-center justify-center p-4`}
        >
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-bold">Model Comparison</h3>
              <button
                id="closeModal"
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setIsOpened(false)}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1"></div>
                <div className="font-medium text-center">
                  {shoe.previousVersion.name}
                </div>
                <div className="font-medium text-center">{shoe.name}</div>
              </div>

              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-3 gap-4 py-3 border-b border-gray-100">
                  <div className="font-medium">Men&apos;s Weight</div>
                  <div className="text-center">
                    {prepareWeight(shoe.previousVersion.specs.m?.weight)}
                  </div>
                  <div className="text-center font-medium text-blue-600">
                    {prepareWeight(shoe.specs.m?.weight)}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 py-3 border-b border-gray-100">
                  <div className="font-medium">Stack Height</div>
                  <div className="text-center">
                    {prepareHeightInMM(shoe.previousVersion.specs.m?.heelStack)}
                  </div>
                  <div className="text-center">
                    {prepareHeightInMM(shoe.specs.m?.heelStack)}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 py-3 border-b border-gray-100">
                  <div className="font-medium">Drop</div>
                  <div className="text-center">
                    {prepareHeightInMM(shoe.previousVersion.specs.m?.drop)}
                  </div>
                  <div className="text-center">
                    {prepareHeightInMM(shoe.specs.m?.drop)}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 py-3 border-b border-gray-100">
                  <div className="font-medium">Upper</div>
                  <div className="text-center">
                    {prepareListDividedByComma(
                      shoe.previousVersion.specs.upper
                    )}
                  </div>
                  <div className="text-center font-medium text-blue-600">
                    {prepareListDividedByComma(shoe.specs.upper)}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 py-3 border-b border-gray-100">
                  <div className="font-medium">Foam</div>
                  <div className="text-center">
                    {prepareListDividedByComma(shoe.previousVersion.specs.foam)}
                  </div>
                  <div className="text-center font-medium text-blue-600">
                    {prepareListDividedByComma(shoe.specs.foam)}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 py-3 border-b border-gray-100">
                  <div className="font-medium">Plate</div>
                  <div className="text-center">
                    {shoe.previousVersion.specs.plate}
                  </div>
                  <div className="text-center font-medium text-blue-600">
                    {shoe.specs.plate}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 py-3 border-b border-gray-100">
                  <div className="font-medium">Outsole</div>
                  <div className="text-center">
                    {prepareListDividedByComma(
                      shoe.previousVersion.specs.outsole
                    )}
                  </div>
                  <div className="text-center font-medium text-blue-600">
                    {prepareListDividedByComma(shoe.specs.outsole)}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 py-3 border-b border-gray-100">
                  <div className="font-medium">Price</div>
                  <div className="text-center">
                    {preparePriceInfo(shoe.previousVersion.releaseInfo)}
                  </div>
                  <div className="text-center">
                    {preparePriceInfo(shoe.releaseInfo)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  );
};

export default CompareModal;
