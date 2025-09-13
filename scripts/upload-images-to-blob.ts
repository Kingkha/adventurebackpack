import { put } from "@vercel/blob"
import { config } from "dotenv"
import fs from "fs/promises"
import path from "path"

// Load environment variables
config()

//const IMAGES_DIR = path.join(process.cwd(), "public", "images")
const IMAGES_DIR = "/home/hiepnt/mywork/scrapbot-article-creator/data/hacks"
const OUTPUT_FILE = path.join(process.cwd(), "blob-upload-results.json")

interface UploadResult {
  filename: string
  url: string
}

async function uploadImagesToBlobAndSaveResults() {
  try {
    // Read existing results from OUTPUT_FILE if it exists
    let existingResults: UploadResult[] = [];
    try {
      const data = await fs.readFile(OUTPUT_FILE, 'utf-8');
      existingResults = JSON.parse(data);
    } catch (error) {
      // If the file does not exist, we can ignore the error
      if (error.code !== 'ENOENT') {
        console.error("Error reading existing results:", error);
      }
    }

    // Create a set of existing filenames for quick lookup
    const existingFilenames = new Set(existingResults.map(result => result.filename));

    // Read all files in the images directory
    const files = await fs.readdir(IMAGES_DIR);
    const imageFiles = files.filter((file) => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));

    const uploadResults: UploadResult[] = [];

    for (const file of imageFiles) {
      // Skip uploading if the file is already in the OUTPUT_FILE
      if (existingFilenames.has(file)) {
        console.log(`Skipping ${file}, already uploaded.`);
        continue;
      }

      const filePath = path.join(IMAGES_DIR, file);
      const fileContent = await fs.readFile(filePath);

      try {
        // Upload file to Vercel Blob
        const blob = await put(`blog/${file}`, fileContent, {
          access: "public",
          token: process.env.BLOB_READ_WRITE_TOKEN,
        });

        uploadResults.push({
          filename: file,
          url: blob.url,
        });

        console.log(`Successfully uploaded ${file} to Vercel Blob`);
      } catch (error) {
        console.error(`Failed to upload ${file}:`, error);
      }
    }

    // Save results to JSON file
    await fs.writeFile(OUTPUT_FILE, JSON.stringify([...existingResults, ...uploadResults], null, 2));
    console.log(`Upload results saved to ${OUTPUT_FILE}`);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

uploadImagesToBlobAndSaveResults()

