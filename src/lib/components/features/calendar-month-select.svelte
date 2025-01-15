<script lang="ts">
  import type { MonthValue } from "$lib/types/calendar-month";

  export let selectedMonth: MonthValue = (new Date().getMonth() + 1)
    .toString()
    .padStart(2, "0") as MonthValue;

  const months = [
    { value: "01", label: "Januar" },
    { value: "02", label: "Februar" },
    { value: "03", label: "März" },
    { value: "04", label: "April" },
    { value: "05", label: "Mai" },
    { value: "06", label: "Juni" },
    { value: "07", label: "Juli" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "Oktober" },
    { value: "11", label: "November" },
    { value: "12", label: "Dezember" },
  ] as const;
</script>

<div class="flex flex-col items-start mt-2 w-48 relative">
  <select
    id="month-select"
    bind:value={selectedMonth}
    class="inline-block border-2 border-white rounded-lg bg-tint text-black/70 py-2 px-2 ps-3 pe-4 focus:outline-0 w-full cursor-pointer leading-relaxed"
  >
    {#each months as month}
      <option value={month.value}>{month.label}</option>
    {/each}
  </select>
  <label
    for="month-select"
    class="absolute top-0.5 left-3 -translate-y-1/2 text-xs text-slate-500 bg-white px-1 rounded"
  >
    Monat
  </label>
</div>
