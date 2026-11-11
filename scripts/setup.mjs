#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs'
import process from 'node:process'

const line = (tag, message) => console.log(`[${tag}] ${message}`)
console.log('\nJARVIS preflight — OpenAI configuration\n---------------------------------------')
const major = Number(process.versions.node.split('.')[0])
line(major >= 20 ? ' ok ' : 'note', `Node.js ${process.versions.node} (${major >= 20 ? 'ready' : 'Node 20+ required'}).`)
let key = process.env.OPENAI_API_KEY?.trim()
if (!key && existsSync('.env.local')) {
  const envFile = readFileSync('.env.local', 'utf8')
  key = envFile.match(/^OPENAI_API_KEY\s*=\s*(.+)$/m)?.[1]?.trim().replace(/^['"]|['"]$/g, '')
}
line(key ? ' ok ' : 'note', key ? 'OPENAI_API_KEY found.' : 'OPENAI_API_KEY missing. Add it to .env.local or your shell environment.')
console.log('The OpenAI key is read by the local bridge only. Do not use a VITE_ prefix.')
console.log('\nStart JARVIS with: npm start')
console.log('Then open the local URL in Chrome, click INITIALISE, and say “Hey Jarvis”.')
console.log('Optional actions are disabled unless you explicitly enable JARVIS_ALLOW_WRITES=1.')
