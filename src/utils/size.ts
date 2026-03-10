import { execa } from 'execa'
import fs from 'fs/promises'

export async function getDirectorySize(dirPath: string): Promise<number> {
  try {
    if (process.platform === 'win32') {
      try {
        const { stdout } = await execa(
          'powershell',
          [
            '-Command',
            `"Get-ChildItem -Path '${dirPath}' -Recurse -Force -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum | Select-Object -ExpandProperty Sum"`,
          ],
          { timeout: 10000, reject: false }
        )
        const size = parseInt(stdout.trim())
        if (!isNaN(size) && size > 0) return size
      } catch {}

      try {
        const { stdout } = await execa('cmd', ['/c', `dir /s "${dirPath}" | find "File(s)"`], {
          timeout: 10000,
          reject: false,
        })
        const match = stdout.match(/(\d[\d\s,]+)\s+bytes/)
        if (match) {
          const bytes = parseInt(match[1].replace(/[\s,]/g, ''))
          if (!isNaN(bytes) && bytes > 0) return bytes
        }
      } catch {}

      return await fastDirectorySize(dirPath)
    }

    const { stdout } = await execa('du', ['-sb', dirPath], { timeout: 10000 })
    return parseInt(stdout.split('\t')[0]) || 0
  } catch {
    return 0
  }
}

async function fastDirectorySize(dirPath: string): Promise<number> {
  let totalSize = 0
  const maxDepth = 2
  const maxFiles = 1000
  let fileCount = 0

  async function scanDir(path: string, depth: number): Promise<void> {
    if (depth > maxDepth || fileCount >= maxFiles) return

    try {
      const entries = await fs.readdir(path, { withFileTypes: true })

      for (const entry of entries) {
        if (fileCount >= maxFiles) break

        const fullPath = `${path}/${entry.name}`

        try {
          if (entry.isDirectory()) {
            await scanDir(fullPath, depth + 1)
          } else if (entry.isFile()) {
            const stats = await fs.stat(fullPath)
            totalSize += stats.size
            fileCount++
          }
        } catch {}
      }
    } catch {}
  }

  await scanDir(dirPath, 0)
  return totalSize
}

export function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let size = bytes
  let unitIndex = 0
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  
  return `${size.toFixed(2)} ${units[unitIndex]}`
}
