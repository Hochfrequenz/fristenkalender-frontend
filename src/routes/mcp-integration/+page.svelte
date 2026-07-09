<script lang="ts">
  import { base } from "$app/paths";
  import { API_BASE_URL } from "$lib/config/api";

  // The MCP server is served by the backend API (not the frontend origin), at /mcp.
  const mcpUrl = `${API_BASE_URL}/mcp`;

  // Ready-to-paste opencode config. Kept as a string so it renders verbatim.
  const opencodeConfig = `{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "fristenkalender": {
      "type": "remote",
      "url": "${mcpUrl}",
      "enabled": true
    }
  }
}`;

  const claudeCodeSnippet = `claude mcp add --transport http fristenkalender ${mcpUrl}`;

  let copied = false;

  async function copyUrl() {
    await window.navigator.clipboard.writeText(mcpUrl);
    copied = true;
    setTimeout(() => (copied = false), 2000);
  }
</script>

<section class="bg-fristenkalender_primary flex-grow overflow-y-auto">
  <div class="flex justify-center px-4 py-10">
    <div
      class="rounded-3xl w-full max-w-2xl bg-fristenkalender_secondary p-8 md:p-12
      shadow-lg ring-1 ring-black/5"
    >
      <h1 class="text-3xl text-black/70 pb-5">MCP-Integration</h1>
      <h2
        class="flex text-lg border-b-2 border-fristenkalender_tone text-black/70 pb-3 mb-5 uppercase"
      >
        Der Fristenkalender in Ihrem KI-Assistenten
      </h2>

      <p class="text-black/70 pb-5">
        Der Fristenkalender steht zusätzlich als <strong>MCP-Server</strong>
        (Model Context Protocol) bereit. Damit können Sie die BDEW-Fristen- und Arbeitstagsberechnungen
        direkt in Ihrem KI-Assistenten – etwa Claude, GitHub Copilot oder opencode
        – abfragen, ohne diese Website zu öffnen.
      </p>

      <h3 class="text-lg text-black/70 pb-3">Was Sie damit tun können</h3>
      <p class="text-black/70 pb-2">
        Kurz gesagt: <strong
          >alles, was auf dieser Website geht, geht auch per MCP</strong
        >, nur eben direkt in Ihrem KI-Assistenten. Zum Beispiel:
      </p>
      <ul class="list-disc list-inside text-black/70 space-y-1 pb-3">
        <li>prüfen, ob ein Datum ein BDEW-Arbeitstag ist,</li>
        <li>den nächsten oder vorherigen Arbeitstag bestimmen,</li>
        <li>
          Arbeitstage oder Kalendertage auf ein Datum addieren (Fristen
          berechnen),
        </li>
        <li>
          alle Fristen eines Jahres erzeugen – für einen Typ (z.&nbsp;B. GPKE,
          MaBiS) oder gesammelt.
        </li>
      </ul>
      <p class="text-black/70 text-sm opacity-70 pb-6">
        Der MCP-Server ist wie diese Website kostenfrei nutzbar. Sie müssen sich
        lediglich anmelden.
      </p>

      <h3 class="text-lg text-black/70 pb-3">Server-Adresse</h3>
      <p class="text-black/70 pb-3">
        Tragen Sie in Ihrem KI-Tool die folgende Adresse als Remote- bzw.
        HTTP-MCP-Server ein:
      </p>
      <div class="flex items-center gap-2 pb-3">
        <code
          class="flex-1 break-all bg-white/60 border border-fristenkalender_tone rounded-lg px-3 py-2 font-mono text-xs text-black/80"
          >{mcpUrl}</code
        >
        <button
          on:click={copyUrl}
          aria-label={copied ? "Kopiert" : "Adresse kopieren"}
          class="flex-none rounded-full bg-fristenkalender_primary text-weichesschwarz text-sm px-4 py-2
            ring-1 ring-black/5 hover:ring-black/10 transition-all duration-300"
        >
          {copied ? "Kopiert ✓" : "Kopieren"}
        </button>
      </div>
      <p class="text-black/70 text-sm opacity-70 pb-6">
        Beim ersten Verbinden öffnet sich gegebenenfalls ein Anmeldefenster.
        Melden Sie sich dort mit Ihrem gewohnten Hochfrequenz-Konto an (dasselbe
        Login wie für diese Website; ggf. lassen Sie sich erneut einen
        6-stelligen Code per E-Mail zuschicken).
      </p>

      <h3 class="text-lg text-black/70 pb-3">Einrichtung in Ihrem KI-Tool</h3>
      <p class="text-black/70 pb-3">
        Die genauen Schritte unterscheiden sich je nach Tool. Folgen Sie der
        offiziellen Anleitung Ihres KI-Assistenten und tragen Sie dort die oben
        genannte Server-Adresse ein:
      </p>
      <ul class="text-black/70 space-y-4 pb-2">
        <li>
          <a
            class="text-fristenkalender_tone font-medium hover:underline"
            target="_blank"
            rel="noopener noreferrer"
            href="https://modelcontextprotocol.io/docs/tutorials/use-remote-mcp-server"
            >Claude ↗</a
          >
          <span class="text-sm opacity-70"
            >(claude.ai &amp; Claude Desktop – „Custom Connectors")</span
          >
        </li>
        <li>
          <a
            class="text-fristenkalender_tone font-medium hover:underline"
            target="_blank"
            rel="noopener noreferrer"
            href="https://code.claude.com/docs/en/mcp"
            >Claude Code (Terminal) ↗</a
          >
          <pre
            class="mt-2 overflow-x-auto bg-white/60 border border-fristenkalender_tone rounded-lg px-3 py-2 font-mono text-xs text-black/80"><code
              >{claudeCodeSnippet}</code
            ></pre>
          <span class="text-sm opacity-70"
            >Danach im Claude-Prompt <code class="font-mono">/mcp</code> öffnen und
            „Authenticate" wählen (öffnet das Login-Fenster).</span
          >
        </li>
        <li>
          <a
            class="text-fristenkalender_tone font-medium hover:underline"
            target="_blank"
            rel="noopener noreferrer"
            href="https://code.visualstudio.com/docs/copilot/chat/mcp-servers"
            >GitHub Copilot in VS Code ↗</a
          >
        </li>
        <li>
          <a
            class="text-fristenkalender_tone font-medium hover:underline"
            target="_blank"
            rel="noopener noreferrer"
            href="https://opencode.ai/docs/mcp-servers/">opencode ↗</a
          >
          <p class="text-sm opacity-70 mt-1">
            In Ihre <code class="font-mono">opencode.json</code> eintragen
            (Repo-Root oder global unter
            <code class="font-mono">~/.config/opencode/opencode.json</code>):
          </p>
          <pre
            class="mt-2 overflow-x-auto bg-white/60 border border-fristenkalender_tone rounded-lg px-3 py-2 font-mono text-xs text-black/80"><code
              >{opencodeConfig}</code
            ></pre>
          <p class="text-sm opacity-70 mt-1">Danach einmalig anmelden:</p>
          <pre
            class="mt-2 overflow-x-auto bg-white/60 border border-fristenkalender_tone rounded-lg px-3 py-2 font-mono text-xs text-black/80"><code
              >opencode mcp auth fristenkalender</code
            ></pre>
        </li>
      </ul>

      <div
        class="mt-6 pt-5 border-t-2 border-dashed border-fristenkalender_tone"
      >
        <a
          href="{base}/"
          class="text-black/70 hover:underline inline-flex items-center gap-1"
          >← Zurück zur Startseite</a
        >
      </div>
    </div>
  </div>
</section>
