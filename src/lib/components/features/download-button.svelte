<script lang="ts">
  import { onDestroy } from "svelte";

  import { IconDownload, IconSpinner } from "$lib/components";
  import { downloadCalendar } from "$lib/services/download-ics";

  export let background = "bg-fristenkalender_primary";
  export let textColor = "text-black";
  export let selectedYear: number;

  let isDownloading = false;
  let cooldownInterval: number | null = null;

  onDestroy(() => {
    if (cooldownInterval) {
      window.clearInterval(cooldownInterval);
    }
  });

  async function handleDownload() {
    if (isDownloading) return;

    try {
      isDownloading = true;
      await downloadCalendar(selectedYear);
    } catch (error) {
      console.error("Error in download handler:", error);
    } finally {
      setTimeout(() => {
        // 3 seconds cooldown timer
        isDownloading = false;
      }, 3000);
    }
  }
</script>

<div class="flex items-center gap-4">
  <button
    on:click={handleDownload}
    disabled={isDownloading}
    class="
      flex
      items-center
      justify-center
      gap-2
      rounded-full
      {background}
      {textColor}
      text-[16px]
      py-3
      px-5
      shadow-md
      ring-1
      ring-black/5
      transition-all
      duration-300
      ease-in-out
      min-w-[290px]
      {isDownloading ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105'}"
  >
    {#if isDownloading}
      <IconSpinner size={25} fillColor="fill-white" />
      Download gestartet
    {:else}
      <IconDownload />
      Download Jahreskalender ICS
    {/if}
  </button>
</div>
