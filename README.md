# CS-E4770 - Designing and Building Scalable Web Applications Final Project
The online Q&A platform is intended for questions and answers on coursework. 

## Technologies Used


<h3 align="left">Connect with me:</h3>
<p align="left">
</p>

<h3 align="left">Languages and Tools:</h3>
<p align="left"> <a href="https://www.docker.com/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original-wordmark.svg" alt="docker" width="40" height="40"/> </a> <a href="https://grafana.com" target="_blank" rel="noreferrer"> <img src="https://www.vectorlogo.zone/logos/grafana/grafana-icon.svg" alt="grafana" width="40" height="40"/> </a> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" alt="javascript" width="40" height="40"/> </a> <a href="https://kubernetes.io" target="_blank" rel="noreferrer"> <img src="https://www.vectorlogo.zone/logos/kubernetes/kubernetes-icon.svg" alt="kubernetes" width="40" height="40"/> </a> <a href="https://www.nginx.com" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nginx/nginx-original.svg" alt="nginx" width="40" height="40"/> </a> <a href="https://www.postgresql.org" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original-wordmark.svg" alt="postgresql" width="40" height="40"/> </a> <a href="https://svelte.dev" target="_blank" rel="noreferrer"> <img src="https://upload.wikimedia.org/wikipedia/commons/1/1b/Svelte_Logo.svg" alt="svelte" width="40" height="40"/> </a> <a href="https://tailwindcss.com/" target="_blank" rel="noreferrer"> <img src="https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg" alt="tailwind" width="40" height="40"/> </a> </p>

| Category                                 | Technologies                                                                                                          |
|------------------------------------------|-----------------------------------------------------------------------------------------------------------------------|
| **Frontend Development**                 | [Svelte](https://svelte.dev/), [Astro](https://astro.build/), [Tailwind CSS](https://tailwindcss.com/)                |
| **Backend Development**                  | [Deno](https://deno.land/), [Hono](https://hono.dev/)                                                                 |
| **Database**                             | [PostgreSQL](https://www.postgresql.org/), [Flyway](https://flywaydb.org/)                                            |
| **Testing and Monitoring**               | [Playwright](https://playwright.dev/), [k6](https://k6.io/)                                                           |
| **Containerization and Orchestration**   | [Docker](https://www.docker.com/), [Kubernetes](https://kubernetes.io/)                                               |
| **Monitoring and Visualization**         | [Grafana](https://grafana.com/), [Prometheus](https://prometheus.io)                                                                                           |
| **Web Server**                           | [NGINX](https://www.nginx.com/)                                                                                       |
### Key Design Decisions

1. **Normalized Database Schema**:
   - The database schema is designed to be normalized to ensure data integrity and minimize redundancy. Each entity (courses, questions, answers, votes) is stored in its own table, with foreign key relationships to maintain referential integrity.

2. **Indexes for Performance Optimization**:
   - Indexes have been strategically placed on columns that are frequently used in query filters and joins. This includes indexes on `course_id` in the `QUESTIONS` table and `question_id` in the `ANSWERS` table. Composite indexes are also used to optimize queries that sort by recent activity for paging end points.

3. **Denormalization for Recent Activity**:
   - To enhance performance for common queries that fetch the most recent questions or answers based on activity, `last_vote_time` is stored directly in the `QUESTIONS` and `ANSWERS` tables. This avoids the need for complex joins and subqueries.

3. **Cursor-Based Pagination**:
   - Instead of using offset-limit pagination, cursor-based pagination is used to handle large datasets more efficiently. This approach reduces the risk of data inconsistencies when new data is added or existing data is modified between queries, providing a more reliable way to paginate through data. Read more about cursor based pagination : https://slack.engineering/evolving-api-pagination-at-slack/

4. **Infinite Scrolling and SSE Notifications**:
    - Infinite scrolling has been implemented. When users reach the bottom of the course page (listing questions) or the question page (listing answers), the application retrieves more content in increments of 20(default value).
    - Server-Sent Events(SSE) are used to notify users of new questions or answers created by others in real-time.(to test this functionality please open incognito tab or try with another user). A button appears, allowing users to reload the page to see new content. This ensures that new questions show up at the top of the list even when the user is at the bottom of the page or has passed several pages(more than 20 question is already loaded).

## Reflection on Possible Improvements

1. **Improving Query Performance**:
   - **Current Situation**: The application relies on indexes to speed up queries, which is effective for most scenarios.
   - **Possible Improvement**: Implement caching mechanisms for frequently accessed data, such as the most recent questions or the courses. This would reduce the load on the database and improve response times.
2. **Enhancing the UI**:
   - **Current Situation**: The user interface provides basic functionality interactivity.


