<script lang="ts">
  import "$src/app.scss";

  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { IconLogin } from "$lib/components";
  import auth from "$src/auth/authService";
  import { isAuthenticated } from "$src/store";

  async function checkAuthentication() {
    if ($isAuthenticated) {
      goto(`${base}/fristenkalender`);
    } else {
      await auth.loginWithRedirect();
    }
  }
</script>

<section
  class="bg-fristenkalender_primary flex-grow flex items-center justify-center"
>
  <div
    class="rounded-3xl w-1/3 bg-fristenkalender_secondary p-12
    shadow-lg
    transition-all
    duration-300
    ring-1
    ring-black/5
    hover:ring-black/10
    relative
    before:absolute
    before:inset-0
    before:rounded-3xl
    before:pointer-events-none
    after:absolute
    after:inset-0
    after:rounded-3xl
    after:pointer-events-none"
  >
    <h1 class="text-3xl text-black/70 pb-5">Digitaler Fristenkalender</h1>
    <h2
      class="flex text-lg border-b-2 border-fristenkalender_tone text-black/70 pb-3 mb-5 uppercase"
    >
      Fristen im Blick und Zukunft im Griff
    </h2>
    pb-5
    <h3
      class="text-black/70 space-y-3 border-b-2 border-dashed border-fristenkalender_tone pb-5"
    >
      Der digitale Fristenkalender bringt den bewährten
      Hochfrequenz-Fristenkalender vom Wandformat direkt in Ihre Kalender-App.
      So können alle offiziellen Fristen, beispielsweise der GPKE und MaBiS, in
      Ihre Kalender importiert und dort als Ereignisse angezeigt werden.
    </h3>
    <div class="text-hf-weiches-schwarz text-sm mt-5 opacity-50 italic">
      <span class="font-medium">DISCLAIMER:</span> Wir geben unser Bestes, dass alle
      Daten korrekt und vollständig sind – können aber trotzdem nicht ausschließen,
      dass sich vereinzelt Fehler einschleichen.
    </div>
    <div class="mt-10 flex justify-center relative z-10">
      <button
        on:click={checkAuthentication}
        class="flex flex-row items-center gap-2 rounded-full bg-fristenkalender_primary text-weichesschwarz text-lg px-5 py-2
          ring-1
          ring-black/5
          hover:ring-black/10
          transition-all
          duration-300
          ease-in-out"
      >
        <IconLogin /> Jetzt öffnen
      </button>
    </div>
  </div>
</section>
