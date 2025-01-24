<script lang="ts">
  import { onMount } from "svelte";

  import { base } from "$app/paths";
  import { IconHeart, IconLogo } from "$lib/components";

  export let background = "bg-fristenkalender_secondary";

  type VersionInfo = {
    version_tag: string;
  };

  let currentYear = new Date().getFullYear();
  let versionTag: string | null = null;

  onMount(async () => {
    const response = await fetch(`${base}/version.json`);
    const data: VersionInfo = await response.json();
    versionTag = data.version_tag;
  });
</script>

<footer class="flex items-center {background} px-3 py-2 z-[60]">
  <div class="flex-none">
    <a href="https://hochfrequenz.de" title="landingpage">
      <IconLogo size={160} />
    </a>
  </div>

  <div class="flex-1 flex justify-center">
    <div class="flex items-center text-sm text-black/70 space-x-1 text-center">
      <p class="flex items-center flex-wrap justify-center">
        © {currentYear}
        {#if versionTag}
          -
          <a
            href="{base}/version/"
            class="hover:underline font-bold mx-1"
            title="Version details"
            >{versionTag}
          </a>
        {/if}
        - made with
        <IconHeart />
        by
        <a
          class="ml-1 mr-2 hover:underline font-bold"
          target="_blank"
          rel="noopener noreferrer"
          href="https://hochfrequenz.de">Hochfrequenz</a
        >
        |
        <a
          class="font-bold ml-2 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.hochfrequenz.de/#fristenkalender"
        >
          hier klicken,</a
        >
        <span class="ml-1 mr-2">
          um unseren aktuellsten Fristenkalender als PDF anzufordern</span
        >
        |
        <a
          class="mx-2 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.hochfrequenz.de/datenschutz/">Datenschutz</a
        >
        |
        <a
          class="mx-2 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.hochfrequenz.de/impressum/">Impressum</a
        >
        |
        <a
          class="mx-2 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.hochfrequenz.de/kontakt/">Kontakt</a
        >
      </p>
    </div>
  </div>

  <!-- to compensate the padding caused by the logo on the left -->
  <div class="flex-none w-[160px]"></div>
</footer>
