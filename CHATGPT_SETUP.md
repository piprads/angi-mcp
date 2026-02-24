# Setting Up Angi Custom GPT

## Step-by-Step Instructions

### 1. Go to ChatGPT GPTs Page
- Open ChatGPT: https://chat.openai.com
- Click your profile icon (bottom left)
- Select **"My GPTs"**
- Click **"Create a GPT"**

### 2. Configure Basic Info

In the **Configure** tab, fill in:

**Name:**
```
Angi Home Services Assistant
```

**Description:**
```
Find verified home service professionals, get expert home improvement advice, and request quotes from Angi pros.
```

**Instructions:**
```
You are an expert home services assistant powered by Angi. You help homeowners with:

1. Finding qualified professionals for home repairs and improvements
2. Answering questions about DIY projects, costs, and when to hire professionals  
3. Requesting quotes from verified Angi professionals

IMPORTANT GUIDELINES:
- Always search for professionals when a homeowner mentions needing a service
- Provide advice before suggesting professionals when appropriate
- Use the homeowner's zip code when searching for professionals
- Emphasize professional ratings, reviews, and Angi certifications
- When presenting quote options, ask for confirmation before submitting
- Format professional information in a clear, scannable way
- Be friendly, helpful, and focused on solving the homeowner's problem

WORKFLOW:
1. If homeowner asks a "how to" question → use get_home_advice first
2. If they need a professional → use search_professionals with their zip code
3. If they want to contact a pro → use request_quote with the professional's ID

Always provide context about why you're calling each tool and what information you need from the homeowner.
```

**Conversation starters:**
```
Find me a plumber in my area
How do I fix a leaky faucet?
I need an electrician for a panel upgrade
What does a bathroom remodel cost?
```

### 3. Add Actions (API Integration)

Scroll down to **"Actions"** section and click **"Create new action"**

#### Import the Schema:

Copy the entire contents of `openapi.yaml` file from the repo and paste it into the schema editor.

**Or manually paste this:**

```yaml
openapi: 3.0.0
info:
  title: Angi Home Services API
  description: API for searching home service professionals, getting home improvement advice, and requesting quotes.
  version: 1.0.0
servers:
  - url: https://angi-mcp-production.up.railway.app

paths:
  /api/search:
    post:
      operationId: searchProfessionals
      summary: Search for home service professionals
      description: Find verified professionals by category, zip code, and availability
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - category
              properties:
                category:
                  type: string
                  example: plumbing
                zip_code:
                  type: string
                  example: "10001"
                availability:
                  type: string
                  enum: [any, available_now, available_this_week]
                  default: any
                max_results:
                  type: integer
                  default: 3
      responses:
        '200':
          description: Success
          
  /api/advice:
    post:
      operationId: getHomeAdvice
      summary: Get home improvement advice
      description: Answer questions about home repairs and maintenance
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - question
              properties:
                question:
                  type: string
                  example: How do I fix a leaky faucet?
      responses:
        '200':
          description: Success
          
  /api/quote:
    post:
      operationId: requestQuote
      summary: Request a quote from a professional
      description: Submit a quote request to connect with an Angi pro
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - professional_id
                - service_needed
                - homeowner_name
                - homeowner_zip
                - preferred_timing
              properties:
                professional_id:
                  type: string
                  example: pro-001
                service_needed:
                  type: string
                  example: Fix leaking sink
                homeowner_name:
                  type: string
                  example: John Doe
                homeowner_zip:
                  type: string
                  example: "10001"
                preferred_timing:
                  type: string
                  enum: [as_soon_as_possible, within_a_week, within_a_month, just_getting_estimates]
                notes:
                  type: string
      responses:
        '200':
          description: Success
```

#### Authentication:
- Select **"None"** (since this is a demo with no auth)
- Click **"Save"**

### 4. Set Privacy

- **Who can access:** Select "Only me" for testing, or "Anyone with a link" to share

### 5. Test Your GPT!

Click **"Test"** in the top right and try:

**Test 1:**
```
Find me a plumber in zip code 10001
```

**Test 2:**
```
How much does it cost to fix a leaky faucet?
```

**Test 3:**
```
I want to request a quote from pro-001 for fixing my kitchen sink. 
My name is John Doe, zip 10001, need it ASAP
```

### 6. Save and Share

- Click **"Save"** when done
- You'll get a shareable link like: `https://chat.openai.com/g/g-XXXXX-angi-home-services`
- Share this link in your presentation!

---

## Expected Behavior

### Example Conversation:

**You:** "Find me a plumber in 10001"

**GPT:** "I'll search for plumbers in your area..."  
*[Calls searchProfessionals API]*  
"I found an excellent plumber for you:

**Marcus Johnson** - Johnson Plumbing & Drain  
⭐ 4.9/5 (312 reviews)  
📞 (212) 555-0192  
💵 $95-$145/hr  
✅ Available now  
🏆 Angi Certified, Background Checked, Top Pro 2024

Marcus has 14 years of experience and specializes in emergency repairs. Would you like me to request a quote from him?"

**You:** "Yes please, my name is John Doe"

**GPT:** *[Calls requestQuote API]*  
"Great! I've submitted your quote request. Marcus should respond within 1-2 hours. You'll receive a confirmation email with lead ID: LEAD-ABC123. Track your request at angi.com/my-projects."

---

## Troubleshooting

**Issue:** GPT says "I can't access external APIs"
- Make sure you're in the Configure tab
- Verify Actions are properly saved
- Check that the server URL is correct

**Issue:** API calls fail
- Test the endpoints manually: https://piprads.github.io/angi-mcp/
- Verify Railway server is online: https://angi-mcp-production.up.railway.app/health

**Issue:** GPT doesn't use the tools
- Make sure Instructions mention when to call each tool
- Try being more specific: "Search for plumbers using the API in zip 10001"

---

## For Your Presentation

1. **Share the GPT link** with your audience
2. **Do a live demo** - ask it questions in real-time
3. **Show the natural flow** - from question → advice → search → quote
4. **Compare to web demo** - show both interfaces side by side

The Custom GPT makes your demo feel like a real product! 🚀
