let apiKey = "<<INSERT API KEY HERE>>";
let content = draft.content;

let http = HTTP.create();
let response = http.request({
  url: "https://api.openai.com/v1/chat/completions",
  method: "POST",
  headers: {
    "Authorization": "Bearer " + apiKey,
    "Content-Type": "application/json"
  },
  data: {
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content:
`You will be given unstructured text from a draft note. This may include a meeting transcript, voice memo transcription, a free-form brain dump, a list of tasks or notes, or a mix of all of these.

Your job is to:
- Extract the key ideas, themes, and decisions
- Identify any actionable items, responsible parties, and deadlines (if mentioned)
- Summarize the core insights clearly and concisely
- Use bullet points or short paragraphs for readability
- Do not repeat the original content verbatim

If the content is too vague or fragmented, still try to derive a useful and intelligent summary.

Here is the content:
${content}`
      }
    ],
    temperature: 0.7
  }
});

if (response.success) {
  let json = response.responseData;
  let summary = json.choices[0].message.content;

  draft.content = "Summary:\n\n" + summary.trim() + "\n\n---\n\n" + content;
  draft.update();
  editor.load(draft);
} else {
  alert("Request failed with status: " + response.statusCode + "\n" + response.error);
  console.log("Error: " + response.responseText);
}
