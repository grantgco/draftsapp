let apiKey = "<<INSERT CLAUDE API KEY HERE>>";
let content = draft.content;
let http = HTTP.create();
let response = http.request({
  url: "https://api.anthropic.com/v1/messages",
  method: "POST",
  headers: {
    "x-api-key": apiKey,
    "Content-Type": "application/json",
    "anthropic-version": "2023-06-01"
  },
  data: {
    model: "claude-sonnet-4-20250514",
    max_tokens: 4000,
    messages: [
      {
        role: "user",
        content: 
`You are an expert at reformatting and organizing unstructured notes while preserving ALL original information. Your job is to take messy, scattered content and transform it into a clean, well-organized format without losing any details.

Please reformat the content below with this structure:

# [Create a Clear, Descriptive Title]

## Overview
Brief 1-2 sentence summary if the content warrants it

## Main Content
Organize all the original information into logical sections with clear headings. Preserve every detail, quote, number, name, and idea from the original - just present it in a cleaner, more readable format.

Use appropriate subsections like:
- **Key Points** 
- **Action Items** (with any owners/deadlines mentioned)
- **Decisions Made**
- **Questions/Issues Raised**
- **Next Steps**
- **Background Info**
- **People/Contacts Mentioned**

## Quick Reference
If applicable, create a brief bulleted list of the most important items for easy scanning

**Instructions:**
- Keep ALL original information - don't summarize or condense details
- Fix obvious typos or formatting issues
- Organize related information together
- Use clear headings and formatting for readability
- If something is unclear in the original, keep it as-is but note [unclear] if helpful

Content to reformat:
${content}`
      }
    ]
  }
});

if (response.success) {
  let json = response.responseData;
  let summary = json.content[0].text;
  // For testing: append original content below summary
  // Comment out the next line once you're satisfied with the results
  draft.content = summary.trim() + "\n\n---\n\n" + content;
  // Uncomment this line to keep only the summary:
  // draft.content = summary.trim();
  draft.update();
  editor.load(draft);
} else {
  alert("Request failed with status: " + response.statusCode + "\n" + response.error);
  console.log("Error: " + response.responseText);
}
