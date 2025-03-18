import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define the interface for the course data
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

// API route handler
export async function GET(req: NextRequest) {
  try {
    const filePath = path.join(process.cwd(), 'ku_courses.json');
    console.log('Looking for file at:', filePath);

    if (!fs.existsSync(filePath)) {
      throw new Error('ku_courses.json not found at the specified path');
    }

    const jsonData = fs.readFileSync(filePath, 'utf8');
    const courses: Course[] = JSON.parse(jsonData);

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const faculty = searchParams.get('faculty');
    const courseCode = searchParams.get('courseCode'); // Optional: Add more fields as needed

    // Filter courses based on parameters
    let filteredCourses = [...courses]; // Start with all courses

    if (faculty) {
      filteredCourses = filteredCourses.filter((course) => course.faculty === faculty);
    }
    if (courseCode) {
      filteredCourses = filteredCourses.filter((course) => course.courseCode === courseCode);
    }

    // Return the filtered results (or all courses if no filters)
    return NextResponse.json(filteredCourses, { status: 200 });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { message: 'Error retrieving courses data'},
      { status: 500 }
    );
  }
}