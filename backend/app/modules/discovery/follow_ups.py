"""Concrete situations refine existing activity meanings without changing their IDs."""

SITUATIONS = {
    "web": (
        "People abandon a form halfway through. What would you try?",
        [
            (
                "web",
                "Fix the confusing interaction",
                "Improve validation, keyboard controls and feedback.",
            ),
            (
                "backend",
                "Investigate failed submissions",
                "Trace the API and fix server-side validation.",
            ),
            (
                "full_stack",
                "Follow the problem end to end",
                "Connect browser behavior with the service handling submissions.",
            ),
        ],
    ),
    "backend": (
        "An app loses requests during busy periods. Where would you investigate?",
        [
            (
                "backend",
                "Trace requests and database queries",
                "Find slow operations and improve service reliability.",
            ),
            (
                "web",
                "Explain failures clearly on screen",
                "Build helpful retry and error interactions.",
            ),
            (
                "full_stack",
                "Trace the whole user journey",
                "Investigate the interface, API and storage together.",
            ),
        ],
    ),
    "full_stack": (
        "A small team needs a booking feature. Which responsibility appeals most?",
        [
            (
                "full_stack",
                "Deliver the complete booking flow",
                "Connect screens, availability rules and saved bookings.",
            ),
            ("web", "Make choosing a time easy", "Build clear, accessible calendar interactions."),
            (
                "backend",
                "Prevent conflicting bookings",
                "Design the service and transactional data rules.",
            ),
        ],
    ),
    "mobile": (
        "A phone app needs to work on an unreliable connection. What interests you?",
        [
            (
                "mobile",
                "Support offline use and device storage",
                "Handle mobile lifecycle and synchronization.",
            ),
            (
                "web",
                "Offer a browser-based experience",
                "Build responsive screens that work across browsers.",
            ),
            (
                "backend",
                "Design a safe synchronization API",
                "Resolve updates consistently on the server.",
            ),
        ],
    ),
    "games": (
        "Players say a level feels unfair. What would you change?",
        [
            (
                "games",
                "Tune the rules and difficulty",
                "Test mechanics, timing and player feedback.",
            ),
            (
                "web",
                "Improve the browser controls",
                "Make interactive controls clearer and more responsive.",
            ),
            (
                "backend",
                "Improve the online service",
                "Investigate saved sessions and server behavior.",
            ),
        ],
    ),
    "ai_features": (
        "An AI feature gives inconsistent answers. What would you investigate?",
        [
            (
                "ai_features",
                "Evaluate the model inside the product",
                "Test inputs, responses and integration safeguards.",
            ),
            (
                "web",
                "Help users understand the output",
                "Build interfaces for reviewing results and errors.",
            ),
            (
                "backend",
                "Make the integration dependable",
                "Improve APIs, retries and service limits.",
            ),
        ],
    ),
    "analyze": (
        "A team's sales fell unexpectedly. What would you deliver?",
        [
            (
                "analyze",
                "An explanation backed by records",
                "Compare groups and check possible causes.",
            ),
            (
                "dashboards",
                "A report the team can monitor",
                "Design recurring measures and reporting views.",
            ),
            (
                "pipelines",
                "A trustworthy dataset to investigate",
                "Repair inconsistent sources and data preparation.",
            ),
        ],
    ),
    "dashboards": (
        "Two departments disagree about a reported number. What would you tackle?",
        [
            (
                "dashboards",
                "Agree on measures and reporting views",
                "Define consistent metrics and improve the report.",
            ),
            (
                "analyze",
                "Investigate what the difference means",
                "Compare the records and explain the discrepancy.",
            ),
            (
                "pipelines",
                "Fix how source records are combined",
                "Make the underlying data flow consistent.",
            ),
        ],
    ),
    "pipelines": (
        "A daily data import keeps producing duplicates. What would you own?",
        [
            (
                "pipelines",
                "Make the import repeatable and reliable",
                "Design cleaning, deduplication and validation steps.",
            ),
            (
                "analyze",
                "Measure how duplicates affect findings",
                "Investigate the impact on the team's conclusions.",
            ),
            (
                "dashboards",
                "Make data-quality problems visible",
                "Build reporting that helps the team monitor issues.",
            ),
        ],
    ),
    "statistics": (
        "A team wants to know whether a change helped. What would you do?",
        [
            (
                "statistics",
                "Design a statistical comparison",
                "Consider variation, uncertainty and competing explanations.",
            ),
            (
                "analyze",
                "Explore the before-and-after records",
                "Explain patterns and possible confounding changes.",
            ),
            (
                "dashboards",
                "Track the outcome over time",
                "Build recurring measures for decision makers.",
            ),
        ],
    ),
    "train_models": (
        "A model works in testing but fails on new examples. What interests you?",
        [
            (
                "train_models",
                "Investigate training and evaluation",
                "Compare datasets, model behavior and performance.",
            ),
            (
                "analyze",
                "Investigate patterns in the failures",
                "Explore which cases differ and explain findings.",
            ),
            (
                "dashboards",
                "Monitor failures after release",
                "Create reports that show performance changes.",
            ),
        ],
    ),
    "test_security": (
        "You have permission to review a login flow. What would you produce?",
        [
            (
                "test_security",
                "A reproducible weakness report",
                "Test an authorized attack path and explain remediation.",
            ),
            (
                "respond",
                "A way to spot attempted abuse",
                "Investigate signals and incident-response steps.",
            ),
            (
                "cloud_security",
                "Safer identity and access settings",
                "Review cloud permissions and service exposure.",
            ),
        ],
    ),
    "respond": (
        "An unusual sign-in alert appears overnight. What would you focus on?",
        [
            (
                "respond",
                "Reconstruct and contain the incident",
                "Correlate logs and identify affected accounts.",
            ),
            (
                "test_security",
                "Reproduce the weakness safely",
                "Use an authorized test to understand the attack path.",
            ),
            (
                "cloud_security",
                "Reduce the exposed permissions",
                "Review identities and cloud access policies.",
            ),
        ],
    ),
    "cloud_security": (
        "A cloud storage service may expose private files. What would you do?",
        [
            (
                "cloud_security",
                "Correct access policies and exposure",
                "Apply least privilege and safer cloud configuration.",
            ),
            (
                "test_security",
                "Verify the exposure with permission",
                "Document a safe, reproducible security finding.",
            ),
            (
                "respond",
                "Investigate whether files were accessed",
                "Review logs and plan containment.",
            ),
        ],
    ),
    "layouts": (
        "People overlook a critical action on a screen. What would you change?",
        [
            (
                "layouts",
                "Rework the visual hierarchy",
                "Improve spacing, labels and control presentation.",
            ),
            (
                "research",
                "Observe people attempting the task",
                "Find the underlying usability problem through research.",
            ),
        ],
    ),
    "research": (
        "People describe a product differently from its designers. What interests you?",
        [
            (
                "research",
                "Study their tasks and expectations",
                "Interview users and test explanations with evidence.",
            ),
            (
                "layouts",
                "Make the interface communicate better",
                "Revise layout, labels and visual hierarchy.",
            ),
        ],
    ),
    "networks": (
        "Only one office loses access to a service. Where would you start?",
        [
            (
                "networks",
                "Trace routes, DNS and connectivity",
                "Isolate where communication breaks down.",
            ),
            (
                "servers",
                "Inspect the service and user accounts",
                "Check operating-system and server configuration.",
            ),
            (
                "cloud",
                "Review the hosted environment",
                "Inspect cloud networking and service provisioning.",
            ),
        ],
    ),
    "servers": (
        "A shared server becomes unreliable after an update. What would you inspect?",
        [
            (
                "servers",
                "Processes, configuration and access",
                "Restore the operating system and service safely.",
            ),
            (
                "networks",
                "Connections between the affected machines",
                "Trace communication and name-resolution issues.",
            ),
            (
                "cloud",
                "The environment running the service",
                "Review provisioning, capacity and cloud configuration.",
            ),
        ],
    ),
    "cloud": (
        "A hosted service slows down when traffic spikes. What would you change?",
        [
            (
                "cloud",
                "Scale capacity and balance traffic",
                "Improve provisioning and the cloud environment.",
            ),
            (
                "networks",
                "Trace latency between components",
                "Investigate connections, routing and network bottlenecks.",
            ),
            (
                "servers",
                "Tune the machines running the service",
                "Inspect server resources, processes and configuration.",
            ),
        ],
    ),
    "releases": (
        "A deployment works on one machine but fails elsewhere. What would you improve?",
        [
            (
                "releases",
                "Make builds and deployment repeatable",
                "Automate checks, packaging and release steps.",
            ),
            (
                "networks",
                "Trace communication between services",
                "Investigate networking and connectivity differences.",
            ),
            (
                "servers",
                "Standardize the server configuration",
                "Manage operating-system settings and service accounts.",
            ),
        ],
    ),
    "circuits": (
        "A sensor's readings become unstable. What would you investigate?",
        [
            (
                "circuits",
                "Measure power and electrical signals",
                "Test components and improve the physical circuit.",
            ),
            (
                "embedded",
                "Inspect sampling and device timing",
                "Debug firmware and hardware interactions.",
            ),
            (
                "linux",
                "Inspect drivers and system behavior",
                "Investigate how the operating system handles the device.",
            ),
        ],
    ),
    "embedded": (
        "A device misses events while doing several tasks. What would you inspect?",
        [
            (
                "embedded",
                "Firmware timing and event handling",
                "Debug interrupts, scheduling and device software.",
            ),
            (
                "circuits",
                "The electrical signals reaching it",
                "Measure and test the circuit and components.",
            ),
            (
                "linux",
                "The underlying operating system",
                "Investigate processes, drivers and system resources.",
            ),
        ],
    ),
    "linux": (
        "A Linux-based device boots slowly. What would you explore?",
        [
            (
                "linux",
                "The boot process and system services",
                "Inspect kernel messages, processes and drivers.",
            ),
            (
                "circuits",
                "Power and component behavior",
                "Measure hardware startup and electrical stability.",
            ),
            (
                "embedded",
                "The software controlling the device",
                "Improve firmware initialization and hardware interaction.",
            ),
        ],
    ),
}
