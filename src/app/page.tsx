"use client";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import ScheduleTable from "./component/schedule";

// Constants for selected buttons
const BUTTONS = {
  SCHEDULE: "schedule",
  LIST: "list",
  REPORT: "report",
};

export default function Home() {
  // State to control the menu size (full or minimized)
  const [isMenuMinimized, setIsMenuMinimized] = useState<boolean>(false);

  // State to track the active button, default is "schedule"
  const [selectedButton, setSelectedButton] = useState<string>(BUTTONS.SCHEDULE);

  // State for window size (width and height)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Function to toggle menu size
  const toggleMenuSize = (): void => {
    setIsMenuMinimized(!isMenuMinimized);
  };

  // Function to handle button click
  const handleButtonClick = (buttonName: string): void => {
    setSelectedButton(buttonName);
  };

  // Update window size on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    // Set initial window size
    handleResize();

    // Add event listener for resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="w-full bg-white h-screen grid grid-cols-12 gap-4 font-noto max-md:grid-cols-1 max-md:grid-rows-auto max-md:bg-green-100 max-md:flex max-md:flex-col ">
      {/* Menu Bar */}
      <div
        className={`${
          isMenuMinimized ? "col-span-1 max-md:col-span-1" : "col-span-2 max-md:col-span-1"
        } transition-all duration-300`}
      >
        <div className="w-full h-full text-gray-500 flex flex-col justify-between p-5">
          <div id="upper-menu">
            {/* Title Section */}
            {!isMenuMinimized && (
              <div className="w-full items-center mb-10 flex justify-between">
                <h1 className="text-2xl text-black font-black">จัดตารางเรียน</h1>
                <button id="hide-menu" onClick={toggleMenuSize}>
                  {/* Show icon based on window size */}
                  {windowSize.width >= 767 && (
                    <Icon icon="solar:list-outline" width="24px" color="black" />
                  )}
                </button>
              </div>
            )}
            {isMenuMinimized && (
              <button
                id="show-menu"
                className="flex justify-center w-full mb-10 max-md:w-full "
                onClick={toggleMenuSize}
              >
                <Icon icon="solar:list-outline" width="24px" color="black" />
              </button>
            )}

            {/* Menu Buttons */}
            <button
              className={`w-full mb-3 px-1 py-2 rounded-md flex items-center ${
                isMenuMinimized ? "justify-center" : "justify-start gap-2"
              } ${selectedButton === BUTTONS.SCHEDULE ? "bg-green-500 text-white" : ""}`}
              onClick={() => handleButtonClick(BUTTONS.SCHEDULE)}
            >
              <Icon icon="mdi:planner-outline" width="24px" />
              {!isMenuMinimized && "ตารางเรียน"}
            </button>
            <button
              className={`w-full mb-3 px-1 py-2 rounded-md flex items-center ${
                isMenuMinimized ? "justify-center" : "justify-start gap-2"
              } ${selectedButton === BUTTONS.LIST ? "bg-green-500 text-white" : ""}`}
              onClick={() => handleButtonClick(BUTTONS.LIST)}
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
              } ${selectedButton === BUTTONS.REPORT ? "bg-green-500 text-white" : ""}`}
              onClick={() => handleButtonClick(BUTTONS.REPORT)}
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
          isMenuMinimized ? "col-span-11 max-md:col-span-12" : "col-span-10 max-md:col-span-12"
        } bg-gray-200 transition-all duration-300`}
      >
        {/* Render ScheduleTable if "schedule" is selected */}
        {selectedButton === BUTTONS.SCHEDULE && <ScheduleTable />}

        {/* Example Placeholder for other views */}
        {selectedButton === BUTTONS.LIST && (
          <div className="text-center text-lg font-semibold">
            รายการตารางเรียน (List View)
          </div>
        )}
        {selectedButton === BUTTONS.REPORT && (
          <div className="text-center text-lg font-semibold">
            แจ้งปัญหา (Report View)
          </div>
        )}
      </div>
    </div>
  );
}
