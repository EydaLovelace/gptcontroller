import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_SECRET
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { parentPageId, title, properties, children } = req.body;

  try {
    const response = await notion.pages.create({
      parent: { page_id: parentPageId },
      properties: properties || {
        title: [
          {
            text: { content: title || "Untitled" }
          }
        ]
      },
      children: children || []
    });

    return res.status(200).json({ success: true, result: response });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
