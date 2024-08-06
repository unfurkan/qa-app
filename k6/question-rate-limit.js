import http from "k6/http";
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

//30 s , 20 virtualuser
export const options = {
    duration: "30s",
    vus: 1
};


let user = uuidv4();

export default function () {
    //creates randomusers to simulate question creation withouth rate limit(1 minute for a user)

    let courseId = Math.floor(Math.random() * 4) + 1; // Random course ID between 1 and 4

    const request = {
        userId :user,
        content: randomString(20),
        courseId: courseId
    };

    const params = { headers: { 'Content-Type': 'application/json' } }

    http.post("http://localhost:7800/api/questions",JSON.stringify(request) , params);
}
