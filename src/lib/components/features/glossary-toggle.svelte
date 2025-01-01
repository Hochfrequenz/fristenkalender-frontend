<script lang="ts">
  let isOpen = false;

  function toggleSidebar() {
    isOpen = !isOpen;
  }
</script>

<div class="fixed left-0 top-1/2 -translate-y-1/2 flex z-50">
  <div class="relative">
    <div
      class="flex transition-transform duration-300 ease-in-out"
      class:translate-x-0={isOpen}
      class:-translate-x-[calc(100%-2.5rem)]={!isOpen}
    >
      <div
        class="w-90 relative shadow-lg p-3 rounded-r-lg h-[50vh] overflow-y-auto"
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
          class="absolute inset-0 bg-primary transition-opacity duration-300 rounded-r-lg"
          class:opacity-90={isOpen}
          class:opacity-100={!isOpen}
        ></div>

        <div
          class="relative z-10 transition-opacity duration-300"
          class:opacity-0={!isOpen}
          class:opacity-100={isOpen}
        >
          <div class="p-2">
            1 WT - 1. Werktag im Monat (nach BDEW)<br />
            3LWT - 3. letzter Werktag im Monat (nach BDEW)<br />
            MaBiS - Marktregeln für die Durchführung der Bilanzkreisabrechnung Strom<br
            />
            GPKE - Geschäftsprozesse zur Kundenbelieferung mit Elektrizität<br
            />
            GeLi Gas - Geschäftsprozesse Lieferantenwechsel Gas<br />
            KOV - Kooperationsvereinbarung Gas<br />
            BKV - Bilanzkreisverantwortlicher<br />
            MGV - Marktgebietsverantwortlicher<br />
            ÜNB - Übertragungsnetzbetreiber
          </div>
        </div>
      </div>

      <button
        on:click={toggleSidebar}
        class="absolute top-1/2 -translate-y-1/2 -right-5 bg-tint rounded-full p-1 hover:scale-110 transition-transform duration-200"
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
