import React, { useEffect, useState } from "react";
import html2canvas from "html2canvas";
import axios from 'axios';

interface Schedule {
  day: string;
  startHour: number;
  endHour: number;
  courseCode: string;
  courseName: string;
}

interface Course {
  courseCode: string;
  courseName: string;
  credits: string;
  foundation: string;
  group: string;
  day: string;
  time: string;
  instructor: string;
  faculty: string;
}

const ScheduleTable: React.FC = () => {
  const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const mapDay = ["M", "Tu", "W", "Th", "F", "Sat", "Sun"];
  
  // Create a mapping between mapDay and days
  const dayMapping: Record<string, string> = {
    "M": "MON",
    "Tu": "TUE",
    "W": "WED",
    "Th": "THU",
    "F": "FRI",
    "Sat": "SAT",
    "Sun": "SUN"
  };

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
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [inputDay, setInputDay] = useState<string>("MON");
  const [startTime, setStartTime] = useState<number>(9);
  const [endTime, setEndTime] = useState<number>(9.5);
  const [courseCode, setCourseCode] = useState<string>("");
  const [courseName, setCourseName] = useState<string>("");
  const [hoveredCell, setHoveredCell] = useState<{ day: string; hour: number } | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/routes');
        // Map the day from API format to our format
        const mappedCourses = response.data.map((course: Course) => ({
          ...course,
          day: dayMapping[course.day] || course.day
        }));
        setCourses(mappedCourses);
        setFilteredCourses(mappedCourses);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = courses.filter(course =>
      course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.courseName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [searchTerm, courses]);

  const formatTime = (time: number) => {
    const hour = Math.floor(time);
    const minutes = time % 1 === 0.5 ? "30" : "00";
    return `${hour}:${minutes}`;
  };

  const handleCourseSelect = (course: Course) => {
    setCourseCode(course.courseCode);
    setCourseName(course.courseName);
    setInputDay(dayMapping[course.day] || course.day);
    
    const [start, end] = course.time.split('-');
    const startHour = parseInt(start.split(':')[0]) + (start.split(':')[1] === '30' ? 0.5 : 0);
    const endHour = parseInt(end.split(':')[0]) + (end.split(':')[1] === '30' ? 0.5 : 0);
    
    setStartTime(startHour);
    setEndTime(endHour);
    setSearchTerm('');
    setShowDropdown(false);
  };

  const handleAddSchedule = () => {
    if (startTime < endTime && courseCode && courseName) {
      setSchedules([
        ...schedules,
        { day: inputDay, startHour: startTime, endHour: endTime, courseCode, courseName },
      ]);
      setCourseCode("");
      setCourseName("");
      setSearchTerm("");
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
    const colSpan = isStart ? (schedule.endHour - schedule.startHour) * 2 : 0;
    const bgColor = dayColors[day];

    return { content: `${schedule.courseCode}\n${schedule.courseName}`, colSpan, bgColor };
  };

  const handleSaveImage = () => {
    const tableElement = document.getElementById("schedule-table");
    if (tableElement) {
      html2canvas(tableElement, {
        windowWidth: 1280,
        scale: 2,
        useCORS: true,
      })
        .then((canvas) => {
          const dataUrl = canvas.toDataURL("image/png");
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

      {/* Search and Input Section */}
      <div className="mb-4">
        <div className="relative mb-4">
          <label className="block mb-2">
            Search Course:
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(true);
              }}
              placeholder="Enter course code or name..."
              className="ml-2 border p-1 w-64"
            />
          </label>
          {showDropdown && searchTerm && filteredCourses.length > 0 && (
            <div className="absolute z-10 bg-white border border-gray-300 w-64 max-h-60 overflow-y-auto">
              {filteredCourses.map((course) => (
                <div
                  key={course.courseCode}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleCourseSelect(course)}
                >
                  <div>{course.courseCode} - {course.courseName}</div>
                  <div className="text-sm text-gray-600">
                    {/* {mapDay[days.indexOf(course.day)]} {course.time} */}
                    {course.day} {course.time}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-5">
          <label className="block mb-2">
            Day:
            <select
              value={inputDay}
              onChange={(e) => setInputDay(e.target.value)}
              className="ml-2 border"
            >
              {days.map((day, index) => (
                <option key={day} value={day}>
                  {mapDay[index]}
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
      <div id="schedule-table" className="max-md:overflow-x-auto bg-white p-2">
        <table className="table-auto border-collapse border border-gray-300 w-full text-center">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Day/Time</th>
              {hours.map((hour, index) => {
                if (index % 2 === 0) {
                  return (
                    <th
                      key={hour}
                      colSpan={2}
                      className="border border-gray-300 p-2 bg-gray-100"
                    >
                      {formatTime(hour)}
                    </th>
                  );
                }
                return null;
              })}
            </tr>
          </thead>
          <tbody>
            {days.map((day, index) => (
              <tr key={day}>
                <td className="border border-gray-300 p-2">{mapDay[index]}</td>
                {hours.map((hour) => {
                  const cellDetails = getCellDetails(day, hour);
                  if (cellDetails?.colSpan === 0) return null;

                  return (
                    <td
                      key={`${day}-${hour}`}
                      colSpan={cellDetails?.colSpan}
                      className={`relative border border-gray-300 p-2 ${cellDetails?.bgColor || ""}`}
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

function setError(message: any) {
  throw new Error("Function not implemented.");
}