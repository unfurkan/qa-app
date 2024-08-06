<script>
    import CourseCard from "./CourseCard.svelte";

    const getCourses = async () => {
        const response = await fetch("/api/courses");
        return await response.json();
    };

    let coursePromise = getCourses();
</script>

{#await coursePromise}
    <p>Loading courses</p>
{:then courses}
    {#if courses.length == 0}
        <p>No course available</p>
    {:else}
        <ul>
            <div class="grid grid-cols-3 gap-1 gap-y-8">
                {#each courses as course}
                    <CourseCard {course}></CourseCard>
                {/each}
            </div>
        </ul>
    {/if}
{/await}
