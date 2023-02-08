import path from 'path';
import { promises as fs } from 'fs';

export async function getData() {
  const jsonDirectory = path.join(process.cwd(), 'src');
  const fileContents = await fs.readFile(jsonDirectory + '/menu.json', 'utf8');
  let parsed = {}
  try {
    parsed = JSON.parse(fileContents);
  } catch {
    parsed = {"err": "no"}
  }
  return parsed
}