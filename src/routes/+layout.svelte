<script lang="ts">
  import "$src/app.scss";

  import { onMount } from "svelte";

  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { page } from "$app/stores";
  import { Footer } from "$lib/components";
  import auth from "$src/auth/authService";
  import { isAuthenticated } from "$src/store";

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

    isAuthenticated.subscribe((value: boolean) => {
      const isExposedEndpoint = exposedEndpoints.includes($page.url.pathname);
      if (!value && !isExposedEndpoint) {
        goto(`${base}/`);
      }
    });
  });

  $: {
    const isExposedEndpoint = exposedEndpoints.includes($page.url.pathname);
    if (!$isAuthenticated && !isExposedEndpoint) {
      goto(`${base}/`);
    }
  }
</script>

<div class="flex flex-col h-screen overflow-hidden">
  <main class="flex-grow flex flex-col min-h-0">
    <slot />
  </main>
  <Footer />
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
</style>
