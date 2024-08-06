<script>
    export let onClick;
    export let buttonText;
    export let placeholder;
    let questionContent ="";

    const test = async () => {
        await onClick(questionContent);        
    };
</script>

<div
    class="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200"
>
    <textarea
        id="comment"
        rows="6"
        bind:value={questionContent}
        class="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none"
        {placeholder}
        required
    ></textarea>
</div>
<button
    type="submit"
    on:click={test}
    class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 "
>
    {buttonText}
</button>
