"""Career batch 2: AI Engineer, Data Scientist, Business Intelligence (BI) Analyst."""

BATCH_2 = [
    # -------------------------------------------------------------
    # 5. AI Engineer
    # -------------------------------------------------------------
    {
        "slug": "ai-engineer",
        "name": "AI Engineer",
        "category": "Software and AI",
        "short_description": "Build intelligent applications powered by Large Language Models, embeddings, Retrieval-Augmented Generation (RAG), and agentic workflows.",
        "responsibilities": [
            "Integrate foundation LLM provider APIs into modern software applications",
            "Design, generate, and query vector embeddings using vector databases",
            "Implement robust Retrieval-Augmented Generation (RAG) pipelines with evaluation",
            "Build autonomous agentic workflows using function calling and tool execution",
            "Deploy AI guardrails, monitor prompt latency and token usage, and mitigate hallucinations"
        ],
        "representative_work": "A production-ready contextual AI assistant featuring custom RAG document search, structured tool-calling, safety guardrails, token usage tracking, and automated evaluation.",
        "core_skills": [
            "Prompt engineering and system prompts",
            "Tokenization, context windows, and model pricing",
            "Vector embeddings and similarity search",
            "Vector databases (Chroma, Pinecone, pgvector)",
            "Retrieval-Augmented Generation (RAG) pipelines",
            "Chunking strategies and metadata filtering",
            "Function calling and structured JSON outputs",
            "Agent orchestration (LangChain / LlamaIndex)",
            "Guardrails, prompt injection defense, and safety",
            "LLM observability, latency tracking, and evaluation"
        ],
        "milestones": [
            {
                "slug": "ai-foundations-prompt-engineering",
                "title": "AI fundamentals and prompt engineering",
                "summary": "Understand generative AI concepts, prompt engineering techniques, token mechanics, and LLM API integration.",
                "topics": [
                    {
                        "slug": "generative-ai-foundations",
                        "title": "Generative AI and foundational model concepts",
                        "overview": "Learn how transformer-based Large Language Models work, including pre-training, instruction tuning, and temperature.",
                        "subtopics": [
                            ("Transformer Architecture Basics", "Self-attention mechanisms, next-token prediction, and parameter scale."),
                            ("Inference Parameters", "How temperature, top-p, and frequency penalties control output randomness and creativity.")
                        ],
                        "practice": "Experiment with different temperature settings on an LLM API and compare determinism across identical prompts.",
                        "url": "https://developer.mozilla.org/en-US/docs/Glossary/Artificial_intelligence",
                        "resource_title": "Artificial Intelligence | MDN"
                    },
                    {
                        "slug": "prompt-engineering-techniques",
                        "title": "Prompt design, few-shot learning and system prompts",
                        "overview": "Master zero-shot, few-shot prompting, chain-of-thought reasoning, and crafting role-based system instructions.",
                        "subtopics": [
                            ("System vs User Prompts", "Setting behavioral constraints and domain personas in system messages."),
                            ("Few-Shot In-Context Learning", "Providing high-quality input-output examples directly in the prompt context.")
                        ],
                        "practice": "Write a system prompt with few-shot examples that reliably extracts structured invoice data from unstructured text.",
                        "url": "https://www.promptingguide.ai/introduction/basics",
                        "resource_title": "Prompt Engineering Guide Basics | DAIR.AI"
                    },
                    {
                        "slug": "tokens-context-pricing",
                        "title": "Tokenization, context windows and pricing models",
                        "overview": "Understand how text converts to tokens, manage context window limitations, and optimize API token costs.",
                        "subtopics": [
                            ("Token Mechanics", "How subwords, punctuation, and code convert to tokens using BPE tokenizers."),
                            ("Cost and Latency Optimization", "Calculating input vs output token costs and pruning unnecessary prompt context.")
                        ],
                        "practice": "Use a tokenizer utility to calculate token counts across text samples and estimate API request costs.",
                        "url": "https://platform.openai.com/tokenizer",
                        "resource_title": "Tokenizer Tool | OpenAI Documentation"
                    },
                    {
                        "slug": "llm-provider-api-integration",
                        "title": "Interacting with LLM provider APIs",
                        "overview": "Make authenticated API calls to LLM providers using HTTP requests or SDKs, handle rate limits, and stream responses.",
                        "subtopics": [
                            ("Chat Completions API", "Structuring messages arrays with system, user, and assistant roles."),
                            ("Streaming Responses (SSE)", "Consuming server-sent tokens in real-time to display responsive typing effects.")
                        ],
                        "practice": "Write a script that sends a prompt to an LLM API and streams the generated response chunk-by-chunk to the console.",
                        "url": "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events",
                        "resource_title": "Server-sent events | MDN"
                    }
                ]
            },
            {
                "slug": "embeddings-and-vector-databases",
                "title": "Embeddings, similarity search and vector stores",
                "summary": "Generate dense vector embeddings, measure semantic similarity, and query vector databases efficiently.",
                "topics": [
                    {
                        "slug": "vector-embeddings-semantics",
                        "title": "Vector embeddings and semantic representation",
                        "overview": "Learn how embedding models map sentences and paragraphs into multi-dimensional vectors capturing semantic meaning.",
                        "subtopics": [
                            ("Dense Vector Representations", "How geometric distance in embedding space correlates with conceptual meaning."),
                            ("Choosing Embedding Models", "Comparing dimension size, model speed, and multilingual embedding capabilities.")
                        ],
                        "practice": "Generate embeddings for a list of sentences and verify that semantically similar sentences produce high cosine similarity.",
                        "url": "https://cloud.google.com/vertex-ai/docs/generative-ai/embeddings/get-text-embeddings",
                        "resource_title": "Text Embeddings | Google Cloud Documentation"
                    },
                    {
                        "slug": "distance-metrics-similarity",
                        "title": "Distance metrics and cosine similarity",
                        "overview": "Calculate geometric proximity using cosine similarity, dot product, and Euclidean (L2) distance metrics.",
                        "subtopics": [
                            ("Cosine Similarity", "Measuring the angle between two normalized vectors regardless of magnitude."),
                            ("Dot Product vs Euclidean", "Choosing the right distance metric based on embedding normalization and database index type.")
                        ],
                        "practice": "Write a Python function computing cosine similarity between two embedding vectors without using external ML libraries.",
                        "url": "https://scikit-learn.org/stable/modules/generated/sklearn.metrics.pairwise.cosine_similarity.html",
                        "resource_title": "Cosine Similarity | scikit-learn Docs"
                    },
                    {
                        "slug": "vector-databases-indexing",
                        "title": "Vector databases: indexing and querying",
                        "overview": "Store and retrieve millions of vectors with low latency using vector databases (e.g. Chroma, pgvector, or Pinecone).",
                        "subtopics": [
                            ("Vector Indexing Algorithms", "How HNSW (Hierarchical Navigable Small World) and IVFFlat enable fast approximate nearest neighbor search."),
                            ("Database Operations", "Inserting embeddings with unique IDs, updating records, and executing k-nearest-neighbor (KNN) queries.")
                        ],
                        "practice": "Set up a local vector database instance, insert 50 embedded paragraphs, and query for the 3 most relevant results.",
                        "url": "https://github.com/pgvector/pgvector",
                        "resource_title": "pgvector: Open-source vector similarity search for Postgres"
                    },
                    {
                        "slug": "chunking-and-metadata-filtering",
                        "title": "Chunking strategies and metadata filtering",
                        "overview": "Split long documents into coherent chunks using character, sentence, or recursive splitters, and attach filterable metadata.",
                        "subtopics": [
                            ("Chunk Size and Overlap", "Balancing context completeness against token budgets using chunk overlap."),
                            ("Metadata Filtering", "Tagging chunks with source URL, author, and timestamp to filter queries during search.")
                        ],
                        "practice": "Chunk a 10-page document using recursive text splitting with a 500-token chunk size and a 50-token overlap.",
                        "url": "https://python.langchain.com/docs/concepts/#text-splitters",
                        "resource_title": "Text Splitters | LangChain Concepts"
                    }
                ]
            },
            {
                "slug": "retrieval-augmented-generation",
                "title": "Retrieval-Augmented Generation (RAG)",
                "summary": "Build end-to-end RAG systems, parse diverse document formats, ground answers in evidence, and evaluate retrieval fidelity.",
                "topics": [
                    {
                        "slug": "rag-architecture-lifecycle",
                        "title": "End-to-end RAG architecture",
                        "overview": "Connect user queries, semantic retrieval, prompt synthesis, and grounded LLM generation into a unified RAG workflow.",
                        "subtopics": [
                            ("The RAG Pipeline", "Retrieving relevant context from vector stores, injecting it into prompts, and asking the LLM to answer."),
                            ("Reducing Hallucinations", "Instructing models to answer strictly based on retrieved context and admit when information is missing.")
                        ],
                        "practice": "Build a working RAG script that takes a user question, retrieves relevant chunks, and returns an answer citing sources.",
                        "url": "https://python.langchain.com/docs/tutorials/rag/",
                        "resource_title": "RAG Tutorial | LangChain Documentation"
                    },
                    {
                        "slug": "document-parsing-extraction",
                        "title": "Document parsing and text extraction",
                        "overview": "Extract clean text and tabular information from PDFs, markdown files, and web pages for ingestion into vector stores.",
                        "subtopics": [
                            ("PDF and Document Parsing", "Extracting text while preserving document structure, headings, and tables."),
                            ("HTML Web Scraping", "Cleaning boilerplate navigation and scripts from web pages using tools like BeautifulSoup.")
                        ],
                        "practice": "Write a document ingestion script that parses a PDF file, strips headers and footers, and extracts clean paragraphs.",
                        "url": "https://www.crummy.com/software/BeautifulSoup/bs4/doc/",
                        "resource_title": "Beautiful Soup Documentation"
                    },
                    {
                        "slug": "prompt-injection-defense-rag",
                        "title": "Context synthesis and prompt injection defense",
                        "overview": "Synthesize multiple retrieved context passages into clear prompt templates while defending against indirect prompt injection.",
                        "subtopics": [
                            ("Prompt Formatting", "Formatting retrieved passages with clear boundaries and citation identifiers."),
                            ("Indirect Injection Defense", "Preventing untrusted text inside ingested documents from overriding system instructions.")
                        ],
                        "practice": "Test a RAG prompt with an adversarial document containing an override instruction and verify that the system ignores it.",
                        "url": "https://cheatsheetseries.owasp.org/cheatsheets/LLM_AI_Security_Cheat_Sheet.html",
                        "resource_title": "LLM AI Security Cheat Sheet | OWASP"
                    },
                    {
                        "slug": "rag-evaluation-and-metrics",
                        "title": "Evaluation of retrieval relevance and answer fidelity",
                        "overview": "Measure the performance of your RAG pipeline using metrics like context precision, context recall, faithfulness, and answer relevancy.",
                        "subtopics": [
                            ("Retrieval vs Generation Evaluation", "Evaluating whether search returned the right chunks vs whether the LLM faithfully summarized them."),
                            ("Evaluation Frameworks", "Using automated evaluation frameworks (e.g. Ragas or TruLens) with synthetic test datasets.")
                        ],
                        "practice": "Evaluate 10 question-answer pairs from your RAG pipeline and calculate a faithfulness score based on citations.",
                        "url": "https://docs.ragas.io/en/stable/",
                        "resource_title": "Ragas: Evaluation framework for LLM applications"
                    }
                ]
            },
            {
                "slug": "agentic-workflows-tools",
                "title": "Agentic workflows and tool-calling",
                "summary": "Equip LLMs with executable tools using function calling, build multi-step reasoning agents, and manage conversation memory.",
                "topics": [
                    {
                        "slug": "function-calling-structured-json",
                        "title": "Function calling and structured JSON outputs",
                        "overview": "Define JSON schema tool signatures so LLMs can invoke external functions and return strictly typed JSON objects.",
                        "subtopics": [
                            ("JSON Schema Definitions", "Describing function names, descriptions, parameter types, and required fields."),
                            ("Tool Call Parsing", "Extracting tool arguments from LLM responses, executing the code, and feeding results back.")
                        ],
                        "practice": "Equip an LLM with a calculator tool and a weather lookup tool, and verify that it invokes them with valid JSON arguments.",
                        "url": "https://platform.openai.com/docs/guides/function-calling",
                        "resource_title": "Function calling | OpenAI Documentation"
                    },
                    {
                        "slug": "react-reasoning-loops",
                        "title": "Multi-step reasoning loops and ReAct",
                        "overview": "Implement Reason + Act (ReAct) loops where the agent alternates between thinking, executing tools, and observing outcomes.",
                        "subtopics": [
                            ("The ReAct Pattern", "Generating thought, action, and observation steps until a final answer is derived."),
                            ("Loop Termination and Limits", "Setting maximum iteration bounds to prevent infinite loops when tools fail.")
                        ],
                        "practice": "Build a multi-step agent that answers a question requiring two consecutive tool lookups before returning a final answer.",
                        "url": "https://python.langchain.com/docs/concepts/#agents",
                        "resource_title": "Agents | LangChain Concepts"
                    },
                    {
                        "slug": "orchestration-frameworks",
                        "title": "Orchestration frameworks: LangChain and LlamaIndex",
                        "overview": "Use modern AI orchestration libraries to construct declarative chains, agent executors, and data retrieval graphs.",
                        "subtopics": [
                            ("Chains and Pipelines", "Composing prompt templates, models, and output parsers into reusable execution pipelines."),
                            ("Agent State Graphs", "Modeling complex multi-agent workflows with state machines (e.g., LangGraph).")
                        ],
                        "practice": "Build a document research chain using an orchestration framework that retrieves information and outputs a formatted markdown summary.",
                        "url": "https://docs.llamaindex.ai/en/stable/",
                        "resource_title": "LlamaIndex Documentation"
                    },
                    {
                        "slug": "agent-conversation-memory",
                        "title": "Memory management across agent conversations",
                        "overview": "Maintain coherent conversation context across multiple turns using sliding window memory, summarization, and key-value state.",
                        "subtopics": [
                            ("Buffer and Window Memory", "Keeping the last N messages in the context window while pruning older turns."),
                            ("Summary Memory", "Using an LLM to progressively summarize past conversation history to preserve context compactly.")
                        ],
                        "practice": "Implement a conversation session that retains past user context across 5 turns while staying under a 2,000-token limit.",
                        "url": "https://python.langchain.com/docs/concepts/#memory",
                        "resource_title": "Memory | LangChain Concepts"
                    }
                ]
            },
            {
                "slug": "guardrails-eval-finetuning",
                "title": "Guardrails, evaluation and optimization",
                "summary": "Enforce input/output safety guardrails, benchmark models, optimize token costs, and understand fine-tuning concepts.",
                "topics": [
                    {
                        "slug": "ai-safety-guardrails",
                        "title": "AI safety, toxicity filtering and guardrails",
                        "overview": "Implement guardrails (e.g. NeMo Guardrails, Guardrails AI) to block toxic content, PII leakage, and off-topic queries.",
                        "subtopics": [
                            ("Input Sanitization", "Scanning user prompts for jailbreaks, prompt injection, and PII before sending to the model."),
                            ("Output Verification", "Validating that model outputs do not contain sensitive data, harmful advice, or policy violations.")
                        ],
                        "practice": "Configure a guardrail that detects and masks credit card numbers and email addresses in generated outputs.",
                        "url": "https://cheatsheetseries.owasp.org/cheatsheets/LLM_AI_Security_Cheat_Sheet.html",
                        "resource_title": "OWASP Top 10 for LLM Applications"
                    },
                    {
                        "slug": "benchmarking-llm-as-judge",
                        "title": "Benchmarking with LLM-as-a-judge",
                        "overview": "Evaluate complex, qualitative generative outputs using an automated judge model with clear rubrics and scoring scales.",
                        "subtopics": [
                            ("Evaluation Rubrics", "Creating explicit 1-to-5 scoring criteria for conciseness, accuracy, and tone."),
                            ("Mitigating Judge Bias", "Mitigating position bias and verbosity bias when comparing candidate responses.")
                        ],
                        "practice": "Write an evaluation prompt where a judge model scores 5 assistant responses on a 1-to-5 scale with written explanations.",
                        "url": "https://docs.ragas.io/en/stable/concepts/metrics/index.html",
                        "resource_title": "Ragas Metrics Overview"
                    },
                    {
                        "slug": "fine-tuning-peft-lora",
                        "title": "Parameter-efficient fine-tuning (PEFT/LoRA) overview",
                        "overview": "Understand when prompt engineering is sufficient versus when to fine-tune open-weights models using LoRA/QLoRA.",
                        "subtopics": [
                            ("When to Fine-Tune", "Distinguishing between knowledge injection (use RAG) vs style/formatting adaptation (use fine-tuning)."),
                            ("Low-Rank Adaptation (LoRA)", "How adding small trainable rank-decomposition matrices avoids re-training all model weights.")
                        ],
                        "practice": "Prepare a formatted JSONL instruction-tuning dataset with 20 input-output pairs following an instruction schema.",
                        "url": "https://huggingface.co/docs/peft/index",
                        "resource_title": "PEFT: Parameter-Efficient Fine-Tuning | Hugging Face Docs"
                    },
                    {
                        "slug": "cost-latency-streaming-optimization",
                        "title": "Cost tracking, latency optimization and caching",
                        "overview": "Track API spending, reduce time-to-first-token (TTFT) using prompt caching, and select cost-efficient models for subtasks.",
                        "subtopics": [
                            ("Prompt Caching", "Reusing static system prompts and large context prefixes to reduce cost and inference latency."),
                            ("Model Tiering", "Routing simple categorization tasks to fast, low-cost models and complex reasoning to larger models.")
                        ],
                        "practice": "Implement a semantic prompt cache that returns cached completions for repeated queries without calling the API.",
                        "url": "https://cloud.google.com/vertex-ai/docs/generative-ai/pricing",
                        "resource_title": "Vertex AI Pricing and Token Economics | Google Cloud"
                    }
                ]
            },
            {
                "slug": "ai-deployment-observability",
                "title": "AI application deployment and observability",
                "summary": "Instrument LLM calls with tracing tools, build interactive full-stack chat/RAG interfaces, and deploy reliable production AI services.",
                "topics": [
                    {
                        "slug": "llm-tracing-observability",
                        "title": "Tracing LLM calls with OpenTelemetry and Langfuse",
                        "overview": "Trace multi-step LLM chains, inspect raw prompts and completions, debug tool inputs, and monitor latency bottlenecks.",
                        "subtopics": [
                            ("Distributed Tracing for AI", "Logging every LLM generation, tool call, and vector retrieval in a central dashboard."),
                            ("Debugging Latency and Costs", "Identifying slow chain steps and monitoring cost spikes per user session.")
                        ],
                        "practice": "Instrument an LLM script with a tracing callback that records request duration, token counts, and input prompts.",
                        "url": "https://opentelemetry.io/docs/what-is-opentelemetry/",
                        "resource_title": "What is OpenTelemetry? | OpenTelemetry Docs"
                    },
                    {
                        "slug": "caching-and-rate-limiting-ai",
                        "title": "Rate limiting and fallback resilience for AI APIs",
                        "overview": "Protect your backend from API quota exhaustion using rate limiters, exponential backoff, and fallback model providers.",
                        "subtopics": [
                            ("Rate Limiting and Quotas", "Managing requests-per-minute (RPM) and tokens-per-minute (TPM) limits gracefully."),
                            ("Fallback Providers", "Automatically failing over to a secondary model provider if the primary provider returns 503 or 429.")
                        ],
                        "practice": "Write an API client with an exponential backoff retry handler that handles HTTP 429 rate limit responses gracefully.",
                        "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429",
                        "resource_title": "HTTP Status 429 Too Many Requests | MDN"
                    },
                    {
                        "slug": "building-chat-rag-ui",
                        "title": "Building a full-stack chat and RAG user interface",
                        "overview": "Build a responsive frontend chat interface with markdown rendering, source citation popovers, and streaming tokens.",
                        "subtopics": [
                            ("Streaming UI Hooks", "Using client hooks (e.g., Vercel AI SDK) to render streaming text with stop/regenerate controls."),
                            ("Citation Previews", "Rendering interactive badge links that display the retrieved source passage in a drawer.")
                        ],
                        "practice": "Build a responsive chat interface component that streams assistant responses and displays expandable citations.",
                        "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting",
                        "resource_title": "Dynamic scripting | MDN"
                    },
                    {
                        "slug": "deploying-production-ai-service",
                        "title": "Deploying a reliable production AI service",
                        "overview": "Package your AI service in Docker, configure secure environment secrets, set up health checks, and launch production operations.",
                        "subtopics": [
                            ("Containerizing AI Apps", "Creating slim Docker containers with vector store dependencies and runtime SDKs."),
                            ("Operational Monitoring", "Setting up alerting for elevated hallucination rates, error rates, and sudden token budget surges.")
                        ],
                        "practice": "Deploy a containerized RAG service, verify that its health check endpoint reports status 200, and execute a live query.",
                        "url": "https://docs.docker.com/guides/walkthroughs/deploy-your-app/",
                        "resource_title": "Deploy your application | Docker Docs"
                    }
                ]
            }
        ]
    },

    # -------------------------------------------------------------
    # 6. Data Scientist
    # -------------------------------------------------------------
    {
        "slug": "data-scientist",
        "name": "Data Scientist",
        "category": "Data & Analytics",
        "short_description": "Extract actionable knowledge from complex data using applied statistics, machine learning algorithms, and predictive modeling.",
        "responsibilities": [
            "Perform comprehensive exploratory data analysis (EDA) and data cleansing on raw datasets",
            "Apply statistical hypothesis testing, probability distributions, and A/B test methodologies",
            "Engineer informative features and train supervised and unsupervised machine learning models",
            "Evaluate model performance rigorously using cross-validation and error diagnostics",
            "Explain model predictions using interpretability techniques and communicate findings clearly"
        ],
        "representative_work": "An end-to-end data science project including data wrangling, exploratory visualizations, statistical hypothesis testing, machine learning model training, cross-validation evaluation, and SHAP interpretability explanations.",
        "core_skills": [
            "Python data science stack (NumPy, pandas)",
            "Exploratory Data Analysis (EDA)",
            "Applied probability and descriptive statistics",
            "Hypothesis testing and A/B experimental design",
            "Data visualization (Matplotlib, Seaborn)",
            "Feature engineering, scaling, and encoding",
            "Supervised learning (Regression, Random Forest, XGBoost)",
            "Unsupervised learning (K-Means, PCA)",
            "Model evaluation metrics (ROC-AUC, RMSE, F1)",
            "Model explainability with SHAP values"
        ],
        "milestones": [
            {
                "slug": "data-science-eda-python",
                "title": "Exploratory data analysis and Python foundations",
                "summary": "Master data manipulation with NumPy and pandas, explore raw datasets, and clean missing or inconsistent records.",
                "topics": [
                    {
                        "slug": "numpy-numerical-programming",
                        "title": "Python numerical programming with NumPy",
                        "overview": "Perform high-performance numerical computations using N-dimensional arrays, vectorization, and mathematical operations.",
                        "subtopics": [
                            ("Ndarray Manipulation", "Creating arrays, slicing multi-dimensional data, and reshaping matrices."),
                            ("Vectorized Operations", "Writing vectorized mathematical expressions that replace slow Python loops.")
                        ],
                        "practice": "Write vectorized NumPy expressions to normalize a 2D matrix of numbers to zero mean and unit variance.",
                        "url": "https://numpy.org/doc/stable/user/quickstart.html",
                        "resource_title": "NumPy quickstart | NumPy Documentation"
                    },
                    {
                        "slug": "pandas-data-manipulation",
                        "title": "Data manipulation with pandas",
                        "overview": "Load, filter, transform, group, and merge tabular data using pandas Series and DataFrames.",
                        "subtopics": [
                            ("Indexing and Filtering", "Selecting subsets of rows and columns using loc, iloc, and boolean masking."),
                            ("Aggregation and Grouping", "Using groupby, agg, and pivot tables to calculate summary statistics across categories.")
                        ],
                        "practice": "Load a CSV dataset with pandas, filter out outliers, and compute average sales grouped by region.",
                        "url": "https://pandas.pydata.org/docs/user_guide/10min.html",
                        "resource_title": "10 minutes to pandas | pandas Documentation"
                    },
                    {
                        "slug": "exploratory-data-analysis-eda",
                        "title": "Exploratory data analysis (EDA) techniques",
                        "overview": "Investigate distributions, correlations, data types, and anomalies in raw datasets before statistical modeling.",
                        "subtopics": [
                            ("Summary Statistics", "Inspecting mean, median, standard deviation, quartiles, and skewness of continuous variables."),
                            ("Data Profiling", "Identifying cardinality, unique value counts, and mismatched data types across columns.")
                        ],
                        "practice": "Perform an EDA workflow on a public dataset and write a summary identifying the 3 strongest relationships found.",
                        "url": "https://scikit-learn.org/stable/tutorial/basic/tutorial.html",
                        "resource_title": "An introduction to machine learning with scikit-learn"
                    },
                    {
                        "slug": "handling-missing-data-types",
                        "title": "Handling missing data and type casting",
                        "overview": "Detect missing values, apply imputation techniques (mean, median, forward fill), and cast appropriate data types.",
                        "subtopics": [
                            ("Missingness Patterns", "Distinguishing between Missing Completely at Random (MCAR) and Missing at Random (MAR)."),
                            ("Imputation Strategies", "Choosing between row deletion, simple median imputation, and model-based imputation.")
                        ],
                        "practice": "Impute missing numeric values in a DataFrame with the median and fill missing categorical values with the mode.",
                        "url": "https://scikit-learn.org/stable/modules/impute.html",
                        "resource_title": "Imputation of missing values | scikit-learn Docs"
                    }
                ]
            },
            {
                "slug": "statistics-probability-experiments",
                "title": "Statistics, probability and experimental design",
                "summary": "Apply descriptive and inferential statistics, probability distributions, hypothesis testing, and design rigorous A/B experiments.",
                "topics": [
                    {
                        "slug": "descriptive-stats-distributions",
                        "title": "Descriptive statistics and summary distributions",
                        "overview": "Measure central tendency, spread, variance, standard deviation, and explore data distribution shapes.",
                        "subtopics": [
                            ("Measures of Spread", "Understanding interquartile range (IQR), standard deviation, and variance."),
                            ("Normal Distribution and Z-Scores", "Standardizing values with Z-scores and applying empirical rules (68-95-99.7).")
                        ],
                        "practice": "Calculate Z-scores for a numeric column and identify records that fall beyond 3 standard deviations from the mean.",
                        "url": "https://docs.scipy.org/doc/scipy/tutorial/stats.html",
                        "resource_title": "Statistical functions | SciPy Documentation"
                    },
                    {
                        "slug": "probability-central-limit-theorem",
                        "title": "Probability distributions and Central Limit Theorem",
                        "overview": "Understand discrete and continuous probability distributions (Binomial, Poisson, Normal) and the Central Limit Theorem.",
                        "subtopics": [
                            ("Probability Density Functions", "Interpreting probability mass functions (PMF) and probability density functions (PDF)."),
                            ("Central Limit Theorem (CLT)", "Why sample means approach a normal distribution regardless of underlying population distribution.")
                        ],
                        "practice": "Simulate the Central Limit Theorem by drawing 1,000 sample means from a skewed distribution and plotting the result.",
                        "url": "https://docs.scipy.org/doc/scipy/reference/stats.html",
                        "resource_title": "Statistics (scipy.stats) | SciPy Documentation"
                    },
                    {
                        "slug": "hypothesis-testing-p-values",
                        "title": "Hypothesis testing and p-values",
                        "overview": "Formulate null and alternative hypotheses, choose appropriate statistical tests (t-test, chi-square, ANOVA), and interpret p-values.",
                        "subtopics": [
                            ("Type I and Type II Errors", "Balancing false positive risk (alpha) against statistical power (1 - beta)."),
                            ("T-Tests and Chi-Square", "Comparing means between two groups (t-test) and testing independence of categorical variables.")
                        ],
                        "practice": "Conduct a two-sample t-test comparing average test scores between two groups and report whether the difference is significant at p < 0.05.",
                        "url": "https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.ttest_ind.html",
                        "resource_title": "scipy.stats.ttest_ind | SciPy Documentation"
                    },
                    {
                        "slug": "ab-testing-experimental-design",
                        "title": "A/B testing design and sample size calculation",
                        "overview": "Design controlled experiments, calculate minimum required sample sizes, randomize traffic, and evaluate conversion lifts.",
                        "subtopics": [
                            ("Sample Size Determination", "Calculating required sample size based on baseline conversion, minimum detectable effect, and power."),
                            ("Interpreting Lift", "Evaluating whether observed conversion differences between control and treatment groups are statistically valid.")
                        ],
                        "practice": "Calculate the sample size needed to detect a 2% lift in conversion rate with 80% power and 5% significance.",
                        "url": "https://docs.scipy.org/doc/scipy/reference/stats.html",
                        "resource_title": "Statistical tests | SciPy Documentation"
                    }
                ]
            },
            {
                "slug": "visualization-and-feature-engineering",
                "title": "Data visualization and feature preparation",
                "summary": "Create insightful data visualizations, analyze correlations, detect outliers, and engineer predictive features.",
                "topics": [
                    {
                        "slug": "matplotlib-seaborn-visualizations",
                        "title": "Data visualization with Matplotlib and Seaborn",
                        "overview": "Visualize distributions and relationships using histograms, scatter plots, box plots, and heatmaps.",
                        "subtopics": [
                            ("Chart Selection", "Choosing the right visualization for single distributions (histogram, KDE) vs relationships (scatter, pairplot)."),
                            ("Customizing Figures", "Configuring labels, titles, legends, color palettes, and subplots for clarity.")
                        ],
                        "practice": "Create a 2x2 subplot figure showing a histogram, a scatter plot, a box plot, and a correlation heatmap for a dataset.",
                        "url": "https://seaborn.pydata.org/tutorial/introduction.html",
                        "resource_title": "An introduction to seaborn | Seaborn Documentation"
                    },
                    {
                        "slug": "correlation-multicollinearity",
                        "title": "Correlation, covariance and multicollinearity",
                        "overview": "Analyze linear and non-linear relationships using Pearson and Spearman correlation matrices and diagnose multicollinearity.",
                        "subtopics": [
                            ("Pearson vs Spearman", "When to use linear Pearson correlation vs rank-based non-parametric Spearman correlation."),
                            ("Variance Inflation Factor (VIF)", "Identifying highly collinear predictor features that destabilize regression model weights.")
                        ],
                        "practice": "Compute a correlation matrix for features in a dataset and identify pairs with correlation > 0.8 to address collinearity.",
                        "url": "https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.corr.html",
                        "resource_title": "pandas.DataFrame.corr | pandas Documentation"
                    },
                    {
                        "slug": "outlier-detection-transformation",
                        "title": "Outlier detection and data transformation",
                        "overview": "Detect extreme data outliers using IQR and Z-scores, and apply log transformations to normalize right-skewed features.",
                        "subtopics": [
                            ("IQR Outlier Detection", "Identifying values below Q1 - 1.5*IQR or above Q3 + 1.5*IQR."),
                            ("Log and Box-Cox Transforms", "Transforming highly skewed distributions (e.g. income, price) into bell-shaped distributions.")
                        ],
                        "practice": "Apply a log transformation to a right-skewed price column and compare histograms before and after the transform.",
                        "url": "https://scikit-learn.org/stable/modules/preprocessing.html",
                        "resource_title": "Preprocessing data | scikit-learn Docs"
                    },
                    {
                        "slug": "feature-encoding-scaling",
                        "title": "Feature encoding and numerical scaling",
                        "overview": "Encode categorical variables (One-Hot, Ordinal, Target) and scale numerical features (StandardScaler, MinMaxScaler).",
                        "subtopics": [
                            ("Categorical Encoding", "Using One-Hot Encoding for nominal variables and Ordinal Encoding for ranked variables."),
                            ("Feature Scaling", "Why distance-based algorithms and gradient descent require features on comparable numerical scales.")
                        ],
                        "practice": "Build a scikit-learn ColumnTransformer that scales numeric features and one-hot encodes categorical features.",
                        "url": "https://scikit-learn.org/stable/modules/compose.html#columntransformer-for-heterogeneous-data",
                        "resource_title": "ColumnTransformer for heterogeneous data | scikit-learn"
                    }
                ]
            },
            {
                "slug": "supervised-machine-learning",
                "title": "Supervised machine learning algorithms",
                "summary": "Train and evaluate supervised classification and regression models using scikit-learn, XGBoost, and LightGBM.",
                "topics": [
                    {
                        "slug": "train-test-cross-validation",
                        "title": "Train-test splitting and cross-validation",
                        "overview": "Prevent data leakage by splitting datasets into train and test sets, and evaluate stability with k-fold cross-validation.",
                        "subtopics": [
                            ("Avoiding Data Leakage", "Fitting scalers and encoders strictly on training data before transforming test sets."),
                            ("Stratified K-Fold", "Preserving target class proportions across all cross-validation folds for imbalanced data.")
                        ],
                        "practice": "Perform a 5-fold stratified cross-validation on a classification model and report mean accuracy and standard deviation.",
                        "url": "https://scikit-learn.org/stable/modules/cross_validation.html",
                        "resource_title": "Cross-validation: evaluating estimator performance | scikit-learn"
                    },
                    {
                        "slug": "linear-logistic-regression",
                        "title": "Linear and logistic regression models",
                        "overview": "Fit linear regression for continuous target prediction and logistic regression with sigmoid functions for binary classification.",
                        "subtopics": [
                            ("Linear Regression Coefficients", "Interpreting regression slope weights, intercepts, and residuals."),
                            ("Logistic Regression and Odds", "Interpreting log-odds, probability thresholds, and L1/L2 regularization (Lasso/Ridge).")
                        ],
                        "practice": "Train a logistic regression model, print the feature coefficients, and identify the top 3 predictors.",
                        "url": "https://scikit-learn.org/stable/modules/linear_model.html#logistic-regression",
                        "resource_title": "Logistic Regression | scikit-learn Docs"
                    },
                    {
                        "slug": "decision-trees-random-forests",
                        "title": "Decision trees and Random Forests",
                        "overview": "Build intuitive decision trees and ensemble them into robust Random Forests using bagging and feature subsampling.",
                        "subtopics": [
                            ("Splitting Criteria", "How Gini impurity and entropy measure information gain at decision tree split nodes."),
                            ("Ensemble Bagging", "Why averaging predictions from multiple de-correlated trees reduces variance without increasing bias.")
                        ],
                        "practice": "Train a Random Forest classifier, evaluate its test set accuracy, and plot feature importances.",
                        "url": "https://scikit-learn.org/stable/modules/ensemble.html#forests-of-randomized-trees",
                        "resource_title": "Forests of randomized trees | scikit-learn Docs"
                    },
                    {
                        "slug": "gradient-boosting-xgboost",
                        "title": "Gradient boosting with XGBoost and LightGBM",
                        "overview": "Train high-performance gradient boosted decision trees that iteratively minimize residual prediction errors.",
                        "subtopics": [
                            ("Boosting vs Bagging", "How boosting builds trees sequentially to correct errors of previous estimators."),
                            ("Hyperparameter Controls", "Tuning learning rate, max depth, subsample ratio, and early stopping iterations.")
                        ],
                        "practice": "Train an XGBoost or LightGBM model with early stopping enabled to prevent overfitting on the validation set.",
                        "url": "https://scikit-learn.org/stable/modules/ensemble.html#gradient-boosted-trees",
                        "resource_title": "Gradient Tree Boosting | scikit-learn Docs"
                    }
                ]
            },
            {
                "slug": "model-evaluation-unsupervised",
                "title": "Model evaluation and unsupervised learning",
                "summary": "Evaluate models with precision, recall, and ROC-AUC, discover patterns with K-Means clustering, and reduce dimensions with PCA.",
                "topics": [
                    {
                        "slug": "classification-metrics-roc-auc",
                        "title": "Classification metrics: ROC-AUC, precision and recall",
                        "overview": "Evaluate classifiers on imbalanced datasets using confusion matrices, precision, recall, F1-score, and ROC-AUC curves.",
                        "subtopics": [
                            ("Precision-Recall Tradeoff", "Adjusting decision probability thresholds to favor precision vs recall based on business cost."),
                            ("ROC-AUC Interpretation", "Interpreting Area Under the ROC Curve as the model's ability to rank positive cases higher than negatives.")
                        ],
                        "practice": "Generate a classification report and plot a ROC curve with calculated AUC score for a binary classifier.",
                        "url": "https://scikit-learn.org/stable/modules/model_evaluation.html#classification-metrics",
                        "resource_title": "Classification metrics | scikit-learn Docs"
                    },
                    {
                        "slug": "regression-metrics-evaluation",
                        "title": "Regression metrics: RMSE, MAE and R-squared",
                        "overview": "Measure continuous prediction accuracy using Mean Squared Error (MSE), Root Mean Squared Error (RMSE), MAE, and R-squared.",
                        "subtopics": [
                            ("MAE vs RMSE", "Why RMSE penalizes large outlier errors more heavily than Mean Absolute Error."),
                            ("Coefficient of Determination (R2)", "Measuring the proportion of target variance explained by the model features.")
                        ],
                        "practice": "Calculate and compare MAE, RMSE, and R2 on test set predictions from a regression model.",
                        "url": "https://scikit-learn.org/stable/modules/model_evaluation.html#regression-metrics",
                        "resource_title": "Regression metrics | scikit-learn Docs"
                    },
                    {
                        "slug": "kmeans-clustering-analysis",
                        "title": "K-Means clustering and cluster evaluation",
                        "overview": "Group unlabelled observations into natural clusters using K-Means and determine optimal cluster count with the Elbow method.",
                        "subtopics": [
                            ("The K-Means Algorithm", "Iteratively assigning points to nearest centroids and recalculating cluster centroid positions."),
                            ("Elbow Method and Silhouette Score", "Evaluating within-cluster sum of squares (inertia) and silhouette coefficients to pick k.")
                        ],
                        "practice": "Apply K-Means clustering to customer behavior data and determine the optimal k using a silhouette plot.",
                        "url": "https://scikit-learn.org/stable/modules/clustering.html#k-means",
                        "resource_title": "K-means | scikit-learn Docs"
                    },
                    {
                        "slug": "pca-dimensionality-reduction",
                        "title": "Dimensionality reduction with PCA",
                        "overview": "Compress high-dimensional feature spaces into orthogonal principal components while retaining maximum variance.",
                        "subtopics": [
                            ("Principal Component Analysis", "Finding directions of maximum variance and projecting data onto orthogonal principal axes."),
                            ("Explained Variance Ratio", "Selecting the number of components needed to retain 90%+ of the original dataset variance.")
                        ],
                        "practice": "Reduce a 10-feature dataset down to 2 principal components with PCA and plot the 2D cluster visualization.",
                        "url": "https://scikit-learn.org/stable/modules/decomposition.html#pca",
                        "resource_title": "Principal component analysis (PCA) | scikit-learn"
                    }
                ]
            },
            {
                "slug": "tuning-explainability-deployment",
                "title": "Model diagnostics, deployment and communication",
                "summary": "Tune hyperparameters, explain predictions with SHAP values, serialize models, and communicate data science findings.",
                "topics": [
                    {
                        "slug": "hyperparameter-tuning-search",
                        "title": "Hyperparameter tuning with Grid and Random Search",
                        "overview": "Systematically search parameter combinations to maximize validation metrics using GridSearchCV and RandomizedSearchCV.",
                        "subtopics": [
                            ("Grid vs Random Search", "Comparing exhaustive grid evaluations against randomized sampling across parameter distributions."),
                            ("Bayesian Optimization", "Using probabilistic models (e.g. Optuna) to guide the search toward optimal parameter spaces.")
                        ],
                        "practice": "Use RandomizedSearchCV to tune max_depth, n_estimators, and learning_rate for a gradient boosted classifier.",
                        "url": "https://scikit-learn.org/stable/modules/grid_search.html",
                        "resource_title": "Tuning the hyper-parameters of an estimator | scikit-learn"
                    },
                    {
                        "slug": "model-explainability-shap",
                        "title": "Model explainability with SHAP values",
                        "overview": "Explain complex machine learning models using SHapley Additive exPlanations (SHAP) to interpret global and local feature impacts.",
                        "subtopics": [
                            ("Shapley Values", "Attributing credit fairly to each feature based on cooperative game theory concepts."),
                            ("Summary and Waterfall Plots", "Visualizing global feature importance rankings and single-prediction waterfall breakdowns.")
                        ],
                        "practice": "Generate a SHAP summary plot for a trained model and explain how the top feature influences individual predictions.",
                        "url": "https://shap.readthedocs.io/en/latest/index.html",
                        "resource_title": "SHAP (SHapley Additive exPlanations) Documentation"
                    },
                    {
                        "slug": "model-serialization-serving",
                        "title": "Model serialization and API serving",
                        "overview": "Serialize trained model pipelines with joblib or ONNX, package preprocessing steps, and serve predictions via a REST API.",
                        "subtopics": [
                            ("Full Pipeline Packaging", "Wrapping preprocessing scalers and trained estimators in a single scikit-learn Pipeline object."),
                            ("Prediction Endpoints", "Building a lightweight FastAPI or Flask endpoint that accepts JSON input and returns model predictions.")
                        ],
                        "practice": "Save a trained pipeline to disk with joblib and write a minimal script that loads the file and scores new data.",
                        "url": "https://scikit-learn.org/stable/modules/model_persistence.html",
                        "resource_title": "Model persistence | scikit-learn Docs"
                    },
                    {
                        "slug": "data-science-reporting",
                        "title": "Writing an end-to-end data science report",
                        "overview": "Synthesize data cleaning, statistical tests, model benchmarks, and business recommendations into an executive report.",
                        "subtopics": [
                            ("Communicating with Stakeholders", "Translating technical metric gains (e.g. +0.03 ROC-AUC) into tangible business ROI."),
                            ("Reproducible Notebooks", "Structuring clean Jupyter notebooks with clear markdown explanations and documented dependencies.")
                        ],
                        "practice": "Draft an executive summary for your data science project explaining the problem, methodology, results, and limitations.",
                        "url": "https://docs.jupyter.org/en/latest/",
                        "resource_title": "Jupyter Documentation"
                    }
                ]
            }
        ]
    },

    # -------------------------------------------------------------
    # 7. Business Intelligence (BI) Analyst
    # -------------------------------------------------------------
    {
        "slug": "bi-analyst",
        "name": "Business Intelligence (BI) Analyst",
        "category": "Data & Analytics",
        "short_description": "Transform raw business data into actionable executive insights, dimensional data models, and interactive KPI dashboards.",
        "responsibilities": [
            "Gather business requirements and translate strategic goals into measurable KPI metrics",
            "Design dimensional data models (star schema, fact/dimension tables) for reporting",
            "Write complex analytical SQL queries with window functions and multi-table joins",
            "Build interactive dashboards and reports in modern BI tools (Power BI, Tableau, Metabase)",
            "Implement row-level security, schedule data refreshes, and communicate data storytelling"
        ],
        "representative_work": "An enterprise KPI dashboard suite featuring dimensional data modeling, complex SQL/DAX metrics (YoY growth, customer churn), interactive cross-filtering, row-level security, and executive storytelling slides.",
        "core_skills": [
            "KPI definition and metric framework design",
            "Dimensional data modeling (star and snowflake schemas)",
            "Fact vs dimension tables and surrogate keys",
            "Advanced SQL queries and window functions",
            "Data warehouse architecture fundamentals",
            "Data visualization principles and chart selection",
            "Interactive dashboard design (Power BI / Tableau)",
            "Calculated measures and time-intelligence expressions",
            "Row-level security (RLS) and access governance",
            "Executive data storytelling and automated alerts"
        ],
        "milestones": [
            {
                "slug": "bi-concepts-requirements",
                "title": "Business intelligence concepts and requirements",
                "summary": "Understand the BI lifecycle, define business KPI frameworks, gather stakeholder requirements, and apply data governance.",
                "topics": [
                    {
                        "slug": "bi-role-decision-support",
                        "title": "Business intelligence role and decision support",
                        "overview": "Learn how business intelligence bridges raw operational data and executive decision-making through timely reporting.",
                        "subtopics": [
                            ("The BI Lifecycle", "From data generation to ingestion, modeling, visualization, and strategic business action."),
                            ("Descriptive vs Diagnostic Analytics", "Answering 'What happened?' and 'Why did it happen?' with curated analytical data.")
                        ],
                        "practice": "Map out the decision-making process of a business stakeholder and identify the key reports they rely on.",
                        "url": "https://learn.microsoft.com/en-us/power-bi/fundamentals/power-bi-overview",
                        "resource_title": "What is Power BI? | Microsoft Learn"
                    },
                    {
                        "slug": "defining-kpi-metric-frameworks",
                        "title": "Defining business KPIs and metric frameworks",
                        "overview": "Design clear, actionable Key Performance Indicators (KPIs) like customer churn, lifetime value (LTV), and revenue growth.",
                        "subtopics": [
                            ("Leading vs Lagging Indicators", "Distinguishing between predictive input metrics and outcome results."),
                            ("SMART Metric Criteria", "Ensuring KPIs are Specific, Measurable, Achievable, Relevant, and Time-bound.")
                        ],
                        "practice": "Draft a KPI dictionary defining 5 key metrics for an e-commerce business including formula, data sources, and targets.",
                        "url": "https://learn.microsoft.com/en-us/power-bi/create-reports/service-dashboard-add-widget",
                        "resource_title": "Dashboard tiles and widgets | Microsoft Learn"
                    },
                    {
                        "slug": "stakeholder-requirements-gathering",
                        "title": "Stakeholder requirements gathering",
                        "overview": "Conduct interviews with business leaders to translate vague analytical questions into concrete dashboard specifications.",
                        "subtopics": [
                            ("Requirements Elicitation", "Asking targeted questions to uncover the real business problem behind an ad-hoc report request."),
                            ("Dashboard Wireframing", "Sketching low-fidelity dashboard layouts with stakeholders before writing data queries.")
                        ],
                        "practice": "Write a one-page requirements document and sketch a layout wireframe for a weekly executive sales review dashboard.",
                        "url": "https://learn.microsoft.com/en-us/power-bi/create-reports/designer-dashboard-best-practices",
                        "resource_title": "Tips for designing a great Power BI dashboard | Microsoft Learn"
                    },
                    {
                        "slug": "data-governance-compliance-basics",
                        "title": "Data governance and compliance basics",
                        "overview": "Understand data catalogs, single-source-of-truth principles, data stewardship, and privacy regulations (GDPR, CCPA).",
                        "subtopics": [
                            ("Single Source of Truth", "Ensuring consistent metric definitions across departments to avoid conflicting numbers."),
                            ("Data Classification and Privacy", "Protecting Personally Identifiable Information (PII) and maintaining audit trails.")
                        ],
                        "practice": "Create a data dictionary documenting column names, descriptions, data types, and sensitivity tags for a customer table.",
                        "url": "https://learn.microsoft.com/en-us/power-bi/guidance/whitepaper-powerbi-governance",
                        "resource_title": "Power BI Governance and Security | Microsoft Learn"
                    }
                ]
            },
            {
                "slug": "data-modeling-analytical-schemas",
                "title": "Data modeling and analytical schemas",
                "summary": "Design dimensional data models, construct star and snowflake schemas, and manage slowly changing dimensions.",
                "topics": [
                    {
                        "slug": "oltp-vs-olap-systems",
                        "title": "Relational databases vs analytical data warehouses",
                        "overview": "Understand why operational transactional systems (OLTP) differ fundamentally from analytical reporting data warehouses (OLAP).",
                        "subtopics": [
                            ("Row-Oriented vs Columnar Storage", "Why columnar storage drastically accelerates aggregation queries across millions of rows."),
                            ("Normalization vs Denormalization", "Why analytical reporting benefits from denormalized structures over 3NF normalized tables.")
                        ],
                        "practice": "Compare the execution time of an analytical aggregation query on a row-oriented table vs a columnar table.",
                        "url": "https://learn.microsoft.com/en-us/azure/architecture/data-guide/relational-data/online-analytical-processing-olap",
                        "resource_title": "Online Analytical Processing (OLAP) | Microsoft Learn"
                    },
                    {
                        "slug": "dimensional-modeling-star-snowflake",
                        "title": "Dimensional modeling: star and snowflake schemas",
                        "overview": "Design dimensional schemas that simplify reporting queries and maximize BI engine performance.",
                        "subtopics": [
                            ("Star Schema Architecture", "Surrounding a central fact table with denormalized dimension tables linked by simple foreign keys."),
                            ("Snowflake Schema Trade-offs", "Normalizing dimension tables and evaluating when the added join complexity is justified.")
                        ],
                        "practice": "Design a star schema diagram for a retail business with one fact table and four surrounding dimension tables.",
                        "url": "https://learn.microsoft.com/en-us/power-bi/guidance/star-schema",
                        "resource_title": "Understand star schema and the importance for Power BI | Microsoft Learn"
                    },
                    {
                        "slug": "fact-and-dimension-tables",
                        "title": "Fact tables and dimension tables",
                        "overview": "Differentiate additive, semi-additive, and non-additive numerical facts from descriptive categorical dimensions.",
                        "subtopics": [
                            ("Granularity of Facts", "Defining the exact grain (e.g., individual receipt line item vs daily summary) of a fact table."),
                            ("Surrogate Keys", "Why using synthetic surrogate keys instead of natural business keys protects historical integrity.")
                        ],
                        "practice": "Define schemas for a sales_fact table and customer_dim table, identifying business keys, surrogate keys, and measures.",
                        "url": "https://www.postgresql.org/docs/current/ddl-constraints.html",
                        "resource_title": "Constraints | PostgreSQL Documentation"
                    },
                    {
                        "slug": "slowly-changing-dimensions",
                        "title": "Slowly changing dimensions (SCD)",
                        "overview": "Track historical changes to dimension records over time using SCD Type 1 (overwrite), Type 2 (history rows), and Type 3.",
                        "subtopics": [
                            ("SCD Type 1 vs Type 2", "Overwriting attributes vs adding valid_from and valid_to timestamp columns to preserve history."),
                            ("Point-in-Time Reporting", "Querying transactions against the historical dimension attributes valid at the time of the sale.")
                        ],
                        "practice": "Write an SQL update demonstrating SCD Type 2 by closing an existing record and inserting a new version with an active date range.",
                        "url": "https://www.postgresql.org/docs/current/tutorial-update.html",
                        "resource_title": "Updating Data | PostgreSQL Documentation"
                    }
                ]
            },
            {
                "slug": "advanced-sql-analytical-queries",
                "title": "Advanced SQL for analytical queries",
                "summary": "Write complex analytical SQL queries using window functions, grouping sets, CTEs, and cohort aggregations.",
                "topics": [
                    {
                        "slug": "multitable-joins-cleaning-sql",
                        "title": "Multi-table joins and data cleaning in SQL",
                        "overview": "Combine data across multiple tables using INNER, LEFT, FULL OUTER joins, and handle NULL values with COALESCE.",
                        "subtopics": [
                            ("Handling Missing Values in Joins", "Using COALESCE and NULLIF to prevent null propagation in calculated metrics."),
                            ("Deduplication in SQL", "Identifying duplicate records using ROW_NUMBER() and filtering to the latest record.")
                        ],
                        "practice": "Write a query that joins three tables, cleans inconsistent capitalization, and replaces null values with defaults.",
                        "url": "https://www.postgresql.org/docs/current/queries-table-expressions.html",
                        "resource_title": "Table Expressions | PostgreSQL Documentation"
                    },
                    {
                        "slug": "aggregations-grouping-having",
                        "title": "Aggregations and grouping with HAVING",
                        "overview": "Aggregate millions of rows using SUM, COUNT, AVG, MIN, MAX, and filter aggregated results using the HAVING clause.",
                        "subtopics": [
                            ("WHERE vs HAVING", "Understanding that WHERE filters rows before aggregation while HAVING filters aggregated group results."),
                            ("GROUPING SETS and ROLLUP", "Generating subtotals and grand totals across multiple dimensions in a single query.")
                        ],
                        "practice": "Write a query grouping customer purchases by month and category, filtering only for categories generating over $10,000.",
                        "url": "https://www.postgresql.org/docs/current/queries-table-expressions.html#QUERIES-GROUP",
                        "resource_title": "The GROUP BY and HAVING Clauses | PostgreSQL Documentation"
                    },
                    {
                        "slug": "window-functions-sql",
                        "title": "Window functions: ROW_NUMBER, RANK, LEAD, LAG",
                        "overview": "Perform advanced calculations across row partitions without collapsing individual rows using SQL window functions.",
                        "subtopics": [
                            ("OVER (PARTITION BY ... ORDER BY)", "Calculating running totals, moving averages, and ranks within distinct subsets."),
                            ("LEAD and LAG", "Comparing current row values against prior or subsequent rows to calculate period-over-period differences.")
                        ],
                        "practice": "Write a query using LAG() to calculate the month-over-month revenue percentage change for each product category.",
                        "url": "https://www.postgresql.org/docs/current/tutorial-window.html",
                        "resource_title": "Window Functions | PostgreSQL Documentation"
                    },
                    {
                        "slug": "ctes-and-subqueries",
                        "title": "Common Table Expressions (CTEs) and subqueries",
                        "overview": "Break down complex multi-stage analytical queries into readable, modular Common Table Expressions (WITH clauses).",
                        "subtopics": [
                            ("Modularizing Queries with CTEs", "Replacing deeply nested subqueries with sequential, named CTE blocks."),
                            ("Cohort Analysis in SQL", "Tracking user retention cohorts by joining first-purchase CTEs with subsequent activity CTEs.")
                        ],
                        "practice": "Write a modular CTE query that cohorts users by their signup month and calculates their 30-day retention rate.",
                        "url": "https://www.postgresql.org/docs/current/queries-with.html",
                        "resource_title": "WITH Queries (Common Table Expressions) | PostgreSQL Docs"
                    }
                ]
            },
            {
                "slug": "bi-tools-visual-design",
                "title": "BI tools, data extraction and visual design",
                "summary": "Connect BI tools to data warehouses, apply visual perception principles, and design accessible, interactive dashboard views.",
                "topics": [
                    {
                        "slug": "connecting-bi-data-sources",
                        "title": "Connecting BI tools to data sources",
                        "overview": "Establish secure database connections, configure direct query versus in-memory import modes, and schedule data refreshes.",
                        "subtopics": [
                            ("Import vs DirectQuery / Live Connection", "Understanding performance trade-offs between cached in-memory models and live queries."),
                            ("Data Transformation in BI Tools", "Using Power Query or visual ETL stages to reshape and clean incoming datasets.")
                        ],
                        "practice": "Connect a BI tool to a relational database, import two related tables, and configure the relationship cardinality.",
                        "url": "https://learn.microsoft.com/en-us/power-bi/connect-data/desktop-connect-to-data",
                        "resource_title": "Connect to data in Power BI Desktop | Microsoft Learn"
                    },
                    {
                        "slug": "visual-perception-chart-selection",
                        "title": "Principles of visual perception and chart selection",
                        "overview": "Apply pre-attentive visual attributes (position, length, color) to select the right chart type for every data story.",
                        "subtopics": [
                            ("Chart Selection Framework", "Using line charts for trends, bar charts for comparisons, scatter plots for correlation, and avoiding pie charts."),
                            ("Decluttering Visuals", "Eliminating non-data ink, reducing gridlines, and maximizing data-to-ink ratio.")
                        ],
                        "practice": "Redesign a cluttered 3D chart into a clean, minimal horizontal bar chart with direct data labels.",
                        "url": "https://learn.microsoft.com/en-us/power-bi/visuals/power-bi-visualization-types-for-reports",
                        "resource_title": "Visualization types in Power BI | Microsoft Learn"
                    },
                    {
                        "slug": "interactive-dashboard-design",
                        "title": "Designing interactive dashboards and filters",
                        "overview": "Build intuitive dashboard layouts with cross-filtering, slicers, drill-through paths, and clear visual hierarchy.",
                        "subtopics": [
                            ("F-Shaped Visual Hierarchy", "Placing primary summary KPI cards at the top left and detailed analytical charts below."),
                            ("Cross-Highlighting and Slicers", "Enabling users to click an item in one chart to filter all related visuals on the page.")
                        ],
                        "practice": "Create an interactive dashboard with 4 KPI cards at the top, a trend line chart, and an interactive category slicer.",
                        "url": "https://learn.microsoft.com/en-us/power-bi/create-reports/power-bi-reports-filters-and-highlighting",
                        "resource_title": "About filters and highlighting in Power BI reports | Microsoft Learn"
                    },
                    {
                        "slug": "color-typography-accessibility",
                        "title": "Color palettes, typography and dashboard accessibility",
                        "overview": "Ensure dashboards are legible and accessible to all users by using colorblind-safe palettes and proper text contrast.",
                        "subtopics": [
                            ("Color Psychology and Contrast", "Using color purposefully to highlight outliers rather than decorating every element."),
                            ("Accessible Visuals", "Meeting WCAG 2.1 AA color contrast standards and adding alt-text descriptions to charts.")
                        ],
                        "practice": "Apply a colorblind-safe palette to a dashboard and verify that all text meets WCAG contrast requirements.",
                        "url": "https://learn.microsoft.com/en-us/power-bi/create-reports/desktop-accessibility-creating-reports",
                        "resource_title": "Creating accessible Power BI reports | Microsoft Learn"
                    }
                ]
            },
            {
                "slug": "calculations-expressions-security",
                "title": "Calculations, expressions and row security",
                "summary": "Write expressive analytical formulas (DAX / calculated fields), implement time intelligence, and enforce row-level security.",
                "topics": [
                    {
                        "slug": "calculated-columns-measures",
                        "title": "Calculated columns and custom measures",
                        "overview": "Differentiate between row-by-row calculated columns and dynamic, aggregatable measures evaluated in filter context.",
                        "subtopics": [
                            ("Row Context vs Filter Context", "Why measures recompute dynamically based on active dashboard slicers and filters."),
                            ("Basic Aggregation Formulas", "Writing DAX / expression formulas using SUM, AVERAGE, DIVIDE, and COUNTROWS.")
                        ],
                        "practice": "Write a calculated measure that computes profit margin percentage safely handling zero-revenue divisions.",
                        "url": "https://learn.microsoft.com/en-us/power-bi/transform-model/desktop-measures",
                        "resource_title": "Create measures for data analysis in Power BI Desktop | Microsoft Learn"
                    },
                    {
                        "slug": "time-intelligence-expressions",
                        "title": "Time intelligence expressions and YoY growth",
                        "overview": "Calculate period-over-period metrics (Year-over-Year, Quarter-to-Date, Month-over-Month) using a dedicated date dimension.",
                        "subtopics": [
                            ("The Dedicated Date Table", "Why time intelligence requires a contiguous, unbroken calendar dimension table."),
                            ("Period Shift Functions", "Using SAMEPERIODLASTYEAR and DATEADD to calculate growth rates and comparisons.")
                        ],
                        "practice": "Create a Year-over-Year (YoY) Sales Growth measure and plot it on a bar chart alongside current year sales.",
                        "url": "https://learn.microsoft.com/en-us/power-bi/transform-model/desktop-quickstart-learn-dax-basics",
                        "resource_title": "Apply DAX basics in Power BI Desktop | Microsoft Learn"
                    },
                    {
                        "slug": "row-level-security-rls",
                        "title": "Row-level security (RLS) implementation",
                        "overview": "Restrict data access for given users so regional managers only see data pertaining to their assigned territory.",
                        "subtopics": [
                            ("Static vs Dynamic RLS", "Assigning static role filters vs looking up the current user's email via USERPRINCIPALNAME()."),
                            ("Testing Roles", "Validating that data is correctly filtered when viewing the dashboard under different simulated roles.")
                        ],
                        "practice": "Configure a dynamic row-level security role that filters customer sales records to match the viewer's regional assignment.",
                        "url": "https://learn.microsoft.com/en-us/power-bi/enterprise/service-admin-rls",
                        "resource_title": "Row-level security (RLS) with Power BI | Microsoft Learn"
                    },
                    {
                        "slug": "scheduled-refreshes-gateways",
                        "title": "Scheduled data refreshes and gateway configuration",
                        "overview": "Automate daily or hourly data refreshes from on-premises databases and cloud data warehouses to keep reports fresh.",
                        "subtopics": [
                            ("Data Refresh Lifecycle", "Configuring automated refresh schedules and monitoring failure notifications."),
                            ("Data Gateways", "Setting up on-premises data gateways to bridge local databases securely to cloud BI services.")
                        ],
                        "practice": "Configure a scheduled data refresh for a published report and review the refresh history logs.",
                        "url": "https://learn.microsoft.com/en-us/power-bi/connect-data/refresh-data",
                        "resource_title": "Data refresh in Power BI | Microsoft Learn"
                    }
                ]
            },
            {
                "slug": "executive-reporting-storytelling",
                "title": "Executive reporting, alerting and business impact",
                "summary": "Configure automated KPI alerts, enable drill-down pathways, and present data-driven narratives to executive stakeholders.",
                "topics": [
                    {
                        "slug": "drill-down-cross-filtering",
                        "title": "Drill-down and cross-filtering interactions",
                        "overview": "Enable users to navigate seamlessly from high-level annual summaries down into monthly and daily transactional records.",
                        "subtopics": [
                            ("Hierarchy Drill-Down", "Configuring date and geographic hierarchies (Year > Quarter > Month > Day) in visual charts."),
                            ("Drill-Through Pages", "Creating dedicated detail pages that open when a user right-clicks a specific customer or store.")
                        ],
                        "practice": "Build a drill-through page that displays detailed order history when clicking a specific customer on the main report.",
                        "url": "https://learn.microsoft.com/en-us/power-bi/create-reports/desktop-drillthrough",
                        "resource_title": "Set up drillthrough in Power BI reports | Microsoft Learn"
                    },
                    {
                        "slug": "automated-alerts-anomaly-detection",
                        "title": "Automated data alerts and KPI anomaly detection",
                        "overview": "Set threshold-based alerts that notify teams via email or Slack when a crucial KPI exceeds or drops below targets.",
                        "subtopics": [
                            ("Metric Threshold Alerts", "Configuring alerts that fire when daily churn exceeds 5% or server errors spike."),
                            ("Automated Anomaly Detection", "Using built-in machine learning anomaly detection to highlight unexpected dips or spikes in time-series data.")
                        ],
                        "practice": "Set an alert on a KPI card that sends a notification if daily revenue falls below target.",
                        "url": "https://learn.microsoft.com/en-us/power-bi/create-reports/service-set-data-alerts",
                        "resource_title": "Set data alerts in the Power BI service | Microsoft Learn"
                    },
                    {
                        "slug": "executive-summary-storytelling",
                        "title": "Executive summary presentation and storytelling",
                        "overview": "Structure data storytelling presentations that lead with business context, explain root causes, and propose clear actions.",
                        "subtopics": [
                            ("The Data Story Arc", "Structuring findings: Situation, Complication, Evidence (data charts), and Resolution (recommendations)."),
                            ("Executive Summaries", "Distilling 20-page dashboards into 3 bullet points that answer 'So what?' for leadership.")
                        ],
                        "practice": "Write an executive slide summary interpreting an unexpected drop in product margins and recommending 2 business actions.",
                        "url": "https://learn.microsoft.com/en-us/power-bi/create-reports/designer-dashboard-best-practices",
                        "resource_title": "Best practices for dashboard design | Microsoft Learn"
                    },
                    {
                        "slug": "commercial-bi-project-delivery",
                        "title": "Delivering an end-to-end commercial BI project",
                        "overview": "Package your star schema model, calculated measures, interactive dashboards, RLS security, and user documentation into a finished deliverable.",
                        "subtopics": [
                            ("Report Documentation", "Documenting metric definitions, data lineage, and user instructions for self-service analytics."),
                            ("Stakeholder Handoff", "Conducting end-user training sessions and gathering user feedback for continuous dashboard refinement.")
                        ],
                        "practice": "Publish a completed BI report workspace with configured roles, documentation, and a schedule of automated refreshes.",
                        "url": "https://learn.microsoft.com/en-us/power-bi/collaborate-share/service-create-distribute-apps",
                        "resource_title": "Create and distribute an app in Power BI | Microsoft Learn"
                    }
                ]
            }
        ]
    }
]
