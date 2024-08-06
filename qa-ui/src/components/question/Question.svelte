<script>

    export let question;
    export let course;
    import { userUuid } from "../../stores/stores";
    import { onMount } from "svelte";
    
    const upVoteQuestion = async () => {
        const data = {
            userId: $userUuid,
            questionId: question.id,
        };

        const response = await fetch("/api/questions/upvote", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        let voteSuccess = await response.json();

        if (voteSuccess) {
            question.isUserVoted = true;
            question.voteCount++;
        }
    };

    onMount(() => {
        //e2e-testing
        document.body.classList.add("ready-for-testing");
    });
</script>

<section class="flex gap-x-4">
    <div class="flex flex-col items-center justify-center">
        <p class="font-extrabold">{question.voteCount}</p>

        {#if !question.isUserVoted}
            <button
                on:click={upVoteQuestion}
                class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
                +
            </button>
        {/if}
    </div>

    <div
        class="grid pt-4 text-left border-t border-gray-200 md:gap-16 dark:border-gray-700 md:grid-cols-2"
    >
        <div>
            <div class="mb-10">
                <a
                    data-testid ="question-{question.id}"
                    href="/courses/{course.id}/questions/{question.id}"
                    class="flex items-center mb-4 text-lg font-medium text-gray-900"
                >
                    <svg
                        class="flex-shrink-0 mr-2 w-5 h-5 text-gray-500 dark:text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        ><path
                            fill-rule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                            clip-rule="evenodd"
                        ></path></svg
                    >
                    {question.content}
                </a>
            </div>
        </div>
    </div>
</section>
