# Angi MCP Server — Live Demo

A working Model Context Protocol (MCP) server demonstrating how Angi integrates with LLM platforms.

## 🎯 Quick Start

**🌐 Try the Live Demo:** https://piprads.github.io/angi-mcp/

**💬 ChatGPT Custom GPT:** [Setup Guide](./CHATGPT_SETUP.md) — Create your own AI assistant (requires ChatGPT Plus)

**📖 Full Documentation:** [DEMO.md](./DEMO.md) — Complete guide with sample inputs/outputs, architecture, and case study context

**🚀 MCP Server:** https://angi-mcp-production.up.railway.app

## 🛠️ Three MCP Tools

This demo implements three tools that address homeowner use cases:

1. **`search_professionals`** — Find verified Angi pros by category, zip code, and availability
2. **`get_home_advice`** — Answer home improvement questions with cost estimates and DIY guidance  
3. **`request_quote`** — Submit quote requests to professionals (lead generation)

---

## Deploy to Railway (10 minutes)

### Step 1 -- Push to GitHub

```bash
cd angi-mcp
git init
git add .
git commit -m "Initial Angi MCP server"
# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/angi-mcp.git
git push -u origin main
```

### Step 2 -- Deploy on Railway

1. Go to railway.app and sign in with GitHub
2. Click New Project -> Deploy from GitHub repo
3. Select your angi-mcp repo
4. Railway auto-detects the config and deploys (~2 minutes)
5. Go to Settings -> Networking -> Generate Domain
6. Your public URL: https://your-app.railway.app

### Step 3 -- Verify it's live

```bash
curl https://your-app.railway.app/health
# Should return: {"status":"ok","server":"angi-mcp","version":"1.0.0"}
```

---

## Connect to Claude.ai (easiest)

1. Go to Claude.ai -> Settings -> Integrations
2. Click Add Integration
3. Enter: https://your-app.railway.app/mcp
4. Name it "Angi"
5. Done -- Claude can now call your tools in any conversation

## Connect to Claude Desktop

Edit ~/Library/Application Support/Claude/claude_desktop_config.json:

```json
{
  "mcpServers": {
    "angi": {
      "url": "https://your-app.railway.app/mcp"
    }
  }
}
```

Restart Claude Desktop.

---

## Tools Available

- search_professionals: Find verified Angi pros by category + zip code
- get_home_advice: Answer home improvement questions with cost estimates  
- request_quote: Submit a quote request (the conversion/lead event)

---

## Demo Scenarios

Scenario A -- Emergency plumbing:
"My kitchen sink is clogged and backing up. I'm in zip 10002, I need someone today."
LLM calls: get_home_advice -> search_professionals -> request_quote

Scenario B -- Remodel planning:
"I want to remodel my bathroom. What should I expect to pay?"
LLM calls: get_home_advice -> search_professionals

Scenario C -- AC not working:
"My AC is blowing warm air. Can I fix this myself?"
LLM calls: get_home_advice -> search_professionals

---

## Project Structure

```
angi-mcp/
├── src/
│   ├── index.ts        # MCP server + 3 tools (StreamableHTTP transport)
│   └── mockData.ts     # Mock professionals + home advice Q&A
├── railway.toml        # Railway deploy config
├── package.json
├── tsconfig.json
└── README.md
```
