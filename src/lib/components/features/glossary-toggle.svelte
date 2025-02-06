<script lang="ts">
  let isOpen = false;

  function toggleSidebar() {
    isOpen = !isOpen;
  }
</script>

<div class="fixed left-0 top-1/2 -translate-y-1/2 flex z-50 h-[500px]">
  <div class="relative">
    <div
      class="flex transition-transform duration-300 ease-in-out"
      class:translate-x-0={isOpen}
      class:-translate-x-[calc(100%-2.5rem)]={!isOpen}
    >
      <div
        class="w-90 relative shadow-lg p-3 rounded-r-lg h-full min-h-fit w-[500px] overflow-y-auto"
      >
        <div
          class="absolute top-1/2 -translate-y-1/2 transition-opacity duration-300 right-4 z-20"
          class:opacity-0={isOpen}
          class:opacity-100={!isOpen}
        >
          <span
            class="block -rotate-180 font-medium text-black/70"
            style="writing-mode: vertical-rl;"
          >
            GLOSSAR
          </span>
        </div>

        <div
          class="absolute inset-0 bg-fristenkalender_primary transition-opacity duration-300 rounded-r-lg"
          class:opacity-99={isOpen}
          class:opacity-100={!isOpen}
        ></div>

        <div
          class="flex flex-col justify-center relative z-10 transition-opacity duration-300 h-full"
          class:opacity-0={!isOpen}
          class:opacity-100={isOpen}
        >
          <div class="p-4 h-full flex items-center">
            <table class="w-full">
              <tbody>
                <tr>
                  <td class="py-2 pr-4 align-top font-medium">1 WT</td>
                  <td class="py-2">1. Werktag im Monat (nach BDEW)</td>
                </tr>
                <tr>
                  <td class="py-2 pr-4 align-top font-medium">3LWT</td>
                  <td class="py-2">3. letzter Werktag im Monat (nach BDEW)</td>
                </tr>
                <tr>
                  <td class="py-2 pr-4 align-top font-medium">MaBiS</td>
                  <td class="py-2"
                    >Marktregeln für die Durchführung der Bilanzkreisabrechnung
                    Strom</td
                  >
                </tr>
                <tr>
                  <td class="py-2 pr-4 align-top font-medium">GPKE</td>
                  <td class="py-2"
                    >Geschäftsprozesse zur Kundenbelieferung mit Elektrizität</td
                  >
                </tr>
                <tr>
                  <td class="py-2 pr-4 align-top font-medium">GeLi Gas</td>
                  <td class="py-2">Geschäftsprozesse Lieferantenwechsel Gas</td>
                </tr>
                <tr>
                  <td class="py-2 pr-4 align-top font-medium">KOV</td>
                  <td class="py-2">Kooperationsvereinbarung Gas</td>
                </tr>
                <tr>
                  <td class="py-2 pr-4 align-top font-medium">BKV</td>
                  <td class="py-2">Bilanzkreisverantwortlicher</td>
                </tr>
                <tr>
                  <td class="py-2 pr-4 align-top font-medium">MGV</td>
                  <td class="py-2">Marktgebietsverantwortlicher</td>
                </tr>
                <tr>
                  <td class="py-2 pr-4 align-top font-medium">ÜNB</td>
                  <td class="py-2">Übertragungsnetzbetreiber</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <button
        on:click={toggleSidebar}
        class="absolute top-1/2 -translate-y-1/2 -right-5 bg-fristenkalender_secondary rounded-full p-1 hover:scale-110 transition-transform duration-200"
      >
        {#if isOpen}
          <!-- toggle off -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-circle-chevron-left"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m14 16-4-4 4-4" />
          </svg>
        {:else}
          <!-- toggle on -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-circle-chevron-right"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m10 8 4 4-4 4" />
          </svg>
        {/if}
      </button>
    </div>
  </div>
</div>
