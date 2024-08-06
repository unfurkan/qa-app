<script>
  import { userUuid } from "../stores/stores.js";
</script>

<nav class="p-4 mb-4 shadow">
  <div class="flex justify-between">
    <span class="text-2xl text-gray-700 font-serif">Hello {$userUuid}!</span>
    <a href="/" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
      Show all courses
  </a> 
 </div>
</nav>
