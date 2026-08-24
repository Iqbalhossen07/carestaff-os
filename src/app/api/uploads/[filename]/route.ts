import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest, { params }: { params: Promise<{ filename: string }> | { filename: string } }) {
  try {
    const resolvedParams = await params;
    const filename = resolvedParams.filename;
    // We store files in the root 'uploads' directory to avoid Next.js public folder caching issues
    const filePath = path.join(process.cwd(), "uploads", filename);

    if (!fs.existsSync(filePath)) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    
    // Determine content type based on extension
    const ext = path.extname(filename).toLowerCase();
    let contentType = "image/jpeg";
    if (ext === ".png") contentType = "image/png";
    if (ext === ".webp") contentType = "image/webp";
    if (ext === ".gif") contentType = "image/gif";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("Error serving file:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
