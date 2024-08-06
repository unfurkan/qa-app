import http from 'k6/http';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export let options = {
    vus: 10,
    duration: '10s',
};


const baseUrl = 'http://localhost:7800';

//initial question data shared between Virtual Users
export function setup() {
    const exampleQuestion = {
        userId: uuidv4(),
        content: randomString(20),
        courseId: 1,
    };

    const params = { headers: { 'Content-Type': 'application/json' } }

    let response = http.post(`${baseUrl}/api/questions`, JSON.stringify(exampleQuestion), params);

    let question = response.json();
    return { id: question.id };
}


export default function (question) {
    //each user can upvote at most once genereate random users
    let payload = JSON.stringify({
        questionId:question.id,
        userId: uuidv4(), // Generate a unique userId for each request
    });

    http.put(`${baseUrl}/api/questions/upvote`, payload, {
        headers: {
            'Content-Type': 'application/json',
        },
    });

}
