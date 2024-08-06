### Key Design Decisions

1. **Normalized Database Schema**:
   - The database schema is designed to be normalized to ensure data integrity and minimize redundancy. Each entity (courses, questions, answers, votes) is stored in its own table, with foreign key relationships to maintain referential integrity.

2. **Indexes for Performance Optimization**:
   - Indexes have been strategically placed on columns that are frequently used in query filters and joins. This includes indexes on `course_id` in the `QUESTIONS` table and `question_id` in the `ANSWERS` table. Composite indexes are also used to optimize queries that sort by recent activity for paging end points.

3. **Denormalization for Recent Activity**:
   - To enhance performance for common queries that fetch the most recent questions or answers based on activity, `last_vote_time` is stored directly in the `QUESTIONS` and `ANSWERS` tables. This avoids the need for complex joins and subqueries.

3. **Cursor-Based Pagination**:
   - Instead of using offset-limit pagination, cursor-based pagination is used to handle large datasets more efficiently. This approach reduces the risk of data inconsistencies when new data is added or existing data is modified between queries, providing a more reliable way to paginate through data. Read more about cursor based pagination : https://slack.engineering/evolving-api-pagination-at-slack/

3. **Cursor-Based Pagination**:
   - Instead of using offset-limit pagination, cursor-based pagination is used to handle large datasets more efficiently. This approach reduces the risk of data inconsistencies when new data is added or existing data is modified between queries, providing a more reliable way to paginate through data. Read more about cursor based pagination : https://slack.engineering/evolving-api-pagination-at-slack/.
   - Infinite scrolling has been implemented. When users reach the bottom of the course page (listing questions) or the question page (listing answers), the application retrieves more content in increments of 20(default value).

4. **Infinite Scrolling and SSE Notifications**:
    - To improve the user experience on pages that list questions or answers,
    - Server-Sent Events (SSE) are used to notify users of new questions or answers created by others in real-time.(to test this functionality please open incognito tab or try with another user) A button appears, allowing users to reload the page to see new content. This ensures that new questions show up at the top of the list even when the user is at the bottom of the page or has passed several pages(more than 20 question is already loaded).

## Reflection on Possible Improvements

1. **Improving Query Performance**:
   - **Current Situation**: The application relies on indexes to speed up queries, which is effective for most scenarios.
   - **Possible Improvement**: Implement caching mechanisms for frequently accessed data, such as the most recent questions or the courses. This would reduce the load on the database and improve response times.
2. **Enhancing the UI**:
   - **Current Situation**: The user interface provides basic functionality interactivity.

By addressing these areas, the application can become more robust, and user-friendly.
