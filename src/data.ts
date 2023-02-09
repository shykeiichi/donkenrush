import path from 'path';
import { promises as fs } from 'fs';

export async function getData() {
    const jsonDirectory = path.join(process.cwd(), 'data');
    const fileContents = await fs.readFile(jsonDirectory + '/menu.json', 'utf8');
    let parsed = {}
    try {
        parsed = JSON.parse(fileContents);
    } catch {
        parsed = {"err": "no"}
    }
    return parsed
}


export async function getOrders() {
    const jsonDirectory = path.join(process.cwd(), 'data');
    const fileContents = await fs.readFile(jsonDirectory + '/orders.json', 'utf8');
    let parsed = {}
    try {
        parsed = JSON.parse(fileContents);
    } catch {
        parsed = {"err": "no"}
    }
    return parsed
}

export async function setOrders(data: object) {
    let date = new Date().toUTCString().substring(5, new Date().toUTCString().length - 4).replaceAll(" ", "-");
  
    const dataDirectory = path.join(process.cwd(), 'data');
    const backupDirectory = path.join(process.cwd(), 'data', 'backup');
  
    await fs.writeFile(backupDirectory + `/orders-${date}.json`, JSON.stringify(await getOrders()));
    await fs.writeFile(dataDirectory + '/orders.json', JSON.stringify(data));
}