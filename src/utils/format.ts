import fs from 'fs/promises'

export async function exists(path: string): Promise<boolean> {
  try {
    await fs.access(path)
    return true
  } catch {
    return false
  }
}

export async function deleteDirectory(path: string): Promise<void> {
  await fs.rm(path, { recursive: true, force: true })
}

export async function ensureDirectoryExists(path: string): Promise<void> {
  try {
    await fs.mkdir(path, { recursive: true })
  } catch {
    // Directory may already exist
  }
}
