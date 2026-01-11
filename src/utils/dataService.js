import Papa from 'papaparse';

// UPDATED: Your specific Sheet ID converted to a CSV export URL
const SHEET_ID = "1Ur53b0yWWDWmsqXrD3OfsA6sV0Ap6HtJuz9PKNiet9c";
const GOOGLE_SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

// FALLBACK DATA (Used only if the Sheet is empty or fails to load)
const FALLBACK_DATA = [
  {
    title: "BREAKING: Major Deal Struck in Global Summit",
    category: "POLITICS",
    summary: "World leaders agree on historic trade regulations affecting global markets.",
    img_url: "https://images.unsplash.com/photo-1555848962-6e79363ec58f?w=800&q=80",
    date: "2026-01-09",
    time: "10:30",
    views: "24k",
    comments: "1.4k"
  },
  {
    title: "Epic Soccer Match Ends in Dramatic Win",
    category: "SPORTS",
    summary: "The final minutes saw a turnaround that shocked fans worldwide.",
    img_url: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80",
    date: "2026-01-09",
    time: "09:15",
    views: "15k",
    comments: "18k"
  },
  {
    title: "ChatGPT Just Got an Insane New Upgrade!",
    category: "TECH",
    summary: "OpenAI releases the latest model capable of real-time reasoning.",
    img_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    date: "2026-01-09",
    time: "08:45",
    views: "18k",
    comments: "18k"
  }
];

// GENERATE DETERMINISTIC ID
const generateId = (item) => {
  const str = `${item.title}-${item.date}-${item.time}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return `news-${Math.abs(hash)}`;
};

export const fetchNewsData = async () => {
  try {
    console.log("Fetching from:", GOOGLE_SHEET_URL); // Debug log
    const response = await fetch(GOOGLE_SHEET_URL);
    
    if (!response.ok) throw new Error(`Sheet fetch failed: ${response.statusText}`);
    
    const csvText = await response.text();
    
    return new Promise((resolve) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true, // Important for empty rows at bottom of sheet
        complete: (results) => {
          // Check if we actually got data rows
          if (results.data && results.data.length > 0) {
            console.log("Sheet data loaded:", results.data.length, "rows");
            const processed = processData(results.data);
            resolve(processed);
          } else {
            console.warn("Primary source empty. Using fallback.");
            resolve(processData(FALLBACK_DATA));
          }
        },
        error: (err) => {
          console.warn("CSV Parse error:", err);
          resolve(processData(FALLBACK_DATA));
        }
      });
    });

  } catch (error) {
    console.warn("Network error or invalid URL. Using fallback.", error);
    return processData(FALLBACK_DATA);
  }
};

const processData = (rawData) => {
  // Add IDs and ensure required fields
  const cleanData = rawData.map(item => ({
    ...item,
    id: generateId(item),
    // Ensure these fields exist if you didn't add them to the sheet
    views: item.views || (Math.floor(Math.random() * 20) + 1) + 'k', 
    comments: item.comments || (Math.floor(Math.random() * 10) + 1) + 'k'
  }));

  // Sort Descending (Newest first)
  return cleanData.sort((a, b) => {
    // Handle potential date format issues
    if (!a.date || !b.date) return 0;
    const dateA = new Date(`${a.date}T${a.time || '00:00'}`);
    const dateB = new Date(`${b.date}T${b.time || '00:00'}`);
    return dateB - dateA;
  });
};