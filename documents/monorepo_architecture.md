I have below requirement with all the provided details. Now I want to create HLP and LLP focused on AG Grid onboarding with all the architecture setup for other feature rich components to onboard. Now deep analyze the requirement and share the HLP and LLP different for each Monorepo and all the projects are inside the individual monorepo.

References to be deep analyzed
1. https://github.com/mkosir/frontend-monorepo-boilerplate/tree/main
2. https://github.com/medly/medly-components
3. https://turborepo.com/docs
4. https://www.ag-grid.com/react-data-grid/getting-started/
5. https://minimals.cc/components
6. React Iconify :- https://iconify.design/
7. https://mui.com/material-ui/all-components/


Monorepo Architecture

I have 3 different projects with Monorepo in each projects. I have Turborepo with Monorepo setup with each project. I am using below projects for 3 different reasons. Below are the 3 project names and there works.

- Establish a robust monorepo structure with Yarn v4, Node.js LTS version, and Turborepo.
- Streamline new project/package creation with Turborepo's generation tools.

1. @highradius/g4-ui-config :-
  This is a monorepo project build using Turborepo. This project is going to be configured or designed for all the config projects like below in a monorepo.
      - Typescript config
      - Eslint config
      - Prettier
      - MUI theme config
      - Storybook config
      - Husky
      - Lint Staged
      - Commitlint
      - Commitizen
      - all utilities

  This project is going to have all kind of configs like this and will be exported from this project so that it can be used in the other projects.
  Follow below link for more details. Consider all of the configs here how it's configured here.
  https://github.com/mkosir/frontend-monorepo-boilerplate/tree/main


2. @highradius/g4-core-ui :-
  This is a monorepo project build using Turborepo. This project is going to be build for React component library. such as below
      - Core components
          - Button
          - Input field
          - Tabs
          - etc
      - Typography
      - Colors
      - Icons
      - Layouts
      - Loaders
      - Markdown
      - Loaders
      - Utils
      - Grid
        - We are going to use AG Grid Commercial here

We are going to enhance the MUI components after applying the theme config from @highradius/g4-ui-config project to onboard all the core and dumb components here. Dumb component means all the styling is going to be applied here. No business logic is going to be part of this project. We have all the components now in a project called base_component and we are going to deprecate that slowly.

Follow below link for this and only consider how we design and apply styles here.
https://github.com/medly/medly-components

I am putting an example and best use case for this project.
I want to export AG Grid with all the required styling and theming that are going to match to highradius HiRa theme and will be applied here to the AG Grid Enterprise in this project and exported here with only having configuration to apply the styles.

3. @highradius/g4-aps-ui :-

    - This is a monorepo project build using Turborepo. This project is going to cover all business use cases and follow JSON config based rendering for each components.
    - These components are called as complex components, as they build on top of multiple components imported from @highradius/g4-core-ui.
    - The JSON config based rendering is called as DSL and the DSL is configured in database.
    - So all the components we will build here is going to be developed as feature component.
    - These components can have different variants like a simple button have Text, Outlined and Filled, here the component can have feature variants. Like in example the Grid will show Simple Grid or Row Expandable Grid or a Tree Data Grid on top of the configuration of DSL.
    - We will also have Redux Toolkit configuration pulled from @highradius/g4-ui-config and a provider will be exported here.
        - If the providers are exported and used the Feature component like Grid should store all the configuration like API data and User interaction changes like search and sort can be stored.
        - The caching will work with config, if they are enabled it will store them in the Page context with component sys name (sys name:- a unique id for the component)
        - As or page is Dynamic and getting rendered from DSL JSON the configuration design should support this
    - We also have all kind of Display and Edit renderers here in this project like
        - Display renderers
            - Text
            - Number
            - Date
            - Chip
            - etc
        - Edit renderers with all validations in form
            - Text
            - Number
            - Date
            - Chip
            - etc
    - The renderers can be used in multiple components like Grid and Form
    - Now we have all the renderers in ux_framework project and going further we need to deprecate them
    - After building feature based composit components here in the g4-aps-ui we are going to export them so that ux_framework and end products like R2R UI, Admin UI, AP ui and other projects can directly use them also they can use indirectly through ux_framework as ux_framework is responsible to dynamically render the pages with the JSON based DSL config in DB. So the feature components from g4-aps-ui can directly rendered in ux_framework with all the old configs to be parsed and supported to new architecture of g4-aps-ui.


