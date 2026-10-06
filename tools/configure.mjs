import {readFile,writeFile} from 'node:fs/promises';
const api=String(process.env.OPENCLSCOPE_DATABASE_API||'').trim().replace(/\/$/,'');
if(!/^https:\/\/[A-Za-z0-9.-]+(?::443)?$/.test(api))throw Error('Deploy requires a fixed HTTPS API origin in OPENCLSCOPE_DATABASE_API');
await writeFile('config.js',`window.OPENCLSCOPE_DATABASE_API = ${JSON.stringify(api)};\n`);
const source=await readFile('index.html','utf8');
const updated=source.replace("connect-src 'self' https:;",`connect-src 'self' ${api};`);
if(updated===source)throw Error('Expected Content Security Policy source declaration is absent');
await writeFile('index.html',updated);
