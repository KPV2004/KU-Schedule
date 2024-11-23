"use client";
import { useState } from "react";
import { Icon } from "@iconify/react";
import ScheduleTable from "./component/schedule";

export default function Home() {
  // State to control the menu size (full or minimized)
  const [isMenuMinimized, setIsMenuMinimized] = useState<boolean>(false);

  // State to track the active button, default is "schedule"
  const [selectedButton, setSelectedButton] = useState<string>("schedule");

  // Function to toggle menu size
  const toggleMenuSize = (): void => {
    setIsMenuMinimized(!isMenuMinimized);
  };

  // Function to handle button click
  const handleButtonClick = (buttonName: string): void => {
    setSelectedButton(buttonName);
  };

  return (
    <div className="w-full h-screen grid grid-cols-12 gap-4 font-noto">
      {/* Menu Bar */}
      <div
        className={`${
          isMenuMinimized ? "col-span-1" : "col-span-2"
        } transition-all duration-300`}
      >
        <div className="w-full h-full text-gray-500 flex flex-col justify-between p-5">
          <div id="upper-menu">
            {/* Title Section */}
            {!isMenuMinimized && (
              <div className="w-full items-center mb-10 flex justify-between">
                <h1 className="text-2xl text-black font-black">จัดตารางเรียน</h1>
                <button id="hide-menu" onClick={toggleMenuSize}>
                  <Icon icon="solar:list-outline" width="24px" color="black" />
                </button>
              </div>
            )}
            {isMenuMinimized && (
              <button
                id="show-menu"
                className="flex justify-center w-full mb-10"
                onClick={toggleMenuSize}
              >
                <Icon icon="solar:list-outline" width="24px" color="black" />
              </button>
            )}

            {/* Menu Buttons */}
            <button
              className={`w-full mb-3 px-1 py-2 rounded-md flex items-center ${
                isMenuMinimized ? "justify-center" : "justify-start gap-2"
              } ${
                selectedButton === "schedule" ? "bg-green-500 text-white" : ""
              }`}
              onClick={() => handleButtonClick("schedule")}
            >
              <Icon icon="mdi:planner-outline" width="24px" />
              {!isMenuMinimized && "ตารางเรียน"}
            </button>
            <button
              className={`w-full mb-3 px-1 py-2 rounded-md flex items-center ${
                isMenuMinimized ? "justify-center" : "justify-start gap-2"
              } ${
                selectedButton === "list" ? "bg-green-500 text-white" : ""
              }`}
              onClick={() => handleButtonClick("list")}
            >
              <Icon icon="material-symbols:view-list-sharp" width="24px" />
              {!isMenuMinimized && "รายการตารางเรียน"}
            </button>
          </div>

          {/* Lower Menu */}
          <div id="lower-menu">
            <button
              className={`w-full px-1 py-2 rounded-md flex items-center ${
                isMenuMinimized ? "justify-center" : "justify-start gap-2"
              } ${
                selectedButton === "report" ? "bg-green-500 text-white" : ""
              }`}
              onClick={() => handleButtonClick("report")}
            >
              <Icon icon="bx:error" width="24px" />
              {!isMenuMinimized && "แจ้งปัญหา"}
            </button>
          </div>
        </div>
      </div>

      {/* Display */}
      <div
        className={`p-5 ${
          isMenuMinimized ? "col-span-11" : "col-span-10"
        } bg-[#D6EFD8] transition-all duration-300`}
      >
        {/* Render ScheduleTable if "schedule" is selected */}
        {selectedButton === "schedule" && <ScheduleTable />}
        
        {/* Example Placeholder for other views */}
        {selectedButton === "list" && (
          <div className="text-center text-lg font-semibold">
            รายการตารางเรียน (List View)
          </div>
        )}
        {selectedButton === "report" && (
          <div className="text-center text-lg font-semibold">
            แจ้งปัญหา (Report View)
          </div>
        )}
      </div>
    </div>
  );
}