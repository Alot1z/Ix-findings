# Sidebar Regression Report

## Status

B-0 is structurally fixed.

## Verified cause

The root shell was sourced from planning/wiki/index.html. The deep-page generator in planning/pages/build-public.mjs contained a separate hardcoded sidebar with Graph sections and individual Issue/PR routes. This caused deep pages to render a simplified/different navigation shell.

## Repair

planning/pages/build-public.mjs now extracts the sidebar from planning/wiki/index.html, reuses the same markup for every generated shell, rewrites only depth-relative internal hrefs, and applies one route-derived high-level active key. Graph subsection routes remain physical pages but no longer appear in the primary sidebar.

## Evidence

- Root and representative deep pages contain the same eight navigation groups and 31 primary navigation items.
- /repositories/, /findings/, /evidence/, /commits/, /prs/, /issues/, /prs/393/, /prs/393/remap/, /issues/219/, /mcp/, /mcp/implementation/, and /mcp/implementation/stdio/ have no Graph sections or Issue # sidebar explosion.
- Active states resolve to repositories, findings, evidence, commits, prs, issues, or map according to route.
- node planning/pages/validate-public.mjs --skip-freshness passed.

## Limitation

A screenshot-based visual audit was unavailable in the SDK preview environment. The generated HTML, route structure, CSS reuse, and DOM-equivalent shell were validated instead.
