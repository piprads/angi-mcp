#!/usr/bin/env node
/**
 * Angi MCP Server -- Prototype
 * ============================
 * MCP server exposing Angi to LLM clients via StreamableHTTP transport.
 * Deployed publicly on Railway.
 *
 * Tools:
 *   1. search_professionals  -- find home service pros by category + zip
 *   2. get_home_advice       -- answer common home improvement questions
 *   3. request_quote         -- simulate a quote / lead request
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import http from "http";
import { PROFESSIONALS, HOME_ADVICE, type Professional } from "./mockData.js";

// ---- Server Instantiation --------------------------------------------------

const server = new McpServer({
  name: "angi-mcp-server",
  version: "1.0.0",
});

// ---- Tool 1: search_professionals ------------------------------------------

server.registerTool(
  "search_professionals",
  {
    title: "Search Angi Professionals",
    description:
      "Search for verified home service professionals on Angi by service category and zip code. " +
      "Returns a ranked list of pros with ratings, availability, pricing, and contact info. " +
      "Use this when a homeowner wants to find, hire, or get a quote from a service professional.",
    inputSchema: {
      category: z
        .string()
        .describe(
          "Service category. Examples: plumbing, electrical, hvac, roofing, cleaning, remodeling"
        ),
      zip_code: z
        .string()
        .optional()
        .describe("5-digit US zip code for the homeowner's location."),
      availability: z
        .enum(["any", "available_now", "available_this_week"])
        .optional()
        .default("any")
        .describe("Filter by availability. Use 'available_now' for urgent needs."),
      max_results: z
        .number()
        .int()
        .min(1)
        .max(5)
        .optional()
        .default(3)
        .describe("Maximum number of results to return (1-5)."),
    },
    annotations: { readOnlyHint: true, openWorldHint: false },
  },
  async ({ category, zip_code, availability = "any", max_results = 3 }) => {
    const normalizedCategory = category.toLowerCase().trim();

    let results: Professional[] = PROFESSIONALS.filter((pro) => {
      const categoryMatch =
        pro.category.includes(normalizedCategory) ||
        pro.subCategories.some((s) => s.includes(normalizedCategory)) ||
        normalizedCategory.includes(pro.category);
      const zipMatch = !zip_code || pro.zipCodes.includes(zip_code);
      const availabilityMatch =
        availability === "any" ||
        pro.availability === availability;
      return categoryMatch && zipMatch && availabilityMatch;
    });

    results = results
      .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
      .slice(0, max_results);

    if (results.length === 0) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: false,
            message: `No professionals found for "${category}"${zip_code ? ` in zip ${zip_code}` : ""}. Try broadening your search.`,
            results: [],
          }),
        }],
      };
    }

    const formatted = results.map((pro) => ({
      id: pro.id,
      name: pro.name,
      businessName: pro.businessName,
      category: pro.category,
      rating: pro.rating,
      reviewCount: pro.reviewCount,
      yearsInBusiness: pro.yearsInBusiness,
      availability: pro.availability.replace(/_/g, " "),
      hourlyRate: pro.hourlyRate ?? "Contact for pricing",
      phone: pro.phone,
      bio: pro.bio,
      badges: pro.badges,
      angiProfileUrl: `https://www.angi.com/companylist/us/${pro.id}`,
    }));

    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: true,
          totalFound: results.length,
          searchedCategory: category,
          zipCode: zip_code ?? "all areas",
          professionals: formatted,
          ctaMessage: "Ready to get quotes? Use the request_quote tool to connect with any of these professionals.",
        }),
      }],
    };
  }
);

// ---- Tool 2: get_home_advice ------------------------------------------------

server.registerTool(
  "get_home_advice",
  {
    title: "Get Home Improvement Advice",
    description:
      "Answer homeowner questions about home improvement, repairs, maintenance, and renovation. " +
      "Provides expert advice including DIY guidance, cost estimates, and when to hire a professional. " +
      "Use for questions like 'how do I fix a leaky faucet', 'how much does a roof repair cost', etc.",
    inputSchema: {
      question: z
        .string()
        .describe("The homeowner's question about home improvement, repair, or renovation."),
    },
    annotations: { readOnlyHint: true, openWorldHint: false },
  },
  async ({ question }) => {
    const q = question.toLowerCase();

    let bestMatch = HOME_ADVICE.find((advice) =>
      advice.keywords.some((kw) => q.includes(kw))
    ) ?? HOME_ADVICE.find((advice) => q.includes(advice.topic));

    if (!bestMatch) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: false,
            question,
            answer:
              "I don't have specific guidance for that question right now. " +
              "Use search_professionals to find a local expert for a free estimate.",
            relatedCategories: [],
          }),
        }],
      };
    }

    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: true,
          question,
          topic: bestMatch.topic,
          answer: bestMatch.answer,
          estimatedCost: bestMatch.estimatedCost ?? "Varies -- get quotes",
          difficulty: bestMatch.difficulty,
          relatedCategories: bestMatch.relatedCategories,
          suggestedAction:
            bestMatch.difficulty === "hire_a_pro"
              ? `This is best left to a professional. Use search_professionals to find a verified ${bestMatch.relatedCategories[0]} pro near you.`
              : bestMatch.difficulty === "DIY"
              ? "This is a manageable DIY project. See guidance above."
              : "You can DIY this or hire a pro -- see guidance above.",
        }),
      }],
    };
  }
);

// ---- Tool 3: request_quote -------------------------------------------------

server.registerTool(
  "request_quote",
  {
    title: "Request a Quote from a Professional",
    description:
      "Submit a quote request to a specific Angi professional. Connects the homeowner with the pro " +
      "and initiates the lead/booking process. Requires the professional's ID from search_professionals.",
    inputSchema: {
      professional_id: z.string().describe("The professional's ID from search_professionals (e.g. 'pro-001')."),
      service_needed: z.string().describe("Brief description of the service or project needed."),
      homeowner_name: z.string().describe("The homeowner's first and last name."),
      homeowner_zip: z.string().describe("The homeowner's zip code."),
      preferred_timing: z
        .enum(["as_soon_as_possible", "within_a_week", "within_a_month", "just_getting_estimates"])
        .describe("How urgently the homeowner needs the service."),
      notes: z.string().optional().describe("Additional project details."),
    },
  },
  async ({ professional_id, service_needed, homeowner_name, homeowner_zip, preferred_timing, notes }) => {
    const pro = PROFESSIONALS.find((p) => p.id === professional_id);

    if (!pro) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: false,
            error: `Professional "${professional_id}" not found. Use search_professionals first.`,
          }),
        }],
      };
    }

    const leadId = `LEAD-${Date.now().toString(36).toUpperCase()}`;
    const estimatedResponseTime =
      pro.availability === "available_now" ? "within 1-2 hours" :
      pro.availability === "available_this_week" ? "within 24 hours" :
      "within 2-3 business days";

    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: true,
          leadId,
          message: `Your quote request has been sent to ${pro.name} at ${pro.businessName}!`,
          professional: {
            name: pro.name,
            businessName: pro.businessName,
            phone: pro.phone,
            rating: pro.rating,
            badges: pro.badges,
          },
          quoteDetails: {
            service: service_needed,
            homeownerName: homeowner_name,
            zip: homeowner_zip,
            timing: preferred_timing.replace(/_/g, " "),
            notes: notes ?? "None provided",
          },
          nextSteps: [
            `${pro.name} should respond ${estimatedResponseTime}.`,
            "You'll receive a confirmation email from Angi with your lead ID.",
            "Track this request at angi.com/my-projects.",
            "We recommend getting 2-3 quotes before deciding.",
          ],
          angiTrackingUrl: `https://www.angi.com/my-projects/${leadId}`,
        }),
      }],
    };
  }
);

// ---- HTTP Server (StreamableHTTP transport) --------------------------------

const PORT = parseInt(process.env.PORT ?? "3000", 10);

const httpServer = http.createServer(async (req, res) => {
  // Add CORS headers for browser access
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // Health check endpoint
  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", server: "angi-mcp", version: "1.0.0" }));
    return;
  }

  // MCP endpoint
  if (req.url === "/mcp" || req.url === "/") {
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined, // stateless mode
    });

    res.on("close", () => transport.close());

    try {
      await server.connect(transport);
      await transport.handleRequest(req, res, await readBody(req));
    } catch (err) {
      if (!res.headersSent) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: "Internal server error" }));
      }
    }
    return;
  }

  res.writeHead(404);
  res.end("Not found");
});

function readBody(req: http.IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

httpServer.listen(PORT, () => {
  console.log(`Angi MCP Server listening on port ${PORT}`);
  console.log(`MCP endpoint: http://localhost:${PORT}/mcp`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
