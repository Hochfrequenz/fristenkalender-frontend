<script lang="ts">
  import { base } from "$app/paths";

  export let width = "16";
  export let height = "16";
  export let stroke = "rgb(0 0 0 / 0.7)";
</script>

<img
  src="{base}/companystylesheet/icons/herz.svg"
  {width}
  {height}
  alt="Heart icon"
  style="stroke: {stroke}"
  class="mx-1"
/>
