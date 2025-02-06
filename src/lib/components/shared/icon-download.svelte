<script lang="ts">
  import { base } from "$app/paths";

  export let width = "18";
  export let height = "18";
  export let stroke = "currentColor";
</script>

<img
  src="{base}/companystylesheet/icons/download.svg"
  {width}
  {height}
  alt="Download icon"
  style="stroke: {stroke}"
/>
