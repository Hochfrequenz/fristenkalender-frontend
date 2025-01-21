<script lang="ts">
  export let selectedYear: number = new Date().getFullYear();

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
</script>

<div class="flex flex-col items-start mt-2 w-48 relative">
  <select
    id="year-select"
    bind:value={selectedYear}
    class="inline-block border-2 border-white rounded-lg bg-secondary text-black/70 py-2 px-2 ps-3 pe-4 focus:outline-0 w-full cursor-pointer leading-relaxed"
  >
    {#each years as year}
      <option value={year}>{year}</option>
    {/each}
  </select>
  <label
    for="year-select"
    class="absolute top-0.5 left-3 -translate-y-1/2 text-xs text-slate-500 bg-white px-1 rounded"
  >
    Jahr
  </label>
</div>
