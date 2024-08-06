import * as questionService from "./questionsService.js";

const QUESTION_RATE_LIMIT = 1;

const validateQuestionRateLimit = async (c, next) => {

    const request = await c.req.json();

    let createdQuestionsWithInMinuteInterval = await questionService.findQuestionsCreatedByUserIdWithInMinuteInterval(request.userId);

      if (createdQuestionsWithInMinuteInterval >= QUESTION_RATE_LIMIT) {
          c.status(400);
          return c.json("Not allowed to create question frequently. Please try again shortly.")
      }

    await next();
};

export { validateQuestionRateLimit };