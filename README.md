# Cultural Fusion Concept Generator

A web application that supports combinational creativity in design by generating
structured fusion concepts from two cultural or visual traditions.

Built for: Introduction to Artificial Intelligence and Arts (11420CS560400), NTHU  
Student: 曾世賢 (112006274)

---

## What it does

The system accepts two cultural or visual sources, a design domain, and a mood.
It uses GPT-4o to extract visual features from each source and combine them into
a structured design concept, then generates three prompt directions. The user
can visualize any direction using gpt-image-1. All concepts are saved locally.

---

## Setup

### Prerequisites
- Node.js 18 or higher
- An OpenAI API key with access to GPT-4o and gpt-image-1

### Installation

1. Clone the repository and enter the project folder:
   ```
   cd cultural-fusion-generator
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file in the project root:
   ```
   OPENAI_API_KEY=your-openai-api-key-here
   ```

4. Create the data directory and initialize storage:
   ```
   mkdir data
   echo [] > data/concepts.json
   ```

5. Start the development server:
   ```
   npm run dev
   ```

6. Open `http://localhost:3002` in your browser
   (or whichever port Next.js assigns if 3002 is occupied)

---

## How to use

1. Enter Source A — a cultural or visual tradition (e.g. "Indonesian batik")
2. Enter Source B — a second tradition (e.g. "Cyberpunk neon signage")
3. Enter a Domain — where the concept will be applied (e.g. "Cafe interior")
4. Enter a Mood — optional emotional direction (e.g. "Calm but futuristic")
5. Click **Generate Concept**
6. Read the fusion concept and visual feature lists
7. Click **Generate Image** on any of the three prompt directions
8. View saved concepts at `/history`

---

## Architecture

- **Frontend:** Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **API routes:** Next.js server-side routes (no separate backend)
- **Concept generation:** OpenAI GPT-4o with structured JSON output
- **Image generation:** OpenAI gpt-image-1
- **Storage:** Local JSON file (`data/concepts.json`)

All OpenAI API calls are made server-side. The API key is never exposed
to the browser.

---

## Evaluation test cases

| Source A | Source B | Domain |
|---|---|---|
| Indonesian batik | Cyberpunk neon signage | Cafe interior |
| Taiwanese temple signage | Art Deco poster style | Poster design |
| Japanese woodblock print | Brutalist architecture | Building facade |

---

## Notes

- Generated image URLs may expire after approximately 1 hour. For demos,
  generate images shortly before presenting.
- The system prompt instructs GPT-4o to distinguish between the three
  prompt directions by focus: form/structure, color/atmosphere,
  and detail/ornamentation.
- Concepts are saved automatically when the result page loads.
  Images are saved when generated.
