<script lang="ts">
  import { onMount } from "svelte";

  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { page } from "$app/stores";
  import { DownloadButton, GlossaryToggle, Header } from "$lib/components";
  import CalendarTable from "$lib/components/features/calendar-table.svelte";
  import type { MonthValue } from "$lib/types/calendar-month";
  import type { TypeValue } from "$lib/types/calendar-type";
  import { typeNames } from "$lib/types/calendar-type";

  // default placeholders on inital page access (current year/month + "alle Netzzugangsthemen")
  let selectedYear = new Date().getFullYear();
  let selectedMonth: MonthValue = (new Date().getMonth() + 1)
    .toString()
    .padStart(2, "0") as MonthValue;
  let selectedType: TypeValue = "ALL";

  const monthNameMap: Record<MonthValue, string> = {
    "01": "januar",
    "02": "februar",
    "03": "maerz",
    "04": "april",
    "05": "mai",
    "06": "juni",
    "07": "juli",
    "08": "august",
    "09": "september",
    "10": "oktober",
    "11": "november",
    "12": "dezember",
  };

  const reverseMonthNameMap: Record<string, MonthValue> = Object.fromEntries(
    Object.entries(monthNameMap).map(([k, v]) => [v, k as MonthValue]),
  );

  const typeNameMap: Record<TypeValue, string> = {
    ALL: "alle",
    GELI: "geli-gas",
    GPKE: "gpke",
    KOV: "kov",
    MABIS: "mabis",
  };

  const reverseTypeNameMap: Record<string, TypeValue> = Object.fromEntries(
    Object.entries(typeNameMap).map(([k, v]) => [v, k as TypeValue]),
  );

  onMount(() => {
    const queryParams = $page.url.searchParams;

    const urlYear = queryParams.get("jahr");
    if (urlYear && !isNaN(Number(urlYear))) {
      selectedYear = Number(urlYear);
    }

    const urlMonth = queryParams.get("monat");
    if (urlMonth && reverseMonthNameMap[urlMonth]) {
      selectedMonth = reverseMonthNameMap[urlMonth];
    }

    const urlType = queryParams.get("netzzugangsthemen");
    if (urlType && reverseTypeNameMap[urlType]) {
      selectedType = reverseTypeNameMap[urlType];
    }
  });

  $: {
    // dynamically update URL query parameters
    if (selectedYear && selectedMonth && selectedType) {
      const params = new URLSearchParams();
      params.set("jahr", selectedYear.toString());
      params.set("monat", monthNameMap[selectedMonth]);
      params.set("netzzugangsthemen", typeNameMap[selectedType]);

      goto(`${base}/fristenkalender/?${params.toString()}`, {
        replaceState: true,
      });
    }
  }
</script>

<div class="flex flex-col h-full bg-white relative">
  <Header bind:selectedYear bind:selectedMonth bind:selectedType />
  <div class="flex flex-row justify-between">
    <div class="flex flex-col px-24 py-12">
      <h1 class="text-2xl font-medium text-black/70">
        {monthNameMap[selectedMonth].charAt(0).toUpperCase() +
          monthNameMap[selectedMonth].slice(1)}
        {selectedYear}
      </h1>
      <h2 class="text-xl text-black/70">
        Netzzugangsthemen: {typeNames.find((t) => t.value === selectedType)
          ?.label || "alle"}
      </h2>
    </div>
    <div class="px-24 py-12">
      <DownloadButton {selectedYear} />
    </div>
  </div>
  <div class="flex-1 min-h-0 px-24 pb-1">
    <CalendarTable {selectedYear} {selectedMonth} {selectedType} />
  </div>
  <GlossaryToggle />
</div>
