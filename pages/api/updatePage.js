import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_SECRET
});

export default async function handler(req, res) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { pageId, properties, children } = req.body;

  try {
    const response = await notion.pages.update({
      page_id: pageId,
      properties: properties
    });

    if (children) {
      await notion.blocks.children.append({
        block_id: pageId,
        children: children
      });
    }

    return res.status(200).json({ success: true, result: response });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
