<script>
    import { userUuid } from "../stores/stores";
    
    export let question;
    const askSomething = async () => {
      const data = {
        user: $userUuid,
        question : question,
      };
      
      const response = await fetch("/api/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      const jsonData = await response.json();
      alert(JSON.stringify(jsonData));
    };
  </script>
  
  <button
    class="bg-blue-500 hover:bg-blue-700 text-white font-bold p-4 rounded m-4"
    on:click={askSomething}
  >
    Test!
  </button>
  