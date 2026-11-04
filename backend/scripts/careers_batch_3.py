"""Career batch 3: Cloud Engineer, System Administrator, Cloud Security Engineer, Linux Systems Engineer."""

BATCH_3 = [
    # -------------------------------------------------------------
    # 8. Cloud Engineer
    # -------------------------------------------------------------
    {
        "slug": "cloud-engineer",
        "name": "Cloud Engineer",
        "category": "Networking & Infrastructure",
        "short_description": "Design, provision, and maintain scalable, reliable cloud infrastructure and services across virtual networks, compute, and storage.",
        "responsibilities": [
            "Architect and provision resilient cloud infrastructure using Infrastructure as Code (Terraform)",
            "Configure secure virtual private clouds (VPCs), subnets, routing tables, and gateways",
            "Deploy and scale compute workloads using virtual machines, containers, and serverless functions",
            "Manage cloud storage lifecycle policies, relational and NoSQL databases, and CDNs",
            "Implement automated monitoring, resource alarms, backup policies, and disaster recovery"
        ],
        "representative_work": "A production-grade multi-tier cloud infrastructure provisioned entirely with Terraform, featuring public/private VPC subnets, an auto-scaling compute cluster behind an Application Load Balancer, a managed database, and automated CloudWatch alarms.",
        "core_skills": [
            "Cloud service models (IaaS, PaaS, Serverless)",
            "Cloud global infrastructure and regions",
            "Virtual Private Clouds (VPC) and CIDR subnets",
            "Compute instances, auto-scaling, and load balancing",
            "Cloud storage (S3/Blob) and lifecycle policies",
            "Managed relational and NoSQL database services",
            "Infrastructure as Code (IaC) with Terraform",
            "DNS management, routing, and CDN distribution",
            "Cloud monitoring, metrics, and automated alerting",
            "High availability and disaster recovery planning"
        ],
        "milestones": [
            {
                "slug": "cloud-concepts-fundamentals",
                "title": "Cloud computing concepts and fundamentals",
                "summary": "Understand cloud service models, global regions, cloud console and CLI tooling, and cost management.",
                "topics": [
                    {
                        "slug": "cloud-service-models-iaas-paas",
                        "title": "Cloud service models: IaaS, PaaS, SaaS",
                        "overview": "Learn the trade-offs between Infrastructure as a Service, Platform as a Service, and Software as a Service.",
                        "subtopics": [
                            ("Service Model Trade-offs", "Comparing control, operational overhead, and flexibility across IaaS, PaaS, and serverless."),
                            ("Shared Responsibility", "Understanding which security and maintenance responsibilities belong to the cloud provider vs the customer.")
                        ],
                        "practice": "Categorize 5 common enterprise workloads into their optimal cloud service model (IaaS, PaaS, or SaaS).",
                        "url": "https://aws.amazon.com/types-of-cloud-computing/",
                        "resource_title": "Types of Cloud Computing | AWS Documentation"
                    },
                    {
                        "slug": "global-infrastructure-regions-azs",
                        "title": "Global infrastructure: regions and availability zones",
                        "overview": "Understand how cloud providers structure regions, multiple independent availability zones (AZs), and edge locations.",
                        "subtopics": [
                            ("Regions and Availability Zones", "Why deploying across multiple AZs provides fault tolerance against localized data center outages."),
                            ("Edge Locations and Latency", "Using edge points of presence (PoP) to cache content close to global end users.")
                        ],
                        "practice": "Draft a multi-AZ deployment plan for a web app that remains available if an entire availability zone experiences a blackout.",
                        "url": "https://aws.amazon.com/about-aws/global-infrastructure/",
                        "resource_title": "Global Infrastructure | AWS"
                    },
                    {
                        "slug": "cloud-console-cli-sdk",
                        "title": "Cloud console, CLI tools and SDK configuration",
                        "overview": "Install, authenticate, and configure cloud command-line interfaces (AWS CLI, gcloud, or Azure CLI) and SDK profiles.",
                        "subtopics": [
                            ("CLI Authentication", "Configuring access keys, default output formats, and regional settings in CLI configuration files."),
                            ("Command Line Automation", "Querying cloud resource states, creating instances, and parsing JSON responses with jq.")
                        ],
                        "practice": "Configure a cloud CLI profile, authenticate, and execute a command listing all available regions in your account.",
                        "url": "https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html",
                        "resource_title": "What is the AWS Command Line Interface? | AWS CLI Docs"
                    },
                    {
                        "slug": "resource-tagging-budgets-billing",
                        "title": "Resource tagging, budgets and cost alerts",
                        "overview": "Organize cloud resources with mandatory tags, create monthly cost budgets, and set up automated billing threshold alerts.",
                        "subtopics": [
                            ("Tagging Strategies", "Using tags (Environment, Project, Owner, CostCenter) to track ownership and allocate expenses."),
                            ("Cost Alerts and Budgets", "Configuring email or Slack alerts when forecasted monthly spend reaches 80% of budget limits.")
                        ],
                        "practice": "Define a corporate tagging policy schema and configure a budget alert that triggers if monthly spend exceeds a dollar threshold.",
                        "url": "https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html",
                        "resource_title": "Managing your costs with AWS Budgets | AWS Docs"
                    }
                ]
            },
            {
                "slug": "cloud-compute-and-scaling",
                "title": "Cloud compute and scaling",
                "summary": "Provision virtual machine instances, deploy serverless functions, configure auto-scaling groups, and set up load balancers.",
                "topics": [
                    {
                        "slug": "vm-provisioning-lifecycle",
                        "title": "Virtual machine provisioning and lifecycle",
                        "overview": "Launch, configure, and connect to cloud virtual machine instances (e.g., EC2, Compute Engine) using SSH and cloud-init.",
                        "subtopics": [
                            ("Instance Types and Sizes", "Selecting appropriate compute-optimized, memory-optimized, or general-purpose instance families."),
                            ("User Data Bootstrapping", "Using cloud-init user data scripts to automatically install web servers and packages upon first boot.")
                        ],
                        "practice": "Launch a virtual machine instance with a user data script that installs Nginx, and access its default web page via public IP.",
                        "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/concepts.html",
                        "resource_title": "What is Amazon EC2? | Amazon EC2 User Guide"
                    },
                    {
                        "slug": "serverless-functions-triggers",
                        "title": "Serverless functions and event triggers",
                        "overview": "Deploy event-driven serverless functions (AWS Lambda, Google Cloud Functions) triggered by HTTP requests, storage events, or timers.",
                        "subtopics": [
                            ("Event-Driven Execution", "How serverless runtimes spin up containers on demand, execute event payloads, and shut down."),
                            ("Cold Starts and Timeouts", "Managing initialization latency (cold starts), execution memory allocation, and maximum timeout limits.")
                        ],
                        "practice": "Deploy a serverless function that triggers when an image is uploaded to a storage bucket and creates a thumbnail.",
                        "url": "https://docs.aws.amazon.com/lambda/latest/dg/welcome.html",
                        "resource_title": "What is AWS Lambda? | AWS Lambda Developer Guide"
                    },
                    {
                        "slug": "auto-scaling-groups-configurations",
                        "title": "Auto-scaling groups and launch configurations",
                        "overview": "Maintain application availability by automatically scaling compute instances up or down based on CPU and traffic demand.",
                        "subtopics": [
                            ("Scaling Policies", "Configuring target-tracking scaling policies (e.g., maintain average CPU at 60%) and step scaling."),
                            ("Launch Templates", "Defining standardized AMI images, instance types, key pairs, and security groups for new instances.")
                        ],
                        "practice": "Configure an auto-scaling group with min 2 and max 5 instances, and simulate CPU load to verify that a new instance launches.",
                        "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html",
                        "resource_title": "What is Amazon EC2 Auto Scaling? | AWS Docs"
                    },
                    {
                        "slug": "application-load-balancers-health",
                        "title": "Application load balancers and health checks",
                        "overview": "Distribute incoming HTTP/HTTPS traffic across healthy targets using Application Load Balancers with automated health checks.",
                        "subtopics": [
                            ("Target Groups and Routing", "Routing requests based on path rules (/api, /static) or host headers to distinct target groups."),
                            ("Health Check Monitoring", "Periodically probing instance endpoints and automatically routing traffic away from failing targets.")
                        ],
                        "practice": "Deploy an Application Load Balancer in front of two web instances and verify that shutting down one does not disrupt service.",
                        "url": "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html",
                        "resource_title": "What is an Application Load Balancer? | AWS Docs"
                    }
                ]
            },
            {
                "slug": "cloud-networking-connectivity",
                "title": "Cloud networking and connectivity",
                "summary": "Design virtual private clouds, isolate public and private subnets, configure NAT gateways, and manage cloud DNS.",
                "topics": [
                    {
                        "slug": "vpc-cidr-blocks-subnets",
                        "title": "Virtual Private Clouds (VPC) and CIDR blocks",
                        "overview": "Create isolated virtual network environments, allocate private IPv4 CIDR blocks, and subdivide networks into subnets.",
                        "subtopics": [
                            ("CIDR Notation and IP Math", "Calculating available host IP addresses for /16, /20, and /24 network masks."),
                            ("Subnet Isolation", "Creating distinct subnets for public ingress, application logic, and private database tiers.")
                        ],
                        "practice": "Design a VPC with a 10.0.0.0/16 CIDR block and divide it into two public and two private /24 subnets across two AZs.",
                        "url": "https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html",
                        "resource_title": "What is Amazon VPC? | Amazon VPC User Guide"
                    },
                    {
                        "slug": "subnets-internet-nat-gateways",
                        "title": "Public and private subnets, internet and NAT gateways",
                        "overview": "Provide direct internet access to public subnets via Internet Gateways and secure outbound-only access for private subnets via NAT.",
                        "subtopics": [
                            ("Internet Gateway (IGW)", "Attaching an IGW to a VPC route table to allow instances with public IPs to receive incoming traffic."),
                            ("NAT Gateway / NAT Instance", "Allowing private backend instances to download software patches without exposing public IP addresses.")
                        ],
                        "practice": "Configure a NAT gateway in a public subnet and verify that a database in a private subnet can fetch outbound updates.",
                        "url": "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html",
                        "resource_title": "NAT gateways | Amazon VPC User Guide"
                    },
                    {
                        "slug": "cloud-dns-domain-routing",
                        "title": "DNS management and domain routing",
                        "overview": "Manage public and private DNS hosted zones (e.g. Route 53, Cloud DNS), alias records, health-check failovers, and routing policies.",
                        "subtopics": [
                            ("DNS Record Types", "Configuring A, AAAA, CNAME, MX, TXT records and cloud-native apex Alias records."),
                            ("Routing Policies", "Using latency-based routing, weighted routing, and geo-proximity routing to optimize global performance.")
                        ],
                        "practice": "Create a DNS hosted zone, add an A record pointing to a load balancer, and configure a CNAME alias.",
                        "url": "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/Welcome.html",
                        "resource_title": "What is Amazon Route 53? | Amazon Route 53 Developer Guide"
                    },
                    {
                        "slug": "hybrid-connectivity-vpns-peering",
                        "title": "Hybrid connectivity: VPNs and transit gateways",
                        "overview": "Connect multiple cloud VPCs together using VPC Peering, or link on-premises corporate data centers with Site-to-Site VPNs.",
                        "subtopics": [
                            ("VPC Peering", "Routing traffic directly between two VPCs using private IPs without traffic traversing the public internet."),
                            ("Site-to-Site IPsec VPN", "Establishing encrypted tunnels between cloud VPCs and corporate on-premises routers.")
                        ],
                        "practice": "Set up a VPC peering connection between two virtual networks and verify that instances can ping across private IP addresses.",
                        "url": "https://docs.aws.amazon.com/vpc/latest/peering/what-is-vpc-peering.html",
                        "resource_title": "What is VPC peering? | Amazon VPC Peering Guide"
                    }
                ]
            },
            {
                "slug": "cloud-storage-and-databases",
                "title": "Cloud storage, databases and caching",
                "summary": "Configure object storage with lifecycle rules, deploy managed relational and NoSQL databases, and accelerate delivery with CDNs.",
                "topics": [
                    {
                        "slug": "object-storage-lifecycle-rules",
                        "title": "Object storage buckets and lifecycle policies",
                        "overview": "Store unstructured data (images, backups, logs) in cloud object storage (S3/Cloud Storage) and configure automatic lifecycle transitions.",
                        "subtopics": [
                            ("Bucket Permissions and Versioning", "Enabling object versioning and blocking accidental public bucket exposure."),
                            ("Storage Tiers and Lifecycle Rules", "Transitioning objects from Standard to Infrequent Access (IA) and Glacier archival over time.")
                        ],
                        "practice": "Create an object storage bucket with a lifecycle rule that moves objects to cold archival storage after 90 days.",
                        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html",
                        "resource_title": "What is Amazon S3? | Amazon S3 User Guide"
                    },
                    {
                        "slug": "managed-relational-databases-rds",
                        "title": "Managed relational database provisioning",
                        "overview": "Deploy managed relational database instances (PostgreSQL / MySQL) with automated patching, multi-AZ failover, and read replicas.",
                        "subtopics": [
                            ("Multi-AZ Deployments", "Synchronous replication to a standby instance in a secondary AZ for automatic disaster failover."),
                            ("Read Replicas", "Offloading analytical read traffic to asynchronous read replicas to protect primary database throughput.")
                        ],
                        "practice": "Provision a managed PostgreSQL database in private subnets and configure an automated daily backup snapshot window.",
                        "url": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html",
                        "resource_title": "What is Amazon RDS? | Amazon RDS User Guide"
                    },
                    {
                        "slug": "managed-nosql-databases",
                        "title": "Managed NoSQL databases",
                        "overview": "Provision fully managed, horizontally scalable key-value and document databases (e.g. DynamoDB, Firestore) with single-digit millisecond latency.",
                        "subtopics": [
                            ("Partition and Sort Keys", "Designing primary keys that evenly distribute data access across physical storage partitions."),
                            ("On-Demand vs Provisioned Capacity", "Choosing between auto-scaling read/write units and pay-per-request billing models.")
                        ],
                        "practice": "Create a managed NoSQL table with a composite primary key and insert and query a document record.",
                        "url": "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html",
                        "resource_title": "What is Amazon DynamoDB? | DynamoDB Developer Guide"
                    },
                    {
                        "slug": "managed-caching-cdn-distribution",
                        "title": "Managed caching clusters and CDN distribution",
                        "overview": "Accelerate read latency with managed in-memory Redis clusters (ElastiCache) and global Content Delivery Networks (CloudFront).",
                        "subtopics": [
                            ("In-Memory Caching", "Clustering Redis nodes for sub-millisecond query caching and session state persistence."),
                            ("CDN Edge Caching", "Configuring CDN distributions with custom domain SSL certificates, cache TTLs, and origin fallbacks.")
                        ],
                        "practice": "Configure a CDN distribution in front of an S3 bucket and verify that static assets return HTTP cache-hit headers.",
                        "url": "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html",
                        "resource_title": "What is Amazon CloudFront? | CloudFront Developer Guide"
                    }
                ]
            },
            {
                "slug": "infrastructure-as-code-terraform",
                "title": "Infrastructure as Code (IaC) and automation",
                "summary": "Declare, plan, and provision cloud infrastructure repeatably using Terraform, manage remote state, and build modular templates.",
                "topics": [
                    {
                        "slug": "iac-fundamentals-declarative",
                        "title": "IaC fundamentals and declarative configuration",
                        "overview": "Understand why declarative Infrastructure as Code eliminates manual configuration drift and provides versioned infrastructure history.",
                        "subtopics": [
                            ("Declarative vs Imperative", "Specifying the desired end state in code and letting the engine determine the execution plan."),
                            ("Idempotency", "Running the same IaC configuration multiple times safely without creating duplicate resources.")
                        ],
                        "practice": "Write a simple Terraform file declaring a local file or cloud resource and execute terraform plan to inspect changes.",
                        "url": "https://developer.hashicorp.com/terraform/intro",
                        "resource_title": "What is Terraform? | HashiCorp Developer"
                    },
                    {
                        "slug": "terraform-providers-resources-variables",
                        "title": "Terraform providers, resources and variables",
                        "overview": "Configure cloud providers, declare resource blocks, define input variables with validation, and output computed values.",
                        "subtopics": [
                            ("Provider Configuration", "Configuring provider plugins, credentials, and default resource tags."),
                            ("Variables and Outputs", "Parameterizing environments with variable defaults, types, and exporting endpoint URLs in outputs.")
                        ],
                        "practice": "Write a Terraform configuration that provisions a VPC, parameterized with input variables for CIDR and environment name.",
                        "url": "https://developer.hashicorp.com/terraform/language",
                        "resource_title": "The Terraform Configuration Language | HashiCorp Developer"
                    },
                    {
                        "slug": "managing-terraform-state",
                        "title": "Managing Terraform state and remote backends",
                        "overview": "Store the terraform.tfstate mapping file in a secure remote backend (S3 bucket with DynamoDB state locking) to prevent race conditions.",
                        "subtopics": [
                            ("State File Mechanics", "How the state file maps declarative code to real-world cloud resource IDs and attributes."),
                            ("Remote State Locking", "Using distributed locks to prevent two engineers from modifying infrastructure simultaneously.")
                        ],
                        "practice": "Configure a remote backend block using cloud storage and a lock table, and migrate local state to the cloud.",
                        "url": "https://developer.hashicorp.com/terraform/language/state/backends",
                        "resource_title": "Backends | Terraform | HashiCorp Developer"
                    },
                    {
                        "slug": "modularizing-cloud-infrastructure",
                        "title": "Modularizing cloud infrastructure",
                        "overview": "Package reusable cloud patterns (e.g. standard VPC module, database module) into reusable Terraform modules with clean interfaces.",
                        "subtopics": [
                            ("Module Structure", "Organizing main.tf, variables.tf, and outputs.tf into self-contained reusable directories."),
                            ("Instantiating Modules", "Calling child modules multiple times to spin up identical staging and production environments.")
                        ],
                        "practice": "Build a reusable web-server module and instantiate it twice with different instance types for dev and prod.",
                        "url": "https://developer.hashicorp.com/terraform/language/modules",
                        "resource_title": "Modules Overview | Terraform | HashiCorp Developer"
                    }
                ]
            },
            {
                "slug": "observability-disaster-recovery",
                "title": "Observability, backup and disaster recovery",
                "summary": "Configure CloudWatch metrics and alarms, automate snapshot backups, design multi-region disaster recovery, and deploy complete architectures.",
                "topics": [
                    {
                        "slug": "cloud-metrics-alarms-logs",
                        "title": "Cloud metrics, alarms and log aggregation",
                        "overview": "Collect system metrics (CPU, disk I/O, network), aggregate application logs, and trigger SNS alerts on anomalous spikes.",
                        "subtopics": [
                            ("Metric Alarms", "Configuring alarms that trigger automated actions when error rates or CPU cross thresholds."),
                            ("Centralized Log Groups", "Streaming container and OS logs to central log stores for real-time querying and filtering.")
                        ],
                        "practice": "Create a metric alarm that sends an alert notification if server CPU utilization exceeds 80% for 5 consecutive minutes.",
                        "url": "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html",
                        "resource_title": "What is Amazon CloudWatch? | CloudWatch User Guide"
                    },
                    {
                        "slug": "automated-snapshot-backup-strategies",
                        "title": "Automated snapshot and backup strategies",
                        "overview": "Automate daily snapshot backups of block storage volumes (EBS) and database instances with retention lifecycle rules.",
                        "subtopics": [
                            ("RPO and RTO Targets", "Understanding Recovery Point Objective (acceptable data loss) and Recovery Time Objective (time to recover)."),
                            ("Automated Backup Policies", "Using AWS Backup or cloud schedulers to enforce immutable, encrypted snapshot retention.")
                        ],
                        "practice": "Configure an automated backup plan that creates daily encrypted snapshots of a database and deletes snapshots older than 30 days.",
                        "url": "https://docs.aws.amazon.com/aws-backup/latest/devguide/whatisbackup.html",
                        "resource_title": "What is AWS Backup? | AWS Backup Developer Guide"
                    },
                    {
                        "slug": "high-availability-disaster-recovery",
                        "title": "High availability and multi-region disaster recovery",
                        "overview": "Evaluate disaster recovery strategies: Backup & Restore, Pilot Light, Warm Standby, and Multi-Region Active-Active.",
                        "subtopics": [
                            ("DR Architecture Comparison", "Balancing business recovery speed against cost across the four standard DR tiers."),
                            ("Cross-Region Replication", "Replicating database transactions and storage buckets asynchronously to a secondary geographical region.")
                        ],
                        "practice": "Write a disaster recovery runbook detailing step-by-step failover procedures to a backup region during a primary region outage.",
                        "url": "https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html",
                        "resource_title": "Disaster Recovery Options in the Cloud | AWS Whitepapers"
                    },
                    {
                        "slug": "deploying-scalable-multi-tier-app",
                        "title": "Deploying a scalable multi-tier web architecture",
                        "overview": "Synthesize VPC networking, load balancers, auto-scaling groups, managed databases, and IaC into a production deployment.",
                        "subtopics": [
                            ("The Reference Architecture", "Public load balancer tier > private application compute tier > private isolated database tier."),
                            ("Final Verification", "Conducting end-to-end failover tests, load testing, and security group verification on the live system.")
                        ],
                        "practice": "Provision and verify a complete 3-tier web architecture in code, proving that public internet traffic cannot directly reach the database.",
                        "url": "https://docs.aws.amazon.com/whitepapers/latest/web-application-hosting-best-practices/an-aws-cloud-architecture-for-web-hosting.html",
                        "resource_title": "Web Application Hosting Best Practices | AWS Whitepapers"
                    }
                ]
            }
        ]
    },

    # -------------------------------------------------------------
    # 9. System Administrator
    # -------------------------------------------------------------
    {
        "slug": "system-administrator",
        "name": "System Administrator",
        "category": "Networking & Infrastructure",
        "short_description": "Administer, secure, and maintain enterprise Linux servers, operating system storage, user access, services, and network connectivity.",
        "responsibilities": [
            "Install, configure, and maintain Linux operating systems and enterprise distributions",
            "Manage user accounts, group permissions, PAM authentication, and SSH access controls",
            "Partition disks, configure Logical Volume Management (LVM), and manage filesystems",
            "Control background services and daemons using systemd and automate tasks with cron and Bash",
            "Configure host firewalls, monitor system logs with journalctl, and execute disaster recovery backups"
        ],
        "representative_work": "A hardened, production-ready enterprise Linux server deployment featuring LVM partitioned storage, non-root sudo accounts, hardened SSH key authentication, automated systemd service management, firewall rules, and automated rsync backup scripts.",
        "core_skills": [
            "Linux filesystem hierarchy and terminal navigation",
            "Superuser privileges and sudo configuration",
            "User and group account administration",
            "Linux file permissions (chmod, chown, SUID/SGID)",
            "Storage partitioning and Logical Volume Management (LVM)",
            "Package management with APT and DNF/YUM",
            "Process control and systemd service units",
            "Bash scripting and scheduled cron automation",
            "Host firewall configuration (UFW and nftables)",
            "System log auditing and rsync backup automation"
        ],
        "milestones": [
            {
                "slug": "sysadmin-fundamentals",
                "title": "System administration fundamentals",
                "summary": "Understand Linux distribution families, navigate the filesystem hierarchy, master core shell commands, and manage superuser rights.",
                "topics": [
                    {
                        "slug": "linux-distributions-installation",
                        "title": "Linux distribution families and installation",
                        "overview": "Learn the differences between Debian/Ubuntu and RHEL/Fedora distribution families, kernel releases, and minimal server installations.",
                        "subtopics": [
                            ("Distribution Ecosystems", "Comparing package formats (.deb vs .rpm), release cadences (LTS vs rolling), and enterprise support."),
                            ("Headless Server Installation", "Installing a minimal server operating system without graphical desktop overhead.")
                        ],
                        "practice": "Install a minimal headless Linux server in a local virtual machine and log in via the console.",
                        "url": "https://ubuntu.com/server/docs",
                        "resource_title": "Ubuntu Server Guide | Ubuntu Documentation"
                    },
                    {
                        "slug": "filesystem-hierarchy-standard",
                        "title": "Filesystem hierarchy and navigation",
                        "overview": "Master the Filesystem Hierarchy Standard (FHS), understanding the roles of /etc, /var, /home, /usr, /tmp, and /opt.",
                        "subtopics": [
                            ("The Linux Directory Tree", "Where configuration files (/etc), system logs (/var/log), and binaries (/usr/bin) reside."),
                            ("Absolute vs Relative Paths", "Navigating directory structures efficiently using cd, ls -la, pwd, and tree.")
                        ],
                        "practice": "Explore the root filesystem, locate the system hosts file in /etc, and inspect recent log files in /var/log.",
                        "url": "https://tldp.org/LDP/intro-linux/html/sect_03_01.html",
                        "resource_title": "The Filesystem Hierarchy Standard | The Linux Documentation Project"
                    },
                    {
                        "slug": "shell-commands-pipes-redirection",
                        "title": "Shell commands, pipes and text redirection",
                        "overview": "Harness the power of the command line using standard streams (stdin, stdout, stderr), pipes (|), and file redirection operators.",
                        "subtopics": [
                            ("Standard Streams and Redirection", "Redirecting command output to files with > and >>, and capturing error streams with 2>&1."),
                            ("Piping and Text Filters", "Chaining commands together using grep, sort, uniq, cut, and wc to extract information.")
                        ],
                        "practice": "Write a command pipeline that extracts all unique usernames from /etc/passwd sorted alphabetically.",
                        "url": "https://tldp.org/LDP/intro-linux/html/sect_05_01.html",
                        "resource_title": "I/O redirection | The Linux Documentation Project"
                    },
                    {
                        "slug": "superuser-privileges-sudo",
                        "title": "Superuser privileges and sudo configuration",
                        "overview": "Manage root administrative access securely, avoiding direct root logins, and configure granular permissions with visudo.",
                        "subtopics": [
                            ("The Principle of Least Privilege", "Why day-to-day operations should use unprivileged accounts elevated only when necessary."),
                            ("Configuring the Sudoers File", "Using visudo to grant specific users or groups passworded or passwordless sudo rights.")
                        ],
                        "practice": "Create a new administrative user, add them to the sudo/wheel group, and verify they can execute commands as root.",
                        "url": "https://man7.org/linux/man-pages/man8/sudo.8.html",
                        "resource_title": "sudo(8) — Linux manual page"
                    }
                ]
            },
            {
                "slug": "user-management-permissions-auth",
                "title": "User management, permissions and authentication",
                "summary": "Create and manage user and group accounts, apply standard and special permissions, and harden SSH server authentication.",
                "topics": [
                    {
                        "slug": "user-group-management",
                        "title": "User and group creation and management",
                        "overview": "Add, modify, and delete user accounts and security groups, manage home directories, and inspect /etc/passwd and /etc/shadow.",
                        "subtopics": [
                            ("User Account Lifecycle", "Using useradd, usermod, and userdel to manage accounts, shells, and expiry dates."),
                            ("Group Membership", "Assigning primary and supplementary groups to organize permissions across team roles.")
                        ],
                        "practice": "Create a 'developers' group, add two user accounts with custom home directories, and assign the group to both.",
                        "url": "https://man7.org/linux/man-pages/man8/useradd.8.html",
                        "resource_title": "useradd(8) — Linux manual page"
                    },
                    {
                        "slug": "file-permissions-suid-sgid",
                        "title": "Standard and special file permissions",
                        "overview": "Set standard read, write, and execute permissions (chmod, chown) and special bits: SUID, SGID, and Sticky Bit.",
                        "subtopics": [
                            ("Numeric and Symbolic Modes", "Calculating permission values (e.g., 755, 644, 700) across Owner, Group, and Others."),
                            ("Special Permissions", "Understanding how SUID executes with file owner rights, SGID inherits group ownership, and Sticky Bit protects shared folders.")
                        ],
                        "practice": "Create a shared collaboration directory with SGID enabled so all newly created files inherit the group identity automatically.",
                        "url": "https://tldp.org/LDP/intro-linux/html/sect_03_04.html",
                        "resource_title": "File security | The Linux Documentation Project"
                    },
                    {
                        "slug": "ssh-configuration-hardening",
                        "title": "SSH key configuration and server hardening",
                        "overview": "Configure secure remote access with OpenSSH, generate ed25519 key pairs, disable password authentication, and disable root login.",
                        "subtopics": [
                            ("Asymmetric Key Authentication", "Generating public/private key pairs and installing public keys into authorized_keys."),
                            ("Harden sshd_config", "Setting PermitRootLogin no, PasswordAuthentication no, and changing default port settings.")
                        ],
                        "practice": "Generate an ed25519 SSH key pair, install it on a server, and configure sshd to reject all password-based logins.",
                        "url": "https://man7.org/linux/man-pages/man5/sshd_config.5.html",
                        "resource_title": "sshd_config(5) — Linux manual page"
                    },
                    {
                        "slug": "pam-authentication-basics",
                        "title": "Pluggable Authentication Modules (PAM) basics",
                        "overview": "Understand how Linux uses PAM to manage authentication rules across services (sudo, login, sshd) via configuration files in /etc/pam.d.",
                        "subtopics": [
                            ("PAM Modules and Control Flags", "Understanding auth, account, password, session types and required, requisite, sufficient flags."),
                            ("Account Lockout Policies", "Configuring pam_faillock to lock user accounts after consecutive failed password attempts.")
                        ],
                        "practice": "Inspect /etc/pam.d/sudo and configure an account lockout rule that locks an account for 10 minutes after 5 failed attempts.",
                        "url": "https://man7.org/linux/man-pages/man8/pam.8.html",
                        "resource_title": "pam(8) — Linux manual page"
                    }
                ]
            },
            {
                "slug": "storage-lvm-package-management",
                "title": "Storage, filesystems and package management",
                "summary": "Partition physical disks, configure dynamic Logical Volume Management (LVM), mount filesystems, and manage packages.",
                "topics": [
                    {
                        "slug": "disk-partitioning-filesystems",
                        "title": "Disk partitioning and filesystem creation",
                        "overview": "Partition storage drives using fdisk/parted, format partitions with ext4 or XFS filesystems, and verify disk geometry.",
                        "subtopics": [
                            ("GPT vs MBR Partitioning", "Understanding GUID Partition Tables (GPT) vs legacy MBR disk limits."),
                            ("Formatting Filesystems", "Using mkfs.ext4 and mkfs.xfs to initialize filesystem superblocks and inode tables.")
                        ],
                        "practice": "Create a new partition on a secondary disk, format it with an ext4 filesystem, and inspect it with lsblk.",
                        "url": "https://man7.org/linux/man-pages/man8/fdisk.8.html",
                        "resource_title": "fdisk(8) — Linux manual page"
                    },
                    {
                        "slug": "logical-volume-management-lvm",
                        "title": "Logical Volume Management (LVM)",
                        "overview": "Create dynamic storage using LVM: Physical Volumes (PV), Volume Groups (VG), and expandable Logical Volumes (LV).",
                        "subtopics": [
                            ("The LVM Hierarchy", "Aggregating multiple physical disks into a shared volume group and carving out resizable logical volumes."),
                            ("Online Volume Expansion", "Expanding a logical volume and extending its filesystem online with lvextend and resize2fs without rebooting.")
                        ],
                        "practice": "Set up an LVM volume group across two drives, create a logical volume, and expand its size while mounted.",
                        "url": "https://man7.org/linux/man-pages/man8/lvm.8.html",
                        "resource_title": "lvm(8) — Linux manual page"
                    },
                    {
                        "slug": "mounting-filesystems-fstab",
                        "title": "Mounting drives and fstab configuration",
                        "overview": "Mount storage partitions manually with mount, identify UUIDs with blkid, and configure persistent mounts in /etc/fstab.",
                        "subtopics": [
                            ("The /etc/fstab Format", "Configuring device UUID, mount point, filesystem type, mount options (e.g. noexec, nodev), and dump/pass."),
                            ("Testing fstab Without Rebooting", "Using mount -a to verify fstab syntax before rebooting to avoid emergency boot hangs.")
                        ],
                        "practice": "Add a new partition to /etc/fstab using its filesystem UUID, verify it with mount -a, and reboot to confirm it mounts automatically.",
                        "url": "https://man7.org/linux/man-pages/man5/fstab.5.html",
                        "resource_title": "fstab(5) — Linux manual page"
                    },
                    {
                        "slug": "package-managers-apt-dnf",
                        "title": "Package managers (APT, DNF) and repositories",
                        "overview": "Install, update, remove, and query software packages using package managers (apt on Debian/Ubuntu, dnf on RHEL/Fedora).",
                        "subtopics": [
                            ("Repository Management", "Adding trusted GPG repository keys and repository URLs in sources.list or /etc/yum.repos.d."),
                            ("System Upgrades and Security Patches", "Executing unattended security updates and cleaning cached package files.")
                        ],
                        "practice": "Add a verified third-party repository, install a package from it, and verify its package signing key with apt-key or rpm.",
                        "url": "https://man7.org/linux/man-pages/man8/apt.8.html",
                        "resource_title": "apt(8) — Linux manual page"
                    }
                ]
            },
            {
                "slug": "process-control-systemd-automation",
                "title": "Process control, services and automation",
                "summary": "Monitor system processes, create custom systemd service units, schedule recurring cron jobs, and write automation scripts.",
                "topics": [
                    {
                        "slug": "process-monitoring-signals",
                        "title": "Process monitoring and priority (ps, top, kill)",
                        "overview": "Inspect running processes, check CPU and memory utilization, adjust process priorities with nice, and send process signals.",
                        "subtopics": [
                            ("Process States and Signals", "Sending SIGTERM (15), SIGKILL (9), and SIGHUP (1) to terminate or reload processes safely."),
                            ("Real-Time Monitoring", "Using htop and top to identify rogue processes consuming excessive CPU or memory.")
                        ],
                        "practice": "Identify a runaway background process using ps aux and terminate it cleanly using kill -15 followed by kill -9 if unresponsive.",
                        "url": "https://man7.org/linux/man-pages/man1/ps.1.html",
                        "resource_title": "ps(1) — Linux manual page"
                    },
                    {
                        "slug": "systemd-service-management",
                        "title": "Service management with systemd",
                        "overview": "Control system daemons using systemctl (start, stop, restart, status, enable) and write custom unit files in /etc/systemd/system.",
                        "subtopics": [
                            ("Systemctl Operations", "Starting services, enabling them to boot automatically, and checking service health."),
                            ("Creating Custom Unit Files", "Writing .service unit files defining Description, ExecStart, Restart=always, and User.")
                        ],
                        "practice": "Write a custom systemd service unit that runs a background Node or Python script and restart it with systemctl.",
                        "url": "https://man7.org/linux/man-pages/man5/systemd.service.5.html",
                        "resource_title": "systemd.service(5) — Linux manual page"
                    },
                    {
                        "slug": "scheduled-tasks-cron-timers",
                        "title": "Scheduled tasks with cron and systemd timers",
                        "overview": "Automate recurring maintenance tasks using user and system crontabs or modern systemd timer units.",
                        "subtopics": [
                            ("Cron Syntax", "Defining execution schedules using minute, hour, day-of-month, month, day-of-week syntax (* * * * *)."),
                            ("Systemd Timers", "Creating monotonic and calendar timers that trigger systemd service units with accurate logging.")
                        ],
                        "practice": "Create a cron job that runs a disk cleanup script every Sunday at 2:00 AM and appends output to a log file.",
                        "url": "https://man7.org/linux/man-pages/man5/crontab.5.html",
                        "resource_title": "crontab(5) — Linux manual page"
                    },
                    {
                        "slug": "bash-scripting-automation",
                        "title": "Basic Bash scripting for system automation",
                        "overview": "Write modular Bash scripts with shebang lines, command-line arguments, variables, conditionals (if/else), and error exits.",
                        "subtopics": [
                            ("Script Robustness", "Using set -euo pipefail to immediately halt execution when errors occur or variables are unset."),
                            ("Conditional Checks and Loops", "Checking file existence with [ -f file ], looping over lists, and executing maintenance steps.")
                        ],
                        "practice": "Write a robust Bash script that checks disk space on / and outputs a warning alert if utilization exceeds 85%.",
                        "url": "https://tldp.org/LDP/Bash-Beginners-Guide/html/",
                        "resource_title": "Bash Guide for Beginners | The Linux Documentation Project"
                    }
                ]
            },
            {
                "slug": "networking-firewalls-dns",
                "title": "Host networking, firewalls and DNS",
                "summary": "Configure network interfaces, set static IP addresses, configure DNS clients, and protect servers with host firewalls.",
                "topics": [
                    {
                        "slug": "network-interfaces-ip-addressing",
                        "title": "Network interface configuration and IP addressing",
                        "overview": "Configure static and DHCP network interfaces using iproute2 commands (ip addr, ip link, ip route) and netplan/NetworkManager.",
                        "subtopics": [
                            ("Inspecting Network State", "Checking interface link states, assigned IP addresses, and default gateway routes."),
                            ("Persistent Interface Configuration", "Writing declarative YAML netplan or ifcfg configuration files.")
                        ],
                        "practice": "Assign a static IP address, subnet mask, and default gateway to a server interface and verify connectivity.",
                        "url": "https://man7.org/linux/man-pages/man8/ip.8.html",
                        "resource_title": "ip(8) — Linux manual page"
                    },
                    {
                        "slug": "hostname-dns-client-setup",
                        "title": "Hostname resolution and DNS client setup",
                        "overview": "Configure local hostname resolution in /etc/hosts, set up DNS resolvers in /etc/resolv.conf, and query records with dig.",
                        "subtopics": [
                            ("NSSwitch Order", "How /etc/nsswitch.conf determines whether /etc/hosts or DNS servers resolve hostnames first."),
                            ("DNS Troubleshooting", "Querying nameservers directly using dig and nslookup to diagnose domain resolution failures.")
                        ],
                        "practice": "Set the server hostname, add a static alias in /etc/hosts, and use dig to query public DNS nameservers.",
                        "url": "https://man7.org/linux/man-pages/man5/resolv.conf.5.html",
                        "resource_title": "resolv.conf(5) — Linux manual page"
                    },
                    {
                        "slug": "firewall-configuration-ufw-nftables",
                        "title": "Firewall configuration with UFW and nftables",
                        "overview": "Harden host network perimeters by configuring default deny policies and allowing only required inbound ports (SSH, HTTP).",
                        "subtopics": [
                            ("Default Deny Ingress", "Blocking all incoming unsolicited connections while allowing established outbound traffic."),
                            ("Port Rules and Rate Limiting", "Allowing specific port numbers or service names and applying connection rate limiting on SSH.")
                        ],
                        "practice": "Configure UFW or nftables to allow incoming SSH and HTTPS while blocking all other unsolicited inbound ports.",
                        "url": "https://man7.org/linux/man-pages/man8/ufw.8.html",
                        "resource_title": "ufw(8) — Linux manual page"
                    },
                    {
                        "slug": "network-troubleshooting-tools",
                        "title": "Network troubleshooting with ping, traceroute, ss",
                        "overview": "Diagnose network latency, route hops, packet loss, and listening sockets using ping, traceroute, and ss.",
                        "subtopics": [
                            ("Socket Inspection with ss", "Listing all open listening TCP/UDP ports and their associated process IDs using ss -tulpn."),
                            ("Tracing Route Paths", "Using traceroute/tracepath to pinpoint exactly which router hop drops network packets.")
                        ],
                        "practice": "Use ss -tulpn to identify all programs currently listening on network ports on your server.",
                        "url": "https://man7.org/linux/man-pages/man8/ss.8.html",
                        "resource_title": "ss(8) — Linux manual page"
                    }
                ]
            },
            {
                "slug": "logging-backups-recovery",
                "title": "Logging, backup and disaster recovery",
                "summary": "Inspect system logs with journalctl, configure logrotate, automate offsite backups with rsync, and test server recovery procedures.",
                "topics": [
                    {
                        "slug": "system-log-inspection-journalctl",
                        "title": "System log inspection with journalctl",
                        "overview": "Query binary systemd journal logs by service unit, priority level (errors/warnings), and timeframe using journalctl.",
                        "subtopics": [
                            ("Filtering Journal Logs", "Querying logs with journalctl -u nginx --since '1 hour ago' -p err."),
                            ("Persistent Journal Storage", "Configuring /etc/systemd/journald.conf to persist logs across server reboots.")
                        ],
                        "practice": "Filter the system journal to view all error-level log entries generated since the last server boot.",
                        "url": "https://man7.org/linux/man-pages/man1/journalctl.1.html",
                        "resource_title": "journalctl(1) — Linux manual page"
                    },
                    {
                        "slug": "log-rotation-syslog-forwarding",
                        "title": "Log rotation and central syslog forwarding",
                        "overview": "Prevent disk space exhaustion by configuring logrotate policies (compress, dateext, maxsize) and forward logs to central syslogs.",
                        "subtopics": [
                            ("Logrotate Configuration", "Writing configuration files in /etc/logrotate.d/ to compress and rotate application logs daily."),
                            ("Rsyslog Forwarding", "Forwarding log events over UDP/TCP to a central log server.")
                        ],
                        "practice": "Create a logrotate configuration file that rotates an application log file weekly, keeps 4 backups, and compresses old logs.",
                        "url": "https://man7.org/linux/man-pages/man8/logrotate.8.html",
                        "resource_title": "logrotate(8) — Linux manual page"
                    },
                    {
                        "slug": "automated-backups-rsync-tar",
                        "title": "Automated backup strategies with rsync and tar",
                        "overview": "Create compressed, encrypted server backups using tar and sync data incrementally to a remote storage server using rsync over SSH.",
                        "subtopics": [
                            ("Incremental Sync with rsync", "Transferring only modified file blocks over SSH using rsync -avz --delete."),
                            ("Archiving with tar", "Creating timestamped tar.gz archives of /etc and application data folders.")
                        ],
                        "practice": "Write an automated backup script that archives /etc and /var/www and syncs them to a remote backup destination with rsync.",
                        "url": "https://man7.org/linux/man-pages/man1/rsync.1.html",
                        "resource_title": "rsync(1) — Linux manual page"
                    },
                    {
                        "slug": "system-recovery-diagnostics",
                        "title": "System recovery runbook and hardware diagnostics",
                        "overview": "Recover unbootable servers using rescue mode, chroot into root filesystems, reset lost passwords, and check hardware health.",
                        "subtopics": [
                            ("Rescue Mode and Chroot", "Booting from live media, mounting root partitions, and running chroot to repair corrupted systems."),
                            ("Hardware Health Checks", "Checking disk SMART health with smartctl and memory integrity with memtest.")
                        ],
                        "practice": "Document a step-by-step disaster recovery runbook detailing how to restore a server from bare metal to running state.",
                        "url": "https://man7.org/linux/man-pages/man1/chroot.1.html",
                        "resource_title": "chroot(1) — Linux manual page"
                    }
                ]
            }
        ]
    },

    # -------------------------------------------------------------
    # 10. Cloud Security Engineer
    # -------------------------------------------------------------
    {
        "slug": "cloud-security-engineer",
        "name": "Cloud Security Engineer",
        "category": "Cybersecurity",
        "short_description": "Secure multi-cloud environments, implement least-privilege IAM policies, defend virtual networks, and automate cloud posture compliance.",
        "responsibilities": [
            "Implement granular least-privilege Identity and Access Management (IAM) policies",
            "Harden cloud network perimeters using security groups, NACLs, and Web Application Firewalls (WAF)",
            "Enforce encryption at rest and in transit across cloud storage, databases, and key vaults",
            "Audit cloud infrastructure for misconfigurations using Cloud Security Posture Management (CSPM)",
            "Automate static security scanning for Infrastructure as Code (IaC) and container images"
        ],
        "representative_work": "A hardened, compliance-audited cloud environment featuring zero-trust IAM roles, automated secret rotation, encrypted storage buckets with public access blocked, container vulnerability scanning in CI/CD, and real-time CloudTrail threat detection.",
        "core_skills": [
            "Cloud shared responsibility model and threat vectors",
            "Least-privilege IAM policy design and role assumption",
            "Multi-factor authentication (MFA) and SSO federation",
            "VPC network defense, security groups, and NACLs",
            "Cloud Key Management Services (KMS) and data encryption",
            "Automated secrets management and credential rotation",
            "Cloud Security Posture Management (CSPM) and CIS Benchmarks",
            "Container and Kubernetes security (image scanning, RBAC)",
            "Infrastructure as Code (IaC) static security analysis",
            "Cloud audit logging (CloudTrail, VPC Flow Logs) and alerting"
        ],
        "milestones": [
            {
                "slug": "cloud-security-foundations-threats",
                "title": "Cloud security architecture and threat models",
                "summary": "Understand cloud shared responsibility, cloud attack surfaces, security standards, and zero trust architecture.",
                "topics": [
                    {
                        "slug": "shared-responsibility-threat-models",
                        "title": "Shared responsibility model across cloud services",
                        "overview": "Differentiate security 'of' the cloud (provider responsibility) from security 'in' the cloud (customer responsibility).",
                        "subtopics": [
                            ("Service-Specific Boundaries", "How customer security obligations change between IaaS, PaaS, and serverless architectures."),
                            ("Common Cloud Attack Vectors", "Analyzing real-world cloud breaches caused by open storage buckets, SSRF, and leaked API credentials.")
                        ],
                        "practice": "Analyze a cloud security incident report and identify which failures fell under customer responsibility.",
                        "url": "https://aws.amazon.com/compliance/shared-responsibility-model/",
                        "resource_title": "Shared Responsibility Model | AWS Compliance"
                    },
                    {
                        "slug": "cloud-threat-landscape",
                        "title": "Cloud threat landscape and attack surfaces",
                        "overview": "Explore the unique attack vectors of cloud environments including metadata service abuse, privileged role pivoting, and control plane attacks.",
                        "subtopics": [
                            ("Instance Metadata Service (IMDSv2)", "How IMDSv2 token-backed sessions defend against SSRF credential theft."),
                            ("Control Plane vs Data Plane", "Protecting cloud administrative APIs from compromised access keys and session hijacking.")
                        ],
                        "practice": "Verify that all cloud virtual instances require IMDSv2 and reject unauthenticated v1 metadata requests.",
                        "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/configuring-instance-metadata-service.html",
                        "resource_title": "Configuring instance metadata service | Amazon EC2 User Guide"
                    },
                    {
                        "slug": "cloud-compliance-cis-benchmarks",
                        "title": "Cloud security standards: CIS Benchmarks and ISO 27017",
                        "overview": "Implement recognized security frameworks including the Center for Internet Security (CIS) Cloud Foundations Benchmarks.",
                        "subtopics": [
                            ("CIS Benchmark Controls", "Mandating root account MFA, disabling inactive credentials, and enabling multi-region audit trails."),
                            ("Compliance Auditing", "Automating compliance checks against regulatory frameworks (SOC 2, ISO 27001, HIPAA).")
                        ],
                        "practice": "Audit a cloud account against the CIS Foundations Benchmark and list the top 3 high-severity non-compliant findings.",
                        "url": "https://www.cisecurity.org/benchmark/amazon_web_services",
                        "resource_title": "CIS AWS Foundations Benchmark | Center for Internet Security"
                    },
                    {
                        "slug": "zero-trust-cloud-architecture",
                        "title": "Zero trust principles in cloud environments",
                        "overview": "Apply Zero Trust architecture: never trust, always verify, enforce continuous authentication, and assume breach.",
                        "subtopics": [
                            ("Micro-Segmentation", "Eliminating flat network perimeters and requiring mutual authentication for inter-service calls."),
                            ("Context-Aware Access", "Evaluating user identity, device health, and network location on every resource request.")
                        ],
                        "practice": "Draft a zero-trust network diagram showing micro-segmentation and token verification between application microservices.",
                        "url": "https://csrc.nist.gov/pubs/sp/800/207/final",
                        "resource_title": "Zero Trust Architecture (SP 800-207) | NIST"
                    }
                ]
            },
            {
                "slug": "cloud-iam-least-privilege",
                "title": "Cloud Identity and Access Management (IAM)",
                "summary": "Design granular IAM policies, enforce least privilege, configure MFA and SSO federation, and audit privileged roles.",
                "topics": [
                    {
                        "slug": "iam-policies-least-privilege",
                        "title": "IAM policies, roles and least-privilege principles",
                        "overview": "Write restrictive JSON IAM policies specifying explicit Effects, Actions, Resources, and Conditions.",
                        "subtopics": [
                            ("Policy Evaluation Logic", "Understanding how explicit denies override allows, and why wildcard (*) permissions are dangerous."),
                            ("Condition Keys", "Restricting API actions based on source IP, MFA status, or date using Condition blocks.")
                        ],
                        "practice": "Write an IAM policy that allows read-only access to a specific storage bucket only if the request uses MFA.",
                        "url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html",
                        "resource_title": "Policies and permissions in IAM | AWS IAM User Guide"
                    },
                    {
                        "slug": "mfa-sso-federation",
                        "title": "Multi-factor authentication and SSO federation",
                        "overview": "Enforce hardware or virtual MFA across all human accounts and integrate enterprise Single Sign-On (SSO) using SAML 2.0 or OIDC.",
                        "subtopics": [
                            ("Federated Identity", "Federating corporate identity providers (Okta, Azure AD, Google) into cloud accounts via OIDC."),
                            ("Eliminating Long-Lived Credentials", "Replacing static IAM user access keys with short-lived federated session tokens.")
                        ],
                        "practice": "Configure an IAM role that can only be assumed by a federated web identity provider with valid OIDC tokens.",
                        "url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers.html",
                        "resource_title": "Identity providers and federation | AWS IAM User Guide"
                    },
                    {
                        "slug": "cross-account-roles-assumption",
                        "title": "Cross-account access and role assumption",
                        "overview": "Establish secure cross-account access using IAM role assumption (sts:AssumeRole) and external ID validation.",
                        "subtopics": [
                            ("Trust Relationships", "Configuring trust policies that specify exactly which external account principals may assume a role."),
                            ("The Confused Deputy Problem", "Using external IDs in trust policies to prevent cross-account privilege escalation.")
                        ],
                        "practice": "Configure a trust policy allowing an external audit account to assume a security-audit role using an external ID.",
                        "url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user.html",
                        "resource_title": "Creating a role to delegate permissions | AWS IAM User Guide"
                    },
                    {
                        "slug": "iam-credential-auditing-escalation",
                        "title": "IAM credential auditing and privilege escalation defense",
                        "overview": "Audit unused IAM credentials, identify privilege escalation paths (e.g., iam:PassRole abuses), and remove dormant keys.",
                        "subtopics": [
                            ("Credential Reports", "Generating and parsing automated IAM credential reports to find keys older than 90 days."),
                            ("Privilege Escalation Paths", "Identifying misconfigured policies that allow unprivileged users to attach admin policies to themselves.")
                        ],
                        "practice": "Run an IAM credential report and write a script that flags all access keys that have not been used in the past 60 days.",
                        "url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_getting-report.html",
                        "resource_title": "Getting credential reports | AWS IAM User Guide"
                    }
                ]
            },
            {
                "slug": "network-defense-perimeter-security",
                "title": "Cloud network defense and perimeter security",
                "summary": "Configure VPC security groups, network ACLs, deploy Web Application Firewalls (WAF), and secure private endpoints.",
                "topics": [
                    {
                        "slug": "vpc-isolation-security-groups",
                        "title": "VPC network isolation, subnets and route tables",
                        "overview": "Design isolated network tiers, verify that database subnets have no route to an internet gateway, and inspect route tables.",
                        "subtopics": [
                            ("Network Tiering", "Separating DMZ public ingress from private application logic and isolated database tiers."),
                            ("Routing Audits", "Ensuring private subnet route tables route outbound internet traffic strictly through NAT gateways.")
                        ],
                        "practice": "Audit the route tables of a VPC to confirm that no private database subnet possesses a route to an internet gateway.",
                        "url": "https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Route_Tables.html",
                        "resource_title": "Route tables | Amazon VPC User Guide"
                    },
                    {
                        "slug": "security-groups-vs-nacls",
                        "title": "Security groups, NACLs and stateful firewalls",
                        "overview": "Implement defense-in-depth using stateful instance-level Security Groups combined with stateless subnet-level Network ACLs.",
                        "subtopics": [
                            ("Stateful vs Stateless", "Why security groups automatically allow return response traffic while NACLs require explicit return rules."),
                            ("Restricting Inbound Scope", "Restricting administrative SSH/RDP rules to specific corporate VPN CIDRs rather than 0.0.0.0/0.")
                        ],
                        "practice": "Configure a Security Group allowing port 443 only from an Application Load Balancer security group ID.",
                        "url": "https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html",
                        "resource_title": "Security groups | Amazon VPC User Guide"
                    },
                    {
                        "slug": "cloud-waf-ddos-mitigation",
                        "title": "Web Application Firewalls (WAF) and DDoS mitigation",
                        "overview": "Protect public APIs and websites from SQL injection, cross-site scripting (XSS), rate abuse, and DDoS attacks.",
                        "subtopics": [
                            ("Managed WAF Rule Sets", "Enabling OWASP Top 10 managed rule sets and known malicious IP reputation lists."),
                            ("Rate-Based Rules", "Throttling individual client IP addresses that exceed 500 requests per 5 minutes.")
                        ],
                        "practice": "Deploy a WAF Web ACL in front of a web endpoint with a rate-based rule and an SQL injection blocking rule.",
                        "url": "https://docs.aws.amazon.com/waf/latest/developerguide/what-is-aws-waf.html",
                        "resource_title": "What is AWS WAF? | AWS WAF Developer Guide"
                    },
                    {
                        "slug": "private-endpoints-vpc-peering-sec",
                        "title": "Private endpoints and VPC peering security",
                        "overview": "Keep cloud API traffic entirely off the public internet using private endpoints (PrivateLink / Private Service Connect).",
                        "subtopics": [
                            ("VPC Endpoints", "Accessing S3, DynamoDB, and secrets managers over private AWS network links without using public IPs."),
                            ("Endpoint Policies", "Attaching restrictive resource policies to VPC endpoints allowing access only to internal corporate buckets.")
                        ],
                        "practice": "Create a VPC endpoint for object storage and verify that an instance can download objects with zero internet access.",
                        "url": "https://docs.aws.amazon.com/vpc/latest/privatelink/what-is-privatelink.html",
                        "resource_title": "What is AWS PrivateLink? | AWS PrivateLink Guide"
                    }
                ]
            },
            {
                "slug": "data-protection-encryption-secrets",
                "title": "Data protection, encryption and secrets",
                "summary": "Enforce encryption at rest and in transit, manage cryptographic keys with KMS, and automate secret credential rotation.",
                "topics": [
                    {
                        "slug": "data-classification-discovery",
                        "title": "Data classification and sensitive data discovery",
                        "overview": "Classify data by sensitivity (Public, Internal, Confidential, Restricted) and use automated scanners (e.g. Amazon Macie) to detect PII.",
                        "subtopics": [
                            ("Classification Tiers", "Mapping regulatory requirements to handling procedures for PII, financial, and health records."),
                            ("Automated PII Scanning", "Running machine-learning discovery jobs across storage buckets to detect exposed credit cards or social security numbers.")
                        ],
                        "practice": "Run an automated sensitive data discovery scan across a sample storage bucket and generate a findings report.",
                        "url": "https://docs.aws.amazon.com/macie/latest/user/what-is-macie.html",
                        "resource_title": "What is Amazon Macie? | Amazon Macie User Guide"
                    },
                    {
                        "slug": "kms-encryption-rest-transit",
                        "title": "Encryption at rest and in transit (TLS, KMS)",
                        "overview": "Implement envelope encryption with Key Management Service (KMS), configure customer-managed keys (CMK), and mandate TLS 1.3.",
                        "subtopics": [
                            ("Envelope Encryption", "How KMS customer master keys encrypt lightweight data keys that encrypt database records."),
                            ("Enforcing HTTPS/TLS", "Configuring load balancers and storage endpoints to reject unencrypted HTTP requests and old SSL ciphers.")
                        ],
                        "practice": "Create a customer-managed KMS key with a restrictive key policy and encrypt an EBS storage volume with it.",
                        "url": "https://docs.aws.amazon.com/kms/latest/developerguide/overview.html",
                        "resource_title": "AWS Key Management Service concepts | AWS KMS Docs"
                    },
                    {
                        "slug": "secrets-management-rotation",
                        "title": "Secrets management and automated rotation",
                        "overview": "Store database passwords, API tokens, and private certificates in cloud secret stores with automated rotation Lambdas.",
                        "subtopics": [
                            ("Eliminating Hardcoded Secrets", "Fetching credentials dynamically at runtime using secret manager APIs."),
                            ("Automated Credential Rotation", "Configuring secret managers to rotate database passwords every 30 days without downtime.")
                        ],
                        "practice": "Store a database password in a secrets manager, configure an automated rotation policy, and retrieve it using the CLI.",
                        "url": "https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html",
                        "resource_title": "What is AWS Secrets Manager? | AWS Secrets Manager User Guide"
                    },
                    {
                        "slug": "storage-bucket-hardening",
                        "title": "Storage bucket hardening and public access blocks",
                        "overview": "Lock down cloud storage buckets by enabling account-level Public Access Blocks, bucket policies, and object versioning.",
                        "subtopics": [
                            ("Account-Level S3 Block Public Access", "Enabling global guardrails that prevent any bucket from ever being made public."),
                            ("Enforcing TLS in Bucket Policies", "Writing bucket policies that deny s3:GetObject requests unless aws:SecureTransport is true.")
                        ],
                        "practice": "Apply a bucket policy requiring HTTPS and verify that attempting to download an object over plain HTTP is denied.",
                        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html",
                        "resource_title": "Blocking public access to S3 storage | Amazon S3 Docs"
                    }
                ]
            },
            {
                "slug": "workload-and-container-security",
                "title": "Cloud workload and container security",
                "summary": "Harden virtual machine images, scan container images for CVEs in CI/CD, and configure Kubernetes RBAC and network policies.",
                "topics": [
                    {
                        "slug": "vm-image-hardening-patching",
                        "title": "Virtual machine image hardening and patching",
                        "overview": "Build hardened base OS images using CIS Benchmarks, remove unnecessary services, and automate security patching with SSM.",
                        "subtopics": [
                            ("Golden Image Pipelines", "Using Packer to bake standardized, hardened machine images with pre-installed security agents."),
                            ("Automated Patch Baselines", "Enforcing patch baselines that automatically install critical OS security updates weekly.")
                        ],
                        "practice": "Scan a running virtual machine for outdated packages and apply an automated patch baseline using a systems manager.",
                        "url": "https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-patch.html",
                        "resource_title": "AWS Systems Manager Patch Manager | AWS Docs"
                    },
                    {
                        "slug": "container-image-vulnerability-scanning",
                        "title": "Container image vulnerability scanning",
                        "overview": "Scan container base images and application dependencies for known Common Vulnerabilities and Exposures (CVEs) in CI/CD.",
                        "subtopics": [
                            ("Container Registry Scanning", "Configuring Amazon ECR or Harbor to scan images automatically on push."),
                            ("CI/CD Vulnerability Gates", "Using Trivy or Grype in build pipelines to block image builds containing critical CVEs.")
                        ],
                        "practice": "Scan a Docker container image with Trivy and output a report categorizing vulnerabilities by severity.",
                        "url": "https://docs.docker.com/scout/",
                        "resource_title": "Docker Scout | Docker Docs"
                    },
                    {
                        "slug": "kubernetes-rbac-network-policies",
                        "title": "Kubernetes RBAC and network policies",
                        "overview": "Secure managed Kubernetes clusters (EKS/GKE) using Role-Based Access Control, pod security standards, and network policies.",
                        "subtopics": [
                            ("Kubernetes RBAC", "Defining Roles and RoleBindings to restrict developer and service account API privileges."),
                            ("Pod Network Policies", "Creating declarative network policies that restrict inter-pod network communication.")
                        ],
                        "practice": "Write a Kubernetes NetworkPolicy that allows traffic into a backend pod only from pods with the label role=frontend.",
                        "url": "https://kubernetes.io/docs/concepts/security/overview/",
                        "resource_title": "Overview of Cloud Native Security | Kubernetes Documentation"
                    },
                    {
                        "slug": "runtime-threat-detection",
                        "title": "Runtime threat detection and anomaly alerting",
                        "overview": "Detect active intrusions and anomalous behavior in cloud workloads using threat detection engines (e.g. GuardDuty, Falco).",
                        "subtopics": [
                            ("Intelligent Threat Detection", "Analyzing VPC flow logs, DNS queries, and Kubernetes audit logs for indicators of compromise (IoC)."),
                            ("Crypto-Mining and C2 Detection", "Detecting unauthorized crypto-mining processes and outbound connections to known Command and Control (C2) servers.")
                        ],
                        "practice": "Enable a cloud threat detection service (e.g. GuardDuty) and generate a sample threat finding to test alert notifications.",
                        "url": "https://docs.aws.amazon.com/guardduty/latest/ug/what-is-guardduty.html",
                        "resource_title": "What is Amazon GuardDuty? | GuardDuty User Guide"
                    }
                ]
            },
            {
                "slug": "cspm-iac-incident-response",
                "title": "Cloud Security Posture Management and automation",
                "summary": "Deploy CSPM tools for drift detection, scan IaC with checkov, audit logs with CloudTrail, and build automated incident response playbooks.",
                "topics": [
                    {
                        "slug": "cspm-drift-detection",
                        "title": "CSPM tools and automated drift detection",
                        "overview": "Maintain continuous visibility over cloud asset configurations and remediate compliance drift automatically using CSPM tools.",
                        "subtopics": [
                            ("Configuration Auditing", "Using AWS Config or cloud posture tools to record all configuration changes over time."),
                            ("Automated Remediation", "Triggering automated serverless functions to close security group ports opened accidentally.")
                        ],
                        "practice": "Create a configuration rule that flags any security group allowing inbound port 22 from 0.0.0.0/0 as non-compliant.",
                        "url": "https://docs.aws.amazon.com/config/latest/developerguide/WhatIsConfig.html",
                        "resource_title": "What is AWS Config? | AWS Config Developer Guide"
                    },
                    {
                        "slug": "iac-security-scanning",
                        "title": "Infrastructure as Code (IaC) security scanning",
                        "overview": "Shift cloud security left by scanning Terraform and CloudFormation templates for security misconfigurations before deployment.",
                        "subtopics": [
                            ("Static IaC Analysis", "Using tools like Checkov, tfsec, or KICS in CI/CD pipelines to detect unencrypted disks and public buckets."),
                            ("Enforcing Security Baselines", "Failing pull requests automatically if newly proposed IaC configurations violate security policies.")
                        ],
                        "practice": "Scan a Terraform configuration repository with Checkov and resolve 3 flagged security misconfigurations.",
                        "url": "https://www.checkov.io/1.Welcome/What%20is%20Checkov.html",
                        "resource_title": "What is Checkov? | Checkov Documentation"
                    },
                    {
                        "slug": "cloud-audit-logging-cloudtrail",
                        "title": "Cloud audit logging: CloudTrail and flow logs",
                        "overview": "Record and analyze all API calls and management events across your cloud organization using immutable multi-region audit logs.",
                        "subtopics": [
                            ("Multi-Region CloudTrail", "Ensuring audit logging is enabled across all regions and log files are validated with SHA256 hashing."),
                            ("VPC Flow Logs", "Capturing network IP traffic flows for security forensics and threat hunting.")
                        ],
                        "practice": "Enable a multi-region audit trail with log file integrity validation enabled and query recent console logins.",
                        "url": "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html",
                        "resource_title": "What is AWS CloudTrail? | AWS CloudTrail User Guide"
                    },
                    {
                        "slug": "cloud-incident-response-playbooks",
                        "title": "Incident response playbook for compromised cloud credentials",
                        "overview": "Execute structured incident response: revoke compromised IAM sessions, rotate keys, isolate instances, and preserve forensic evidence.",
                        "subtopics": [
                            ("Containment Procedures", "Attaching an explicit DenyAll policy to a compromised IAM user and terminating active sessions."),
                            ("Forensic Disk Snapshots", "Creating isolated forensic snapshots of infected virtual machine disks for offline forensic analysis.")
                        ],
                        "practice": "Execute an incident response drill: isolate a simulated compromised virtual instance by swapping its security group to a quarantine group.",
                        "url": "https://docs.aws.amazon.com/whitepapers/latest/aws-security-incident-response-guide/welcome.html",
                        "resource_title": "AWS Security Incident Response Guide | AWS Whitepapers"
                    }
                ]
            }
        ]
    },

    # -------------------------------------------------------------
    # 11. Linux Systems Engineer
    # -------------------------------------------------------------
    {
        "slug": "linux-systems-engineer",
        "name": "Linux Systems Engineer",
        "category": "Hardware & Embedded Systems",
        "short_description": "Engineer high-performance Linux systems, write system-level C and Bash software, program kernel calls, and analyze kernel observability.",
        "responsibilities": [
            "Write robust systems-level software in C and advanced POSIX shell scripting",
            "Interact directly with Linux kernel system calls, memory management, and file descriptors",
            "Implement inter-process communication (IPC) using pipes, Unix domain sockets, and shared memory",
            "Build and inspect loadable Linux kernel modules (LKM) and hardware device drivers",
            "Diagnose low-level performance bottlenecks using eBPF, strace, perf, and sysctl tunables"
        ],
        "representative_work": "A high-performance C systems daemon and loadable Linux kernel module featuring low-level system call interaction, multi-process IPC, custom `/proc` telemetry, and eBPF observability tracing.",
        "core_skills": [
            "Linux kernel architecture and memory management",
            "System calls (syscalls) and glibc interfaces",
            "Advanced POSIX shell scripting, awk, and sed",
            "Systems programming in C and GCC toolchains",
            "File descriptors, non-blocking I/O, and select/epoll",
            "Process lifecycles (fork, exec, wait, signals)",
            "Inter-process communication (pipes, shared memory, sockets)",
            "Loadable kernel modules (LKM) and device nodes (/dev)",
            "Kernel parameter tuning via sysctl, /proc, and /sys",
            "Low-level observability with eBPF, strace, and perf"
        ],
        "milestones": [
            {
                "slug": "linux-kernel-architecture-syscalls",
                "title": "Linux kernel architecture and system calls",
                "summary": "Understand the user space vs kernel space boundary, the system call interface, virtual memory, and virtual filesystems.",
                "topics": [
                    {
                        "slug": "kernel-space-vs-user-space",
                        "title": "Kernel space vs user space architecture",
                        "overview": "Understand CPU privilege rings, monolithic kernel architecture, and the boundary protecting hardware from user applications.",
                        "subtopics": [
                            ("Privilege Rings and Context Switches", "How x86/ARM CPU rings enforce memory isolation between ring 0 (kernel) and ring 3 (user space)."),
                            ("Monolithic Kernel Design", "How core drivers, filesystems, and network stacks execute inside shared kernel memory space.")
                        ],
                        "practice": "Inspect CPU execution modes and memory segmentation using lscpu and /proc/cpuinfo.",
                        "url": "https://www.kernel.org/doc/html/latest/admin-guide/index.html",
                        "resource_title": "The Linux kernel user's and administrator's guide | kernel.org"
                    },
                    {
                        "slug": "linux-syscall-interface",
                        "title": "Linux system call interface and glibc",
                        "overview": "Learn how user space programs request kernel services using software interrupts, syscall instructions, and glibc wrappers.",
                        "subtopics": [
                            ("The Syscall Mechanism", "How registers pass system call numbers and arguments before switching to kernel mode."),
                            ("Standard C Library Wrappers", "How glibc wraps raw kernel syscalls and sets errno on failure.")
                        ],
                        "practice": "Trace all system calls invoked by a simple command (such as 'ls') using strace and identify the openat and read calls.",
                        "url": "https://man7.org/linux/man-pages/man2/syscalls.2.html",
                        "resource_title": "syscalls(2) — Linux manual page"
                    },
                    {
                        "slug": "virtual-memory-pages-swap",
                        "title": "Virtual memory, pages and swap mechanics",
                        "overview": "Understand virtual address spaces, Memory Management Units (MMU), page tables, 4KB memory pages, page faults, and swap.",
                        "subtopics": [
                            ("Virtual Memory Translation", "How the MMU translates virtual process memory addresses into physical RAM frames."),
                            ("Page Faults and Swapping", "Handling major vs minor page faults, demand paging, and swapping inactive pages to disk.")
                        ],
                        "practice": "Inspect virtual memory statistics of a process by reading /proc/[pid]/smaps and running vmstat 1 5.",
                        "url": "https://man7.org/linux/man-pages/man8/vmstat.8.html",
                        "resource_title": "vmstat(8) — Linux manual page"
                    },
                    {
                        "slug": "proc-and-sys-virtual-filesystems",
                        "title": "The /proc and /sys virtual filesystems",
                        "overview": "Interact with kernel data structures and hardware device trees exposed dynamically as text files in /proc and /sys.",
                        "subtopics": [
                            ("The /proc Filesystem", "Reading kernel runtime statistics, process maps (/proc/[pid]/maps), and hardware info (/proc/meminfo)."),
                            ("The /sys (sysfs) Tree", "Inspecting bus hierarchies, block devices, and network interface settings exposed in sysfs.")
                        ],
                        "practice": "Read process statistics, command line arguments, and open file descriptors directly from the /proc directory.",
                        "url": "https://man7.org/linux/man-pages/man5/proc.5.html",
                        "resource_title": "proc(5) — Linux manual page"
                    }
                ]
            },
            {
                "slug": "advanced-shell-text-processing",
                "title": "Advanced shell scripting and text processing",
                "summary": "Master POSIX shell scripting, signal handling, text manipulation with sed and awk, and script debugging.",
                "topics": [
                    {
                        "slug": "posix-shell-signal-trapping",
                        "title": "POSIX shell scripting and signal trapping",
                        "overview": "Write portable, robust POSIX shell scripts that handle process exit codes, parse flags, and trap OS signals (SIGINT, SIGTERM).",
                        "subtopics": [
                            ("Signal Trapping with trap", "Registering cleanup functions that delete temporary files when a script is interrupted."),
                            ("Parsing Command Flags", "Using getopts to parse standard short command-line flags (-h, -f, -v).")
                        ],
                        "practice": "Write a shell script with a trap handler that cleans up temporary scratch files upon unexpected script cancellation.",
                        "url": "https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html",
                        "resource_title": "Shell Command Language | POSIX Standard"
                    },
                    {
                        "slug": "stream-editing-sed",
                        "title": "Text stream processing with sed",
                        "overview": "Transform, filter, and substitute text streams non-interactively using stream editor (sed) regular expressions.",
                        "subtopics": [
                            ("Search and Replace", "Using s/pattern/replacement/g to modify configuration files in-place with sed -i."),
                            ("Line Addressing and Deletions", "Targeting specific line numbers or matching regex ranges for text modification.")
                        ],
                        "practice": "Write a sed command that comments out all lines matching a specific directive in an Nginx or SSH configuration file.",
                        "url": "https://www.gnu.org/software/sed/manual/sed.html",
                        "resource_title": "GNU sed manual"
                    },
                    {
                        "slug": "text-processing-awk",
                        "title": "Advanced data processing with awk",
                        "overview": "Parse structured columnar log files, compute column totals, and generate formatted reports using the awk programming language.",
                        "subtopics": [
                            ("Pattern-Action Syntax", "Using BEGIN, pattern matches, field separators (-F), and END summary blocks in awk."),
                            ("Associative Arrays in awk", "Aggregating counts and sums grouped by IP address or HTTP status code.")
                        ],
                        "practice": "Write an awk script that parses a web server access log and prints the top 5 IP addresses generating 404 errors.",
                        "url": "https://www.gnu.org/software/gawk/manual/gawk.html",
                        "resource_title": "GAWK: Effective AWK Programming | GNU"
                    },
                    {
                        "slug": "script-debugging-profiling",
                        "title": "Script debugging, profiling and error handling",
                        "overview": "Debug complex shell scripts using tracing flags (set -x), validate syntax with shellcheck, and handle pipeline errors safely.",
                        "subtopics": [
                            ("Strict Mode Execution", "Why using set -euo pipefail prevents silent bugs when variables are undefined or commands fail."),
                            ("Static Shell Analysis", "Using ShellCheck to catch syntax bugs, quoting issues, and portability errors before execution.")
                        ],
                        "practice": "Audit an existing shell script using ShellCheck and resolve all reported quoting and error-handling warnings.",
                        "url": "https://www.shellcheck.net/",
                        "resource_title": "ShellCheck: a shell script static analysis tool"
                    }
                ]
            },
            {
                "slug": "systems-programming-c-foundations",
                "title": "Systems programming and C foundations",
                "summary": "Master C memory management, pointers, compilation with GCC/Make, low-level file I/O, and process creation.",
                "topics": [
                    {
                        "slug": "c-compilation-toolchain-gcc",
                        "title": "C compilation toolchain (gcc, make)",
                        "overview": "Understand the C build stages: preprocessor, compilation, assembly, and linking, and automate builds using Makefiles.",
                        "subtopics": [
                            ("The Compilation Stages", "How gcc transforms C source into object files (.o) and links dynamic libraries (.so)."),
                            ("Writing Makefiles", "Defining targets, dependencies, compiler flags (-Wall -Wextra -O2), and clean recipes.")
                        ],
                        "practice": "Write a Makefile that compiles a multi-file C program with strict compiler warning flags into a binary.",
                        "url": "https://www.gnu.org/software/make/manual/make.html",
                        "resource_title": "GNU Make Manual"
                    },
                    {
                        "slug": "memory-pointers-stack-heap",
                        "title": "Memory allocation, pointers and stack vs heap",
                        "overview": "Master pointer arithmetic, stack frames, heap allocation (malloc, calloc, realloc, free), and prevent memory leaks.",
                        "subtopics": [
                            ("Pointers and Memory Addresses", "Dereferencing memory addresses, passing pointers to functions, and double pointers."),
                            ("Dynamic Memory Management", "Allocating dynamic heap memory and using Valgrind to detect memory leaks and buffer overflows.")
                        ],
                        "practice": "Write a C program that dynamically allocates a resizable array of integers and verify zero memory leaks with Valgrind.",
                        "url": "https://man7.org/linux/man-pages/man3/malloc.3.html",
                        "resource_title": "malloc(3) — Linux manual page"
                    },
                    {
                        "slug": "file-descriptors-lowlevel-io",
                        "title": "File descriptors, low-level I/O and buffering",
                        "overview": "Perform low-level system I/O using open, read, write, close, and lseek system calls, and compare with buffered stdio.",
                        "subtopics": [
                            ("The File Descriptor Table", "How integer file descriptors index the kernel's open file table across processes."),
                            ("Direct vs Buffered I/O", "Comparing unbuffered low-level read/write syscalls with buffered stdio (fopen, fread).")
                        ],
                        "practice": "Write a C utility that copies a file using the open, read, write, and close system calls with a fixed 4KB buffer.",
                        "url": "https://man7.org/linux/man-pages/man2/read.2.html",
                        "resource_title": "read(2) — Linux manual page"
                    },
                    {
                        "slug": "process-creation-fork-exec",
                        "title": "Process creation with fork, exec and wait",
                        "overview": "Create child processes with fork, replace process memory with execve, prevent zombie processes, and collect exit statuses with waitpid.",
                        "subtopics": [
                            ("The Fork-Exec Pattern", "How fork clones the parent process address space and exec replaces it with a new executable."),
                            ("Zombie and Orphan Processes", "How uncollected child exit statuses become zombies until reaped by waitpid or PID 1.")
                        ],
                        "practice": "Write a minimal command-line shell in C that forks a child process, executes a command with execvp, and waits for completion.",
                        "url": "https://man7.org/linux/man-pages/man2/fork.2.html",
                        "resource_title": "fork(2) — Linux manual page"
                    }
                ]
            },
            {
                "slug": "ipc-and-concurrency",
                "title": "Inter-process communication and concurrency",
                "summary": "Coordinate processes using Unix pipes, signals, shared memory, semaphores, and POSIX multithreading (pthreads).",
                "topics": [
                    {
                        "slug": "pipes-and-named-fifos",
                        "title": "Unix pipes and named FIFOs",
                        "overview": "Transfer unidirectional byte streams between processes using anonymous pipes (pipe) and named pipes (mkfifo) in the filesystem.",
                        "subtopics": [
                            ("Anonymous Kernel Pipes", "Creating pipe file descriptors and redirecting child stdout to parent stdin."),
                            ("Named Pipes (FIFOs)", "Creating persistent filesystem nodes that allow unrelated processes to stream data.")
                        ],
                        "practice": "Write a C program where a parent process creates a pipe, forks a child, and sends a message through the pipe.",
                        "url": "https://man7.org/linux/man-pages/man2/pipe.2.html",
                        "resource_title": "pipe(2) — Linux manual page"
                    },
                    {
                        "slug": "posix-signals-handlers",
                        "title": "POSIX signals and signal handlers",
                        "overview": "Handle asynchronous kernel notifications using sigaction, block signals with sigprocmask, and handle real-time signals.",
                        "subtopics": [
                            ("Reliable Signal Handling", "Using sigaction to register safe handler functions and avoiding reentrancy hazards."),
                            ("Async-Signal-Safe Functions", "Why standard functions like printf and malloc must never be called inside a signal handler.")
                        ],
                        "practice": "Write a C daemon that catches SIGINT and SIGTERM, performs clean file shutdowns, and exits gracefully.",
                        "url": "https://man7.org/linux/man-pages/man2/sigaction.2.html",
                        "resource_title": "sigaction(2) — Linux manual page"
                    },
                    {
                        "slug": "shared-memory-semaphores",
                        "title": "Shared memory and semaphores",
                        "overview": "Share memory regions directly between processes using shm_open and mmap, and synchronize access using POSIX semaphores.",
                        "subtopics": [
                            ("Shared Memory (shm_open, mmap)", "Mapping the same physical RAM frame into the virtual address spaces of two processes."),
                            ("Semaphores and Mutexes", "Preventing race conditions when multiple processes read and write to shared memory.")
                        ],
                        "practice": "Write a producer-consumer application using POSIX shared memory and semaphores to coordinate data updates.",
                        "url": "https://man7.org/linux/man-pages/man3/shm_open.3.html",
                        "resource_title": "shm_open(3) — Linux manual page"
                    },
                    {
                        "slug": "posix-threads-pthreads",
                        "title": "Multithreading with POSIX threads (pthreads)",
                        "overview": "Create lightweight threads within a process address space using pthread_create, synchronize with mutexes, and avoid deadlocks.",
                        "subtopics": [
                            ("Thread Creation and Joining", "Creating concurrent execution threads and waiting for thread completion with pthread_join."),
                            ("Thread Synchronization", "Using pthread_mutex_t and condition variables to prevent shared memory race conditions.")
                        ],
                        "practice": "Write a multi-threaded C program where 4 worker threads increment a shared counter protected by a mutex.",
                        "url": "https://man7.org/linux/man-pages/man3/pthread_create.3.html",
                        "resource_title": "pthread_create(3) — Linux manual page"
                    }
                ]
            },
            {
                "slug": "kernel-modules-drivers",
                "title": "Linux kernel modules and driver basics",
                "summary": "Understand loadable kernel modules (LKM), module lifecycles, character devices, /dev nodes, and compile a hello-world module.",
                "topics": [
                    {
                        "slug": "lkm-architecture-lifecycle",
                        "title": "Kernel module structure and lifecycles",
                        "overview": "Learn how Loadable Kernel Modules (LKM) extend the running kernel dynamically without rebooting the operating system.",
                        "subtopics": [
                            ("Module Initialization and Exit", "Defining module_init() and module_exit() entry points and kernel licensing macros."),
                            ("Kernel Log Ring Buffer", "Printing kernel debug messages using printk() and inspecting them with dmesg.")
                        ],
                        "practice": "Inspect loaded kernel modules on your machine using lsmod and examine module details with modinfo.",
                        "url": "https://man7.org/linux/man-pages/man8/lsmod.8.html",
                        "resource_title": "lsmod(8) — Linux manual page"
                    },
                    {
                        "slug": "loading-inspecting-modules",
                        "title": "Loading and inspecting modules (insmod, modprobe)",
                        "overview": "Insert and remove kernel modules using insmod, rmmod, and modprobe, and manage dependency mappings with depmod.",
                        "subtopics": [
                            ("Modprobe vs Insmod", "Why modprobe is preferred because it resolves module dependency chains automatically."),
                            ("Module Parameters", "Passing configuration parameters into kernel modules upon loading via module_param().")
                        ],
                        "practice": "Use modprobe to load and unload a benign kernel module (e.g. dummy network module) and check dmesg output.",
                        "url": "https://man7.org/linux/man-pages/man8/modprobe.8.html",
                        "resource_title": "modprobe(8) — Linux manual page"
                    },
                    {
                        "slug": "character-devices-udev-rules",
                        "title": "Character device nodes in /dev and udev rules",
                        "overview": "Understand character device drivers, major and minor device numbers, and writing udev rules to manage device node creation.",
                        "subtopics": [
                            ("Major and Minor Numbers", "How the kernel uses major numbers to identify the driver and minor numbers to identify specific devices."),
                            ("Udev Rules Engine", "Creating persistent symlinks and setting permissions when hardware devices connect.")
                        ],
                        "practice": "Write a udev rule that sets custom permissions and creates a symlink whenever a USB device connects.",
                        "url": "https://man7.org/linux/man-pages/man7/udev.7.html",
                        "resource_title": "udev(7) — Linux manual page"
                    },
                    {
                        "slug": "compiling-hello-world-kernel-module",
                        "title": "Writing and compiling a minimal hello-world kernel module",
                        "overview": "Write, compile using kbuild, insert, and remove a minimal C loadable kernel module on a Linux system.",
                        "subtopics": [
                            ("The Kbuild Makefile", "Using obj-m += module.o and the kernel headers build directory (/lib/modules/$(uname -r)/build)."),
                            ("Executing in Ring 0", "Understanding safety hazards: null pointer dereferences cause kernel panics, not simple segfaults.")
                        ],
                        "practice": "Compile a hello-world kernel module that logs a message to dmesg on load and a farewell message on unload.",
                        "url": "https://www.kernel.org/doc/html/latest/kbuild/modules.html",
                        "resource_title": "Building External Modules | The Linux Kernel Documentation"
                    }
                ]
            },
            {
                "slug": "kernel-tuning-observability",
                "title": "Kernel tuning, observability and systems automation",
                "summary": "Tune kernel parameters via sysctl, trace execution with strace and perf, explore eBPF tracing, and build a systems monitoring daemon.",
                "topics": [
                    {
                        "slug": "kernel-tuning-sysctl",
                        "title": "Kernel parameter tuning with sysctl",
                        "overview": "Tune kernel network buffers, virtual memory swappiness, and file descriptor limits dynamically via sysctl and /etc/sysctl.conf.",
                        "subtopics": [
                            ("Virtual Memory Tunables", "Tuning vm.swappiness, vm.dirty_ratio, and vm.overcommit_memory for server workloads."),
                            ("Network Stack Tunables", "Increasing net.core.somaxconn and tcp_tw_reuse to handle high-concurrency web traffic.")
                        ],
                        "practice": "Tune a kernel parameter using sysctl -w and persist the setting across reboots in /etc/sysctl.d/99-custom.conf.",
                        "url": "https://man7.org/linux/man-pages/man8/sysctl.8.html",
                        "resource_title": "sysctl(8) — Linux manual page"
                    },
                    {
                        "slug": "tracing-strace-ltrace",
                        "title": "Tracing execution with strace and ltrace",
                        "overview": "Diagnose application crashes, missing configuration files, and permission denials by tracing system calls and library calls.",
                        "subtopics": [
                            ("Syscall Timing and Counts", "Using strace -c to generate a summary table of syscall counts, errors, and time spent in the kernel."),
                            ("Attaching to Running Processes", "Attaching strace -p [pid] to live production processes to diagnose hangs.")
                        ],
                        "practice": "Trace a failing command with strace to identify the exact file path that caused a 'file not found' or permission error.",
                        "url": "https://man7.org/linux/man-pages/man1/strace.1.html",
                        "resource_title": "strace(1) — Linux manual page"
                    },
                    {
                        "slug": "performance-analysis-perf-ebpf",
                        "title": "Linux performance analysis tools (perf, eBPF basics)",
                        "overview": "Profile CPU cache misses, function call overhead with perf, and explore programmable in-kernel tracing with eBPF.",
                        "subtopics": [
                            ("CPU Sampling with perf", "Recording CPU cycles with perf record and generating flame graphs to visualize hot code paths."),
                            ("eBPF Programmable Tracing", "How Extended Berkeley Packet Filter (eBPF) runs sandboxed bytecode safely inside the kernel for observability.")
                        ],
                        "practice": "Record a CPU profile of a busy command using perf record and view the function call overhead using perf report.",
                        "url": "https://perf.wiki.kernel.org/index.php/Main_Page",
                        "resource_title": "Linux perf Wiki | kernel.org"
                    },
                    {
                        "slug": "systems-automation-daemon",
                        "title": "Building an automated systems monitoring daemon",
                        "overview": "Build a production-grade C or shell systems daemon that collects /proc metrics, handles signals, and logs to systemd.",
                        "subtopics": [
                            ("Daemonization Standards", "Forking background processes, detaching controlling terminals, and redirecting standard I/O."),
                            ("Complete Systems Capstone", "Synthesizing process monitoring, IPC, signal handling, and kernel tuning into a reliable utility.")
                        ],
                        "practice": "Deploy your systems monitoring daemon under systemd, verify clean signal termination, and review its journal logs.",
                        "url": "https://man7.org/linux/man-pages/man7/daemon.7.html",
                        "resource_title": "daemon(7) — Linux manual page"
                    }
                ]
            }
        ]
    }
]
