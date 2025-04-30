<script lang="ts">
  import { base } from "$app/paths";
  import {
    AuthButton,
    CalendarMonthSelect,
    CalendarTypeSelect,
    CalendarYearSelect,
    DownloadButton,
    IconSymbol,
  } from "$lib/components";
  import type { MonthValue } from "$lib/types/calendar-month";

  export let background = "bg-fristenkalender_primary";
  export let selectedYear: number;
  export let selectedMonth: MonthValue;
  export let selectedType: string;
</script>

<header class="flex items-center justify-between {background} px-3 py-2 z-[60]">
  <div class="flex items-center gap-3 flex-grow">
    <div class="flex-none pl-3">
      <a href="{base}/" title="landingpage">
        <IconSymbol size={23} />
      </a>
    </div>

    <span class="text-xl text-black/70"> Digitaler Fristenkalender </span>

    <div class="flex gap-4 ml-4 pb-1.5">
      <CalendarYearSelect bind:selectedYear />
      <CalendarMonthSelect bind:selectedMonth />
      <CalendarTypeSelect bind:selectedType />
    </div>
  </div>

  <div class="flex-none py-2 pr-3">
    <div class="flex items-center gap-4">
      <DownloadButton {selectedYear} />
      <AuthButton
        background="bg-fristenkalender_secondary"
        textColor="text-black/70"
      />
    </div>
  </div>
</header>
