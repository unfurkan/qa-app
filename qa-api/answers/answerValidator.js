import * as answerService from "./answersService.js";

const ANSWER_RATE_LIMIT = 1;

 const validateAnswerRateLimit = async (c, next) => {
    
    const request = await c.req.json();


    let isUserAnswerExists = await answerService.isUserAnswerExists(request.questionId, request.userId);

    if(isUserAnswerExists){
        c.status(400);
        return c.json("User already answered this question.")
    }

    let createdAnswersWithInMinuteInterval = await answerService.findAnswersCreatedByUserIdWithInMinuteInterval(request.userId);

    if (createdAnswersWithInMinuteInterval >= ANSWER_RATE_LIMIT) {
        c.status(400);
        return c.json("Not allowed to create multiple answers at the same time. Please try again short later")
    }

    await next();
};

export {validateAnswerRateLimit};