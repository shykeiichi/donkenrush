import path from 'path';
import { promises as fs } from 'fs';
import { Config } from './interfaces';

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

    try {
        await fs.writeFile(backupDirectory + `/orders-${date}.json`, JSON.stringify(await getOrders()));
    } catch {
        
    }
    await fs.writeFile(dataDirectory + '/orders.json', JSON.stringify(data));
}

export async function getConfig(): Promise<Config> {
    const jsonDirectory = path.join(process.cwd(), 'data');
    const fileContents = await fs.readFile(jsonDirectory + '/config.json', 'utf8');
    let parsed = {}
    try {
        parsed = JSON.parse(fileContents);
    } catch {
        parsed = {"err": "no"}
    }
    return new Promise(function(resolve, reject) {
        resolve(parsed as Config)
    });
}

export async function setConfig(data: Config) {
    const dataDirectory = path.join(process.cwd(), 'data');

    await fs.writeFile(dataDirectory + '/config.json', JSON.stringify(data));
}