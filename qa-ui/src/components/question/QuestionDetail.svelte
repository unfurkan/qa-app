<script>
    
    import InputForm from "../InputForm.svelte";
    import Answer from "../answer/Answer.svelte";
    import { userUuid } from "../../stores/stores";
    import InfiniteScroll from "../InfiniteScroll.svelte";
    import { onMount } from "svelte";

    export let questionId;

    let answers = [];

    let lastId;
    let mostRecentTime;

    let hasMore = true;
    let isNewAnswersAvaliable = false;

    let eventSource;

    onMount(() => {
        eventSource = new EventSource("/api/sse");


        eventSource.onmessage = (event) => {
            const eventBody = JSON.parse(event.data);

            if (
                eventBody.type === "answer-created" &&
                eventBody.questionId === questionId &&
                eventBody.userId != $userUuid
            ) {
                isNewAnswersAvaliable = true;
            }
        };

        eventSource.onerror = (event) => {
            console.log(event);
        };

        return () => {
            if (eventSource.readyState === 1) {
                eventSource.close();
            }
        };
    });

    const getQuestionDetail = async () => {
        const response = await fetch(`/api/questions/${questionId}`);
        return await response.json();
    };

    const getAnswers = async () => {
        let url = `/api/questions/${questionId}/answers?userId=${$userUuid}`;

        if (lastId && mostRecentTime) {
            url += `&last_id=${lastId}&most_recent_time=${mostRecentTime}`;
        }

        const response = await fetch(url);
        let body = await response.json();

        console.log(answers);

        answers = [...answers, ...body.content];

        console.log("after");
        console.log(answers);

        lastId = body.lastId;
        mostRecentTime = body.lastMostRecentTime;
        hasMore = body.hasMore;
    };

    let questionPromise = getQuestionDetail();
    let answerPromise = getAnswers();

    const createAnswer = async (answerContent) => {
        const data = {
            userId: $userUuid,
            questionId: questionId,
            content: answerContent,
        };

        const response = await fetch("/api/answers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        let isAnswerCreated = response.ok;

        if (!isAnswerCreated) {
            alert(await response.json());
        }

        resetParams();
        answerPromise = await getAnswers();
    };

    const loadNewQuestion = async () => {
        resetParams();
        answerPromise = await getAnswers();
        isNewAnswersAvaliable = false;
    };

    const resetParams = () => {
        lastId = null;
        mostRecentTime = null;
        answers = [];
    };
</script>

{#await questionPromise}
    <p>Loading questions</p>
{:then question}
    <h1
        class="mb-4 text-4xl font-extrabold tracking-tight text-center leading-none text-gray-900"
    >
      <a href="/courses/{question.course_id}">{question.title}</a>   
    </h1>
    <p
        class="mb-8 text-lg font-normal text-gray-500 text-center dark:text-gray-400"
    >
    {question.summary}
</p>

    <div class="pt-4 my-4 border-t-2">
        <h1
            class="mb-4 text-4xl font-semibold tracking-tight leading-none text-gray-900"
        >
            {question.content}
        </h1>

        <div class="my-4">
            <InputForm
                placeholder="Share your opinion..."
                buttonText={"Answer"}
                onClick={createAnswer}
            />
        </div>
    </div>

    {#if isNewAnswersAvaliable}
        <div
            class="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 text-center"
        >
            <button
                on:click={loadNewQuestion}
                class="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center"
            >
                <svg
                    class="w-5 h-5 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 32 32"
                >
                    <path
                        fill="currentColor"
                        d="M12 10H6.78A11 11 0 0 1 27 16h2A13 13 0 0 0 6 7.68V4H4v8h8zm8 12h5.22A11 11 0 0 1 5 16H3a13 13 0 0 0 23 8.32V28h2v-8h-8z"
                    />
                </svg>
                New answers are avaliable. Click here to load new answers
            </button>
        </div>
    {/if}

    {#await answerPromise}
        <p>Loading questions</p>
    {:then test}
        <div class="grid gap-y-8 max-w-full overflow-x-scrool overflow-y-auto">
            {#each answers as answer (answer.id)}
                <Answer {answer}></Answer>
            {/each}

            <InfiniteScroll
                {hasMore}
                on:loadMore={async () => {
                    answerPromise = await getAnswers();
                }}
            />
        </div>
    {/await}
{/await}
