import { RelationSchema, TableRow } from '../types';

export const instructorData: TableRow[] = [
  { ID: '10101', name: 'Srinivasan', dept_name: 'Comp. Sci.', salary: 65000 },
  { ID: '12121', name: 'Wu', dept_name: 'Finance', salary: 90000 },
  { ID: '15151', name: 'Mozart', dept_name: 'Music', salary: 40000 },
  { ID: '22222', name: 'Einstein', dept_name: 'Physics', salary: 95000 },
  { ID: '32343', name: 'El Said', dept_name: 'History', salary: 60000 },
  { ID: '33456', name: 'Gold', dept_name: 'Physics', salary: 87000 },
  { ID: '45565', name: 'Katz', dept_name: 'Comp. Sci.', salary: 75000 },
  { ID: '58583', name: 'Califieri', dept_name: 'History', salary: 62000 },
  { ID: '76543', name: 'Singh', dept_name: 'Finance', salary: 80000 },
  { ID: '76766', name: 'Crick', dept_name: 'Biology', salary: 72000 },
  { ID: '83821', name: 'Brandt', dept_name: 'Comp. Sci.', salary: 92000 },
  { ID: '98345', name: 'Kim', dept_name: 'Elec. Eng.', salary: 80000 },
];

export const teachesData: TableRow[] = [
  { ID: '10101', course_id: 'CS-101', sec_id: '1', semester: 'Fall', year: 2017 },
  { ID: '10101', course_id: 'CS-315', sec_id: '1', semester: 'Spring', year: 2018 },
  { ID: '10101', course_id: 'CS-347', sec_id: '1', semester: 'Fall', year: 2017 },
  { ID: '12121', course_id: 'FIN-201', sec_id: '1', semester: 'Spring', year: 2018 },
  { ID: '15151', course_id: 'MU-199', sec_id: '1', semester: 'Spring', year: 2018 },
  { ID: '22222', course_id: 'PHY-101', sec_id: '1', semester: 'Fall', year: 2017 },
  { ID: '32343', course_id: 'HIS-351', sec_id: '1', semester: 'Spring', year: 2018 },
  { ID: '45565', course_id: 'CS-101', sec_id: '1', semester: 'Spring', year: 2018 },
  { ID: '45565', course_id: 'CS-319', sec_id: '1', semester: 'Spring', year: 2018 },
  { ID: '76766', course_id: 'BIO-101', sec_id: '1', semester: 'Summer', year: 2017 },
  { ID: '76766', course_id: 'BIO-301', sec_id: '1', semester: 'Summer', year: 2018 },
  { ID: '83821', course_id: 'CS-190', sec_id: '1', semester: 'Spring', year: 2017 },
  { ID: '83821', course_id: 'CS-190', sec_id: '2', semester: 'Spring', year: 2017 },
  { ID: '83821', course_id: 'CS-319', sec_id: '2', semester: 'Spring', year: 2018 },
  { ID: '98345', course_id: 'EE-181', sec_id: '1', semester: 'Spring', year: 2017 },
];

export const sectionData: TableRow[] = [
  { course_id: 'BIO-101', sec_id: '1', semester: 'Summer', year: 2017, building: 'Painter', room_number: '514', time_slot_id: 'B' },
  { course_id: 'BIO-301', sec_id: '1', semester: 'Summer', year: 2018, building: 'Painter', room_number: '514', time_slot_id: 'A' },
  { course_id: 'CS-101', sec_id: '1', semester: 'Fall', year: 2017, building: 'Packard', room_number: '101', time_slot_id: 'H' },
  { course_id: 'CS-101', sec_id: '1', semester: 'Spring', year: 2018, building: 'Packard', room_number: '101', time_slot_id: 'F' },
  { course_id: 'CS-190', sec_id: '1', semester: 'Spring', year: 2017, building: 'Taylor', room_number: '3128', time_slot_id: 'E' },
  { course_id: 'CS-190', sec_id: '2', semester: 'Spring', year: 2017, building: 'Taylor', room_number: '3128', time_slot_id: 'A' },
  { course_id: 'CS-315', sec_id: '1', semester: 'Spring', year: 2018, building: 'Watson', room_number: '120', time_slot_id: 'D' },
  { course_id: 'CS-319', sec_id: '1', semester: 'Spring', year: 2018, building: 'Watson', room_number: '100', time_slot_id: 'B' },
  { course_id: 'CS-319', sec_id: '2', semester: 'Spring', year: 2018, building: 'Taylor', room_number: '3128', time_slot_id: 'C' },
  { course_id: 'CS-347', sec_id: '1', semester: 'Fall', year: 2017, building: 'Taylor', room_number: '3128', time_slot_id: 'A' },
  { course_id: 'EE-181', sec_id: '1', semester: 'Spring', year: 2017, building: 'Taylor', room_number: '3128', time_slot_id: 'C' },
  { course_id: 'FIN-201', sec_id: '1', semester: 'Spring', year: 2018, building: 'Packard', room_number: '101', time_slot_id: 'B' },
  { course_id: 'HIS-351', sec_id: '1', semester: 'Spring', year: 2018, building: 'Painter', room_number: '514', time_slot_id: 'C' },
  { MU_199: undefined, course_id: 'MU-199', sec_id: '1', semester: 'Spring', year: 2018, building: 'Packard', room_number: '101', time_slot_id: 'D' },
  { course_id: 'PHY-101', sec_id: '1', semester: 'Fall', year: 2017, building: 'Watson', room_number: '100', time_slot_id: 'A' },
];

export const departmentData: TableRow[] = [
  { dept_name: 'Biology', building: 'Watson', budget: 90000 },
  { dept_name: 'Comp. Sci.', building: 'Taylor', budget: 100000 },
  { dept_name: 'Elec. Eng.', building: 'Taylor', budget: 85000 },
  { dept_name: 'Finance', building: 'Painter', budget: 120000 },
  { dept_name: 'History', building: 'Painter', budget: 50000 },
  { dept_name: 'Music', building: 'Packard', budget: 80000 },
  { dept_name: 'Physics', building: 'Watson', budget: 70000 },
];

export const courseData: TableRow[] = [
  { course_id: 'BIO-101', title: 'Intro. to Biology', dept_name: 'Biology', credits: 4 },
  { course_id: 'BIO-301', title: 'Genetics', dept_name: 'Biology', credits: 4 },
  { course_id: 'CS-101', title: 'Intro. to Computer Science', dept_name: 'Comp. Sci.', credits: 4 },
  { course_id: 'CS-190', title: 'Game Design', dept_name: 'Comp. Sci.', credits: 4 },
  { course_id: 'CS-315', title: 'Robotics', dept_name: 'Comp. Sci.', credits: 3 },
  { course_id: 'CS-319', title: 'Image Processing', dept_name: 'Comp. Sci.', credits: 3 },
  { course_id: 'CS-347', title: 'Database System Concepts', dept_name: 'Comp. Sci.', credits: 3 },
  { course_id: 'EE-181', title: 'Intro. to Digital Systems', dept_name: 'Elec. Eng.', credits: 3 },
  { course_id: 'FIN-201', title: 'Investment Banking', dept_name: 'Finance', credits: 3 },
  { course_id: 'HIS-351', title: 'World History', dept_name: 'History', credits: 3 },
  { course_id: 'MU-199', title: 'Music Video Production', dept_name: 'Music', credits: 3 },
  { course_id: 'PHY-101', title: 'Physical Principles', dept_name: 'Physics', credits: 4 },
];

export const studentData: TableRow[] = [
  { ID: '00128', name: 'Zhang', dept_name: 'Comp. Sci.', tot_cred: 102 },
  { ID: '12345', name: 'Shankar', dept_name: 'Comp. Sci.', tot_cred: 32 },
  { ID: '19991', name: 'Brandt', dept_name: 'History', tot_cred: 80 },
  { ID: '23121', name: 'Chavez', dept_name: 'Finance', tot_cred: 110 },
  { ID: '44553', name: 'Peltier', dept_name: 'Physics', tot_cred: 56 },
  { ID: '45678', name: 'Levy', dept_name: 'Physics', tot_cred: 46 },
  { ID: '54321', name: 'Williams', dept_name: 'Comp. Sci.', tot_cred: 54 },
  { ID: '55739', name: 'Sanchez', dept_name: 'Music', tot_cred: 38 },
  { ID: '70557', name: 'Snow', dept_name: 'Physics', tot_cred: 0 },
  { ID: '76543', name: 'Brown', dept_name: 'Comp. Sci.', tot_cred: 58 },
  { ID: '76653', name: 'Aoi', dept_name: 'Elec. Eng.', tot_cred: 60 },
  { ID: '98765', name: 'Bourikas', dept_name: 'Elec. Eng.', tot_cred: 98 },
  { ID: '98988', name: 'Tanaka', dept_name: 'Biology', tot_cred: 120 },
];

export const takesData: TableRow[] = [
  { ID: '00128', course_id: 'CS-101', sec_id: '1', semester: 'Fall', year: 2017, grade: 'A' },
  { ID: '00128', course_id: 'CS-347', sec_id: '1', semester: 'Fall', year: 2017, grade: 'A-' },
  { ID: '12345', course_id: 'CS-101', sec_id: '1', semester: 'Fall', year: 2017, grade: 'C' },
  { ID: '12345', course_id: 'CS-190', sec_id: '2', semester: 'Spring', year: 2017, grade: 'A' },
  { ID: '12345', course_id: 'CS-315', sec_id: '1', semester: 'Spring', year: 2018, grade: 'A' },
  { ID: '12345', course_id: 'CS-347', sec_id: '1', semester: 'Fall', year: 2017, grade: 'A' },
  { ID: '19991', course_id: 'HIS-351', sec_id: '1', semester: 'Spring', year: 2018, grade: 'B' },
  { ID: '23121', course_id: 'FIN-201', sec_id: '1', semester: 'Spring', year: 2018, grade: 'C+' },
  { ID: '44553', course_id: 'PHY-101', sec_id: '1', semester: 'Fall', year: 2017, grade: 'B-' },
  { ID: '45678', course_id: 'CS-101', sec_id: '1', semester: 'Fall', year: 2017, grade: 'F' },
  { ID: '45678', course_id: 'CS-101', sec_id: '1', semester: 'Spring', year: 2018, grade: 'B+' },
  { ID: '45678', course_id: 'CS-319', sec_id: '1', semester: 'Spring', year: 2018, grade: 'B' },
  { ID: '54321', course_id: 'CS-101', sec_id: '1', semester: 'Fall', year: 2017, grade: 'A-' },
  { ID: '54321', course_id: 'CS-190', sec_id: '2', semester: 'Spring', year: 2017, grade: 'B+' },
  { ID: '55739', course_id: 'MU-199', sec_id: '1', semester: 'Spring', year: 2018, grade: 'A-' },
  { ID: '76543', course_id: 'CS-101', sec_id: '1', semester: 'Fall', year: 2017, grade: 'A' },
  { ID: '76543', course_id: 'CS-319', sec_id: '2', semester: 'Spring', year: 2018, grade: 'A' },
  { ID: '76653', course_id: 'EE-181', sec_id: '1', semester: 'Spring', year: 2017, grade: 'C' },
  { ID: '98765', course_id: 'CS-101', sec_id: '1', semester: 'Fall', year: 2017, grade: 'C-' },
  { ID: '98765', course_id: 'CS-315', sec_id: '1', semester: 'Spring', year: 2018, grade: 'B' },
  { ID: '98988', course_id: 'BIO-101', sec_id: '1', semester: 'Summer', year: 2017, grade: 'A' },
  { ID: '98988', course_id: 'BIO-301', sec_id: '1', semester: 'Summer', year: 2018, grade: null },
];

export const advisorData: TableRow[] = [
  { s_id: '00128', i_id: '45565' },
  { s_id: '12345', i_id: '10101' },
  { s_id: '23121', i_id: '76543' },
  { s_id: '44553', i_id: '22222' },
  { s_id: '45678', i_id: '22222' },
  { s_id: '76543', i_id: '45565' },
  { s_id: '76653', i_id: '98345' },
  { s_id: '98765', i_id: '98345' },
  { s_id: '98988', i_id: '76766' },
];

export const classroomData: TableRow[] = [
  { building: 'Packard', room_number: '101', capacity: 500 },
  { building: 'Painter', room_number: '514', capacity: 10 },
  { building: 'Taylor', room_number: '3128', capacity: 70 },
  { building: 'Watson', room_number: '100', capacity: 30 },
  { building: 'Watson', room_number: '120', capacity: 50 },
];

export const timeSlotData: TableRow[] = [
  { time_slot_id: 'A', day: 'M', start_time: '8:00', end_time: '8:50' },
  { time_slot_id: 'B', day: 'M', start_time: '9:00', end_time: '9:50' },
  { time_slot_id: 'C', day: 'M', start_time: '11:00', end_time: '11:50' },
  { time_slot_id: 'D', day: 'M', start_time: '13:00', end_time: '13:50' },
  { time_slot_id: 'E', day: 'T', start_time: '10:30', end_time: '11:45' },
  { time_slot_id: 'F', day: 'T', start_time: '14:00', end_time: '15:15' },
  { time_slot_id: 'H', day: 'W', start_time: '10:00', end_time: '10:50' },
];

export const prereqData: TableRow[] = [
  { course_id: 'BIO-301', prereq_id: 'BIO-101' },
  { course_id: 'CS-190', prereq_id: 'CS-101' },
  { course_id: 'CS-315', prereq_id: 'CS-101' },
  { course_id: 'CS-319', prereq_id: 'CS-101' },
  { course_id: 'CS-347', prereq_id: 'CS-101' },
  { course_id: 'EE-181', prereq_id: 'PHY-101' },
];

export const universityDatabaseSchemas: Record<string, RelationSchema> = {
  instructor: {
    name: 'instructor',
    primaryKey: ['ID'],
    attributes: [
      { name: 'ID', type: 'string', domain: '5-character string (Employee ID)' },
      { name: 'name', type: 'string', domain: 'Instructor name string' },
      { name: 'dept_name', type: 'string', domain: 'Department name string' },
      { name: 'salary', type: 'number', domain: 'Positive integer (Annual salary in USD)' },
    ],
    foreignKeys: [
      { attribute: 'dept_name', referencedTable: 'department', referencedAttribute: 'dept_name' },
    ],
  },
  teaches: {
    name: 'teaches',
    primaryKey: ['ID', 'course_id', 'sec_id', 'semester', 'year'],
    attributes: [
      { name: 'ID', type: 'string', domain: '5-character instructor ID' },
      { name: 'course_id', type: 'string', domain: 'Course identifier (e.g. CS-101)' },
      { name: 'sec_id', type: 'string', domain: 'Section identifier (e.g. 1, 2)' },
      { name: 'semester', type: 'string', domain: 'Semester name (Fall, Spring, Summer)' },
      { name: 'year', type: 'number', domain: '4-digit calendar year' },
    ],
    foreignKeys: [
      { attribute: 'ID', referencedTable: 'instructor', referencedAttribute: 'ID' },
      { attribute: 'course_id, sec_id, semester, year', referencedTable: 'section', referencedAttribute: 'course_id, sec_id, semester, year' },
    ],
  },
  section: {
    name: 'section',
    primaryKey: ['course_id', 'sec_id', 'semester', 'year'],
    attributes: [
      { name: 'course_id', type: 'string', domain: 'Course identifier' },
      { name: 'sec_id', type: 'string', domain: 'Section identifier' },
      { name: 'semester', type: 'string', domain: 'Semester name' },
      { name: 'year', type: 'number', domain: 'Year' },
      { name: 'building', type: 'string', domain: 'Building name' },
      { name: 'room_number', type: 'string', domain: 'Room number identifier' },
      { name: 'time_slot_id', type: 'string', domain: 'Time slot code (A, B, C...)' },
    ],
    foreignKeys: [
      { attribute: 'course_id', referencedTable: 'course', referencedAttribute: 'course_id' },
      { attribute: 'building, room_number', referencedTable: 'classroom', referencedAttribute: 'building, room_number' },
      { attribute: 'time_slot_id', referencedTable: 'time_slot', referencedAttribute: 'time_slot_id' },
    ],
  },
  course: {
    name: 'course',
    primaryKey: ['course_id'],
    attributes: [
      { name: 'course_id', type: 'string', domain: 'Unique course code' },
      { name: 'title', type: 'string', domain: 'Course title description' },
      { name: 'dept_name', type: 'string', domain: 'Department name' },
      { name: 'credits', type: 'number', domain: 'Credit units (positive integer)' },
    ],
    foreignKeys: [
      { attribute: 'dept_name', referencedTable: 'department', referencedAttribute: 'dept_name' },
    ],
  },
  department: {
    name: 'department',
    primaryKey: ['dept_name'],
    attributes: [
      { name: 'dept_name', type: 'string', domain: 'Department name string' },
      { name: 'building', type: 'string', domain: 'Main administrative building' },
      { name: 'budget', type: 'number', domain: 'Annual budget in USD' },
    ],
  },
  student: {
    name: 'student',
    primaryKey: ['ID'],
    attributes: [
      { name: 'ID', type: 'string', domain: '5-character student ID' },
      { name: 'name', type: 'string', domain: 'Student full name' },
      { name: 'dept_name', type: 'string', domain: 'Major department name' },
      { name: 'tot_cred', type: 'number', domain: 'Total earned credits (>= 0)' },
    ],
    foreignKeys: [
      { attribute: 'dept_name', referencedTable: 'department', referencedAttribute: 'dept_name' },
    ],
  },
  takes: {
    name: 'takes',
    primaryKey: ['ID', 'course_id', 'sec_id', 'semester', 'year'],
    attributes: [
      { name: 'ID', type: 'string', domain: 'Student ID' },
      { name: 'course_id', type: 'string', domain: 'Course identifier' },
      { name: 'sec_id', type: 'string', domain: 'Section identifier' },
      { name: 'semester', type: 'string', domain: 'Semester name' },
      { name: 'year', type: 'number', domain: 'Year' },
      { name: 'grade', type: 'string', domain: 'Letter grade (A, B, C, D, F, or null)' },
    ],
    foreignKeys: [
      { attribute: 'ID', referencedTable: 'student', referencedAttribute: 'ID' },
      { attribute: 'course_id, sec_id, semester, year', referencedTable: 'section', referencedAttribute: 'course_id, sec_id, semester, year' },
    ],
  },
  advisor: {
    name: 'advisor',
    primaryKey: ['s_id'],
    attributes: [
      { name: 's_id', type: 'string', domain: 'Student ID' },
      { name: 'i_id', type: 'string', domain: 'Instructor ID' },
    ],
    foreignKeys: [
      { attribute: 's_id', referencedTable: 'student', referencedAttribute: 'ID' },
      { attribute: 'i_id', referencedTable: 'instructor', referencedAttribute: 'ID' },
    ],
  },
  classroom: {
    name: 'classroom',
    primaryKey: ['building', 'room_number'],
    attributes: [
      { name: 'building', type: 'string', domain: 'Campus building name' },
      { name: 'room_number', type: 'string', domain: 'Room number identifier' },
      { name: 'capacity', type: 'number', domain: 'Seating capacity (integer)' },
    ],
  },
  time_slot: {
    name: 'time_slot',
    primaryKey: ['time_slot_id', 'day', 'start_time'],
    attributes: [
      { name: 'time_slot_id', type: 'string', domain: 'Slot code letter' },
      { name: 'day', type: 'string', domain: 'Day of week (M, T, W, R, F)' },
      { name: 'start_time', type: 'string', domain: '24-hour / 12-hour start time' },
      { name: 'end_time', type: 'string', domain: 'End time' },
    ],
  },
  prereq: {
    name: 'prereq',
    primaryKey: ['course_id', 'prereq_id'],
    attributes: [
      { name: 'course_id', type: 'string', domain: 'Target course identifier' },
      { name: 'prereq_id', type: 'string', domain: 'Prerequisite course identifier' },
    ],
    foreignKeys: [
      { attribute: 'course_id', referencedTable: 'course', referencedAttribute: 'course_id' },
      { attribute: 'prereq_id', referencedTable: 'course', referencedAttribute: 'course_id' },
    ],
  },
};

export const sampleDatabase = {
  instructor: instructorData,
  teaches: teachesData,
  section: sectionData,
  department: departmentData,
  course: courseData,
  student: studentData,
  takes: takesData,
  advisor: advisorData,
  classroom: classroomData,
  time_slot: timeSlotData,
  prereq: prereqData,
};
