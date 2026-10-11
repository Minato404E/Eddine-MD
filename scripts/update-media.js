import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { installDownloader } from '../src/downloader.js';
try{await installDownloader(path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'));}
catch(e){console.error(e.message);process.exitCode=1;}
