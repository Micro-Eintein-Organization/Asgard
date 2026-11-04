"""Career curriculum specifications for 11 additional Asgard roadmaps."""

CAREERS_DATA = [
    # -------------------------------------------------------------
    # 1. Backend Developer
    # -------------------------------------------------------------
    {
        "slug": "backend-developer",
        "name": "Backend Developer",
        "category": "Software and AI",
        "short_description": "Build the server-side logic, databases, and APIs that power modern web and mobile applications.",
        "responsibilities": [
            "Design, build, and maintain robust server-side APIs",
            "Model relational and document data with appropriate constraints and indexing",
            "Implement secure authentication, session management, and authorization",
            "Integrate third-party services, background jobs, and caching mechanisms",
            "Write automated unit and integration tests for backend services"
        ],
        "representative_work": "A fully functional REST API with authentication, relational database storage, background processing, and comprehensive unit tests.",
        "core_skills": [
            "Client-server architecture and HTTP",
            "RESTful API design and status codes",
            "Asynchronous programming and event loops",
            "Relational database schemas and SQL queries",
            "Database migrations and transactions",
            "User authentication and password hashing",
            "JWT and session-based authorization",
            "In-memory caching with Redis",
            "API request validation and error handling",
            "Containerization with Docker"
        ],
        "milestones": [
            {
                "slug": "backend-fundamentals",
                "title": "Backend architecture and HTTP foundations",
                "summary": "Understand client-server architecture, HTTP protocol fundamentals, API conventions, and backend environment setup.",
                "topics": [
                    {
                        "slug": "client-server-and-http",
                        "title": "Client-server architecture and HTTP",
                        "overview": "Learn how web clients communicate with backend servers over HTTP using request methods, status codes, and headers.",
                        "subtopics": [
                            ("HTTP Request Lifecycle", "How DNS resolution, TCP handshakes, and HTTP requests flow from client to server."),
                            ("Methods and Headers", "The semantic purpose of GET, POST, PUT, PATCH, DELETE, and common request/response headers.")
                        ],
                        "practice": "Use curl or Postman to inspect headers and status codes of an existing public API endpoint.",
                        "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview",
                        "resource_title": "An overview of HTTP | MDN"
                    },
                    {
                        "slug": "restful-api-design",
                        "title": "RESTful API design principles",
                        "overview": "Understand how to design consistent, resource-oriented RESTful endpoints with appropriate status codes and payload structures.",
                        "subtopics": [
                            ("Resource Naming", "Using plural nouns, hierarchical paths, and query parameters for filtering and pagination."),
                            ("Standard Status Codes", "Appropriate use of 200, 201, 204, 400, 401, 403, 404, 409, and 500 status codes.")
                        ],
                        "practice": "Draft an API specification for a library catalog detailing endpoints, methods, and response schemas.",
                        "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/First_steps/Web_frameworks",
                        "resource_title": "Server-side web frameworks | MDN"
                    },
                    {
                        "slug": "server-environment-and-tooling",
                        "title": "Server environment and package management",
                        "overview": "Set up a server runtime environment, initialize package dependencies, and manage environment variables securely.",
                        "subtopics": [
                            ("Runtime Setup", "Configuring modern backend runtimes like Node.js, Python, or Go on your local development machine."),
                            ("Environment Configuration", "Using .env files and process environment variables to store configuration without committing secrets.")
                        ],
                        "practice": "Initialize a backend project repository with dependency manifests, a .gitignore file, and an environment loader.",
                        "url": "https://nodejs.org/en/learn/getting-started/introduction-to-nodejs",
                        "resource_title": "Introduction to Node.js | Node.js Guides"
                    },
                    {
                        "slug": "backend-version-control",
                        "title": "Version control for backend services",
                        "overview": "Apply Git branching strategies, clean commit conventions, and repository structure for backend microservices or monolithic APIs.",
                        "subtopics": [
                            ("Branching Strategies", "Using feature branches, pull requests, and semantic versioning for backend codebases."),
                            ("Ignoring Artifacts", "Ensuring build outputs, log files, node_modules, and virtualenvs are properly excluded from Git.")
                        ],
                        "practice": "Create a feature branch, make a modular API utility change, and submit a formatted pull request with documentation.",
                        "url": "https://git-scm.com/book/en/v2/Git-Branching-Branching-Workflows",
                        "resource_title": "Git Branching Workflows | Pro Git Book"
                    }
                ]
            },
            {
                "slug": "server-runtimes-and-routing",
                "title": "Server runtimes and API development",
                "summary": "Build modular server applications, handle request routing, implement middleware, and manage asynchronous I/O.",
                "topics": [
                    {
                        "slug": "async-programming-and-event-loop",
                        "title": "Asynchronous programming and event loops",
                        "overview": "Master non-blocking I/O, asynchronous execution, promises/async-await patterns, and concurrent request handling.",
                        "subtopics": [
                            ("Non-Blocking I/O", "How servers handle multiple concurrent I/O operations without freezing the execution thread."),
                            ("Promises and Async/Await", "Writing readable asynchronous code and avoiding unhandled promise rejections.")
                        ],
                        "practice": "Write an asynchronous script that fetches data concurrently from multiple endpoints using Promise.all or asyncio.gather.",
                        "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Async_JS/Introducing",
                        "resource_title": "Introducing asynchronous JavaScript | MDN"
                    },
                    {
                        "slug": "routing-and-middleware",
                        "title": "Routing and middleware architecture",
                        "overview": "Structure server endpoints with nested routers and chainable middleware for logging, authentication, and parsing.",
                        "subtopics": [
                            ("Request Routing", "Mapping HTTP methods and path parameters to controller handler functions."),
                            ("Middleware Pipeline", "Executing cross-cutting concerns like body parsing, request timing, and security headers before handlers.")
                        ],
                        "practice": "Build an HTTP server with a logging middleware that records the request method, path, and duration for every incoming call.",
                        "url": "https://expressjs.com/en/guide/using-middleware.html",
                        "resource_title": "Using Express middleware | Express Guides"
                    },
                    {
                        "slug": "request-validation-and-serialization",
                        "title": "Request validation and data serialization",
                        "overview": "Validate incoming JSON payloads against strict schemas, sanitize inputs, and serialize clean outgoing responses.",
                        "subtopics": [
                            ("Schema Validation", "Using libraries like Zod, Joi, or Pydantic to enforce data types, required fields, and constraints."),
                            ("Sanitization and Security", "Preventing injection attacks by trimming inputs, rejecting unrecognized properties, and enforcing limits.")
                        ],
                        "practice": "Create an API endpoint that validates a user registration request body and returns detailed 400 error messages for invalid fields.",
                        "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/First_steps/Web_frameworks",
                        "resource_title": "Working with web frameworks | MDN"
                    },
                    {
                        "slug": "error-handling-and-logging",
                        "title": "Error handling and structured logging",
                        "overview": "Implement centralized error handling to return uniform client responses while logging actionable error context internally.",
                        "subtopics": [
                            ("Centralized Error Handlers", "Catching synchronous and asynchronous runtime errors and mapping them to HTTP status responses."),
                            ("Structured Logging", "Emitting JSON-formatted log lines with timestamps, log levels, request IDs, and stack traces.")
                        ],
                        "practice": "Add a global error middleware that intercepts unhandled exceptions, hides internal stack traces from clients, and outputs JSON logs.",
                        "url": "https://expressjs.com/en/guide/error-handling.html",
                        "resource_title": "Error Handling in Express | Express Guides"
                    }
                ]
            },
            {
                "slug": "relational-databases-and-data-modeling",
                "title": "Relational databases and data modeling",
                "summary": "Design normalized database schemas, write expressive SQL queries, and manage transactional integrity.",
                "topics": [
                    {
                        "slug": "relational-schemas-and-constraints",
                        "title": "Relational schemas and constraints",
                        "overview": "Design normalized tables with primary keys, foreign keys, unique constraints, and referential integrity rules.",
                        "subtopics": [
                            ("Primary and Foreign Keys", "Establishing unique identities and linking parent-child records across tables."),
                            ("Integrity Constraints", "Using NOT NULL, CHECK, UNIQUE, and ON DELETE CASCADE rules to protect data consistency.")
                        ],
                        "practice": "Write a SQL schema file creating users, posts, and comments tables with appropriate relationships and constraints.",
                        "url": "https://www.postgresql.org/docs/current/ddl-constraints.html",
                        "resource_title": "Constraints | PostgreSQL Documentation"
                    },
                    {
                        "slug": "sql-queries-and-aggregations",
                        "title": "SQL queries and aggregations",
                        "overview": "Retrieve, filter, sort, join, and aggregate relational data efficiently using standard SQL queries.",
                        "subtopics": [
                            ("Joins and Filtering", "Combining data with INNER, LEFT, and RIGHT joins, WHERE clauses, and LIKE pattern matching."),
                            ("Grouping and Aggregation", "Using GROUP BY, HAVING, COUNT, SUM, and AVG to compute analytical summary metrics.")
                        ],
                        "practice": "Write complex SQL queries that join three related tables and compute summary totals grouped by category.",
                        "url": "https://www.postgresql.org/docs/current/tutorial-select.html",
                        "resource_title": "Querying a Table | PostgreSQL Documentation"
                    },
                    {
                        "slug": "database-migrations-and-transactions",
                        "title": "Database migrations and transactions",
                        "overview": "Version database changes over time with reversible migrations and wrap multi-step mutations in ACID transactions.",
                        "subtopics": [
                            ("Migration Tooling", "Writing sequential UP and DOWN migration files that track schema evolution safely across environments."),
                            ("ACID Transactions", "Using BEGIN, COMMIT, and ROLLBACK to guarantee atomicity and consistency during multi-table writes.")
                        ],
                        "practice": "Write a database migration that adds a new table and execute a simulated bank transfer within a SQL transaction.",
                        "url": "https://www.postgresql.org/docs/current/tutorial-transactions.html",
                        "resource_title": "Transactions | PostgreSQL Documentation"
                    },
                    {
                        "slug": "connection-pooling-and-indexing",
                        "title": "Connection pooling and query indexing",
                        "overview": "Optimize database interaction by pooling server connections and adding B-tree indexes on frequently queried columns.",
                        "subtopics": [
                            ("Connection Pooling", "Managing a reusable pool of database client connections to minimize connection overhead under load."),
                            ("Index Optimization", "Using EXPLAIN ANALYZE to identify sequential scans and adding indexes on foreign keys and search fields.")
                        ],
                        "practice": "Run an EXPLAIN query plan on an unindexed table, add an index, and compare the execution time and scan method.",
                        "url": "https://www.postgresql.org/docs/current/indexes-intro.html",
                        "resource_title": "Introduction to Indexes | PostgreSQL Documentation"
                    }
                ]
            },
            {
                "slug": "authentication-and-security",
                "title": "Authentication and application security",
                "summary": "Protect application resources with password hashing, secure token generation, role checks, and standard security headers.",
                "topics": [
                    {
                        "slug": "password-hashing-and-storage",
                        "title": "User authentication and password hashing",
                        "overview": "Securely register and authenticate users by hashing passwords with adaptive algorithms like Argon2 or bcrypt.",
                        "subtopics": [
                            ("Salted Password Hashing", "Why plaintext and fast hashes (MD5, SHA256) are insecure, and how work factors resist brute force."),
                            ("Authentication Workflow", "Verifying credentials during login and returning authenticated session identifiers.")
                        ],
                        "practice": "Implement a user registration and login handler that hashes passwords with bcrypt before database insertion.",
                        "url": "https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html",
                        "resource_title": "Password Storage Cheat Sheet | OWASP"
                    },
                    {
                        "slug": "jwt-and-session-tokens",
                        "title": "JWT and session tokens",
                        "overview": "Issue, verify, and expire JSON Web Tokens (JWT) or server-stored session cookies for authenticated requests.",
                        "subtopics": [
                            ("Token Structure", "Understanding the header, payload, and cryptographic signature of standard JWTs."),
                            ("Token Storage and Expiry", "Best practices for token expiration, refresh tokens, and HttpOnly Secure cookies.")
                        ],
                        "practice": "Build an authentication middleware that validates Bearer JWT tokens in the Authorization header and attaches the user payload.",
                        "url": "https://jwt.io/introduction",
                        "resource_title": "Introduction to JSON Web Tokens | JWT.io"
                    },
                    {
                        "slug": "role-based-access-control",
                        "title": "Role-based access control (RBAC)",
                        "overview": "Authorize access to sensitive endpoints based on user roles and granular permissions.",
                        "subtopics": [
                            ("Roles and Permissions", "Structuring user records with roles (e.g., admin, editor, member) and permission matrices."),
                            ("Authorization Guards", "Creating reusable route guards that reject unauthorized requests with HTTP 403 Forbidden.")
                        ],
                        "practice": "Create an admin-only endpoint guarded by a role verification middleware that blocks non-admin users.",
                        "url": "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html",
                        "resource_title": "Authorization Cheat Sheet | OWASP"
                    },
                    {
                        "slug": "api-security-headers-and-cors",
                        "title": "Security headers and CORS configuration",
                        "overview": "Harden backend servers against common web attacks with Cross-Origin Resource Sharing (CORS) rules and security headers.",
                        "subtopics": [
                            ("CORS Policies", "Configuring allowed origins, methods, and credentials for cross-origin browser requests."),
                            ("Defensive Headers", "Using Helmet or custom middleware to set Content-Security-Policy, HSTS, and X-Content-Type-Options.")
                        ],
                        "practice": "Configure strict CORS settings that allow only an authorized frontend domain while rejecting arbitrary origins.",
                        "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS",
                        "resource_title": "Cross-Origin Resource Sharing (CORS) | MDN"
                    }
                ]
            },
            {
                "slug": "caching-and-integrations",
                "title": "Caching, background tasks and integrations",
                "summary": "Accelerate server responses with caching, offload long-running operations to task queues, and communicate with external services.",
                "topics": [
                    {
                        "slug": "in-memory-caching-redis",
                        "title": "In-memory caching with Redis",
                        "overview": "Reduce database load and latency by caching expensive query results in an in-memory key-value store with time-to-live (TTL).",
                        "subtopics": [
                            ("Cache Aside Pattern", "Checking the cache before database queries and writing back on cache misses."),
                            ("Expiration and Invalidation", "Setting TTLs and invalidating cached keys when underlying data is updated.")
                        ],
                        "practice": "Implement a caching layer around an expensive API endpoint with a 60-second TTL.",
                        "url": "https://redis.io/docs/latest/develop/get-started/",
                        "resource_title": "Get started with Redis | Redis Documentation"
                    },
                    {
                        "slug": "background-jobs-and-queues",
                        "title": "Background jobs and task queues",
                        "overview": "Offload slow or asynchronous operations (such as sending emails or processing images) to background worker queues.",
                        "subtopics": [
                            ("Producer-Consumer Architecture", "Enqueuing tasks from HTTP requests and processing them in isolated background workers."),
                            ("Retries and Dead-Letter Queues", "Handling transient network errors and safely parking permanently failing jobs.")
                        ],
                        "practice": "Create a queue worker that processes a background job simulation with retries and status logging.",
                        "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/First_steps/Web_frameworks",
                        "resource_title": "Server-side background architecture | MDN"
                    },
                    {
                        "slug": "external-apis-and-webhooks",
                        "title": "Consuming external APIs and webhooks",
                        "overview": "Integrate third-party HTTP services reliably using resilient HTTP clients and process incoming webhook events securely.",
                        "subtopics": [
                            ("HTTP Client Resilience", "Configuring timeouts, exponential backoff retries, and circuit breakers for external calls."),
                            ("Webhook Verification", "Validating cryptographic HMAC signatures on incoming webhook payloads before processing.")
                        ],
                        "practice": "Write an endpoint that receives an incoming webhook, validates its signature header, and logs the verified event.",
                        "url": "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch",
                        "resource_title": "Using the Fetch API | MDN"
                    },
                    {
                        "slug": "file-uploads-and-storage",
                        "title": "Data serialization and file uploads",
                        "overview": "Handle multipart/form-data requests, validate file types and sizes, and store uploads in cloud storage or local disk.",
                        "subtopics": [
                            ("Multipart Form Handling", "Streaming file uploads safely without consuming excessive server memory."),
                            ("File Validation", "Verifying MIME types, file size limits, and sanitizing filenames before saving.")
                        ],
                        "practice": "Create a file upload endpoint that accepts image files up to 5MB, validates their format, and saves them with a unique ID.",
                        "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types",
                        "resource_title": "MIME types | MDN"
                    }
                ]
            },
            {
                "slug": "testing-and-deployment",
                "title": "Testing, containerization and deployment",
                "summary": "Write automated API tests, containerize the service with Docker, and deploy a production-ready backend service.",
                "topics": [
                    {
                        "slug": "api-unit-and-integration-testing",
                        "title": "Unit and integration testing for APIs",
                        "overview": "Write automated test suites using frameworks like Jest, Pytest, or Supertest to verify endpoint responses and business logic.",
                        "subtopics": [
                            ("Unit vs Integration Tests", "Testing pure functions in isolation vs testing endpoints with an ephemeral database."),
                            ("Mocking External Dependencies", "Mocking third-party API clients and database calls during test execution.")
                        ],
                        "practice": "Write an automated test suite verifying status codes, response bodies, and error cases for your user endpoints.",
                        "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Testing",
                        "resource_title": "Testing web applications | MDN"
                    },
                    {
                        "slug": "docker-containerization-backend",
                        "title": "Containerizing backend services with Docker",
                        "overview": "Package backend code, runtime dependencies, and configuration into consistent, portable Docker container images.",
                        "subtopics": [
                            ("Dockerfile Directives", "Using FROM, WORKDIR, COPY, RUN, CMD, and non-root users for secure, reproducible builds."),
                            ("Multi-Stage Builds", "Minimizing production image size by separating compilation tools from runtime images.")
                        ],
                        "practice": "Write a multi-stage Dockerfile that builds and runs your backend application in a slim Linux container.",
                        "url": "https://docs.docker.com/get-started/docker-concepts/building-images/writing-a-dockerfile/",
                        "resource_title": "Writing a Dockerfile | Docker Docs"
                    },
                    {
                        "slug": "secrets-and-config-management",
                        "title": "Production configuration and secrets",
                        "overview": "Manage production environment variables, database credentials, and API keys securely without hardcoding secrets.",
                        "subtopics": [
                            ("Twelve-Factor Config", "Strictly separating code from configuration using environment variables across stages."),
                            ("Secrets Auditing", "Using scanners to prevent accidental commit of API keys or database connection strings to Git.")
                        ],
                        "practice": "Audit a project repository to verify zero committed credentials and document required variables in an example file.",
                        "url": "https://12factor.net/config",
                        "resource_title": "Config: Store config in the environment | The Twelve-Factor App"
                    },
                    {
                        "slug": "backend-deployment-and-monitoring",
                        "title": "Deploying and monitoring a REST API",
                        "overview": "Deploy your containerized backend API to a cloud host, configure health-check endpoints, and monitor runtime metrics.",
                        "subtopics": [
                            ("Health Checks", "Implementing /health and /ready endpoints that verify database connectivity and process liveness."),
                            ("Runtime Monitoring", "Tracking server uptime, response latency, and HTTP 5xx error rates in production.")
                        ],
                        "practice": "Deploy your backend service, verify that the health check returns 200 OK, and simulate an error to confirm log capture.",
                        "url": "https://docs.docker.com/get-started/",
                        "resource_title": "Get started with Docker | Docker Docs"
                    }
                ]
            }
        ]
    }
]

print(f"Loaded {len(CAREERS_DATA)} career data definitions.")
