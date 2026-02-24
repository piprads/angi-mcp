# Angi MCP Server — Demo Summary
**One-Page Overview for Presentation**

---

## 🔗 Demo Links

| **Live Demo** | https://piprads.github.io/angi-mcp/ |
| **MCP Server** | https://angi-mcp-production.up.railway.app |
| **GitHub Repo** | https://github.com/piprads/angi-mcp |
| **Full Docs** | [DEMO.md](https://github.com/piprads/angi-mcp/blob/main/DEMO.md) |

---

## 🎯 What This Demonstrates

A **working prototype** showing how Angi integrates with LLM platforms (Claude, ChatGPT, Gemini) using the Model Context Protocol (MCP).

### Three Core Tools

1. **Search Professionals** — Find pros by category, zip, availability
2. **Get Home Advice** — Answer DIY questions with cost estimates
3. **Request Quote** — Generate leads from homeowner inquiries

---

## 📊 Sample Flow: Emergency Plumbing

**Homeowner:** *"My sink is clogged in zip 10001, need help ASAP"*

1. LLM calls `get_home_advice("clogged sink")` → Returns DIY tips + "consider a pro"
2. LLM calls `search_professionals("plumbing", "10001", "available_now")` → Returns Marcus Johnson (4.9★, $95-145/hr)
3. Homeowner approves → LLM calls `request_quote()` → **Lead generated** (LEAD-LRC8H2D3)

---

## 🗄️ Mock Data

- **6 professionals** across plumbing, electrical, HVAC, remodeling, roofing, cleaning
- **8 advice topics** covering leaks, AC, remodels, roof repair, drain clogs
- **NYC zip codes** (10001-10033) with realistic ratings, availability, pricing

---

## 🏗️ Technical Architecture

```
LLM Platform (Claude/ChatGPT/Gemini)
         ↓ MCP Protocol
   MCP Server (Railway)
         ↓
   [3 Tools + Mock Data]
         ↓
   Web Demo (GitHub Pages)
```

**Stack:** TypeScript, Node.js, MCP SDK v1.12, StreamableHTTP transport  
**Deployment:** Railway auto-deploy from GitHub, public HTTPS endpoint  
**Transport:** Dual support (MCP protocol + REST API for browsers)

---

## ✅ Case Study Requirements Met

| **Product Scope** | 3 distinct tools, interactive mockup, lead generation flow |
| **Technical Architecture** | Scalable, stateless, clean separation, CORS-enabled |
| **Integration** | MCP protocol for Claude, adaptable to ChatGPT/Gemini APIs |
| **KPIs** | Tool usage, conversion rate, latency, match relevance |

---

## 🔄 Platform-Specific Notes

| Platform | Integration Approach |
|----------|----------------------|
| **Claude** | ✅ Native MCP support via Claude Desktop |
| **ChatGPT** | ⚠️ Requires Custom GPT Actions + OpenAPI spec |
| **Gemini** | ⚠️ Requires Function Calling API (different format) |

This demo uses **MCP protocol** (optimal for Claude). Adapting to ChatGPT/Gemini requires platform-specific implementations.

---

## 📈 Sample Input/Output

### Search Professionals
```
INPUT:  { "category": "plumbing", "zip_code": "10001" }
OUTPUT: { "success": true, "professionals": [
           { "id": "pro-001", "name": "Marcus Johnson",
             "rating": 4.9, "hourlyRate": "$95–$145/hr", ... }
         ]}
```

### Get Home Advice
```
INPUT:  { "question": "How do I fix a leaky faucet?" }
OUTPUT: { "success": true, "answer": "A dripping faucet is usually...",
          "estimatedCost": "$5–$200", "difficulty": "either" }
```

### Request Quote
```
INPUT:  { "professional_id": "pro-001", "service_needed": "Fix leak", ... }
OUTPUT: { "success": true, "leadId": "LEAD-LRC8H2D3",
          "message": "Quote request sent to Marcus Johnson!" }
```

---

## 🚀 Production Roadmap

1. Replace mock data with real Angi API calls
2. Add authentication & rate limiting
3. Implement logging, monitoring, error tracking
4. Build platform-specific adapters (ChatGPT, Gemini)
5. A/B test tool descriptions and response formats
6. Integrate with Angi CRM for lead tracking
7. Create feedback loop for continuous improvement

---

**Built for Case Study Exercise — Feb 2026**  
*Demonstrating MCP integration for Angi's home service platform*
