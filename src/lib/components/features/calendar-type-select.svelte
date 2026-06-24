<script lang="ts">
  export let selectedType: string = "ALL";

  const types = [
    { value: "ALL", label: "alle" },
    { value: "GELI", label: "GeLi Gas" },
    { value: "KOV", label: "KoV" },
    { value: "MABIS", label: "MaBiS" },
  ];
</script>

<div class="flex flex-col items-start mt-2 w-48 relative">
  <select
    id="type-select"
    bind:value={selectedType}
    class="inline-block border-2 border-white rounded-lg bg-fristenkalender_secondary text-black/70 py-2 px-2 ps-3 pe-4 focus:outline-0 w-full cursor-pointer leading-relaxed"
  >
    {#each types as type}
      <option value={type.value}>{type.label}</option>
    {/each}
  </select>
  <label
    for="type-select"
    class="absolute top-0.5 left-3 -translate-y-1/2 text-xs text-slate-500 bg-white px-1 rounded"
  >
    Netzzugangsthemen
  </label>
</div>
