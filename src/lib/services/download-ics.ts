export async function downloadCalendar(year: number): Promise<void> {
  try {
    const apiEndpoint = `https://fristenkalender.azurewebsites.net/api/GenerateAndExportWholeCalendar/calendar/test@test.com/${year}`;

    const response = await fetch(apiEndpoint);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: "text/calendar" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `Hochfrequenz_Fristenkalender_${year}.ics`;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading calendar:", error);
    throw error;
  }
}
