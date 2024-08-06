import * as answersService from "./answersService.js";
import { serverSentEventManager } from "../serverSentEventManager.js";

const ANSWER_RATE_LIMIT = 1;

const getAnswersByQuestionId = async (c) => {

  let questionId = await c.req.param("id");

  const currentUserId = await c.req.query('userId');
  const lastId = await c.req.query('last_id');
  const lastElementMostRecentTime = await c.req.query('most_recent_time');
  const limit = await c.req.query('limit') || 5;

  let content = await answersService.getAnswersByQuestionId(questionId, limit, lastElementMostRecentTime, lastId);

  let answerIds = content.map(answer => answer.id);

  let votes = await answersService.getVotesByAnswerIds(answerIds);

  let voteGroupByAnswer = Object.groupBy(votes, ({ answer_id }) => answer_id);

  content = content.map(answer => {
    return {
      ...answer,
      isUserVoted: voteGroupByAnswer[answer.id]?.some(vote => vote.user_uuid === currentUserId),
      voteCount: parseInt(voteGroupByAnswer[answer.id]?.length ?? 0)
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

  let userVoteExists = await answersService.isUserVoteExists(request.answerId, request.userId);

  if (userVoteExists) {
    c.status(404);
    return c.json("User already voted")
  }

  await answersService.upvote(request.answerId, request.userId);

  return c.json(true);
};

const createAnswer = async (request) => {

  let answer = await answersService.createAnswer(request.questionId, request.content, request.userId,)

  let event = {
    type: 'answer-created',
    questionId: request.questionId,
    userId: request.userId
  }

  serverSentEventManager.broadcast(JSON.stringify(event));

  return answer;
};

export { getAnswersByQuestionId, upvote, createAnswer };