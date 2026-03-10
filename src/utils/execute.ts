import { execa } from 'execa'

export async function commandExists(command: string): Promise<boolean> {
  try {
    if (process.platform === 'win32') {
      await execa('where', [command], { timeout: 5000 })
    } else {
      await execa('which', [command], { timeout: 5000 })
    }
    return true
  } catch {
    return false
  }
}

export async function executeCommand(command: string, args: string[] = []): Promise<void> {
  await execa(command, args, { 
    shell: true,
    timeout: 60000 
  })
}
