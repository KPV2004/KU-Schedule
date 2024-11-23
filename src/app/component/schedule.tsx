import React, { useState } from "react";
import { toPng } from "html-to-image"; // Install using: npm install html-to-image

interface Schedule {
  day: string;
  startHour: number;
  endHour: number;
  courseCode: string;
  courseName: string;
}

const ScheduleTable: React.FC = () => {
  const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const hours = [
    9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5,
    15, 15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5, 20, 20.5
  ];

  const dayColors: Record<string, string> = {
    MON: "bg-yellow-300",
    TUE: "bg-pink-300",
    WED: "bg-green-300",
    THU: "bg-orange-300",
    FRI: "bg-blue-300",
    SAT: "bg-purple-300",
    SUN: "bg-red-300",
  };

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [inputDay, setInputDay] = useState<string>("MON");
  const [startTime, setStartTime] = useState<number>(9);
  const [endTime, setEndTime] = useState<number>(9.5);
  const [courseCode, setCourseCode] = useState<string>("");
  const [courseName, setCourseName] = useState<string>("");
  const [hoveredCell, setHoveredCell] = useState<{ day: string; hour: number } | null>(null);

  const formatTime = (time: number) => {
    const hour = Math.floor(time);
    const minutes = time % 1 === 0.5 ? "30" : "00";
    return `${hour}:${minutes}`;
  };

  const handleAddSchedule = () => {
    if (startTime < endTime && courseCode && courseName) {
      setSchedules([
        ...schedules,
        { day: inputDay, startHour: startTime, endHour: endTime, courseCode, courseName },
      ]);
      setCourseCode("");
      setCourseName("");
    } else {
      alert("Please fill all fields and ensure the start time is less than the end time!");
    }
  };

  const handleDeleteSchedule = (day: string, hour: number) => {
    setSchedules((prevSchedules) =>
      prevSchedules.filter(
        (schedule) =>
          schedule.day !== day || hour < schedule.startHour || hour >= schedule.endHour
      )
    );
  };

  const getCellDetails = (day: string, hour: number) => {
    const schedule = schedules.find(
      (schedule) =>
        schedule.day === day &&
        hour >= schedule.startHour &&
        hour < schedule.endHour
    );
    if (!schedule) return null;

    const isStart = hour === schedule.startHour;
    const colSpan = isStart ? (schedule.endHour - schedule.startHour) * 2 : 0; // Multiply by 2 for half-hour steps
    const bgColor = dayColors[day];

    return { content: `${schedule.courseCode}\n${schedule.courseName}`, colSpan, bgColor };
  };

  const handleSaveImage = () => {
    const tableElement = document.getElementById("schedule-table");
    if (tableElement) {
      toPng(tableElement)
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = "schedule-table.png";
          link.click();
        })
        .catch((error) => {
          console.error("Error saving image:", error);
        });
    }
  };

  const handleClearTable = () => {
    setSchedules([]);
  };

  return (
    <div className="h-full p-4 bg-white">
      <h1 className="text-2xl font-bold mb-4">จัดตารางเรียน</h1>

      {/* Input Section */}
      <div className="mb-4">
        <div className="flex items-center gap-5">
          <label className="block mb-2">
            Day:
            <select
              value={inputDay}
              onChange={(e) => setInputDay(e.target.value)}
              className="ml-2 border"
            >
              {days.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </label>
          <label className="block mb-2">
            Start Time:
            <select
              value={startTime}
              onChange={(e) => setStartTime(parseFloat(e.target.value))}
              className="ml-2 border p-1"
            >
              {hours.map((hour) => (
                <option key={hour} value={hour}>
                  {formatTime(hour)}
                </option>
              ))}
            </select>
          </label>
          <label className="block mb-2">
            End Time:
            <select
              value={endTime}
              onChange={(e) => setEndTime(parseFloat(e.target.value))}
              className="ml-2 border p-1"
            >
              {hours.map((hour) => (
                <option key={hour} value={hour}>
                  {formatTime(hour)}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="block mb-2">
          รหัสวิชา (Course Code):
          <input
            type="text"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
            className="ml-2 border p-1"
          />
        </label>
        <label className="block mb-2">
          ชื่อวิชา (Course Name):
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            className="ml-2 border p-1"
          />
        </label>
        <div className="mt-4 flex gap-2">
          <button
            onClick={handleAddSchedule}
            className="bg-blue-500 text-white py-1 px-4 rounded"
          >
            Add
          </button>
          <button
            onClick={handleSaveImage}
            className="bg-green-500 text-white py-1 px-4 rounded"
          >
            Save as Image
          </button>
          <button
            onClick={handleClearTable}
            className="bg-red-500 text-white py-1 px-4 rounded"
          >
            Clear Table
          </button>
        </div>
      </div>

      {/* Schedule Table */}
      <div id="schedule-table" className="overflow-x-auto bg-white p-2">
        <table className="table-auto border-collapse border border-gray-300 w-full text-center">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Day/Time</th>
              {hours.map((hour, index) => {
                // Check for even-indexed hours to merge every two half-hour slots
                if (index % 2 === 0) {
                  return (
                    <th
                      key={hour}
                      colSpan={2} // Merge the current hour and the next half-hour
                      className="border border-gray-300 p-2 bg-gray-100"
                    >
                      {formatTime(hour)}
                    </th>
                  );
                }
                // Skip rendering for odd-indexed half-hours since they're part of the merged cell
                return null;
              })}
            </tr>
          </thead>
          <tbody>
            {days.map((day) => (
              <tr key={day}>
                <td className="border border-gray-300 p-2">{day}</td>
                {hours.map((hour) => {
                  const cellDetails = getCellDetails(day, hour);

                  // Skip rendering if cell is covered by a previous colSpan
                  if (cellDetails?.colSpan === 0) return null;

                  return (
                    <td
                      key={`${day}-${hour}`}
                      colSpan={cellDetails?.colSpan}
                      className={`relative border border-gray-300 p-2 ${cellDetails?.bgColor || ""
                        }`}
                      onMouseEnter={() => setHoveredCell({ day, hour })}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      <pre className="whitespace-pre-wrap text-sm">
                        {cellDetails?.content}
                      </pre>
                      {hoveredCell?.day === day && hoveredCell?.hour === hour && (
                        <button
                          className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded"
                          onClick={() => handleDeleteSchedule(day, hour)}
                        >
                          x
                        </button>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduleTable;
