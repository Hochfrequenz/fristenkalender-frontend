<script context="module" lang="ts">
  type CacheData = Array<string>;
  const dataCache: Record<string, CacheData> = {};
</script>

<script lang="ts">
  import type { CalendarEntry } from "$lib/types/calendar-entry";
  import type { MonthValue } from "$lib/types/calendar-month";
  import type { TypeValue } from "$lib/types/calendar-type";

  export let selectedYear: number;
  export let selectedMonth: MonthValue;
  export let selectedType: TypeValue;

  let entries: CalendarEntry[] = [];
  let isLoading = false;

  // split <number> and <string> ("WT"/"LWT")
  function formatWorkday(workday: string): string {
    return workday.replace(/(\d+)([a-zA-Z]+)/g, "$1 $2");
  }

  async function fetchData(): Promise<CacheData> {
    const cacheKey = `${selectedYear}-${selectedType}`;

    if (dataCache[cacheKey]) {
      return dataCache[cacheKey];
    }

    const requestUrl =
      selectedType === "ALL"
        ? `https://fristenkalender.azurewebsites.net/api/GenerateAllFristen/${selectedYear}`
        : `https://fristenkalender.azurewebsites.net/api/GenerateFristenForType/${selectedYear}/${selectedType}`;

    try {
      const response = await fetch(requestUrl, {
        method: "GET",
        mode: "cors",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      dataCache[cacheKey] = data;
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }

  function processData(data: CacheData): CalendarEntry[] {
    let yearSelected = selectedYear;
    let monthSelected = parseInt(selectedMonth);

    if (monthSelected === 0) {
      yearSelected -= 1;
      monthSelected = 12;
    }
    if (monthSelected === 13) {
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

    return data
      .map((row) => {
        const labelMatch = row.match(/label='(.*?)'/);
        const dateMatch = row.match(
          /datetime\.date\((?<year>\d+), (?<month>\d+), (?<day>\d+)\)/,
        );
        const descriptionMatch = row.match(/description='(.*?)'/);

        if (!dateMatch?.groups || !labelMatch?.[1]) return null;

        const year = parseInt(dateMatch.groups.year);
        const monthInt = parseInt(dateMatch.groups.month);
        const day = parseInt(dateMatch.groups.day);

        if (monthInt !== monthSelected || year !== yearSelected) return null;

        return {
          date: `${day} ${monthNames[monthInt - 1]} ${year}`,
          workday: labelMatch[1],
          description: (descriptionMatch?.[1] || "").replace(/\\n/g, "<br>"),
        };
      })
      .filter((entry): entry is CalendarEntry => entry !== null)
      .sort((a, b) => {
        const [dayA, monthA, yearA] = a.date.split(" ");
        const [dayB, monthB, yearB] = b.date.split(" ");
        return (
          new Date(`${yearA}-${monthA}-${dayA}`).getTime() -
          new Date(`${yearB}-${monthB}-${dayB}`).getTime()
        );
      });
  }

  async function loadData(): Promise<void> {
    if (!selectedYear || !selectedMonth || !selectedType) return;

    isLoading = true;

    try {
      const data = await fetchData();
      entries = processData(data);
    } catch (error) {
      console.error("Error in loadData:", error);
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
    <div class="flex justify-center items-center p-4">
      <span>Lade Fristenkalender ...</span>
    </div>
  {:else if entries.length === 0}
    <span>Keine Fristen für den ausgewählten Zeitraum gefunden.</span>
  {:else}
    <div class="overflow-auto flex-1 min-h-0">
      <table class="w-full text-left">
        <thead class="text-sm bg-tint uppercase sticky top-0 z-10">
          <tr class="text-black/50">
            <th
              class="pb-4 font-normal relative before:absolute before:bottom-0 before:left-0 before:right-0 before:h-0.5 before:bg-secondary"
            >
              Datum
            </th>
            <th
              class="pb-4 font-normal relative before:absolute before:bottom-0 before:left-0 before:right-0 before:h-0.5 before:bg-secondary"
            >
              Werktag
            </th>
            <th
              class="pb-4 font-normal relative before:absolute before:bottom-0 before:left-0 before:right-0 before:h-0.5 before:bg-secondary"
            >
              Beschreibung
            </th>
          </tr>
        </thead>
        <tbody>
          {#each entries as entry}
            <tr class="font-medium border-b border-secondary/40 text-black/70">
              <td class="py-4 whitespace-nowrap">{entry.date}</td>
              <td class="py-4 whitespace-nowrap"
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
