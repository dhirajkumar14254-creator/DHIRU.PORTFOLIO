import fetch from "node-fetch";

async function main() {
  const spreadsheetId = "1qFiy94AJ_Ffi0UakzwU2eEM2j1jiZiiOlvr6hu8Z2K8";
  const gids = {
    "Home GID 0": "0",
    "Bottom Navbar GID 1999507439": "1999507439",
    "P,J Corner Videos GID 484003839": "484003839"
  };

  for (const [name, gid] of Object.entries(gids)) {
    const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&gid=${gid}&_t=${Date.now()}`;
    try {
      const res = await fetch(url);
      if (res.ok) {
        const text = await res.text();
        const jsonStart = text.indexOf("{");
        const jsonEnd = text.lastIndexOf("}");
        if (jsonStart !== -1 && jsonEnd !== -1) {
          const jsonStr = text.substring(jsonStart, jsonEnd + 1);
          const data = JSON.parse(jsonStr);
          if (data && data.table) {
            console.log(`\n=================== ${name} ===================`);
            const cols = data.table.cols.map((c: any) => c.label || "empty");
            console.log("Cols:", cols);
            const rows = data.table.rows;
            console.log(`Row count: ${rows.length}`);
            rows.forEach((r: any, idx: number) => {
              const cells = r?.c?.map((cell: any) => cell?.v ?? "null");
              console.log(`Row ${idx}:`, JSON.stringify(cells));
            });
          }
        }
      }
    } catch (e: any) {
      console.error(`Error fetching ${name}:`, e.message);
    }
  }
}

main();
