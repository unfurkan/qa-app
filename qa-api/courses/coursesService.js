import { sql } from "../database.js";

const getCourses = async () => {
  const result =await sql`
  SELECT id,title,summary, course_order as order FROM  courses c
    ORDER BY c.course_order
`;
  return  result;
};

const getCourseById = async (courseId) => {
  const result =await sql`
  SELECT id,title,summary, course_order as order FROM  courses c
  WHERE c.id =${courseId}
`;
  return  result?.length === 1 ?  result[0] :  null;
};

export {getCourses, getCourseById};
