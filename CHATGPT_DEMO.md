# ChatGPT Custom GPT Demo

## 🤖 Live ChatGPT Integration

**Try it now:** https://chatgpt.com/g/g-699cf50686808191b07ade15b4b7284d-home-services-assistant-mcp-demo

This Custom GPT demonstrates how the Angi MCP server integrates with ChatGPT to provide natural language access to home service tools.

---

## ✨ What This Demo Shows

This ChatGPT integration demonstrates:

- ✅ **Natural conversation** with AI about home services
- ✅ **Automatic tool calling** - ChatGPT decides when to use each API
- ✅ **Real-time data** from the Railway-hosted MCP server
- ✅ **Lead generation flow** from question → advice → search → quote
- ✅ **Production-ready architecture** (minus authentication)

---

## 🧪 How to Test

### Test 1: Search for Professionals
**You say:**
```
Find me a plumber in zip code 10001
```

**What happens:**
1. ChatGPT understands you need a plumber
2. Calls `searchProfessionals` API with category="plumbing", zip_code="10001"
3. Receives Marcus Johnson's info (4.9★, $95-145/hr, available now)
4. Formats it naturally and presents it to you

**Expected response:**
> I found an excellent plumber in your area:
> 
> **Marcus Johnson** - Johnson Plumbing & Drain  
> ⭐ 4.9/5 (312 reviews)  
> 📞 (212) 555-0192  
> 💵 $95-$145/hr  
> ✅ Available now  
> 🏆 Angi Certified, Background Checked, Top Pro 2024
>
> Would you like me to request a quote?

---

### Test 2: Get Home Improvement Advice
**You say:**
```
How do I fix a leaky faucet?
```

**What happens:**
1. ChatGPT recognizes this as a DIY question
2. Calls `getHomeAdvice` API with question="How do I fix a leaky faucet?"
3. Receives detailed answer with costs and difficulty
4. Presents the advice conversationally

**Expected response:**
> A leaky faucet is usually caused by a worn-out washer, O-ring, or cartridge...
> 
> **Estimated Cost:** $5-$200 (DIY to professional repair)  
> **Difficulty:** You can DIY this or hire a pro
>
> Here's what to do:
> 1. Turn off water supply under sink...
> 2. Disassemble the handle...
> 
> Would you like me to find a plumber if you prefer professional help?

---

### Test 3: Request a Quote
**You say:**
```
Yes, request a quote from pro-001 for fixing my kitchen sink. 
My name is John Doe, zip 10001, I need it ASAP
```

**What happens:**
1. ChatGPT extracts the professional ID, your info, and urgency
2. Calls `requestQuote` API with all parameters
3. Receives lead ID and confirmation
4. Presents next steps

**Expected response:**
> Great! I've submitted your quote request to Marcus Johnson at Johnson Plumbing & Drain.
>
> **Lead ID:** LEAD-LRC8H2D3  
> **Expected Response:** Within 1-2 hours
>
> **Next Steps:**
> - You'll receive a confirmation email from Angi
> - Marcus should contact you within 1-2 hours
> - Track your request at angi.com/my-projects/LEAD-LRC8H2D3
> - We recommend getting 2-3 quotes before deciding

---

## 🎬 Demo Scenarios for Presentation

### Scenario A: Emergency Plumbing
**Conversation:**
```
You: My kitchen sink is clogged and backing up. I'm in zip 10002, need help today.

GPT: [Calls getHomeAdvice] Let me help you with that. First, here are some quick things to try...
     [If needed] Let me find you available plumbers in 10002...
     [Calls searchProfessionals]
     I found 2 plumbers available now: [Shows Marcus & Priya]
     
You: Get me a quote from Marcus

GPT: [Calls requestQuote] Done! Marcus will respond within 1-2 hours. Lead ID: LEAD-XYZ
```

### Scenario B: Planning a Remodel
```
You: I'm thinking about remodeling my bathroom. What should I expect to pay?

GPT: [Calls getHomeAdvice] Bathroom remodel costs vary widely...
     - Cosmetic refresh: $1,500-$5,000
     - Mid-range remodel: $8,000-$20,000
     - Full renovation: $30,000-$60,000+
     
     Would you like me to find contractors in your area?
     
You: Yes, I'm in 10001

GPT: [Calls searchProfessionals for remodeling category]
     I found Sarah Kim - Kim's Kitchen & Bath Remodeling...
```

### Scenario C: DIY or Hire?
```
You: My AC is blowing warm air. Can I fix this myself?

GPT: [Calls getHomeAdvice] Let me help you troubleshoot...
     Start with these DIY checks:
     1. Check thermostat settings...
     2. Replace air filter...
     
     If these don't work, it might be low refrigerant (requires a pro).
     Want me to find HVAC technicians just in case?
```

---

## 🏗️ Technical Architecture

```
User
  ↓ (natural language)
ChatGPT GPT
  ↓ (decides which tool to call)
OpenAPI Actions
  ↓ (HTTP POST with JSON)
Railway MCP Server
  ↓ (processes request)
Mock Data / Business Logic
  ↓ (returns results)
ChatGPT GPT
  ↓ (formats naturally)
User receives answer
```

---

## 📊 Integration Components

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **ChatGPT GPT** | OpenAI GPT-4 | Natural language interface |
| **Actions** | OpenAPI 3.0 | API integration layer |
| **MCP Server** | TypeScript/Node.js | Business logic & tools |
| **Transport** | REST over HTTPS | Communication protocol |
| **Hosting** | Railway | Server deployment |
| **Data** | Mock JSON | Demonstration data |

---

## 🔑 Key Features Demonstrated

### 1. **Intelligent Tool Selection**
ChatGPT automatically decides which API to call based on context:
- Question about "how to" → `getHomeAdvice`
- Request to "find" professionals → `searchProfessionals`
- "Request a quote" → `requestQuote`

### 2. **Context Awareness**
ChatGPT maintains conversation context:
- Remembers zip code from earlier in conversation
- References professionals from previous search
- Asks for missing information naturally

### 3. **Natural Language I/O**
- **Input:** Casual user language ("find me a plumber")
- **Processing:** Structured API calls
- **Output:** Conversational, formatted responses

### 4. **Error Handling**
If professional not found, API returns helpful message and ChatGPT suggests alternatives.

---

## 🎯 Use Cases Addressed (From Case Study)

This demo directly addresses the case study requirements:

### ✅ Homeowner Use Cases
1. **Answering home improvement questions** → `getHomeAdvice` tool
2. **Finding home service professionals** → `searchProfessionals` tool
3. **Requesting quotes/leads** → `requestQuote` tool

### ✅ Product Integration
- Natural ChatGPT interface (familiar to users)
- No app downloads needed
- Works on any device with web browser

### ✅ Technical Feasibility
- Public API endpoints
- RESTful architecture
- Scalable deployment
- Clear separation of concerns

---

## 📈 Comparison: MCP vs ChatGPT Integration

| Aspect | MCP (Claude) | ChatGPT Custom GPT |
|--------|--------------|-------------------|
| **Protocol** | Model Context Protocol | OpenAPI/REST |
| **Setup** | Native in Claude Desktop | Custom GPT Actions |
| **Tool Format** | MCP tool definitions | OpenAPI schema |
| **Authentication** | Built-in | Manual configuration |
| **Best For** | Claude ecosystem | ChatGPT ecosystem |

**This demo shows both approaches:**
- MCP endpoint: `https://angi-mcp-production.up.railway.app/mcp`
- REST endpoints: `/api/search`, `/api/advice`, `/api/quote`

---

## 🚀 Next Steps for Production

To turn this demo into a production integration:

### 1. Authentication & Security
- Add API keys for client authentication
- Implement rate limiting
- Add request validation & sanitization

### 2. Real Data Integration
- Replace mock data with real Angi database
- Connect to actual professional listings
- Integrate with lead management system

### 3. Enhanced Features
- Real-time availability checking
- Photo uploads for projects
- Multi-professional comparisons
- User reviews and ratings
- Scheduling integration

### 4. Monitoring & Analytics
- Track tool usage and conversion rates
- Monitor API performance and latency
- A/B test different prompts and flows
- Collect feedback for continuous improvement

### 5. Multi-Platform Support
- Adapt for Google Gemini (different function calling format)
- Build native integrations with other LLMs
- Create unified backend serving all platforms

---

## 📱 How to Share This Demo

### For Your Presentation:
1. **Screen share the ChatGPT conversation**
2. **Walk through a live scenario** (emergency plumbing)
3. **Show the API being called** (mention "Calling HTTP endpoint" messages)
4. **Compare to web demo** side-by-side

### For Stakeholders:
- Share the GPT link: https://chatgpt.com/g/g-699cf50686808191b07ade15b4b7284d-home-services-assistant-mcp-demo
- They can test it themselves with ChatGPT Plus
- Works on desktop and mobile

### For Technical Review:
- OpenAPI schema: https://github.com/piprads/angi-mcp/blob/main/openapi.yaml
- Source code: https://github.com/piprads/angi-mcp
- Architecture docs: https://github.com/piprads/angi-mcp/blob/main/DEMO.md

---

## 🔗 All Demo Resources

| Resource | URL | Purpose |
|----------|-----|---------|
| **ChatGPT Custom GPT** | [Link](https://chatgpt.com/g/g-699cf50686808191b07ade15b4b7284d-home-services-assistant-mcp-demo) | AI chat interface |
| **Web Demo** | [piprads.github.io/angi-mcp](https://piprads.github.io/angi-mcp/) | Direct API testing |
| **MCP Server** | [angi-mcp-production.up.railway.app](https://angi-mcp-production.up.railway.app) | Backend API |
| **GitHub Repo** | [github.com/piprads/angi-mcp](https://github.com/piprads/angi-mcp) | Source code |
| **Documentation** | [DEMO.md](https://github.com/piprads/angi-mcp/blob/main/DEMO.md) | Full technical docs |

---

## 💡 Presentation Tips

1. **Start with ChatGPT demo** - More impressive than JSON
2. **Show natural conversation** - Let the AI do the work
3. **Highlight tool calls** - Point out when APIs are invoked
4. **Demonstrate lead generation** - Show the full funnel
5. **Compare platforms** - Mention MCP for Claude, Actions for ChatGPT
6. **Discuss production path** - Show this is a real architecture

---

**Built for Angi Case Study Exercise - February 2026**

*Demonstrating AI-powered home services integration using Model Context Protocol and ChatGPT Custom GPT Actions*
