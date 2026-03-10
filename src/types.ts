export type RiskLevel = 'low' | 'medium' | 'high'

export interface CacheTool {
  name: string
  displayName: string
  category: 'package-manager' | 'language' | 'system' | 'ide'
  cachePath: string
  cleanCommand?: string
  fallbackAction?: 'delete' | 'skip'
  riskLevel: RiskLevel
  description: string
}

export interface ScanResult {
  tool: CacheTool
  beforeSize: number
  afterSize: number
  cleanedSize: number
  error?: string
  cleaned: boolean
}

export interface ToolStatus {
  tool: CacheTool
  isInstalled: boolean
  cacheExists: boolean
  hasCleanCommand: boolean
  beforeSize?: number
}
