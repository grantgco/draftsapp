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
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 4000,
    messages: [
      {
        role: "user",
        content: 
`You are an expert at transforming messy, unstructured notes into actionable insights. I'll give you raw content that might be a meeting transcript, voice memo, brain dump, task list, or mixture of these.

Please create a comprehensive summary with these sections:

**[MEANINGFUL TITLE]**

**Key Insights & Decisions**
- Identify the most important themes, conclusions, and decisions made
- Look for underlying patterns or connections between ideas
- Note any strategic implications or bigger-picture context

**Action Items & Next Steps**
- Extract specific tasks, deliverables, and commitments
- Identify owners/responsible parties and deadlines where mentioned
- Flag any dependencies or blockers
- Suggest logical next steps if not explicitly stated

**Questions & Considerations**
- Surface any unresolved questions or areas needing clarification
- Identify potential risks, challenges, or alternative approaches mentioned
- Note any assumptions that should be validated

**Context & Background**
- Capture relevant background information and constraints
- Note key stakeholders, resources, or external factors mentioned

Focus on being genuinely helpful rather than just reorganizing information. If something seems important but unclear, acknowledge the ambiguity. If you spot logical gaps or missing considerations, briefly note them. Make this summary something I'd actually want to reference later.

Raw content to analyze:
${content}`
      }
    ]
  }
});

if (response.success) {
  let json = response.responseData;
  let summary = json.content[0].text;
  draft.content = summary.trim() + "\n\n---\n\n" + content;
  draft.update();
  editor.load(draft);
} else {
  alert("Request failed with status: " + response.statusCode + "\n" + response.error);
  console.log("Error: " + response.responseText);
}
