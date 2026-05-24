# Changelog

All notable changes to this project are documented in this file.

## [1.5.4] - 2026-05-24

### Fixed
- Fixed duplicate telephony config blocks after upgrade by purging legacy `; BEGIN {id}` / `; END {id}` marker regions outside the `AVR-MANAGED` section on trunk, phone, and number upsert/remove ([AVR-186](https://github.com/agentvoiceresponse/avr-app/issues/186)).
- Removed unused `manager.conf` write path from Asterisk provisioning; `manager.conf` remains seed/static AMI only (extensions and pjsip are managed at runtime).

## [1.5.3] - 2026-05-24

### Added
- Added backend provisioning consistency primitives and contract helpers to keep provider, trunk, phone, and number synchronization behavior aligned.
- Added backend unit and integration coverage for provisioning synchronization flows, webhook forwarding failure handling, and Asterisk service behavior.
- Added frontend VoiceOps cockpit modules, API error resolution helpers, and Vitest-based frontend test coverage.

### Changed
- Updated backend service logic for agents, providers, trunks, phones, numbers, webhooks, and Asterisk integration to support release lane governance and operational consistency.
- Updated protected frontend pages, app shell, API client/auth handling, and i18n dictionaries (`en` and `it`) for the new operational UX.
- Updated frontend toolchain metadata (`package.json` and lockfile) to include the new test and support modules shipped with this release.

### Fixed
- Fixed concurrent `runAgent` / `stopAgent` requests racing on agent lifecycle transitions by using optimistic status updates before Docker operations.

## [1.5.2] - 2026-05-10

### Changed
- Updated root, backend, and frontend README files to align with the current repository behavior.
- Clarified that backend and frontend are independent npm projects and documented correct local commands.
- Added backend operational notes for CORS, Docker socket access, strict DTO validation, admin seeding, and TypeORM `synchronize: true`.
- Added frontend runtime environment guidance for `next-runtime-env` and corrected stack/version references.
