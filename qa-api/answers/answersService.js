import { sql } from '../database.js';

const upvote = async (answerId, userId) => {
  return await sql.begin(async sql => {
    const vote = await sql`
    INSERT INTO ANSWERS_VOTES 
      (answer_id, user_uuid)
      VALUES (${answerId},${userId})
      RETURNING answer_id,user_uuid;
    `;

    const lastVoteTime = await sql`
    UPDATE ANSWERS
    SET last_vote_time = NOW()
    WHERE id =${answerId}
    RETURNING id;
  `;
    return [vote, lastVoteTime]
  });
};

const isUserVoteExists = async (answerId, userId) => {
  const result = await sql`
  SELECT COUNT(*) > 0 as result FROM ANSWERS_VOTES vote
  WHERE vote.user_uuid =${userId} and vote.answer_id =${answerId};
`;

  return result[0].result;
};


const isUserAnswerExists = async (questionId, userId) => {
  const result = await sql`
  SELECT COUNT(*) > 0 as result FROM ANSWERS a
  WHERE a.user_uuid =${userId} and a.question_id =${questionId};
`;

  return result[0].result;
};
const getAnswersByQuestionId = async (questionId, limit, lastMostRecentTime, lastId) => {

  if (lastMostRecentTime && lastId) {
    // Subsequent queries with cursor
    return await sql`
      SELECT 
        id,
        question_id,
        content,
        created_on,
        user_uuid,
        last_vote_time,
        GREATEST(created_on, last_vote_time) AS most_recent_time
      FROM ANSWERS a
      WHERE a.question_id = ${questionId}
        AND (GREATEST(created_on, last_vote_time), id) < (${lastMostRecentTime}, ${lastId})
      ORDER BY most_recent_time DESC, id DESC
      LIMIT ${limit}
    `;
  } else {
    // Initial query without cursor
    return await sql`
      SELECT 
        id,
        question_id,
        content,
        created_on,
        user_uuid,
        last_vote_time,
        GREATEST(created_on, last_vote_time) AS most_recent_time
      FROM ANSWERS a
      WHERE a.question_id = ${questionId}
      ORDER BY most_recent_time DESC, id DESC
      LIMIT ${limit}
    `;
  }
};

const getVotesByAnswerIds = async (answerIds) => {
  let result = await sql`
  SELECT * FROM ANSWERS_VOTES vote
  WHERE vote.answer_id IN ${sql(answerIds)}
`;
  return result;
};

const createAnswer = async (questionId, content, userId) => {
  const result = await sql`
  INSERT INTO ANSWERS 
    (question_id,content, user_uuid)
    VALUES (${questionId},${content},${userId})
    RETURNING id;
  `;
  return result?.length === 1 ? result[0] : null;
};

const findAnswersCreatedByUserIdWithInMinuteInterval = async (userId) => {
  const result = await sql`
  select count(*) from ANSWERS a
  where a.created_on > (now() - '1 minute'::interval) and user_uuid =${userId}
  `;

  return parseInt(result[0].count);
};

export { createAnswer, upvote, findAnswersCreatedByUserIdWithInMinuteInterval, getVotesByAnswerIds, isUserVoteExists,isUserAnswerExists, getAnswersByQuestionId };
