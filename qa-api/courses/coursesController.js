import * as coursesService from "./coursesService.js";


const getCourses = async (c) => {
  console.log(c);
  let courses = await coursesService.getCourses();
  return c.json(courses);
};

const getCourseById = async (c) => {
  let courseId = await c.req.param("id");
  let course = await coursesService.getCourseById(courseId)
  return c.json(course);
};


export { getCourses, getCourseById};