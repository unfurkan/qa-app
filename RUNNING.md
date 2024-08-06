
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
