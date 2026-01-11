// Function to parse CSV string into JSON objects
// Handles commas inside quotes correctly
const csvToJson = (csvText) => {
  const rows = csvText.split(/\r?\n/);
  const headers = rows[0].split(',').map(h => h.trim().toLowerCase()); // title, category, etc.

  return rows.slice(1).map(row => {
    // Regex to match CSV values, accounting for quotes
    const values = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
    
    if (!values) return null;

    const entry = {};
    headers.forEach((header, index) => {
      // Clean quotes and trim
      const val = values[index] ? values[index].replace(/^"|"$/g, '').trim() : '';
      entry[header] = val;
    });
    return entry;
  }).filter(item => item && item.title); // Filter empty rows
};

export const fetchNewsData = async (sheetId) => {
  try {
    // Construct the CSV export URL
    // GID=0 assumes the first sheet
    const url = `https://docs.google.com/spreadsheets/d/1Ur53b0yWWDWmsqXrD3OfsA6sV0Ap6HtJuz9PKNiet9c/export?format=csv&gid=0`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch data');
    
    const text = await response.text();
    const data = csvToJson(text);

    // Sort by Date + Time (Newest First)
    return data.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateB - dateA;
    });

  } catch (error) {
    console.error("Sheet Fetch Error:", error);
    throw error;
  }
};