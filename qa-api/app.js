
import * as courseController from "./courses/coursesController.js";
import * as questionController from "./questions/questionController.js";
import * as answerController from "./answers/answersController.js";

import * as questionValidator from "./questions/questionValidator.js";
import * as answerValidator from "./answers/answerValidator.js";

import { Hono } from "./deps.js";
import { serverSentEventManager } from "./serverSentEventManager.js";

const api = new Hono();

api.get("/courses", courseController.getCourses);
api.get("/courses/:id", courseController.getCourseById);

api.get("/courses/:id/questions", questionController.getQuestionsByCourseId);

api.post("/questions", questionValidator.validateQuestionRateLimit, async (c) => {
    const request = await c.req.json();
    let question = await questionController.createQuestion(request);
    return c.json(question);
});

api.get("/questions/:id", questionController.getQuestionById);
api.put("/questions/upvote", questionController.upvote);

api.get("/questions/:id/answers", answerController.getAnswersByQuestionId);

api.post("/answers", answerValidator.validateAnswerRateLimit, async (c) => {
    const request = await c.req.json();
    let answer = await answerController.createAnswer(request);
    return c.json(answer);
});

api.put("/answers/upvote", answerController.upvote);


api.get('/sse', async (c) => {

    c.header('Transfer-Encoding', 'chunked')
    c.header('Content-Type', 'text/event-stream')
    c.header('Cache-Control', 'no-cache')
    c.header('Connection', 'keep-alive')

    let stream;
    const body = new ReadableStream({
        start(s) {
            stream = s;
            serverSentEventManager.addStream(stream);
        },
        cancel() {
            serverSentEventManager.removeStream(stream);
        },
    });

    return c.newResponse(body);
})

const portConfig = { port: 7777, hostname: "0.0.0.0" };
Deno.serve(portConfig, api.fetch);


