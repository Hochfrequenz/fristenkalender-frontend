<script lang="ts">
  import "$src/app.scss";

  import { FooterTools } from "$lib/components";
</script>

<div class="flex flex-col h-full">
  <main class="flex-1 min-h-0">
    <slot />
  </main>
  <FooterTools />
</div>
