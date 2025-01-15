<script lang="ts">
  import "$src/app.scss";

  import { onMount } from "svelte";

  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { page } from "$app/stores";
  import { Footer } from "$lib/components";
  import auth from "$src/auth/authService";
  import { isAuthenticated } from "$src/store";

  let isLoading = true;

  const exposedEndpoints = [`${base}/`, `${base}/version/`];

  onMount(async () => {
    await auth.createClient();

    if (
      window.location.search.includes("code=") ||
      window.location.search.includes("state=")
    ) {
      await auth.handleRedirectCallback();
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    await auth.checkAuth();
    isLoading = false;

    isAuthenticated.subscribe((value: boolean) => {
      const isExposedEndpoint = exposedEndpoints.includes($page.url.pathname);
      if (!value && !isLoading && !isExposedEndpoint) {
        goto(`${base}/`);
      }
    });
  });

  $: {
    const isExposedEndpoint = exposedEndpoints.includes($page.url.pathname);
    if (!$isAuthenticated && !isLoading && !isExposedEndpoint) {
      goto(`${base}/`);
    }
  }
</script>

{#if isLoading}
  <div class="flex items-center justify-center h-screen">
    <p>Loading...</p>
  </div>
{:else}
  <div class="flex flex-col h-screen overflow-hidden">
    <main class="flex-grow flex flex-col min-h-0">
      <slot />
    </main>
    <Footer />
  </div>
{/if}

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
</style>
