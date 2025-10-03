## Development Practices

- Use pnpm for installing etc. not npm

## Development Notes

- server is already running. you dont need to ask.

## SAFETY RULES - CRITICAL DATA PROTECTION

### File System Safety
- NEVER execute rm, rmdir, or destructive commands without explicit confirmation
- NEVER use rm -rf on any directory without triple confirmation and backup verification
- Always backup before file operations that modify multiple files
- Require explicit user confirmation for any operation that could cause data loss
- Block dangerous commands: rm -rf, truncate, dd, mv (when overwriting), cp (when overwriting)
- Use trash/recycle bin instead of permanent deletion when possible

### Git Safety Protocols
- NEVER force push to main/master branch without explicit confirmation
- Always verify branch context before destructive git operations
- Require confirmation for: git reset --hard, git clean -fd, git branch -D
- Create backup branches before major git operations
- Verify remote repository before pushing destructive changes

### Code Safety
- Always validate file paths before operations
- Check file existence before modification attempts
- Preserve original file permissions and ownership
- Never modify system files or directories outside project scope
- Require confirmation before bulk find/replace operations across multiple files

### Backup Requirements
- Create backup before operations affecting 3+ files
- Verify backup integrity before proceeding with destructive operations
- Maintain git commit history as primary backup mechanism
- Use git stash for temporary backups during experimental changes

### Confirmation Protocols
- Explicit user acknowledgment required for ALL destructive operations
- Must state specific risks and consequences before executing dangerous commands
- Provide safe alternatives whenever possible
- Allow user to abort any operation at any stage

### Scope Limitations
- Operations restricted to project directory: /Users/voodirameshkumar/kai/directory-template
- NEVER operate on parent directories or system locations
- Validate all paths are within project boundaries
- Reject operations targeting home directory, system directories, or other projects