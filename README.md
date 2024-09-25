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
   - Indexes have been placed on columns that are frequently used in query filters and joins. This includes indexes on `course_id` in the `QUESTIONS` table and `question_id` in the `ANSWERS` table. Composite indexes are also used to optimize queries that sort by recent activity for paging end points.

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


## Database Schema and Index Justification

This document outlines the database schema used in the project. Also more in REFLECTION.md file.
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

CREATE INDEX QUESTIONS_COURSE_ID_IDX ON QUESTIONS (course_id);

CREATE INDEX ANSWERS_QUESTION_ID_IDX ON ANSWERS (question_id);

CREATE INDEX QUESTIONS_ID_COURSE_ID_MOST_RECENT_IDX ON QUESTIONS (course_id, GREATEST(created_on, last_vote_time) DESC, id DESC);

CREATE INDEX ANSWERS_ID_QUESTION_ID_MOST_RECENT_IDX ON ANSWERS (question_id, GREATEST(created_on, last_vote_time) DESC, id DESC);
```

## TO RUN DEV ENVIRONMENT

- Run this commands in the root folder.

```bash
docker compose -f docker-compose.yml build
docker compose -f docker-compose.yml up
```

- Go to your browser `http://localhost:7800`
## TO RUN PROD ENVIRONMENT



- Run this commands in the root folder.

```bash
docker compose -f docker-compose-prod.yml build
docker compose -f docker-compose-prod.yml up
```
- Go to your browser `http://localhost:7800`

### Deploying the Application to a Kubernetes Cluster

Ensure Minikube and kubectl are already downloaded and ready to use.

1. **Start a Kubernetes cluster:** (For details: [Minikube for prometheus stack](https://github.com/prometheus-operator/kube-prometheus?tab=readme-ov-file#prerequisites))
    ```sh
    minikube delete && minikube start --kubernetes-version=v1.23.0 --memory=4g --bootstrapper=kubeadm --extra-config=kubelet.authentication-token-webhook=true --extra-config=kubelet.authorization-mode=Webhook --extra-config=scheduler.bind-address=0.0.0.0 --extra-config=controller-manager.bind-address=0.0.0.0
    ```

2. **Verify the cluster is running:**
    ```sh
    kubectl get pods
    ```
    - This should show "no resources in default namespace" initially.

3. **Build a Docker image for Minikube.** (For details: [Minikube Docker Handbook](https://minikube.sigs.k8s.io/docs/handbook/pushing/#1-pushing-directly-to-the-in-cluster-docker-daemon-docker-env)). Configure the terminal to use Minikube’s Docker daemon:
    - **MacOS:**
        ```sh
        eval $(minikube docker-env)
        ```
    - **Windows:**
        ```sh
        @FOR /f "tokens=*" %i IN ('minikube -p minikube docker-env --shell cmd') DO @%i
        ```

5. **Build images again for Minikube** (Make sure to run the command in the root folder of the project):
    ```sh
    docker compose build
    ```

6. **Check whether the images are available in Minikube:**
    ```sh
    minikube image list
    ```
    - Look for `docker.io/library/qa-api:latest`.

7. **Deploy to the Kubernetes cluster:**
    ```sh
    kubectl apply -f kubernetes/configs
    ```
    ```sh
    kubectl apply -f kubernetes/deployments
    ```

8. **Check the created pods and make sure pods are in the "Running" state (except Flyway, which is a Job that runs once):**
    ```sh
    kubectl get pods
    ```

9. **Port forward (7800 on your local machine) to the Nginx server to access the cluster:**
    ```sh
    kubectl port-forward service/nginx 7800
    ```
    - Go to your browser and type `http://localhost:7800`. If everything is working correctly, you should see the courses listed.

10. **To monitor the Kubernetes cluster, install Grafana and Prometheus using Helm charts.** (Quick read on [what is Helm](https://www.redhat.com/en/topics/devops/what-is-helm)). Open new terminal or teminate port forwarding terminal with CTRL + C.

11. **Install Helm( if Helm already installed this step can be skipped):**
    - **MacOS:**
        ```sh
        brew install helm
        ```
    - **Windows (From Chocolatey):**
        ```sh
        choco install kubernetes-helm
        ```

12. **Add the Prometheus-Grafana chart repository:**
    ```sh
    helm repo add prometheus-community https://prometheus-community.github.io/kube-prometheus-stack
    ```

13. **Install the Prometheus-Grafana stack Helm template:**
    ```sh
    helm upgrade --install prometheus prometheus-community/kube-prometheus-stack --wait
    ```

14. **Check the Prometheus stack and ensure all components are running:**
    ```sh
    kubectl --namespace default get pods -l "release=prometheus"
    ```

15. **Access the Grafana dashboard on your local machine:**
    ```sh
    kubectl port-forward service/prometheus-grafana 9000:80
    ```
    - Go to your browser and type `http://localhost:9000`. Grafana will redirect to the login page. Use the credentials: username: `admin`, password: `prom-operator`.

16. **Navigate the Grafana dashboard:**
    - Click the hamburger menu to open the Menu and click "Dashboards". You can choose dashboards to observe the cluster. To check pods, click "Kubernetes / Compute Resources / Pod" dashboard and choose a pod from the dropdown menu.

17. **To uninstall Grafana & Prometheus:**
    ```sh
    helm uninstall prometheus
    ```

18. **To delete the cluster:**
    ```sh
    minikube delete
     ```
