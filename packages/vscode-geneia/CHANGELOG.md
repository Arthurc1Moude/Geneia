# Changelog

## [1.0.0] - 2025-12-21

### Added
- Initial release
- Syntax highlighting for Geneia (.gn) files
- Code snippets for common patterns
- Run command to execute Geneia files
- Hover documentation for keywords
- Support for all Geneia keywords:
  - Control: `peat`, `repeat`, `turn`, `exit`, `func`, `check`
  - Storage: `str`, `hold`, `var`, `msg`
  - Builtins: `gmath`, `time`, `sys`
  - Math functions: `sqrt`, `abs`, `sin`, `cos`, `tan`, `floor`, `ceil`, `round`
  - String functions: `upper`, `lower`, `trim`, `rev`
  - Time functions: `now`, `unix`, `year`, `month`, `day`, `hour`
  - System functions: `os`, `arch`, `sleep`
- Support for flag syntax: `-u`, `--upper`, `-C`, `--convert`
- Support for module syntax: `.String.upper`, `.Time.now`, `.Math.sqrt`
- Support for time units: `t.s`, `t.ms`, `t.min`
