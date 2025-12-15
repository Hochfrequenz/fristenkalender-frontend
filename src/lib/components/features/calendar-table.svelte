<script lang="ts">
  import { IconSpinner } from "$lib/components";
  import { API_BASE_URL } from "$lib/config/api";
  import type { CalendarApiEntry } from "$lib/types/calendar-api-response";
  import type { CalendarEntry } from "$lib/types/calendar-entry";
  import type { MonthValue } from "$lib/types/calendar-month";
  import type { TypeValue } from "$lib/types/calendar-type";

  export let selectedYear: number;
  export let selectedMonth: MonthValue;
  export let selectedType: TypeValue;

  let entries: CalendarEntry[] = [];
  let isLoading = true;

  // split <number> and <string> ("WT"/"LWT")
  function formatWorkday(workday: string): string {
    return workday.replace(/(\d+)([a-zA-Z]+)/g, "$1 $2");
  }

  async function fetchData(): Promise<CalendarApiEntry[]> {
    const year = selectedYear.toString();
    const type = selectedType.toString();

    const requestUrl =
      type === "ALL"
        ? `${API_BASE_URL}/api/GenerateAllFristen/${year}`
        : `${API_BASE_URL}/api/GenerateFristenForType/${year}/${type}`;

    const response = await fetch(requestUrl, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  function processData(data: CalendarApiEntry[]): CalendarEntry[] {
    let yearSelected = selectedYear;
    let monthSelected = parseInt(selectedMonth);

    if (monthSelected === 0) {
      yearSelected -= 1;
      monthSelected = 12;
    } else if (monthSelected === 13) {
      yearSelected += 1;
      monthSelected = 1;
    }

    const monthNames = [
      "Jan",
      "Feb",
      "März",
      "Apr",
      "Mai",
      "Jun",
      "Jul",
      "Aug",
      "Sept",
      "Okt",
      "Nov",
      "Dez",
    ];

    const entries = data
      .filter((row) => row && typeof row === "object")
      .map((row) => {
        const dateObj = new Date(row.date);
        const rowYear = dateObj.getFullYear();
        const rowMonth = dateObj.getMonth() + 1;

        if (rowMonth !== monthSelected || rowYear !== yearSelected) return null;

        return {
          dateObj,
          date: `${dateObj.getDate()}. ${monthNames[rowMonth - 1]} ${rowYear}`,
          workday: row.label,
          description: (row.description || "").replace(/\\n/g, "<br>"),
        };
      })
      .filter(
        (entry): entry is CalendarEntry & { dateObj: Date } => entry !== null,
      );

    entries.sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return entries.map(({ dateObj, ...entry }) => entry);
  }

  async function loadData(): Promise<void> {
    if (!selectedYear || !selectedMonth || !selectedType) return;
    isLoading = true;
    try {
      const data = await fetchData();
      entries = processData(data);
    } catch (error) {
      console.error("Error while attempting to load data", error);
      entries = [];
    } finally {
      isLoading = false;
    }
  }

  $: if (selectedYear && selectedMonth && selectedType) {
    loadData();
  }
</script>

<div class="h-full w-full relative flex flex-col overflow-hidden">
  {#if isLoading}
    <div class="flex flex-1 items-center justify-center">
      <div>
        <IconSpinner size={80} fillColor="fill-white" />
      </div>
    </div>
  {:else if entries.length === 0}
    <span class="text-lg text-transform: uppercase">
      Keine Fristen für den ausgewählten Zeitraum gefunden.
    </span>
  {:else}
    <div class="overflow-auto flex-1 min-h-0">
      <table class="w-full text-left">
        <thead
          class="text-sm bg-fristenkalender_secondary uppercase sticky top-0 z-10"
        >
          <tr class="text-black/50">
            <th
              class="pb-4 pr-4 font-normal relative before:absolute before:bottom-0 before:left-0 before:right-0 before:h-0.5 before:bg-fristenkalender_secondary"
            >
              Datum
            </th>
            <th
              class="pb-4 pr-4 font-normal relative before:absolute before:bottom-0 before:left-0 before:right-0 before:h-0.5 before:bg-fristenkalender_secondary"
            >
              Werktag
            </th>
            <th
              class="pb-4 font-normal relative before:absolute before:bottom-0 before:left-0 before:right-0 before:h-0.5 before:bg-fristenkalender_secondary"
            >
              Beschreibung
            </th>
          </tr>
        </thead>
        <tbody>
          {#each entries as entry}
            <tr
              class="border-b border-fristenkalender_primary/65 text-black/70"
            >
              <td class="py-4 pr-4 whitespace-nowrap">{entry.date}</td>
              <td class="py-4 pr-4 whitespace-nowrap"
                >{formatWorkday(entry.workday)}</td
              >
              <td class="py-4">{@html entry.description}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>
