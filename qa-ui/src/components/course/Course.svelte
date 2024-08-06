<script>
    import { fade } from "svelte/transition";
    import InputForm from "../InputForm.svelte";
    import Question from "../question/Question.svelte";
    import { userUuid } from "../../stores/stores";
    import InfiniteScroll from "../InfiniteScroll.svelte";
    import { onMount } from "svelte";

    export let courseId;

    let questions = [];

    const limit = 5;
    let lastId;
    let mostRecentTime;

    let hasMore = true;
    let isNewQuestionsAvaliable = false;

    let eventSource;

    onMount(() => {

        // e2e-testing
        document.body.classList.add("ready-for-testing");

        eventSource = new EventSource("/api/sse");

        eventSource.onmessage = (event) => {
            const eventBody = JSON.parse(event.data);

            if (
                eventBody.type === "question-created" &&
                eventBody.courseId === courseId &&
                eventBody.userId != $userUuid
            ) {
                isNewQuestionsAvaliable = true;
                pageSize = pageSize += 1;
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

    const getCourseDetail = async () => {
        const response = await fetch(`/api/courses/${courseId}`);
        return await response.json();
    };

    const getQuestionsTest = async () => {
        let url = `/api/courses/${courseId}/questions?userId=${$userUuid}`;

        if (lastId && mostRecentTime) {
            url += `&last_id=${lastId}&most_recent_time=${mostRecentTime}`;
        }

        const response = await fetch(url);
        let body = await response.json();

        console.log(questions);

        questions = [...questions, ...body.content];

        console.log("after");
        console.log(questions);

        lastId = body.lastId;
        mostRecentTime = body.lastMostRecentTime;
        hasMore = body.hasMore;
    };

    let coursePromise = getCourseDetail();
    let questionPromise = getQuestionsTest();

    const createQuestion = async (questionContent) => {
        const data = {
            userId: $userUuid,
            courseId: courseId,
            content: questionContent,
        };

        const response = await fetch("/api/questions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        let isQuestionCreated = response.ok;

        if (!isQuestionCreated) {
            alert(await response.json());
            return;
        }

        resetParams();
        questionPromise = await getQuestionsTest();
    };

    const loadNewQuestion = async () => {
        resetParams();
        questionPromise = await getQuestionsTest();
        isNewQuestionsAvaliable = false;
    };

    const resetParams = () => {
        lastId = null;
        mostRecentTime = null;
        questions = [];
    };
</script>

{#await coursePromise}
    <p>Loading questions</p>
{:then course}

    <h1
        class="mb-4 text-4xl font-extrabold tracking-tight text-center leading-none text-gray-900"
    >
    <a href ="/courses/{course.id}">
        Welcome to {course.title} course !
    </a> 
    </h1>
    <p
        class="mb-8 text-lg font-normal text-gray-500 text-center dark:text-gray-400"
    >
        {course.summary}
    </p>

    <div class="pt-4 my-4 border-t-2">
        <h1
            class="mb-4 text-4xl font-semibold tracking-tight leading-none text-gray-900"
        >
            Ask questions in your mind
        </h1>

        <div class="my-4">
            <InputForm
                placeholder="Post a new question..."
                buttonText={"Post"}
                onClick={createQuestion}
            />
        </div>
    </div>

    {#if isNewQuestionsAvaliable}
        <div
            class="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 text-center"
        >
            <button
                on:click={loadNewQuestion}
                class="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center"
            >
                <!-- Refresh SVG Icon -->
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
                New questions are avaliable. Click here to load new questions
            </button>
        </div>
    {/if}

    {#await questionPromise}
        <p>Loading questions</p>
    {:then test}
        <div class="grid gap-y-8 max-w-full overflow-x-scrool overflow-y-auto">
            {#each questions as question (question?.id)}
                <Question {question} {course} ></Question>
            {/each}

            <InfiniteScroll
                {hasMore}
                on:loadMore={async () => {
                    questionPromise = await getQuestionsTest();
                }}
            />
        </div>
    {/await}
{/await}
