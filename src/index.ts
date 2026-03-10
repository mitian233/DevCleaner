#!/usr/bin/env node
import * as p from '@clack/prompts'
import pc from 'picocolors'
import { detectAvailableTools } from './tools'
import { getDirectorySize, formatSize } from './utils/size'
import { ScanResult } from './types'
import { BaseCleaner } from './tools/base'
import { NpmCleaner } from './tools/npm'
import { YarnCleaner } from './tools/yarn'
import { PnpmCleaner } from './tools/pnpm'
import { PipCleaner } from './tools/pip'
import { GradleCleaner } from './tools/gradle'
import { MavenCleaner } from './tools/maven'
import { CargoCleaner } from './tools/cargo'
import { NugetCleaner } from './tools/nuget'
import { GoCleaner } from './tools/go'
import { SystemTempCleaner } from './tools/system'
import { CacheTool } from './types'

function createCleaner(tool: CacheTool): BaseCleaner {
  switch (tool.name) {
    case 'npm':
      return new NpmCleaner()
    case 'yarn':
      return new YarnCleaner()
    case 'pnpm':
      return new PnpmCleaner()
    case 'pip':
      return new PipCleaner()
    case 'gradle':
      return new GradleCleaner()
    case 'maven':
      return new MavenCleaner()
    case 'cargo':
      return new CargoCleaner()
    case 'nuget':
      return new NugetCleaner()
    case 'go':
      return new GoCleaner()
    case 'system-temp':
      return new SystemTempCleaner()
    default:
      throw new Error(`Unknown tool: ${tool.name}`)
  }
}

function displayReport(results: ScanResult[]): void {
  console.log('\n' + pc.bold('Cleanup Report:'))
  console.log(pc.gray('─'.repeat(60)))

  let totalCleaned = 0

  for (const result of results) {
    const status = result.cleaned ? pc.green('✓') : pc.red('✗')
    const size = formatSize(result.cleanedSize)

    console.log(`${status} ${result.tool.displayName.padEnd(20)} ${size.padStart(12)}`)

    if (result.cleaned) {
      totalCleaned += result.cleanedSize
    }

    if (result.error) {
      console.log(pc.red(`  Error: ${result.error}`))
    }
  }

  console.log(pc.gray('─'.repeat(60)))
  console.log(pc.green(pc.bold(`Total Cleaned: ${formatSize(totalCleaned)}`)))
  console.log()
}

async function main(): Promise<void> {
  p.intro(pc.bgCyan(pc.black(' DevCleaner - Development Tool Cache Cleaner ')))

  const s = p.spinner()
  s.start('Detecting development tool caches...')

  let tools
  try {
    tools = await detectAvailableTools()
  } catch (error: any) {
    s.stop('Detection failed')
    p.outro(pc.red(`Error: ${error.message}`))
    return
  }

  s.stop('Detection complete')

  if (tools.length === 0) {
    p.outro('No cache found to clean')
    return
  }

  const selected = await p.multiselect({
    message: 'Select caches to clean (Space to select, Enter to confirm)',
    options: tools.map((t) => ({
      value: t.tool.name,
      label: `${t.tool.displayName} - ${formatSize(t.beforeSize!)}`,
      hint:
        t.tool.riskLevel === 'high'
          ? '⚠️  High Risk'
          : t.tool.riskLevel === 'medium'
            ? '⚡ Medium Risk'
            : '✓ Low Risk',
    })),
    required: false,
  })

  if (p.isCancel(selected) || (selected as string[]).length === 0) {
    p.cancel('Cancelled')
    return
  }

  const highRisk = tools.filter(
    (t) => (selected as string[]).includes(t.tool.name) && t.tool.riskLevel === 'high'
  )

  if (highRisk.length > 0) {
    const confirmHigh = await p.confirm({
      message: `High risk items detected: ${highRisk.map((t) => t.tool.displayName).join(', ')}. Dependencies will need to be re-downloaded after cleaning. Continue?`,
      initialValue: false,
    })

    if (!confirmHigh || p.isCancel(confirmHigh)) {
      p.cancel('Cancelled')
      return
    }
  }

  const totalSize = tools
    .filter((t) => (selected as string[]).includes(t.tool.name))
    .reduce((sum, t) => sum + (t.beforeSize || 0), 0)

  const confirmClean = await p.confirm({
    message: `About to clean ${formatSize(totalSize)}. Continue?`,
    initialValue: true,
  })

  if (!confirmClean || p.isCancel(confirmClean)) {
    p.cancel('Cancelled')
    return
  }

  const cleanSpinner = p.spinner()
  const results: ScanResult[] = []

  for (const toolName of selected as string[]) {
    const toolStatus = tools.find((t) => t.tool.name === toolName)!
    cleanSpinner.start(`Cleaning ${toolStatus.tool.displayName}...`)

    try {
      const cleaner = createCleaner(toolStatus.tool)
      await cleaner.clean()

      const afterSize = await getDirectorySize(toolStatus.tool.cachePath)

      results.push({
        tool: toolStatus.tool,
        beforeSize: toolStatus.beforeSize!,
        afterSize,
        cleanedSize: toolStatus.beforeSize! - afterSize,
        cleaned: true,
      })

      cleanSpinner.stop(`${toolStatus.tool.displayName} cleaned`)
    } catch (error: any) {
      results.push({
        tool: toolStatus.tool,
        beforeSize: toolStatus.beforeSize!,
        afterSize: toolStatus.beforeSize!,
        cleanedSize: 0,
        error: error.message,
        cleaned: false,
      })

      cleanSpinner.stop(`${toolStatus.tool.displayName} cleaning failed`)
    }
  }

  displayReport(results)

  p.outro('Cleanup complete!')
}

main().catch((error) => {
  console.error(pc.red(`Error: ${error.message}`))
  process.exit(1)
})
