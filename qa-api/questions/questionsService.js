import { sql } from '../database.js';

const upvote = async (questionId, userId) => {
  return await sql.begin(async sql => {
    const vote = await sql`
    INSERT INTO QUESTIONS_VOTES 
      (question_id, user_uuid)
      VALUES (${questionId},${userId})
      RETURNING question_id,user_uuid;
    `;

    const lastVoteTime = await sql`
    UPDATE QUESTIONS
    SET last_vote_time = NOW()
    WHERE id =${questionId}
    RETURNING id;
  `;
    return [vote, lastVoteTime]
  });
};

const isUserVoteExists = async (questionId, userId) => {
  const result = await sql`
  SELECT COUNT(*) > 0 as result FROM  QUESTIONS_VOTES vote
  WHERE vote.user_uuid =${userId} and vote.question_id =${questionId};
`;

  return result[0].result;
};

const getQuestionsByCourseId = async (courseId, limit, lastMostRecentTime, lastId) => {

  if (lastMostRecentTime && lastId ) {
    // Subsequent queries with cursor
    return await sql`
      SELECT 
        id,
        course_id,
        content,
        created_on,
        last_vote_time,
        GREATEST(created_on, last_vote_time) AS most_recent_time
      FROM questions q
      WHERE q.course_id = ${courseId}
        AND (GREATEST(created_on, last_vote_time), id) < (${lastMostRecentTime}, ${lastId})
      ORDER BY most_recent_time DESC, id DESC
      LIMIT ${limit}
    `;
  } else {
    // Initial query without cursor
    return await sql`
      SELECT 
        id,
        course_id,
        content,
        created_on,
        last_vote_time,
        GREATEST(created_on, last_vote_time) AS most_recent_time
      FROM questions q
      WHERE q.course_id = ${courseId}
      ORDER BY most_recent_time DESC, id DESC
      LIMIT ${limit}
    `;
  }
};

const getQuestionCountByCourseId = async (courseId) => {
  let result = await sql`
  SELECT count(*) FROM QUESTIONS q
  WHERE q.course_id =${courseId}
`;

  return parseInt(result[0].count);
};

const getQuestionVotesByQuestionIds = async (questionIds) => {
  let result = await sql`
  SELECT * FROM QUESTIONS_VOTES vote
  WHERE vote.question_id IN ${sql(questionIds)}
`;

return result;
};

const createQuestion = async (courseId, content, userId) => {
  const result = await sql`
  INSERT INTO QUESTIONS 
    (course_id,content, user_uuid)
    VALUES (${courseId},${content},${userId})
    RETURNING id;
  `;
  return result?.length === 1 ? result[0] : null;
};

const getQuestionById = async (questionId) => {
  const result =await sql`
  SELECT q.id,
  q.content,
  c.id AS course_id,
  c.title as title,
  c.summary as summary,
  COUNT(qv.question_id) AS voteCount
FROM
questions q
  INNER JOIN
courses c ON q.course_id = c.id
  LEFT JOIN
questions_votes qv ON q.id = qv.question_id
WHERE
  q.id = ${questionId}
GROUP BY
q.id, c.id;
`;
  return  result?.length === 1 ?  result[0] :  null;
};

const findQuestionsCreatedByUserIdWithInMinuteInterval= async (userId) => {
  const result = await sql`
  select count(*) from questions q
  where q.created_on > (now() - '1 minute'::interval) and user_uuid =${userId}
  `;

  return parseInt(result[0].count);
};

export { createQuestion, upvote,getQuestionById, getQuestionsByCourseId,findQuestionsCreatedByUserIdWithInMinuteInterval, getQuestionCountByCourseId,getQuestionVotesByQuestionIds, isUserVoteExists };
