---
phase: quick-260630-v5i-server-package-json-engines-node-18-16-s
status: completed
files:
  - server/package.json
  - server/README.md
completed_at: 2026-06-30
---

# Quick Task 260630-v5i Summary

## Result

Updated backend runtime compatibility for the current CentOS 7 ECS transition deployment.

## Delivered

- Changed `server/package.json` `engines.node` from `>=18` to `>=16`.
- Updated `server/README.md` to document:
  - current ECS is CentOS 7 / `glibc 2.17`
  - NodeSource Node 20 RPM requires newer glibc and should not be forced
  - use Node.js `16.20.2` via `nvm` as the transition path
  - long-term recommendation: migrate backend to newer OS for Node 20+

## Verification

Passed:

```bash
grep -q '"node": ">=16"' server/package.json
grep -q 'Node.js 16.20.2 via nvm' server/README.md
grep -q 'glibc 2.17' server/README.md
```
