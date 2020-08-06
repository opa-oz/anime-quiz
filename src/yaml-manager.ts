import YAML from 'yaml';
import path from 'path';
import fs from 'fs';

const BASE_PATH = '../resources/';

export function getResource<T>(filePath: string): T {
    const fullPath = path.join(__dirname, BASE_PATH, filePath)
    const file = fs.readFileSync(fullPath, 'utf8');

    return YAML.parse(file) as T;
}
