<script>
    export let answer;
    import { userUuid } from "../../stores/stores";


    let dateFormatter = new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'full',
    timeStyle: 'long',
    timeZone: 'Europe/Helsinki'
  });

  const upVote = async () => {
        const data = {
            userId: $userUuid,
            answerId: answer.id,
        };

        const response = await fetch("/api/answers/upvote", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        let voteSuccess = await response.json();

        if (voteSuccess) {
            answer.isUserVoted = true;
            answer.voteCount++;
        }
    };

  function formatDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date)) {
      console.error('Invalid date:', dateString);
      return 'Invalid date';
    }
    return dateFormatter.format(date);
  }

</script>
<div class="flex ml-6 lg:ml-12 ">
   
    <div class="p-6 mb-3 ml-6 lg:ml-12 text-base  bg-white rounded-lg   ">
        <div class="flex justify-between items-center mb-2">
            <div class="flex items-center">
                <p class="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">{answer.user_uuid}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400"><time pubdate datetime="{answer.created_on}">{formatDate(answer.created_on)}</time></p>
            </div>
        </div>
        <p class="text-gray-500 dark:text-gray-400">{answer.content}</p>
    </div>
   
    <div class="flex flex-col items-center justify-center py-6 ml-12 mb-3 text-base bg-white rounded-lg ">
        <p class="font-extrabold">{answer.voteCount}</p>
       
        {#if !answer.isUserVoted}

        <button type="submit"
        on:click={upVote}
            class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 ">
            + Vote        
        </button>
        {/if}
    </div>
    
</div>





