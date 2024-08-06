## Database Schema and Index Justification

This document outlines the database schema used in the project.Also more in REFLECTION.md file.
### Database Schema

The following database schema is used in our project. 

```sql
CREATE TABLE COURSES (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  course_order INTEGER NOT NULL,
  created_on TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE QUESTIONS (
  id SERIAL PRIMARY KEY,
  course_id INTEGER REFERENCES COURSES(id),
  content TEXT NOT NULL,
  user_uuid TEXT NOT NULL,
  created_on TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_vote_time TIMESTAMP WITH TIME ZONE
);

CREATE TABLE QUESTIONS_VOTES (
  question_id INT REFERENCES QUESTIONS(id),
  user_uuid TEXT NOT NULL,
  PRIMARY KEY (question_id, user_uuid)
);

CREATE TABLE ANSWERS (
  id SERIAL PRIMARY KEY,
  question_id INTEGER REFERENCES QUESTIONS(id),
  content TEXT NOT NULL,
  user_uuid TEXT NOT NULL,
  created_on TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_vote_time TIMESTAMP WITH TIME ZONE
);

CREATE TABLE ANSWERS_VOTES (
  answer_id INT REFERENCES ANSWERS(id),
  user_uuid TEXT NOT NULL,
  PRIMARY KEY (answer_id, user_uuid)
);

-- This index is created to speed up queries that filter questions based on their associated course.
CREATE INDEX QUESTIONS_COURSE_ID_IDX ON QUESTIONS (course_id);

-- This index optimizes the retrieval of answers for a specific question.
CREATE INDEX ANSWERS_QUESTION_ID_IDX ON ANSWERS (question_id);

-- This index supports queries that need to fetch the most recent questions for a course, ordered by the most recent activity (either creation or last vote time). Used in infinite scrolling cursor based pagination
CREATE INDEX QUESTIONS_ID_COURSE_ID_MOST_RECENT_IDX ON QUESTIONS (course_id, GREATEST(created_on, last_vote_time) DESC, id DESC);

-- This index is designed to optimize queries that fetch the most recent answers for a question, ordered by the most recent activity. Used in infinite scrolling cursor based pagination
CREATE INDEX ANSWERS_ID_QUESTION_ID_MOST_RECENT_IDX ON ANSWERS (question_id, GREATEST(created_on, last_vote_time) DESC, id DESC);
