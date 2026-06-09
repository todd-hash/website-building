# Web Interface Guidelines Review Tool

This tool evaluates UI code against Web Interface Guidelines standards. It operates through a straightforward process:

**Core Workflow:**
The tool fetches current guidelines from a GitHub repository, analyzes specified files, and generates compliance reports. Users can request reviews by saying "review my UI," "check accessibility," or similar phrases.

**Key Details:**
- Guidelines source: `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`
- Output format: terse `file:line` notation for findings
- Creator: Vercel Labs (version 1.0.0)

**Implementation:**
When invoked, the tool retrieves fresh rules from the source URL via WebFetch, reads target files, applies all guidelines, and reports violations using the format specified in the fetched guidelines document.

**User Interaction:**
If no files are specified, the tool requests clarification about which files to review or what pattern to match before proceeding with the audit.
