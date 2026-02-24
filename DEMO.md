# Angi MCP Server - Live Demo Documentation

## 🔗 Quick Links

| Resource | URL | Description |
|----------|-----|-------------|
| **🌐 Live Demo** | [piprads.github.io/angi-mcp](https://piprads.github.io/angi-mcp/) | Interactive web interface to test all tools |
| **🚀 MCP Server** | [angi-mcp-production.up.railway.app](https://angi-mcp-production.up.railway.app) | Public MCP server endpoint |
| **📁 GitHub Repo** | [github.com/piprads/angi-mcp](https://github.com/piprads/angi-mcp) | Source code and documentation |
| **💚 Health Check** | [/health](https://angi-mcp-production.up.railway.app/health) | Server status endpoint |

---

## 📋 What Is This Demo?

This is a **working prototype** of a Model Context Protocol (MCP) server that demonstrates how Angi can integrate with Large Language Model (LLM) platforms like Claude, ChatGPT, and Google Gemini.

### Key Components

1. **MCP Server** - A TypeScript server implementing the MCP protocol, exposing three tools for home services
2. **REST API Wrapper** - Browser-friendly endpoints for the demo interface
3. **Interactive Demo** - A public web interface where anyone can test the integration
4. **Mock Data Layer** - Realistic sample data representing Angi professionals and advice

---

## 🎯 Use Cases Demonstrated

### 1. **Search for Home Service Professionals**
Homeowners can find verified professionals by service category and location.

**Example Input:**
```json
{
  "category": "plumbing",
  "zip_code": "10001",
  "availability": "available_now",
  "max_results": 3
}
```

**Example Output:**
```json
{
  "success": true,
  "totalFound": 1,
  "searchedCategory": "plumbing",
  "zipCode": "10001",
  "professionals": [
    {
      "id": "pro-001",
      "name": "Marcus Johnson",
      "businessName": "Johnson Plumbing & Drain",
      "category": "plumbing",
      "rating": 4.9,
      "reviewCount": 312,
      "yearsInBusiness": 14,
      "availability": "available now",
      "hourlyRate": "$95–$145/hr",
      "phone": "(212) 555-0192",
      "bio": "Licensed master plumber serving Manhattan for 14 years...",
      "badges": ["Angi Certified", "Background Checked", "Top Pro 2024"],
      "angiProfileUrl": "https://www.angi.com/companylist/us/pro-001"
    }
  ],
  "ctaMessage": "Ready to get quotes? Use request_quote to connect..."
}
```

### 2. **Get Home Improvement Advice**
Homeowners receive expert guidance on DIY vs. hiring professionals, with cost estimates.

**Example Input:**
```json
{
  "question": "How do I fix a leaky faucet?"
}
```

**Example Output:**
```json
{
  "success": true,
  "question": "How do I fix a leaky faucet?",
  "topic": "leaky faucet",
  "answer": "A dripping faucet is usually caused by a worn-out washer, O-ring, or cartridge. For a basic compression faucet, you can often DIY it: turn off the water supply under the sink, disassemble the handle, replace the washer or O-ring (~$5–$10 at a hardware store), and reassemble...",
  "estimatedCost": "$5–$200 (DIY to pro repair)",
  "difficulty": "either",
  "relatedCategories": ["plumbing"],
  "suggestedAction": "You can DIY this or hire a pro -- see guidance above."
}
```

### 3. **Request a Quote from a Professional**
Homeowners can submit quote requests, triggering lead generation.

**Example Input:**
```json
{
  "professional_id": "pro-001",
  "service_needed": "Fix kitchen sink leak",
  "homeowner_name": "John Doe",
  "homeowner_zip": "10001",
  "preferred_timing": "as_soon_as_possible",
  "notes": "Kitchen sink is leaking badly under the cabinet"
}
```

**Example Output:**
```json
{
  "success": true,
  "leadId": "LEAD-LRC8H2D3",
  "message": "Your quote request has been sent to Marcus Johnson at Johnson Plumbing & Drain!",
  "professional": {
    "name": "Marcus Johnson",
    "businessName": "Johnson Plumbing & Drain",
    "phone": "(212) 555-0192",
    "rating": 4.9,
    "badges": ["Angi Certified", "Background Checked", "Top Pro 2024"]
  },
  "quoteDetails": {
    "service": "Fix kitchen sink leak",
    "homeownerName": "John Doe",
    "zip": "10001",
    "timing": "as soon as possible",
    "notes": "Kitchen sink is leaking badly under the cabinet"
  },
  "nextSteps": [
    "Marcus Johnson should respond within 1-2 hours.",
    "You'll receive a confirmation email from Angi with your lead ID.",
    "Track this request at angi.com/my-projects.",
    "We recommend getting 2-3 quotes before deciding."
  ],
  "angiTrackingUrl": "https://www.angi.com/my-projects/LEAD-LRC8H2D3"
}
```

---

## 🗄️ Mock Data Overview

The demo uses realistic mock data to simulate a production environment:

### Mock Professionals (6 total)
- **Marcus Johnson** - Plumber (4.9★, 312 reviews, 14 years experience)
- **Elena Reyes** - Electrician (4.8★, 205 reviews, 9 years experience)
- **Tom Nguyen** - HVAC Technician (4.7★, 418 reviews, 18 years experience)
- **Sarah Kim** - Kitchen & Bath Remodeling (4.9★, 87 reviews, 6 years experience)
- **Derek Williams** - Roofing & Gutters (4.6★, 156 reviews, 22 years experience)
- **Priya Patel** - House Cleaning (4.8★, 529 reviews, 7 years experience)

### Mock Home Advice Topics (8 total)
- Leaky faucet repair
- Water heater replacement
- Circuit breaker troubleshooting
- AC not cooling
- Bathroom remodel costs
- Roof repair vs. replacement
- Drain unclogging
- Kitchen remodel costs

All professionals cover multiple NYC zip codes (10001-10033) and have varying availability levels.

---

## 🏗️ Technical Architecture

### Components

```
┌─────────────────────────────────────────────────────────────┐
│                        LLM Platforms                         │
│         (Claude Desktop, ChatGPT, Google Gemini)            │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ MCP Protocol
                      │ (JSON-RPC over HTTP)
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    MCP Server (Railway)                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  StreamableHTTP Transport (MCP Protocol Handler)       │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  REST API Endpoints (Browser Demo)                     │ │
│  │  - POST /api/search                                    │ │
│  │  - POST /api/advice                                    │ │
│  │  - POST /api/quote                                     │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Tool Implementation Layer                             │ │
│  │  - searchProfessionals()                               │ │
│  │  - getHomeAdvice()                                     │ │
│  │  - requestQuote()                                      │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Mock Data Layer                                       │ │
│  │  - PROFESSIONALS[]                                     │ │
│  │  - HOME_ADVICE[]                                       │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              Web Demo (GitHub Pages)                         │
│        https://piprads.github.io/angi-mcp/                  │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Language:** TypeScript
- **Runtime:** Node.js v24
- **MCP SDK:** @modelcontextprotocol/sdk ^1.12.0
- **Transport:** StreamableHTTP (MCP standard)
- **Deployment:** Railway (auto-deploy from GitHub)
- **Demo Frontend:** Pure HTML/CSS/JavaScript (GitHub Pages)

### API Endpoints

| Endpoint | Method | Purpose | Authentication |
|----------|--------|---------|----------------|
| `/mcp` | POST | MCP protocol (for Claude Desktop) | None (demo) |
| `/api/search` | POST | Search professionals (REST) | None (demo) |
| `/api/advice` | POST | Get home advice (REST) | None (demo) |
| `/api/quote` | POST | Request quote (REST) | None (demo) |
| `/health` | GET | Server health check | None |

---

## 🎬 How to Test the Demo

### Option 1: Web Interface (Easiest)
1. Visit **https://piprads.github.io/angi-mcp/**
2. Try the three tools with the sample data provided
3. View JSON responses in real-time

### Option 2: Claude Desktop (Full MCP Experience)
1. Download Claude Desktop from [claude.ai/download](https://claude.ai/download)
2. Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "angi": {
      "url": "https://angi-mcp-production.up.railway.app/mcp",
      "transport": "streamableHttp"
    }
  }
}
```
3. Restart Claude Desktop
4. Ask Claude: "Find me a plumber in zip code 10001"

### Option 3: Direct API Testing (Technical)
```bash
# Search for professionals
curl -X POST https://angi-mcp-production.up.railway.app/api/search \
  -H "Content-Type: application/json" \
  -d '{"category":"plumbing","zip_code":"10001"}'

# Get home advice
curl -X POST https://angi-mcp-production.up.railway.app/api/advice \
  -H "Content-Type: application/json" \
  -d '{"question":"How do I fix a leaky faucet?"}'

# Request a quote
curl -X POST https://angi-mcp-production.up.railway.app/api/quote \
  -H "Content-Type: application/json" \
  -d '{
    "professional_id":"pro-001",
    "service_needed":"Fix leaking pipe",
    "homeowner_name":"John Doe",
    "homeowner_zip":"10001",
    "preferred_timing":"as_soon_as_possible"
  }'
```

---

## 📊 Use Case Flow Examples

### Scenario A: Emergency Plumbing Need
**User:** "My kitchen sink is clogged and backing up. I'm in zip 10002, I need someone today."

**LLM Flow:**
1. Calls `get_home_advice` → Gets DIY tips + recommendation to hire a pro
2. Calls `search_professionals` → Finds available plumbers in 10002
3. Presents options to user
4. User selects → Calls `request_quote` → Lead generated

### Scenario B: Home Remodel Planning
**User:** "I want to remodel my bathroom. What should I expect to pay?"

**LLM Flow:**
1. Calls `get_home_advice` → Returns cost ranges ($1,500-$60,000+) and breakdown
2. User asks for pros → Calls `search_professionals` for remodeling category
3. Presents contractors with ratings and specialties

### Scenario C: AC Troubleshooting
**User:** "My AC is blowing warm air. Can I fix this myself?"

**LLM Flow:**
1. Calls `get_home_advice` → Returns DIY checklist (filter, thermostat, etc.)
2. If DIY doesn't work → Calls `search_professionals` for HVAC pros
3. User can request quote if needed

---

## 🎯 Case Study Context

This demo addresses the exercise requirements:

### ✅ Product Scope
- **3 distinct MCP tools** demonstrating the integration pattern
- **Interactive web mockup** showing homeowner experience
- **Lead generation flow** from question → advice → search → quote

### ✅ Technical Architecture
- **MCP Protocol** for LLM integration (Claude, ChatGPT, Gemini)
- **Scalable deployment** on Railway with auto-deploy from GitHub
- **Dual transport** support (MCP for LLMs, REST for browsers)
- **Clean separation** of concerns (transport → business logic → data)

### ✅ Integration Strategy
- **Stateless design** for scalability
- **RESTful API pattern** that can integrate with existing Angi systems
- **Mock data layer** simulating real Angi database/API responses
- **CORS-enabled** for web integration

### ✅ Data & Evaluation (KPIs)
This demo can track:
- Tool usage frequency (which tools are called most)
- Quote request conversion rate (search → advice → quote funnel)
- Response latency for each tool
- Professional match relevance (could add feedback loop)
- User satisfaction per interaction type

---

## 🔄 Platform Differences

### Claude (Anthropic)
- ✅ **Native MCP support** via Claude Desktop
- Full tool calling with function results
- StreamableHTTP transport works out of the box

### ChatGPT (OpenAI)
- ⚠️ **No native MCP support** (as of Feb 2026)
- Would require **Custom GPT Actions** with OpenAPI spec
- Need REST API + OpenAPI schema (different architecture)

### Google Gemini
- ⚠️ **Function Calling API** (not MCP)
- Would require **Gemini Extensions** framework
- Different tool definition format

**This demo uses MCP protocol, optimized for Claude.** Adapting to ChatGPT/Gemini would require platform-specific implementations.

---

## 🚀 Next Steps for Production

1. **Replace mock data** with real Angi API calls
2. **Add authentication** (API keys, OAuth)
3. **Implement rate limiting** and request validation
4. **Add logging/monitoring** (DataDog, Sentry)
5. **Create feedback loop** to improve tool responses
6. **Build platform-specific adapters** for ChatGPT and Gemini
7. **A/B test** different tool descriptions and response formats
8. **Integrate with Angi CRM** for lead tracking

---

## 📞 Questions?

This demo was built as part of a case study exercise to demonstrate MCP integration capabilities for Angi's home service platform.

**Repository:** https://github.com/piprads/angi-mcp  
**Live Demo:** https://piprads.github.io/angi-mcp/

---

*Built with TypeScript, MCP SDK, and deployed on Railway. Demo data is fictional but representative of production use cases.*
