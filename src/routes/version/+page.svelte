<script lang="ts">
  import { onMount } from "svelte";

  import { base } from "$app/paths";

  type VersionInfo = {
    build_date: string;
    commit_id: string;
    version_tag: string;
    build_branch: string;
  };

  let versionData: VersionInfo | null = null;

  onMount(async () => {
    const response = await fetch(`${base}/version.json`); // local development: static/version.json & stage/prod: build/version.json
    versionData = await response.json();
  });
</script>

<div class="p-6">
  {#if versionData}
    <div class="flex flex-col">
      <div class="flex gap-4">
        <div class="text-black/70 font-medium">build date:</div>
        <div class="text-black/70">
          {new Date(versionData.build_date).toLocaleString()}
        </div>
      </div>

      <div class="flex gap-4">
        <div class="text-black/70 font-medium">version:</div>
        <div class="text-black/70">{versionData.version_tag}</div>
      </div>

      <div class="flex gap-4">
        <div class="text-black/70 font-medium">commit ID:</div>
        <div class="text-black/70">{versionData.commit_id}</div>
      </div>

      <div class="flex gap-4">
        <div class="text-black/70 font-medium">build branch:</div>
        <div class="text-black/70">{versionData.build_branch}</div>
      </div>
    </div>
  {/if}
</div>
