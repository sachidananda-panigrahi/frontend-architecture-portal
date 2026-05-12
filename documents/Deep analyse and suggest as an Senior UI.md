Deep analyse and suggest as an Senior UI Architect.
I have 3 monorepos at platform level.

We have below monorepos for Highradius Frontend Architecture.

1. highradius_ui_config (Configuration Hub Monorepo)
Can contain TypeScript Config, ESLint/Prettier Config, Tailwind CSS Config, etc

2. highradius_core_ui (Base or Atom Component Library Monorepo)
Can contain Button, Chip, Textfield, Dropdown, Avatar, Grid, Tree and other Components which will be taken from
untitled ui React Components and overwriten with HiRa Theme to maintain the Highradius branding.

highradius_aps_ui (Business/Featured/Composit Components)
Can contain the highradius_core_ui components and build end to end features components like Grid Data Table and other required components with all CRUD, RBAC, User Configurations with

• Zustand
• Renderer System
• State Management
• API Integration
• Cache Management

Record To Report (Next JS Project, non monorepo based standalone single project)

