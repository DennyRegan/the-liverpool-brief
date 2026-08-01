import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { BriefSchema } from "./types";
export function getBrief() {
    const filepath = path.join(process.cwd(), "content/briefs/liverpool", "current.md");
const fileContent = fs.readFileSync(filepath, "utf-8");
const { data } = matter (fileContent);
return BriefSchema.parse(data);
}
