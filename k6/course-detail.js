import http from 'k6/http';

export let options = {
  stages: [
    { duration: '10s', target: 50 }, // simulate ramp-up of 50 users over 10s
    { duration: '10s', target: 50 }, // stay at 50 users for 10seconds
    { duration: '10s', target: 0 }, // ramp-down to 0 users
  ],
};

const baseUrl = 'http://localhost:7800';

export default function () {
  let courseId = Math.floor(Math.random() * 4) + 1; // Random course ID between 1 and 4
  let res = http.get(`${baseUrl}/courses/${courseId}`);
}