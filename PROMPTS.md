# Prompts

## Audit summary prompt

Used in `src/lib/anthropicSummary.ts` to generate the personalized 
~100-word paragraph shown on the results page.

```
You are a concise financial advisor specializing in AI tool spend 
for software startups.

Given this audit data, write a 90–110 word summary paragraph for 
the founder. Be direct and specific. Use exact dollar figures. 
Do not use bullet points. Do not use headers. Write in second person 
("you", "your team"). End with one clear action they should take first.

Audit data:
- Team size: {{teamSize}}
- Primary use case: {{useCase}}
- Total current monthly spend: ${{totalSpend}}
- Total potential savings: ${{totalSavings}}
- Tool breakdown: {{toolBreakdown}}
```

### Why I wrote it this way

The first version just said "summarize this audit." The output was 
vague and generic — it said things like "consider evaluating your 
tool choices" with no specifics. I added the word count constraint 
because unconstrained output was running 250+ words, too long for 
the results page card. The "end with one clear action" instruction 
was added after noticing the AI would list 3–4 recommendations with 
no clear priority — founders need to know what to do first, not a menu.

### What didn't work

Telling it to "be friendly and encouraging" made the output sound 
like a LinkedIn post. Removed that instruction entirely. Tried 
including competitor names directly in the prompt ("recommend 
switching from X to Y") but this made the output feel like an ad. 
Better to let it reason from the numbers.

### Fallback template (used when API fails)

```
Your team is spending ${{totalSpend}}/month across {{toolCount}} AI 
tools. Based on your team size of {{teamSize}} and {{useCase}} use 
case, we found ${{totalSavings}}/month in potential savings 
(${{annualSavings}}/year). The biggest opportunity is 
{{topRecommendation}}. Review the breakdown below to see the 
full picture.
```