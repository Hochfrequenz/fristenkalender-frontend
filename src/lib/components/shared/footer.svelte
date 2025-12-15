<script lang="ts">
  import { onMount } from "svelte";

  import { base } from "$app/paths";
  import { IconHeart, IconLogo } from "$lib/components";
  import { API_BASE_URL } from "$lib/config/api";

  export let background = "bg-fristenkalender_secondary";

  type FrontendVersionInfo = {
    version_tag: string;
  };

  type BackendVersionInfo = {
    tag: string;
    commit_hash: string;
    build_date: string;
  };

  let currentYear = new Date().getFullYear();
  let frontendVersion: string | null = null;
  let backendVersion: string | null = null;

  onMount(async () => {
    // Fetch frontend version
    try {
      const response = await fetch(`${base}/version.json`);
      const data: FrontendVersionInfo = await response.json();
      frontendVersion = data.version_tag;
    } catch {
      // Ignore errors fetching frontend version
    }

    // Fetch backend version
    try {
      const response = await fetch(`${API_BASE_URL}/version`);
      if (response.ok) {
        const data: BackendVersionInfo = await response.json();
        backendVersion = data.tag;
      }
    } catch {
      // Ignore errors fetching backend version (endpoint may not exist)
    }
  });
</script>

<footer class="flex items-center {background} px-3 py-2 z-[60]">
  <div class="flex-none">
    <a href="https://hochfrequenz.de" title="landingpage">
      <IconLogo />
    </a>
  </div>

  <div class="flex-1 flex justify-center">
    <div class="flex items-center text-sm text-black/70 space-x-1 text-center">
      <p class="flex items-center flex-wrap justify-center">
        © {currentYear}
        {#if frontendVersion || backendVersion}
          -
          {#if frontendVersion}
            <a
              href="{base}/version/"
              class="hover:underline font-bold mx-1"
              title="Frontend version">{frontendVersion}</a
            >
          {/if}
          {#if backendVersion}
            <span class="text-black/50 mx-1" title="Backend version"
              >(API: {backendVersion})</span
            >
          {/if}
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
        |
        <a
          class="mx-2 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/Hochfrequenz/fristenkalender-frontend/"
          >Github</a
        >
      </p>
    </div>
  </div>

  <!-- to compensate the padding caused by the logo on the left -->
  <div class="flex-none w-[160px]"></div>
</footer>
