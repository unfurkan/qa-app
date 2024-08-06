<script>
  import { onDestroy, createEventDispatcher, onMount } from "svelte";

  export let hasMore;
  const dispatch = createEventDispatcher();
  let isLoadMore = false;

  function handleScroll(e) {
  const { innerHeight, scrollY } = window;
  const windowHeight = innerHeight + scrollY;
  const documentHeight = document.body.offsetHeight;
  const nearBottomThreshold = 10;

  const isNearBottom = documentHeight - windowHeight <= nearBottomThreshold;

  if (isNearBottom) {
    if (!isLoadMore && hasMore) {
      dispatch("loadMore");
      isLoadMore = true;
    }
  } else {
    isLoadMore = false;
  }
}
  onMount(() => {
    window.addEventListener("resize", handleScroll);
  });

  onDestroy(() => {
    window.removeEventListener("scroll", null);
    window.addEventListener("resize", null);
  });
</script>

<svelte:window on:scroll={handleScroll} />
