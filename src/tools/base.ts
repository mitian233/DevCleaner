import { CacheTool } from '../types'
import { commandExists, executeCommand } from '../utils/execute'
import { deleteDirectory, exists } from '../utils/format'

export abstract class BaseCleaner {
  constructor(protected tool: CacheTool) {}

  async clean(): Promise<void> {
    if (!await exists(this.tool.cachePath)) {
      throw new Error(`Cache directory does not exist: ${this.tool.cachePath}`)
    }

    if (this.tool.cleanCommand) {
      const cmd = this.tool.cleanCommand.split(' ')[0]
      if (await commandExists(cmd)) {
        await this.executeCleanCommand()
        return
      }
    }

    if (this.tool.fallbackAction === 'delete') {
      await this.deleteCache()
      return
    }

    throw new Error(`${this.tool.name} has no available cleaning method`)
  }

  protected async executeCleanCommand(): Promise<void> {
    const [cmd, ...args] = this.tool.cleanCommand!.split(' ')
    await executeCommand(cmd, args)
  }

  protected async deleteCache(): Promise<void> {
    await deleteDirectory(this.tool.cachePath)
  }
}
