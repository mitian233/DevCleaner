# DevCleaner User Guide

## Quick Start

### 1. Run the Program

```bash
# Development mode
pnpm dev

# Or run after building
pnpm build
node dist/index.js

# Or after global installation
pnpm link --global
devcleaner
```

### 2. Interactive Flow

After the program starts, it will automatically detect development tool caches in the system:

```
┌  DevCleaner - Development Tool Cache Cleaner
│
◐  Detecting development tool caches...
│
◇  Detection complete
```

### 3. Select Items to Clean

Use arrow keys to navigate, space to select, enter to confirm:

```
◆  Select caches to clean (Space to select, Enter to confirm)
│  ◻ npm Cache - 1.38 MB (Low Risk)
│  ◻ Yarn Cache - 256.45 MB (Low Risk)
│  ◻ pnpm Store - 1.4 GB (Low Risk)
│  ◻ pip Cache - 641.00 B (Low Risk)
│  ◻ Gradle Cache - 749.65 MB (Medium Risk)
│  ◻ Maven Repository - 2.3 GB (High Risk)
│  ◻ System Temp - 253.11 MB (Low Risk)
```

### 4. Risk Confirmation

If high-risk items (like Maven) are selected, there will be additional confirmation:

```
◇  High risk items detected: Maven Repository. Dependencies will need to be re-downloaded after cleaning. Continue?
│  ◻ Yes
│  ◻ No
```

### 5. Cleaning Confirmation

Display total size and confirm:

```
◇  About to clean 4.2 GB. Continue?
│  ◻ Yes
│  ◻ No
```

### 6. Execute Cleaning

Display cleaning progress in real-time:

```
◐  Cleaning npm Cache...
│
◇  npm Cache cleaned
│
◐  Cleaning pnpm Store...
│
◇  pnpm Store cleaned
```

### 7. Cleaning Report

Display detailed cleaning report:

```
Cleanup Report:
────────────────────────────────────────────────────────────
✓ npm Cache                1.38 MB
✓ Yarn Cache             256.45 MB
✓ pnpm Store               1.4 GB
✓ System Temp            253.11 MB
✗ Maven Repository          0.00 B
  Error: Insufficient permissions
────────────────────────────────────────────────────────────
Total Cleaned: 1.91 GB
```

## Supported Tools

### Package Managers (High priority, recommended to clean)

| Tool | Cache Path | Clean Command | Risk |
|------|-----------|--------------|------|
| npm | `%LOCALAPPDATA%\npm-cache` | `npm cache clean --force` | Low |
| Yarn | `%LOCALAPPDATA%\Yarn\Cache` | `yarn cache clean` | Low |
| pnpm | `%LOCALAPPDATA%\pnpm\store` | `pnpm store prune` | Low |

### Programming Languages

| Tool | Cache Path | Clean Command | Risk |
|------|-----------|--------------|------|
| pip | `%LOCALAPPDATA%\pip\Cache` | `pip cache purge` | Low |
| Gradle | `~/.gradle/caches` | Manual deletion | Medium |
| Maven | `~/.m2/repository` | Manual deletion | High |
| Cargo | `~/.cargo/registry` | `cargo cache -a` | Medium |
| NuGet | `~/.nuget/packages` | `dotnet nuget locals all --clear` | Medium |
| Go | `~/go/build` | `go clean -cache` | Low |

### System Cache

| Tool | Cache Path | Clean Command | Risk |
|------|-----------|--------------|------|
| System Temp | `%LOCALAPPDATA%\Temp` | Manual deletion | Low |

## Cleaning Strategy

### Priority 1: Use Tool's Built-in Commands

DevCleaner prioritizes using the tool's built-in cleaning commands, which is the safest approach:

```typescript
// For npm
await executeCommand('npm', ['cache', 'clean', '--force'])

// For pnpm
await executeCommand('pnpm', ['store', 'prune'])
```

### Priority 2: Safe Directory Deletion

If there's no built-in cleaning command, it will safely delete the cache directory:

```typescript
await fs.rm(cachePath, { recursive: true, force: true })
```

### Safety Checks

- ✅ Only cleans known cache directories
- ✅ Checks if directory exists before cleaning
- ✅ Extra confirmation required for high-risk operations
- ✅ Logs errors and continues cleaning other items on failure

## FAQ

### Q: Why is detection slow?
A: Initial scanning requires calculating directory sizes, especially for large caches (like pnpm store) which may take several seconds. Consider adding a caching mechanism in the future.

### Q: What if the project fails to build after cleaning?
A: In most cases, reinstalling dependencies will resolve the issue:
```bash
# Node.js project
rm -rf node_modules
pnpm install  # or npm install / yarn

# Python project
pip install -r requirements.txt

# Java project
gradle build --refresh-dependencies
# or
mvn clean install
```

### Q: Can Maven repository be recovered after cleaning?
A: Maven repository cannot be recovered after cleaning and requires re-downloading all dependencies. Recommendations:
1. Clean in a good network environment
2. Confirm the project can re-download dependencies before cleaning
3. Consider cleaning only specific project dependencies instead of the entire repository

### Q: Why are some tools not detected?
A: Possible reasons:
1. Tool is not installed
2. Cache directory doesn't exist
3. Cache directory is empty (size is 0)

### Q: Is cleaning System Temp safe?
A: Relatively safe, but recommended:
1. Close all running programs
2. Don't delete recently created files
3. Manually check the Temp directory if unsure

## Performance Optimization

### Fast Scanning for Large Directories

For large cache directories, DevCleaner uses optimization strategies:

```typescript
// Limit scan depth and file count
const maxDepth = 2
const maxFiles = 1000

// If limits are exceeded, estimate total size
```

### Sequential Cleaning

When cleaning multiple tools, execute sequentially to avoid resource conflicts.

## Development & Debugging

### View Detailed Logs

```bash
# Set environment variable
DEBUG=* node dist/index.js
```

### Test Specific Tool

```typescript
import { NpmCleaner } from './tools/npm'

const cleaner = new NpmCleaner()
await cleaner.clean()
```

### Calculate Directory Size Individually

```typescript
import { getDirectorySize, formatSize } from './utils/size'

const size = await getDirectorySize('/path/to/cache')
console.log(formatSize(size))
```

## Contributing

Contributions of new cleaners are welcome! Steps:

1. Create new cleaner file `src/tools/new-tool.ts`
2. Extend `BaseCleaner` class
3. Register in `src/tools/index.ts`
4. Add tests

## Changelog

### v1.0.0 (2024-03-10)
- Initial release
- Support for 10+ development tool cache cleaning
- Modern TUI interactive interface
- Smart detection and efficient cleaning
- Cleaning effectiveness statistics report
