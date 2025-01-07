<script lang="ts">
  import { onDestroy } from "svelte";

  import { downloadCalendar } from "$lib/services/download-ics";

  import IconDownload from "../shared/icon-download.svelte";

  export let background = "bg-secondary";
  export let textColor = "text-white";
  export let selectedYear: number;

  let isDownloading = false;
  let cooldownTime = 3; // 3s download cooldown
  let cooldownRemaining = 0;
  let cooldownInterval: number | null = null;

  function startCooldown() {
    isDownloading = true;
    cooldownRemaining = cooldownTime;

    cooldownInterval = window.setInterval(() => {
      cooldownRemaining--;
      if (cooldownRemaining <= 0) {
        if (cooldownInterval) {
          window.clearInterval(cooldownInterval);
        }
        isDownloading = false;
      }
    }, 1000);
  }

  onDestroy(() => {
    if (cooldownInterval) {
      window.clearInterval(cooldownInterval);
    }
  });

  async function handleDownload() {
    if (isDownloading) return;

    try {
      startCooldown();
      await downloadCalendar(selectedYear);
    } catch (error) {
      console.error("Error in download handler:", error);
      cooldownRemaining = 0;
      isDownloading = false;
      if (cooldownInterval) {
        window.clearInterval(cooldownInterval);
      }
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
      {isDownloading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}"
  >
    <IconDownload />
    {#if isDownloading}
      Download gestartet ({cooldownRemaining}s)
    {:else}
      Download Jahreskalender
    {/if}
  </button>
</div>
