import * as questionService from "./questionsService.js";
import { serverSentEventManager } from "../serverSentEventManager.js";
import { createAnswer } from "../answers/answersController.js";

const INFINITE_SCROLL_PAGING_SIZE =20;

const getQuestionById = async (c) => {
  let questionId = await c.req.param("id");
  let question = await questionService.getQuestionById(questionId)
  return c.json(question);
};

const getQuestionsByCourseId = async (c) => {

  let courseId = await c.req.param("id");

  const userId = await c.req.query('userId');
  const lastId = await c.req.query('last_id');
  const lastMostRecentTime = await c.req.query('most_recent_time');
  const limit = await c.req.query('limit') || INFINITE_SCROLL_PAGING_SIZE;

  console.log(lastMostRecentTime);

  let content = await questionService.getQuestionsByCourseId(courseId, limit, lastMostRecentTime, lastId);

  let questionsIds = content.map(question => question.id);
  let questionVotes = await questionService.getQuestionVotesByQuestionIds(questionsIds);

  let voteGroupByQuestion = Object.groupBy(questionVotes, ({ question_id }) => question_id);

  content = content.map(question => {
    return {
      ...question,
      isUserVoted: voteGroupByQuestion[question.id]?.some(vote => vote.user_uuid === userId),
      voteCount: parseInt(voteGroupByQuestion[question.id]?.length ?? 0)
    }
  })

  const lastItem = content[content.length - 1];

  let response = {
    lastMostRecentTime: lastItem?.most_recent_time,
    lastId: lastItem?.id,
    hasMore: content.length == limit,
    content: content,
  };

  return c.json(response);
};

const upvote = async (c) => {
  const request = await c.req.json();

  let userVoteExists = await questionService.isUserVoteExists(request.questionId, request.userId);

  if (userVoteExists) {
    c.status(404);
    return c.json("User already voted")
  }

  await questionService.upvote(request.questionId, request.userId);

  return c.json(true);
};

const saveAIGeneratedAnswer = async (data) => {

  let answers = [];


  for (let i = 0; i < 3; i++) {
    try {
      const response = await fetch("http://llm-api:7000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const body = await response.json();

      let generatedText = body[0].generated_text;

      const answerPart = generatedText.split('\n').slice(1).join('\n').trim(); // Extract part after line break

      answers.push(answerPart);

    } catch (error) {
      console.error('Failed to fetch answer:', error);
    }
  }

  answers.map(answer => {
    return {
      userId :"GPT",
      questionId: data.questionId,
      content: answer
    }
  }).forEach(async (answerRequest) => {
    console.log(answerRequest);
    createAnswer(answerRequest)
  });

  console.log("AI Genereated answers saved");

  return answers;
};

const createQuestion = async (request) => {

  let question = await questionService.createQuestion(request.courseId, request.content, request.userId)

  saveAIGeneratedAnswer({ question: request.content, questionId: question.id });

  let event = {
    type: 'question-created',
    courseId: request.courseId,
    userId: request.userId
  }

  serverSentEventManager.broadcast(JSON.stringify(event));

  return question;
};

export { upvote, createQuestion, getQuestionById, getQuestionsByCourseId };