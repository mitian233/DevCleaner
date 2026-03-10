import { CacheTool, ToolStatus } from '../types'
import { exists } from '../utils/format'
import { commandExists } from '../utils/execute'
import { getDirectorySize } from '../utils/size'
import { NpmCleaner } from './npm'
import { YarnCleaner } from './yarn'
import { PnpmCleaner } from './pnpm'
import { PipCleaner } from './pip'
import { GradleCleaner } from './gradle'
import { MavenCleaner } from './maven'
import { CargoCleaner } from './cargo'
import { NugetCleaner } from './nuget'
import { GoCleaner } from './go'
import { SystemTempCleaner } from './system'
import { ScoopCleaner } from './scoop'
import { ChocolateyCleaner } from './chocolatey'
import { WingetCleaner } from './winget'

const ALL_TOOLS: CacheTool[] = [
  new NpmCleaner()['tool'],
  new YarnCleaner()['tool'],
  new PnpmCleaner()['tool'],
  new PipCleaner()['tool'],
  new GradleCleaner()['tool'],
  new MavenCleaner()['tool'],
  new CargoCleaner()['tool'],
  new NugetCleaner()['tool'],
  new GoCleaner()['tool'],
  new SystemTempCleaner()['tool'],
  new ScoopCleaner()['tool'],
  new ChocolateyCleaner()['tool'],
  new WingetCleaner()['tool'],
]

export async function detectAvailableTools(): Promise<ToolStatus[]> {
  const results: ToolStatus[] = []

  for (const tool of ALL_TOOLS) {
    const status: ToolStatus = {
      tool,
      isInstalled: false,
      cacheExists: false,
      hasCleanCommand: false,
    }

    status.cacheExists = await exists(tool.cachePath)

    if (status.cacheExists) {
      if (tool.cleanCommand) {
        const cmd = tool.cleanCommand.split(' ')[0]
        status.hasCleanCommand = await commandExists(cmd)
      }

      status.beforeSize = await getDirectorySize(tool.cachePath)
    }

    results.push(status)
  }

  return results.filter((r) => r.cacheExists && r.beforeSize && r.beforeSize > 0)
}
