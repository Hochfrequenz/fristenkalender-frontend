<script lang="ts">
  import { base } from "$app/paths";

  export let width = "20";
  export let height = "20";
  export let stroke = "currentColor";
</script>

<img
  src="{base}/companystylesheet/icons/login.svg"
  {width}
  {height}
  alt="Square arrow icon"
  style="stroke: {stroke}"
  class="size-5"
/>
