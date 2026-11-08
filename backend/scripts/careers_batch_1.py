"""Career batch 1: Full Stack Developer, Mobile Developer, Game Developer."""

BATCH_1 = [
    # -------------------------------------------------------------
    # 2. Full Stack Developer
    # -------------------------------------------------------------
    {
        "slug": "full-stack-developer",
        "name": "Full Stack Developer",
        "category": "Software and AI",
        "short_description": "Build complete, end-to-end web applications combining interactive user interfaces, server-side APIs, and databases.",
        "responsibilities": [
            "Develop responsive frontend interfaces and bind them to server-side APIs",
            "Design relational data models and implement transactional database queries",
            "Build secure full-stack authentication, session handling, and authorization flows",
            "Leverage server-side rendering (SSR) frameworks for performant web delivery",
            "Write end-to-end automated tests and deploy containerized full-stack services"
        ],
        "representative_work": "A full-stack web application with user authentication, responsive UI components, REST/GraphQL API endpoints, database persistence, and automated end-to-end tests.",
        "core_skills": [
            "Full-stack web architecture",
            "Modern TypeScript and JavaScript",
            "Component-driven UI development",
            "Client-side state and data fetching",
            "Server-side API routes and middleware",
            "Relational data modeling and SQL",
            "Server-side rendering (SSR) and hydration",
            "End-to-end authentication with cookies and JWTs",
            "Automated testing with Playwright or Cypress",
            "Docker containerization and CI/CD pipelines"
        ],
        "milestones": [
            {
                "slug": "fullstack-architecture-and-workflow",
                "title": "Full-stack architecture and workflow",
                "summary": "Understand full-stack architectural layers, developer tooling, TypeScript foundations, and unified repository workflows.",
                "topics": [
                    {
                        "slug": "fullstack-architecture-layers",
                        "title": "Full-stack web architecture",
                        "overview": "Learn how client applications, server APIs, and database tiers interact to deliver full-stack user experiences.",
                        "subtopics": [
                            ("Multi-Tier Architecture", "The roles of browser clients, edge caches, application servers, and persistence layers."),
                            ("Data Flow Patterns", "How user interactions trigger network requests, server processing, and reactive UI updates.")
                        ],
                        "practice": "Diagram the complete data flow of a user submitting a comment form on a full-stack blog.",
                        "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works",
                        "resource_title": "How the Web Works | MDN"
                    },
                    {
                        "slug": "monorepos-and-project-structure",
                        "title": "Project directory structure and monorepos",
                        "overview": "Organize full-stack codebases using structured folders or workspaces that share TypeScript types between client and server.",
                        "subtopics": [
                            ("Shared Types", "Exporting shared interfaces and data schemas between frontend and backend code."),
                            ("Workspaces Management", "Using npm or pnpm workspaces to manage multi-package full-stack repositories.")
                        ],
                        "practice": "Set up a workspace repository with separate frontend and backend packages sharing a common types package.",
                        "url": "https://docs.npmjs.com/cli/v10/using-npm/workspaces",
                        "resource_title": "NPM Workspaces | npm Docs"
                    },
                    {
                        "slug": "typescript-foundations-fullstack",
                        "title": "Modern JavaScript and TypeScript foundations",
                        "overview": "Master static typing, interfaces, generics, and compiler configurations for robust full-stack development.",
                        "subtopics": [
                            ("Type Safety", "Defining types for API payloads, component props, and database entity models."),
                            ("Compiler Configuration", "Configuring tsconfig.json for strict type-checking across frontend and backend modules.")
                        ],
                        "practice": "Write strongly typed interfaces for an e-commerce catalog and use them in both client and server code.",
                        "url": "https://www.typescriptlang.org/docs/handbook/intro.html",
                        "resource_title": "The TypeScript Handbook | TypeScript Docs"
                    },
                    {
                        "slug": "fullstack-git-workflows",
                        "title": "Git branching and collaboration workflows",
                        "overview": "Apply feature-branch workflows, conventional commit messages, and automated pull-request validation checks.",
                        "subtopics": [
                            ("Conventional Commits", "Writing structured commit messages (feat, fix, refactor) that facilitate automated changelogs."),
                            ("Pull Request Validation", "Ensuring linting and automated type-checking run before merging pull requests.")
                        ],
                        "practice": "Create a pull request with conventional commits and configure a pre-commit hook that runs type checking.",
                        "url": "https://git-scm.com/book/en/v2/Git-Branching-Branching-Workflows",
                        "resource_title": "Git Branching Workflows | Pro Git Book"
                    }
                ]
            },
            {
                "slug": "frontend-ui-and-state",
                "title": "Responsive frontend interfaces and state",
                "summary": "Build responsive, accessible user interfaces, manage client state, and coordinate data fetching.",
                "topics": [
                    {
                        "slug": "component-driven-ui",
                        "title": "Component-driven UI architecture",
                        "overview": "Structure frontend applications with reusable, composable components and semantic HTML elements.",
                        "subtopics": [
                            ("Component Hierarchy", "Breaking complex views into small, focused presentational and container components."),
                            ("Props and Children", "Passing parameters, event handlers, and child elements to create flexible UI primitives.")
                        ],
                        "practice": "Build a responsive card component with customizable headers, action buttons, and accessible markup.",
                        "url": "https://react.dev/learn/your-first-component",
                        "resource_title": "Your First Component | React Docs"
                    },
                    {
                        "slug": "client-state-management",
                        "title": "Client-side state management",
                        "overview": "Manage local, lifted, and global client-side state reactively without causing unnecessary re-renders.",
                        "subtopics": [
                            ("Local vs Shared State", "Deciding when state belongs inside a single component vs shared across the page."),
                            ("Context and Stores", "Using React Context or lightweight state stores to pass global values like theme or auth state.")
                        ],
                        "practice": "Implement a shopping cart state store that adds items, removes items, and calculates the total price.",
                        "url": "https://react.dev/learn/managing-state",
                        "resource_title": "Managing State | React Docs"
                    },
                    {
                        "slug": "forms-validation-accessibility",
                        "title": "Forms, validation and accessibility",
                        "overview": "Build accessible form controls with client-side validation, error announcements, and focus management.",
                        "subtopics": [
                            ("Accessible Form Markup", "Associating form inputs with explicit label elements and aria-describedby error hints."),
                            ("Controlled Form Inputs", "Handling user input, validating fields on blur, and displaying clear feedback.")
                        ],
                        "practice": "Create an accessible registration form with client validation, inline error messages, and disabled submit states.",
                        "url": "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form",
                        "resource_title": "The HTML <form> element | MDN"
                    },
                    {
                        "slug": "data-fetching-and-query-cache",
                        "title": "Data fetching and query caching",
                        "overview": "Coordinate network requests, handle loading and error states, and cache server data with tools like TanStack Query.",
                        "subtopics": [
                            ("Server State vs Client State", "Understanding the lifecycle of remote server state, stale times, and refetching."),
                            ("Optimistic Updates", "Updating UI immediately upon user action before the server network request completes.")
                        ],
                        "practice": "Fetch a list of items using a query hook, display loading skeletons, and implement an optimistic delete action.",
                        "url": "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch",
                        "resource_title": "Using the Fetch API | MDN"
                    }
                ]
            },
            {
                "slug": "backend-apis-and-persistence",
                "title": "Backend APIs and data persistence",
                "summary": "Develop RESTful API routes, validate request payloads, and query relational databases with migrations.",
                "topics": [
                    {
                        "slug": "modular-api-routes",
                        "title": "Building modular API routes",
                        "overview": "Structure server endpoints cleanly with controllers, service layers, and predictable URL routing schemes.",
                        "subtopics": [
                            ("Controller Separation", "Separating HTTP request parsing from core business logic in dedicated service classes."),
                            ("Standardized Responses", "Returning consistent JSON envelopes with status codes, data payloads, and error objects.")
                        ],
                        "practice": "Refactor a monolithic route file into modular controller, service, and routing layers.",
                        "url": "https://expressjs.com/en/guide/routing.html",
                        "resource_title": "Express Routing Guide | Express"
                    },
                    {
                        "slug": "server-data-validation",
                        "title": "Server-side data validation",
                        "overview": "Protect the database from malformed or malicious data by enforcing strict input schemas on the server.",
                        "subtopics": [
                            ("Schema Validation Libraries", "Using Zod or similar libraries to parse request bodies against strict TypeScript schemas."),
                            ("Defense in Depth", "Why frontend validation alone is insufficient and how server validation protects data integrity.")
                        ],
                        "practice": "Write a validation schema that verifies email format, password complexity, and trims unwanted whitespace.",
                        "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/First_steps/Web_frameworks",
                        "resource_title": "Validating user input on the server | MDN"
                    },
                    {
                        "slug": "relational-modeling-queries",
                        "title": "Relational data modeling and queries",
                        "overview": "Model application data into normalized relational tables and query them efficiently using SQL or ORMs.",
                        "subtopics": [
                            ("Entities and Relationships", "Designing one-to-many and many-to-many relationships with foreign key constraints."),
                            ("Query Builders and ORMs", "Using SQL query builders or ORMs (e.g., Prisma, Drizzle) with type-safe schemas.")
                        ],
                        "practice": "Define a relational schema for articles, authors, and tags, and write a query fetching an article with its tags.",
                        "url": "https://www.postgresql.org/docs/current/tutorial-sql.html",
                        "resource_title": "The SQL Language | PostgreSQL Docs"
                    },
                    {
                        "slug": "auth-sessions-cookies",
                        "title": "Secure authentication and session cookies",
                        "overview": "Authenticate users securely and maintain logged-in sessions using HttpOnly cookies or bearer tokens.",
                        "subtopics": [
                            ("Session vs JWT", "Comparing server-side session stores with stateless JSON Web Tokens for full-stack apps."),
                            ("Cookie Security Flags", "Using HttpOnly, Secure, and SameSite flags to defend against XSS and CSRF token theft.")
                        ],
                        "practice": "Build a login flow that issues an HttpOnly cookie and a protected profile endpoint that reads session data.",
                        "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies",
                        "resource_title": "Using HTTP cookies | MDN"
                    }
                ]
            },
            {
                "slug": "frameworks-and-rendering",
                "title": "Full-stack frameworks and rendering modes",
                "summary": "Master modern full-stack frameworks (like Next.js or Remix), server-side rendering, server actions, and web performance.",
                "topics": [
                    {
                        "slug": "ssr-vs-csr-rendering",
                        "title": "Server-side rendering vs client-side rendering",
                        "overview": "Understand the trade-offs between static site generation (SSG), server-side rendering (SSR), and client-side rendering (CSR).",
                        "subtopics": [
                            ("Initial Page Load", "How server rendering sends complete HTML to browsers, accelerating First Contentful Paint."),
                            ("Hydration", "How browser JavaScript attaches event listeners to pre-rendered HTML DOM elements.")
                        ],
                        "practice": "Build a page that pre-renders dynamic content on the server and attaches interactive client components.",
                        "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side",
                        "resource_title": "Server-side website programming | MDN"
                    },
                    {
                        "slug": "server-actions-and-mutations",
                        "title": "Server actions and mutations",
                        "overview": "Execute server mutations directly from UI components without manually configuring boilerplate API endpoints.",
                        "subtopics": [
                            ("Server Function Execution", "Calling server functions securely from form submissions or client buttons."),
                            ("Revalidation", "Triggering automatic data re-fetching and page revalidation after server mutations.")
                        ],
                        "practice": "Implement a full-stack form using a server action that validates data, writes to the database, and revalidates the UI.",
                        "url": "https://react.dev/reference/rsc/server-actions",
                        "resource_title": "Server Actions | React Docs"
                    },
                    {
                        "slug": "dynamic-routing-layouts",
                        "title": "Dynamic routing and nested layouts",
                        "overview": "Build scalable full-stack page hierarchies with nested layouts, error boundaries, and dynamic route segments.",
                        "subtopics": [
                            ("File-Based Routing", "Mapping directory structures to URL paths and handling dynamic parameter segments like [id]."),
                            ("Nested Layouts", "Preserving state in common headers and sidebars while switching child route views.")
                        ],
                        "practice": "Create a nested dashboard layout with a persistent sidebar and dynamic user profile sub-pages.",
                        "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content",
                        "resource_title": "Structuring web content | MDN"
                    },
                    {
                        "slug": "seo-and-web-performance",
                        "title": "SEO and web performance optimization",
                        "overview": "Optimize Core Web Vitals, implement dynamic Open Graph metadata, and compress static assets for fast page loads.",
                        "subtopics": [
                            ("Core Web Vitals", "Measuring and optimizing Largest Contentful Paint (LCP), Interaction to Next Paint (INP), and CLS."),
                            ("Metadata and Open Graph", "Rendering search engine meta tags and social media card previews dynamically per page.")
                        ],
                        "practice": "Audit a full-stack page using Lighthouse and optimize image loading and fonts to achieve a 90+ performance score.",
                        "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Performance",
                        "resource_title": "Web Performance | MDN"
                    }
                ]
            },
            {
                "slug": "fullstack-storage-and-realtime",
                "title": "Full-stack integrations and storage",
                "summary": "Handle cloud file uploads, implement real-time communication, and coordinate third-party webhooks.",
                "topics": [
                    {
                        "slug": "cloud-file-uploads",
                        "title": "File storage and cloud uploads",
                        "overview": "Upload user files and images safely to cloud object storage using presigned URLs or server upload endpoints.",
                        "subtopics": [
                            ("Direct-to-Cloud Uploads", "Generating presigned URLs on the server so clients upload directly to object storage."),
                            ("Media Processing", "Resizing images and generating thumbnails before saving file metadata in the database.")
                        ],
                        "practice": "Build an image upload flow that validates file dimensions, uploads to storage, and displays the image preview.",
                        "url": "https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications",
                        "resource_title": "Using files from web applications | MDN"
                    },
                    {
                        "slug": "realtime-websockets-sse",
                        "title": "Real-time updates with WebSockets or SSE",
                        "overview": "Push real-time updates to connected clients using Server-Sent Events (SSE) or full-duplex WebSockets.",
                        "subtopics": [
                            ("SSE vs WebSockets", "Choosing unidirectional Server-Sent Events for live feeds vs WebSockets for two-way chat."),
                            ("Client Reconnection", "Handling network dropouts, reconnecting automatically, and restoring state.")
                        ],
                        "practice": "Build a live notification badge that increments in real time when an event occurs on the server.",
                        "url": "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events",
                        "resource_title": "Using server-sent events | MDN"
                    },
                    {
                        "slug": "email-notifications-webhooks",
                        "title": "Email notifications and webhooks",
                        "overview": "Send transactional emails (e.g. password resets, welcome messages) and process incoming third-party webhook events.",
                        "subtopics": [
                            ("Transactional Email APIs", "Connecting to email services like Resend or SendGrid with templated HTML layouts."),
                            ("Idempotent Webhooks", "Processing incoming events safely without performing duplicate actions on network retries.")
                        ],
                        "practice": "Create an endpoint that receives a mock payment webhook and updates an order record idempotently.",
                        "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200",
                        "resource_title": "HTTP Status 200 OK | MDN"
                    },
                    {
                        "slug": "transactional-mutations-consistency",
                        "title": "Transactional database mutations",
                        "overview": "Wrap multi-step database writes in ACID transactions to ensure system consistency during complex business workflows.",
                        "subtopics": [
                            ("Multi-Table Operations", "Creating related records across multiple tables in a single atomic database transaction."),
                            ("Rollback Handling", "Safely rolling back changes and cleaning up temporary state if any step fails.")
                        ],
                        "practice": "Implement a checkout mutation that decrements inventory, creates an order record, and logs an audit entry atomically.",
                        "url": "https://www.postgresql.org/docs/current/tutorial-transactions.html",
                        "resource_title": "Transactions | PostgreSQL Docs"
                    }
                ]
            },
            {
                "slug": "testing-containerization-delivery",
                "title": "Automated testing, containerization and delivery",
                "summary": "Write end-to-end tests with Playwright, containerize the full-stack app with Docker, and configure automated deployment.",
                "topics": [
                    {
                        "slug": "e2e-testing-playwright",
                        "title": "End-to-end testing with Playwright",
                        "overview": "Automate complete user journey testing across browsers, asserting on UI elements, network requests, and database changes.",
                        "subtopics": [
                            ("Browser Automation", "Scripting user clicks, form typing, navigation, and assertions on visible elements."),
                            ("Isolated Test Environments", "Running E2E tests against a dedicated test database seeded with fixture data.")
                        ],
                        "practice": "Write an E2E test suite that logs into an account, creates an item, and asserts it appears in the list view.",
                        "url": "https://playwright.dev/docs/intro",
                        "resource_title": "Getting started with Playwright | Playwright Docs"
                    },
                    {
                        "slug": "docker-multistage-fullstack",
                        "title": "Multi-stage Docker builds for full stack",
                        "overview": "Create optimized Docker container images that package both frontend assets and backend server runtimes securely.",
                        "subtopics": [
                            ("Build Stage Separation", "Building frontend bundles in a node build stage and copying only static assets to the final image."),
                            ("Non-Root Security", "Running the production container under an unprivileged user account.")
                        ],
                        "practice": "Write a multi-stage Dockerfile that compiles a frontend and runs the backend server in a slim container.",
                        "url": "https://docs.docker.com/build/building/multi-stage/",
                        "resource_title": "Multi-stage builds | Docker Docs"
                    },
                    {
                        "slug": "cicd-automation-pipelines",
                        "title": "CI/CD automation pipelines",
                        "overview": "Configure GitHub Actions or similar CI tools to run linting, tests, and automated container builds on every push.",
                        "subtopics": [
                            ("Automated Workflows", "Defining workflow YAML files that trigger on pull requests and branch merges."),
                            ("Deployment Gates", "Requiring passing test suites before allowing automated production deployments.")
                        ],
                        "practice": "Write a GitHub Actions workflow that installs dependencies, runs unit tests, and builds your application container.",
                        "url": "https://docs.github.com/en/actions/quickstart",
                        "resource_title": "Quickstart for GitHub Actions | GitHub Docs"
                    },
                    {
                        "slug": "fullstack-production-deployment",
                        "title": "Full-stack starter application deployment",
                        "overview": "Deploy your complete full-stack web application to a cloud host, verify HTTPS, and configure production monitoring.",
                        "subtopics": [
                            ("Production Checklist", "Verifying environment variables, database connections, SSL certificates, and CORS."),
                            ("Observability and Alerts", "Setting up uptime monitors and error alerting for production issues.")
                        ],
                        "practice": "Deploy your full-stack application, run a synthetic check against its health endpoint, and verify live operations.",
                        "url": "https://docs.docker.com/get-started/",
                        "resource_title": "Get started with Docker | Docker Docs"
                    }
                ]
            }
        ]
    },

    # -------------------------------------------------------------
    # 3. Mobile Developer
    # -------------------------------------------------------------
    {
        "slug": "mobile-developer",
        "name": "Mobile Developer",
        "category": "Software and AI",
        "short_description": "Build responsive, native or cross-platform mobile applications for iOS and Android devices.",
        "responsibilities": [
            "Design and build accessible, responsive mobile user interfaces",
            "Manage mobile application state, navigation, and offline data persistence",
            "Integrate device hardware APIs including camera, location, and biometrics",
            "Connect mobile apps to REST and GraphQL backend services with background sync",
            "Test, profile, and publish applications to the Apple App Store and Google Play"
        ],
        "representative_work": "A cross-platform mobile application featuring interactive UI screens, local SQLite offline storage, device camera integration, API data sync, and automated mobile tests.",
        "core_skills": [
            "Mobile platform architectures (iOS vs Android)",
            "Cross-platform toolchains (React Native / Flutter)",
            "Mobile layout styling and flexbox",
            "Touch gestures and navigation stacks",
            "Local storage and offline-first persistence",
            "REST and GraphQL API integration",
            "Push notifications and background workers",
            "Device hardware permissions (camera, location)",
            "Mobile performance profiling and memory analysis",
            "App signing and app store release management"
        ],
        "milestones": [
            {
                "slug": "mobile-foundations-setup",
                "title": "Mobile development platforms and setup",
                "summary": "Understand mobile platform differences, install development toolchains, and configure emulators and physical devices.",
                "topics": [
                    {
                        "slug": "mobile-platforms-architecture",
                        "title": "Mobile platforms and operating system differences",
                        "overview": "Understand the architectural foundations of iOS and Android, sandbox execution, and mobile app lifecycles.",
                        "subtopics": [
                            ("iOS vs Android Architecture", "Comparing Apple's Cocoa Touch and Google's Android application frameworks."),
                            ("Application Lifecycle", "Handling foreground, background, inactive, and terminated app states.")
                        ],
                        "practice": "Map the lifecycle states of a mobile app from initial launch to background suspension.",
                        "url": "https://developer.android.com/guide/components/activities/activity-lifecycle",
                        "resource_title": "The Activity Lifecycle | Android Developers"
                    },
                    {
                        "slug": "mobile-toolchains-ide-setup",
                        "title": "Mobile toolchains and IDE setup",
                        "overview": "Install and configure essential mobile development tools including Xcode, Android Studio, SDKs, and emulators.",
                        "subtopics": [
                            ("SDK and Command-Line Tools", "Configuring Android platform-tools, adb, and Xcode command-line tools."),
                            ("Simulator and Device Pairing", "Launching virtual device emulators and enabling USB debugging on physical devices.")
                        ],
                        "practice": "Launch a mobile simulator and verify that a starter project builds and renders on the screen.",
                        "url": "https://reactnative.dev/docs/set-up-your-environment",
                        "resource_title": "Setting up the development environment | React Native Docs"
                    },
                    {
                        "slug": "mobile-app-architecture",
                        "title": "Mobile app architecture and entry points",
                        "overview": "Explore the entry points, configuration manifests, and component hierarchies of mobile applications.",
                        "subtopics": [
                            ("Manifests and Plists", "Understanding AndroidManifest.xml and Info.plist for app permissions and metadata."),
                            ("Root Components", "How the application root initializes theme providers, navigation containers, and state stores.")
                        ],
                        "practice": "Inspect an app manifest and configure custom app display names, orientations, and bundle IDs.",
                        "url": "https://developer.android.com/guide/topics/manifest/manifest-intro",
                        "resource_title": "App Manifest Overview | Android Developers"
                    },
                    {
                        "slug": "mobile-project-assets",
                        "title": "Mobile project structure and assets",
                        "overview": "Manage mobile project assets including vector icons, multi-resolution images, splash screens, and custom fonts.",
                        "subtopics": [
                            ("Screen Densities", "Providing asset resolutions for @2x, @3x, mdpi, xhdpi, and xxhdpi display densities."),
                            ("App Icons and Splash Screens", "Configuring adaptive app icons and launch splash screens for iOS and Android.")
                        ],
                        "practice": "Add custom app icons and a launch screen to a mobile project and verify them on an emulator.",
                        "url": "https://reactnative.dev/docs/images",
                        "resource_title": "Images in Mobile Apps | React Native Docs"
                    }
                ]
            },
            {
                "slug": "mobile-layouts-and-navigation",
                "title": "Layouts, UI components and navigation",
                "summary": "Build fluid mobile screens using flexbox layouts, handle touch gestures, and implement screen navigation hierarchies.",
                "topics": [
                    {
                        "slug": "mobile-view-layouts-flexbox",
                        "title": "Mobile view layouts and flexbox",
                        "overview": "Create responsive mobile interfaces using flexbox column layouts, safe area insets, and scrollable containers.",
                        "subtopics": [
                            ("Safe Area Views", "Preventing UI overlap with device notches, home indicator bars, and status bars."),
                            ("Flexbox on Mobile", "Using flexDirection, alignItems, and justifyContent to build fluid screen layouts.")
                        ],
                        "practice": "Build a responsive mobile profile screen that respects safe areas across different device screen shapes.",
                        "url": "https://reactnative.dev/docs/flexbox",
                        "resource_title": "Layout with Flexbox | React Native Docs"
                    },
                    {
                        "slug": "touch-interactions-gestures",
                        "title": "Touch interactions and gesture handlers",
                        "overview": "Handle tap feedback, long presses, swipe gestures, and pinch-to-zoom using touchable controls and gesture recognizers.",
                        "subtopics": [
                            ("Touchable Feedback", "Providing visual touch feedback with opacity, highlight, and native ripple effects."),
                            ("Pan and Swipe Gestures", "Detecting drag coordinates, velocity, and swipe thresholds for interactive cards.")
                        ],
                        "practice": "Create a swipe-to-dismiss list item that animates off-screen when swiped past a threshold.",
                        "url": "https://reactnative.dev/docs/handling-touches",
                        "resource_title": "Handling Touches | React Native Docs"
                    },
                    {
                        "slug": "navigation-stacks-tabs-modals",
                        "title": "Navigation stacks, tabs and modals",
                        "overview": "Structure multi-screen mobile apps with native stack navigators, bottom tab bars, and presentation modals.",
                        "subtopics": [
                            ("Stack Navigation", "Pushing and popping screens on a navigation stack while passing route parameters."),
                            ("Tab and Drawer Bars", "Building persistent bottom tab bars and slide-out navigation drawers.")
                        ],
                        "practice": "Build a multi-screen app with a bottom tab bar containing Home, Search, and Settings stack navigators.",
                        "url": "https://reactnavigation.org/docs/getting-started",
                        "resource_title": "React Navigation Getting Started | React Navigation Docs"
                    },
                    {
                        "slug": "mobile-styling-dark-mode",
                        "title": "Platform styling and dark mode",
                        "overview": "Implement consistent mobile design systems that automatically adapt to system dark mode and platform conventions.",
                        "subtopics": [
                            ("Appearance API", "Detecting system light/dark mode changes and applying dynamic color palettes."),
                            ("Platform-Specific Styles", "Applying subtle styling differences between iOS Human Interface and Android Material Design.")
                        ],
                        "practice": "Implement a dynamic theme switcher that toggles light and dark modes based on system preferences.",
                        "url": "https://reactnative.dev/docs/appearance",
                        "resource_title": "Appearance and Color Scheme | React Native Docs"
                    }
                ]
            },
            {
                "slug": "mobile-state-and-local-data",
                "title": "State management and local data",
                "summary": "Manage screen and app-level state, persist data locally with SQLite/key-value storage, and manage device permissions.",
                "topics": [
                    {
                        "slug": "mobile-state-management",
                        "title": "Component and app-level state management",
                        "overview": "Manage UI state reactively across mobile screens using state hooks, context providers, or dedicated stores.",
                        "subtopics": [
                            ("Lifting State", "Sharing data between sibling screens without coupling components directly."),
                            ("Store Persistence", "Hydrating app state from disk upon launch so user settings remain intact.")
                        ],
                        "practice": "Build a bookmarking feature where toggling a bookmark updates state immediately across all screens.",
                        "url": "https://react.dev/learn/managing-state",
                        "resource_title": "Managing State | React Docs"
                    },
                    {
                        "slug": "local-keyvalue-sqlite-storage",
                        "title": "Local key-value and SQLite storage",
                        "overview": "Store user preferences, session tokens, and structured relational records on device flash storage.",
                        "subtopics": [
                            ("Async Key-Value Storage", "Using AsyncStorage or MMKV for fast, lightweight key-value retrieval."),
                            ("SQLite Databases", "Executing SQL queries against an embedded on-device SQLite database for complex data.")
                        ],
                        "practice": "Store a user's recent search queries in local storage and display them on app startup.",
                        "url": "https://developer.android.com/training/data-storage",
                        "resource_title": "Data and file storage overview | Android Developers"
                    },
                    {
                        "slug": "offline-first-data-persistence",
                        "title": "Offline-first data persistence",
                        "overview": "Design mobile apps that function seamlessly without an internet connection and sync changes when reconnected.",
                        "subtopics": [
                            ("Local Cache as Source of Truth", "Rendering cached local data immediately while initiating a background network fetch."),
                            ("Conflict Resolution", "Handling data updates made while offline using timestamps or version vectors.")
                        ],
                        "practice": "Build an offline notes list where users can create notes offline and see them saved locally.",
                        "url": "https://developer.android.com/topic/architecture/data-layer/offline-first",
                        "resource_title": "Build an offline-first app | Android Developers"
                    },
                    {
                        "slug": "device-permissions-sensors",
                        "title": "Managing device permissions and sensors",
                        "overview": "Request runtime user permissions gracefully for camera, microphone, photo library, and location services.",
                        "subtopics": [
                            ("Runtime Permission Flow", "Explaining why permissions are needed before prompting users with system dialogs."),
                            ("Handling Denials", "Gracefully handling user permission denials and guiding users to app system settings.")
                        ],
                        "practice": "Implement a permission request flow that checks camera permission and displays a fallback view if denied.",
                        "url": "https://developer.android.com/training/permissions/requesting",
                        "resource_title": "Request app permissions | Android Developers"
                    }
                ]
            },
            {
                "slug": "mobile-networking-and-services",
                "title": "Network requests and external services",
                "summary": "Connect mobile apps to backend APIs, handle network reachability, push notifications, and deep linking.",
                "topics": [
                    {
                        "slug": "mobile-api-integration",
                        "title": "Fetching and parsing REST and GraphQL APIs",
                        "overview": "Make secure network requests from mobile apps, parse JSON responses, and handle loading and error UI states.",
                        "subtopics": [
                            ("Network Clients", "Configuring fetch or Axios with authorization headers, timeouts, and interceptors."),
                            ("Pagination and Infinite Scroll", "Loading data in pages as the user scrolls down a list view.")
                        ],
                        "practice": "Build an infinite-scrolling feed that loads the next page of items when the user approaches the bottom.",
                        "url": "https://reactnative.dev/docs/network",
                        "resource_title": "Networking in React Native | React Native Docs"
                    },
                    {
                        "slug": "network-reachability-retry-queues",
                        "title": "Handling offline states and retry queues",
                        "overview": "Detect network reachability changes using NetInfo and queue outgoing mutation requests until online.",
                        "subtopics": [
                            ("Reachability Monitoring", "Subscribing to network status changes and alerting users when connectivity is lost."),
                            ("Request Retry Queues", "Storing pending mutation requests in local storage and replaying them on reconnect.")
                        ],
                        "practice": "Display an offline banner when network disconnects and automatically retry failed requests upon reconnection.",
                        "url": "https://developer.android.com/training/monitoring-device-state/connectivity-status-type",
                        "resource_title": "Monitor connectivity status | Android Developers"
                    },
                    {
                        "slug": "push-notifications-background",
                        "title": "Push notifications and background tasks",
                        "overview": "Configure remote push notifications with APNs and FCM, receive push payloads, and schedule background syncs.",
                        "subtopics": [
                            ("Push Token Registration", "Generating device push tokens and registering them with your backend server."),
                            ("Notification Payloads", "Handling foreground notifications, background taps, and action button interactions.")
                        ],
                        "practice": "Configure a local push notification that triggers after a 5-second countdown with a custom title and body.",
                        "url": "https://developer.apple.com/documentation/usernotifications",
                        "resource_title": "User Notifications | Apple Developer Documentation"
                    },
                    {
                        "slug": "deep-linking-and-url-schemes",
                        "title": "Deep linking and universal links",
                        "overview": "Configure custom URL schemes and universal/app links that open specific mobile screens directly from web URLs.",
                        "subtopics": [
                            ("Custom URL Schemes", "Registering custom protocols (e.g., myapp://profile/123) in app configuration."),
                            ("Universal and App Links", "Associating verified web domains with your mobile app for seamless web-to-app routing.")
                        ],
                        "practice": "Configure deep linking in your app so navigating to a custom URL navigates to a specific detail screen.",
                        "url": "https://reactnavigation.org/docs/deep-linking",
                        "resource_title": "Deep linking | React Navigation Docs"
                    }
                ]
            },
            {
                "slug": "mobile-hardware-performance",
                "title": "Device features, hardware and performance",
                "summary": "Access native camera and location hardware, optimize mobile memory and rendering, and ensure battery efficiency.",
                "topics": [
                    {
                        "slug": "camera-media-file-access",
                        "title": "Camera, media and photo library access",
                        "overview": "Capture photos and videos using the device camera and select existing media from the photo gallery.",
                        "subtopics": [
                            ("Camera Preview Views", "Rendering live camera previews and triggering photo capture programmatically."),
                            ("Image Picker Integration", "Launching the system image picker and compressing selected images before upload.")
                        ],
                        "practice": "Build a profile avatar uploader that allows users to snap a photo or pick an existing image from their library.",
                        "url": "https://developer.android.com/training/camera",
                        "resource_title": "Camera APIs | Android Developers"
                    },
                    {
                        "slug": "location-services-maps",
                        "title": "Location services and interactive maps",
                        "overview": "Access device GPS coordinates, monitor significant location changes, and render interactive native map views.",
                        "subtopics": [
                            ("Geolocation Coordinates", "Requesting current latitude and longitude with appropriate accuracy settings."),
                            ("Map Overlays and Pins", "Displaying interactive map views with custom location markers and callout cards.")
                        ],
                        "practice": "Get the device's current coordinates and display a map centered on the user's location with a marker.",
                        "url": "https://developer.android.com/training/location",
                        "resource_title": "Location and context | Android Developers"
                    },
                    {
                        "slug": "memory-rendering-optimization",
                        "title": "Memory management and rendering optimization",
                        "overview": "Identify memory leaks, optimize list rendering with windowing, and maintain a smooth 60fps refresh rate.",
                        "subtopics": [
                            ("Virtualized Lists", "Using FlatList or FlashList to render only visible screen items, recycling off-screen views."),
                            ("Profiling Frames", "Using the React DevTools and native profilers to detect slow renders and dropped frames.")
                        ],
                        "practice": "Optimize a list of 1,000 items with image thumbnails so scrolling remains smooth and memory usage stays low.",
                        "url": "https://reactnative.dev/docs/optimizing-flatlist-configuration",
                        "resource_title": "Optimizing FlatList Configuration | React Native Docs"
                    },
                    {
                        "slug": "battery-efficiency-background-limits",
                        "title": "Battery efficiency and background limitations",
                        "overview": "Design mobile apps that minimize battery drain by reducing background wakeups and batching network requests.",
                        "subtopics": [
                            ("Background Task Limits", "Understanding platform constraints on background execution in iOS and Android Doze mode."),
                            ("Power Optimization", "Stopping location tracking, animations, and active timers when the app moves to the background.")
                        ],
                        "practice": "Add app state listeners that pause active polling and animations whenever the app enters the background.",
                        "url": "https://developer.android.com/topic/performance/power",
                        "resource_title": "Optimize for battery life | Android Developers"
                    }
                ]
            },
            {
                "slug": "mobile-testing-and-publishing",
                "title": "Mobile testing, security and app store releases",
                "summary": "Write mobile unit and UI integration tests, implement biometric security, sign application bundles, and prepare store submissions.",
                "topics": [
                    {
                        "slug": "mobile-unit-ui-testing",
                        "title": "Unit and UI integration testing for mobile",
                        "overview": "Write automated unit tests for business logic and UI component tests that verify rendered screen elements.",
                        "subtopics": [
                            ("Component Testing", "Using React Native Testing Library to simulate user taps and assert on rendered text."),
                            ("Mocking Native Modules", "Mocking native platform APIs (camera, geolocation) during automated test execution.")
                        ],
                        "practice": "Write an automated test suite verifying that entering text and tapping submit renders the expected result view.",
                        "url": "https://reactnative.dev/docs/testing-overview",
                        "resource_title": "Testing Overview | React Native Docs"
                    },
                    {
                        "slug": "secure-storage-biometrics",
                        "title": "Secure storage and biometric authentication",
                        "overview": "Protect sensitive credentials with iOS Keychain and Android Keystore, and gate access with Face ID or fingerprint biometrics.",
                        "subtopics": [
                            ("Hardware Keystore", "Storing encryption keys and auth tokens in platform-secured hardware enclaves."),
                            ("Biometric Prompts", "Prompting users for Touch ID, Face ID, or fingerprint authentication before revealing data.")
                        ],
                        "practice": "Implement a biometric authentication check that prompts for Face ID/fingerprint before revealing private account data.",
                        "url": "https://developer.apple.com/documentation/localauthentication",
                        "resource_title": "Local Authentication | Apple Developer Documentation"
                    },
                    {
                        "slug": "app-signing-provisioning-bundles",
                        "title": "App signing, provisioning and bundle generation",
                        "overview": "Configure iOS signing certificates, provisioning profiles, Android keystores, and compile release APKs and AABs.",
                        "subtopics": [
                            ("Android Keystore Signing", "Generating release keystores and configuring Gradle signingConfigs for Android App Bundles."),
                            ("iOS Certificates and Profiles", "Managing Apple Developer certificates, App IDs, and provisioning profiles.")
                        ],
                        "practice": "Generate a release build bundle (AAB or IPA) configured with release signing credentials.",
                        "url": "https://reactnative.dev/docs/signed-apk-android",
                        "resource_title": "Publishing to Google Play Store | React Native Docs"
                    },
                    {
                        "slug": "store-deployment-guidelines",
                        "title": "App Store and Google Play deployment checklists",
                        "overview": "Prepare app store listings, screenshots, privacy policies, and navigate the review and submission processes.",
                        "subtopics": [
                            ("Store Guidelines", "Understanding Apple App Store Review Guidelines and Google Play Developer Policies."),
                            ("Beta Testing Distribution", "Distributing pre-release builds to testers using Apple TestFlight or Google Play Internal Testing.")
                        ],
                        "practice": "Complete an App Store submission readiness checklist covering privacy disclosures, assets, and beta distribution.",
                        "url": "https://developer.apple.com/app-store/review/guidelines/",
                        "resource_title": "App Store Review Guidelines | Apple Developer"
                    }
                ]
            }
        ]
    },

    # -------------------------------------------------------------
    # 4. Game Developer
    # -------------------------------------------------------------
    {
        "slug": "game-developer",
        "name": "Game Developer",
        "category": "Software and AI",
        "short_description": "Design and build 2D and 3D interactive video games using game engines, physics, audio, and gameplay programming.",
        "responsibilities": [
            "Program core gameplay loops, player movement controllers, and input handling",
            "Implement 2D and 3D physics collisions, triggers, and raycasting",
            "Build game state machines, inventory systems, and save/load persistence",
            "Integrate game sound effects, background music, and user interface HUDs",
            "Profile frame rates, optimize memory and draw calls, and export release builds"
        ],
        "representative_work": "A completed playable 2D/3D action or platformer game featuring player controls, enemy AI, collision physics, health/scoring UI, sound effects, and multi-level progression.",
        "core_skills": [
            "Game engine architecture and game loops",
            "2D sprites, tilesets, and camera viewports",
            "Rigidbodies, collision detection, and raycasting",
            "Player movement, gravity, and input systems",
            "Finite state machines for character behaviors",
            "Sprite animation controllers and blend trees",
            "Game audio: spatial sound effects and background music",
            "Canvas HUDs: health bars, menus, and inventory",
            "Game state saving, loading, and scene transitions",
            "Frame rate profiling and draw call optimization"
        ],
        "milestones": [
            {
                "slug": "game-development-foundations",
                "title": "Game development foundations",
                "summary": "Understand game engine architecture, the core game loop, coordinate spaces, and project structure.",
                "topics": [
                    {
                        "slug": "game-engine-and-loop",
                        "title": "Game engine architecture and the game loop",
                        "overview": "Learn how the game loop handles input, updates game state, and renders frames at consistent target frame rates.",
                        "subtopics": [
                            ("The Game Loop", "How initialization, input processing, physics step, state update, and rendering execute every frame."),
                            ("Delta Time", "Using delta time (time between frames) to ensure movement speed is independent of hardware frame rate.")
                        ],
                        "practice": "Implement a minimal game loop in code that logs frame duration and moves an object based on delta time.",
                        "url": "https://docs.godotengine.org/en/stable/getting_started/introduction/index.html",
                        "resource_title": "Introduction to Godot | Godot Engine Documentation"
                    },
                    {
                        "slug": "coordinates-transforms-vectors",
                        "title": "Coordinates, transforms and vectors",
                        "overview": "Master 2D and 3D coordinate systems, position transforms, vector arithmetic (addition, normalization, dot product).",
                        "subtopics": [
                            ("Vector Math for Games", "Calculating distance between objects, normalizing direction vectors, and calculating velocities."),
                            ("Local vs World Space", "Understanding parent-child transform hierarchies and rotating relative to world axes.")
                        ],
                        "practice": "Write a script that calculates the normalized direction vector and distance from an enemy to the player.",
                        "url": "https://docs.godotengine.org/en/stable/tutorials/math/vector_math.html",
                        "resource_title": "Vector math | Godot Engine Documentation"
                    },
                    {
                        "slug": "game-scripting-basics",
                        "title": "Game scripting basics",
                        "overview": "Write modular game scripts attached to scene objects that manage properties, respond to lifecycle events, and call methods.",
                        "subtopics": [
                            ("Object Lifecycle Hooks", "Using ready, start, update, and process methods to control when script logic runs."),
                            ("Component-Based Design", "Attaching modular scripts (health, movement, weapon) to game entities.")
                        ],
                        "practice": "Create a script with health and speed properties that logs a message when the entity takes damage.",
                        "url": "https://docs.godotengine.org/en/stable/tutorials/scripting/index.html",
                        "resource_title": "Scripting | Godot Engine Documentation"
                    },
                    {
                        "slug": "game-project-asset-pipelines",
                        "title": "Project structure and asset pipelines",
                        "overview": "Organize game assets (sprites, 3D models, textures, audio) and set up import settings and scene hierarchies.",
                        "subtopics": [
                            ("Asset Import Settings", "Configuring pixel-art filtering, compression, mipmaps, and collision meshes on import."),
                            ("Scene Composition", "Structuring reusable prefabs/scenes for players, enemies, items, and environment props.")
                        ],
                        "practice": "Organize a game project folder with scenes, scripts, and audio folders, and import a sprite sheet with correct filtering.",
                        "url": "https://docs.godotengine.org/en/stable/getting_started/step_by_step/nodes_and_scenes.html",
                        "resource_title": "Nodes and Scenes | Godot Engine Documentation"
                    }
                ]
            },
            {
                "slug": "gameplay-physics-controls",
                "title": "2D gameplay, physics and controls",
                "summary": "Build 2D levels with tilesets, implement responsive player controls, and handle physics collisions and triggers.",
                "topics": [
                    {
                        "slug": "2d-sprites-tiles-cameras",
                        "title": "2D sprites, tiles and cameras",
                        "overview": "Build game worlds using 2D tilemaps, configure sorting layers, and set up dynamic cameras that follow the player.",
                        "subtopics": [
                            ("Tilemaps and Autotiling", "Painting level terrain with tilemaps that automatically connect wall and corner tiles."),
                            ("Camera Follow and Deadzones", "Configuring 2D cameras with smooth damping, zoom limits, and deadzones.")
                        ],
                        "practice": "Create a 2D platformer level using a tilemap with solid ground tiles and a camera that smoothly tracks the player.",
                        "url": "https://docs.godotengine.org/en/stable/tutorials/2d/using_tilemaps.html",
                        "resource_title": "Using TileMaps | Godot Engine Documentation"
                    },
                    {
                        "slug": "rigidbodies-collisions-triggers",
                        "title": "Rigidbodies, collisions and triggers",
                        "overview": "Apply physical forces, gravity, bounce, and friction to objects, and detect solid collisions and non-blocking triggers.",
                        "subtopics": [
                            ("Dynamic vs Static Bodies", "Configuring movable physical bodies vs static environment walls and obstacles."),
                            ("Triggers and Area Detectors", "Detecting when an entity enters a coin pickup zone or hazard area without blocking movement.")
                        ],
                        "practice": "Configure a coin pickup that detects when the player enters its collision trigger and awards points.",
                        "url": "https://docs.godotengine.org/en/stable/tutorials/physics/physics_introduction.html",
                        "resource_title": "Physics introduction | Godot Engine Documentation"
                    },
                    {
                        "slug": "player-input-and-movement",
                        "title": "Player input handling and movement",
                        "overview": "Map keyboard, mouse, and gamepad inputs to smooth, responsive character movement and jump mechanics.",
                        "subtopics": [
                            ("Input Mapping", "Configuring cross-platform action names (e.g. 'jump', 'move_left') for keys and controller buttons."),
                            ("Responsive Movement Feel", "Adding coyote time, jump buffering, and acceleration curves to make movement feel satisfying.")
                        ],
                        "practice": "Build a 2D character controller with running, jumping with variable jump height, and wall sliding.",
                        "url": "https://docs.godotengine.org/en/stable/tutorials/inputs/inputevent.html",
                        "resource_title": "Using InputEvent | Godot Engine Documentation"
                    },
                    {
                        "slug": "spawning-pooling-lifecycles",
                        "title": "Spawning, pooling and object lifecycles",
                        "overview": "Spawn projectiles, enemies, and particles dynamically, and optimize performance using object pooling.",
                        "subtopics": [
                            ("Instantiating Scenes", "Spawning new bullet or enemy instances at specific world coordinates programmatically."),
                            ("Object Pooling", "Recycling inactive projectile instances instead of constantly allocating and garbage-collecting them.")
                        ],
                        "practice": "Create a weapon that fires projectiles at a target and reuses inactive projectiles from a pool.",
                        "url": "https://docs.godotengine.org/en/stable/tutorials/scripting/nodes_and_scene_instances.html",
                        "resource_title": "Nodes and scene instances | Godot Engine Documentation"
                    }
                ]
            },
            {
                "slug": "game-state-animation-audio",
                "title": "Game state, animation and audio",
                "summary": "Animate characters with state machines, synchronize sound effects, and manage game timers and scores.",
                "topics": [
                    {
                        "slug": "finite-state-machines",
                        "title": "Finite state machines for characters",
                        "overview": "Structure complex character behaviors cleanly using finite state machines (FSM) separating Idle, Walk, Jump, and Attack.",
                        "subtopics": [
                            ("State Machine Architecture", "Defining distinct state classes with enter, update, and exit lifecycle hooks."),
                            ("Transition Logic", "Switching states cleanly when conditions are met (e.g., falling velocity switches to Fall state).")
                        ],
                        "practice": "Build a state machine for an enemy with Patrol, Chase, and Attack states based on distance to player.",
                        "url": "https://docs.godotengine.org/en/stable/tutorials/best_practices/logic_programming.html",
                        "resource_title": "Logic and state architecture | Godot Engine Documentation"
                    },
                    {
                        "slug": "sprite-animation-transitions",
                        "title": "Sprite animation and transitions",
                        "overview": "Animate 2D sprites with frame-based animations, blend parameters, and link animation triggers to movement states.",
                        "subtopics": [
                            ("Animation Players", "Configuring keyframe animation tracks for sprite frames, positions, and collider shapes."),
                            ("Animation State Trees", "Blending between walk and run speeds and transitioning to jump animations on demand.")
                        ],
                        "practice": "Create an animated character sprite that switches between idle, running, jumping, and landing animations.",
                        "url": "https://docs.godotengine.org/en/stable/tutorials/2d/2d_sprite_animation.html",
                        "resource_title": "2D Sprite animation | Godot Engine Documentation"
                    },
                    {
                        "slug": "sound-effects-and-audio",
                        "title": "Sound effects, spatial audio and music",
                        "overview": "Integrate interactive audio including spatial 2D/3D sound effects, pitch variation, and looped background music.",
                        "subtopics": [
                            ("Audio Buses and Mixing", "Routing sound effects and music to separate audio buses for independent volume controls."),
                            ("Randomized Pitch Variation", "Subtly randomizing sound effect pitch on footsteps or gunfire to prevent repetitive audio.")
                        ],
                        "practice": "Add looped background music and trigger sound effects with slight pitch variations on jumping and item collection.",
                        "url": "https://docs.godotengine.org/en/stable/tutorials/audio/audio_buses.html",
                        "resource_title": "Audio buses | Godot Engine Documentation"
                    },
                    {
                        "slug": "game-timers-and-scoring",
                        "title": "Game timers, cooldowns and scoring",
                        "overview": "Implement game countdown timers, ability cooldowns, scoring systems, and combo multipliers.",
                        "subtopics": [
                            ("Timer Nodes and Clocks", "Using non-blocking timers to manage attack cooldowns, invincibility frames, and wave intervals."),
                            ("Scoring and Multipliers", "Incrementing player score on enemy defeat and decaying combo multipliers over time.")
                        ],
                        "practice": "Build an attack cooldown system where pressing the attack button triggers a 1.5-second cooldown timer before firing again.",
                        "url": "https://docs.godotengine.org/en/stable/tutorials/scripting/pausing_games.html",
                        "resource_title": "Pausing and timing | Godot Engine Documentation"
                    }
                ]
            },
            {
                "slug": "ui-inventory-progression",
                "title": "User interfaces and progression",
                "summary": "Design game HUDs, build inventory and dialogue systems, and manage scene transitions and save states.",
                "topics": [
                    {
                        "slug": "game-canvas-ui-huds",
                        "title": "Canvas UI: health bars, menus and HUDs",
                        "overview": "Build responsive in-game heads-up displays (HUD), health bars, ammo counters, and pause menus that scale across resolutions.",
                        "subtopics": [
                            ("Anchors and Containers", "Pinning UI elements to screen corners and centering modal menus on any aspect ratio."),
                            ("Data Binding to UI", "Updating health bar fill percentages and score text reactively when game events emit.")
                        ],
                        "practice": "Create an in-game HUD with an animated health bar, coin counter, and a pause menu that pauses game time.",
                        "url": "https://docs.godotengine.org/en/stable/tutorials/ui/gui_containers.html",
                        "resource_title": "GUI containers | Godot Engine Documentation"
                    },
                    {
                        "slug": "inventory-and-items",
                        "title": "Inventory and item systems",
                        "overview": "Build inventory grids, manage item data with scriptable data objects, and implement equipment or consumable logic.",
                        "subtopics": [
                            ("Item Data Resources", "Defining reusable item data definitions (name, description, icon, stat modifiers)."),
                            ("Inventory Grid UI", "Displaying collected items in inventory slots and handling item usage or drops.")
                        ],
                        "practice": "Create an inventory system where picking up potions adds them to a grid and clicking a potion restores player health.",
                        "url": "https://docs.godotengine.org/en/stable/tutorials/scripting/resources.html",
                        "resource_title": "Resources | Godot Engine Documentation"
                    },
                    {
                        "slug": "saving-and-loading-data",
                        "title": "Saving and loading game data",
                        "overview": "Persist player progression, high scores, and inventory state to local JSON or binary save files on disk.",
                        "subtopics": [
                            ("Serializing Game State", "Converting current player position, health, unlocked levels, and inventory to serializable dictionaries."),
                            ("Safe File I/O", "Writing save data to user application directories and validating integrity on load.")
                        ],
                        "practice": "Implement a Save Game and Load Game feature that saves the player's position and score and restores them on reboot.",
                        "url": "https://docs.godotengine.org/en/stable/tutorials/io/saving_games.html",
                        "resource_title": "Saving games | Godot Engine Documentation"
                    },
                    {
                        "slug": "scene-management-level-loading",
                        "title": "Scene management and level loading",
                        "overview": "Transition between start menus, cutscenes, and playable levels with smooth fade transitions and asynchronous loading.",
                        "subtopics": [
                            ("Changing Scenes", "Switching the active scene tree node between main menu, gameplay level, and game over screen."),
                            ("Asynchronous Loading", "Displaying a loading progress bar while large level assets load in the background.")
                        ],
                        "practice": "Build a level transition trigger that fades the screen to black, loads Level 2, and fades back in.",
                        "url": "https://docs.godotengine.org/en/stable/tutorials/scripting/change_scenes_manually.html",
                        "resource_title": "Change scenes manually | Godot Engine Documentation"
                    }
                ]
            },
            {
                "slug": "mechanics-ai-3d-intro",
                "title": "Game mechanics, AI and 3D foundations",
                "summary": "Program enemy navigation AI, add screen shake and particle effects, and explore basic 3D game concepts.",
                "topics": [
                    {
                        "slug": "enemy-navigation-ai",
                        "title": "Enemy navigation and basic AI",
                        "overview": "Implement enemy navigation using pathfinding algorithms (A* / NavigationMesh), line-of-sight raycasts, and patrol paths.",
                        "subtopics": [
                            ("Navigation Meshes", "Baking walkable navigation surfaces and querying paths around static obstacles."),
                            ("Line-of-Sight Raycasting", "Checking whether walls block an enemy's view of the player before initiating chase behavior.")
                        ],
                        "practice": "Bake a navigation mesh for a level and have an enemy follow a path directly toward the player while avoiding obstacles.",
                        "url": "https://docs.godotengine.org/en/stable/tutorials/navigation/navigation_introduction_2d.html",
                        "resource_title": "2D Navigation Overview | Godot Engine Documentation"
                    },
                    {
                        "slug": "particle-effects-juice",
                        "title": "Particle effects, screen shake and polish",
                        "overview": "Add visual juice to gameplay with explosive particle systems, screen shake on impacts, and dynamic lighting effects.",
                        "subtopics": [
                            ("Particle Emitters", "Configuring particle lifetimes, velocity curves, gravity, and color ramps for sparks, smoke, and dust."),
                            ("Game Juice", "Applying subtle camera shakes, freeze-frames on heavy hits, and squash-and-stretch on jumps.")
                        ],
                        "practice": "Create an explosion particle effect and trigger a brief camera shake when an enemy is defeated.",
                        "url": "https://docs.godotengine.org/en/stable/tutorials/2d/2d_particle_systems.html",
                        "resource_title": "2D Particle systems | Godot Engine Documentation"
                    },
                    {
                        "slug": "3d-meshes-and-materials",
                        "title": "Introduction to 3D meshes and materials",
                        "overview": "Understand 3D game pipelines: polygons, vertex normals, materials, PBR shaders, and UV texture mapping.",
                        "subtopics": [
                            ("3D Coordinate Space", "Navigating X, Y, and Z axes and understanding mesh topology (vertices, edges, faces)."),
                            ("PBR Materials", "Configuring albedo textures, roughness, metallic values, and normal maps on 3D surfaces.")
                        ],
                        "practice": "Import a 3D model into an engine scene, apply a PBR material with normal maps, and inspect lighting reflections.",
                        "url": "https://docs.godotengine.org/en/stable/tutorials/3d/standard_material_3d.html",
                        "resource_title": "Standard Material 3D | Godot Engine Documentation"
                    },
                    {
                        "slug": "3d-lighting-cameras-raycasting",
                        "title": "3D lighting, cameras and raycasting",
                        "overview": "Configure directional sunlight, point lights, shadow mapping, 3D perspective cameras, and 3D physics raycasting.",
                        "subtopics": [
                            ("3D Lighting and Shadows", "Configuring directional sun lights, ambient lighting, and real-time shadow cascades."),
                            ("3D Raycasting", "Casting rays from a 3D camera into the world to detect which object the player is aiming at.")
                        ],
                        "practice": "Set up a 3D scene with directional light and shadows, and cast a ray from the camera to detect aimed objects.",
                        "url": "https://docs.godotengine.org/en/stable/tutorials/3d/lights_and_shadows.html",
                        "resource_title": "Lights and shadows | Godot Engine Documentation"
                    }
                ]
            },
            {
                "slug": "optimization-playtesting-publishing",
                "title": "Optimization, playtesting and publishing",
                "summary": "Profile and optimize game frame rates, debug memory and physics, polish gameplay, and export release builds.",
                "topics": [
                    {
                        "slug": "frame-rate-optimization-draw-calls",
                        "title": "Frame rate optimization and draw calls",
                        "overview": "Diagnose frame rate dips, batch draw calls, optimize texture atlas sizes, and minimize CPU-GPU synchronization bottlenecks.",
                        "subtopics": [
                            ("Draw Call Batching", "Combining multiple sprites or meshes into single render batches to reduce draw calls."),
                            ("Engine Profiler", "Using engine profiler monitors to see whether CPU script time, physics, or GPU rendering causes lag.")
                        ],
                        "practice": "Open the engine profiler, analyze a scene with multiple objects, and optimize draw calls using a sprite atlas.",
                        "url": "https://docs.godotengine.org/en/stable/tutorials/performance/general_optimization.html",
                        "resource_title": "General optimization | Godot Engine Documentation"
                    },
                    {
                        "slug": "debugging-physics-memory-leaks",
                        "title": "Debugging game physics and memory leaks",
                        "overview": "Troubleshoot physics tunneling, erratic collisions, orphaned nodes in the scene tree, and memory leaks.",
                        "subtopics": [
                            ("Continuous Collision Detection (CCD)", "Preventing fast-moving projectiles from tunneling through thin walls."),
                            ("Orphaned Node Cleanup", "Ensuring scenes free dynamically spawned nodes when removed from the scene tree.")
                        ],
                        "practice": "Enable visual collision debugging, inspect physics shapes during runtime, and verify that destroyed objects are freed.",
                        "url": "https://docs.godotengine.org/en/stable/tutorials/physics/troubleshooting_physics_issues.html",
                        "resource_title": "Troubleshooting physics | Godot Engine Documentation"
                    },
                    {
                        "slug": "playtesting-difficulty-polish",
                        "title": "Playtesting, difficulty curves and polish",
                        "overview": "Conduct structured playtesting sessions, gather feedback on game feel and difficulty, and polish game balance.",
                        "subtopics": [
                            ("Observing Playtests", "Watching new players interact with game mechanics without giving verbal hints."),
                            ("Balancing Metrics", "Tuning enemy health, player jump speeds, and resource scarcity to maintain an engaging flow state.")
                        ],
                        "practice": "Have a peer test your game level, record where they get confused or frustrated, and make two targeted balance adjustments.",
                        "url": "https://docs.godotengine.org/en/stable/tutorials/best_practices/index.html",
                        "resource_title": "Best Practices | Godot Engine Documentation"
                    },
                    {
                        "slug": "exporting-releasing-games",
                        "title": "Exporting and building a playable game release",
                        "overview": "Configure release export templates, pack game assets, generate executable binaries (Windows, Linux, macOS, or Web), and distribute.",
                        "subtopics": [
                            ("Export Templates", "Downloading engine export templates and configuring target architectures and window flags."),
                            ("Publishing Builds", "Packaging release binaries and publishing a playable web build on platforms like itch.io.")
                        ],
                        "practice": "Export a playable release build of your game project for desktop or web and verify that it launches independently.",
                        "url": "https://docs.godotengine.org/en/stable/tutorials/export/exporting_projects.html",
                        "resource_title": "Exporting projects | Godot Engine Documentation"
                    }
                ]
            }
        ]
    }
]
