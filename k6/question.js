import http from "k6/http";
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

//30 s , 20 virtualuser
export const options = {
    duration: "30s",
    vus: 20
};

export default function (data) {
    //creates randomusers to simulate question creation withouth rate limit (1 minute rate limit exists for a user)
    const request = {
        userId: uuidv4() ,
        content: randomString(20),
        courseId: 1
    };

    const params = { headers: { 'Content-Type': 'application/json' } }

    http.post("http://localhost:7800/api/questions",JSON.stringify(request) , params);
}
