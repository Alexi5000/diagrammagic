/**
 * Template Library Dataset
 * 
 * Provides a comprehensive collection of pre-built Mermaid diagram templates
 * organized by category (business, technical, education) with varying difficulty levels.
 * 
 * @module data/templates
 */

import { Template, DiagramType, Category } from '@/types';

/**
 * Complete template library with 12 professionally crafted Mermaid diagrams
 * across Business, Technical, and Education categories
 */
export const templates: Template[] = [
  // ==================== BUSINESS CATEGORY (4) ====================
  
  {
    id: 'tpl-business-swot-001',
    name: 'SWOT Analysis Matrix',
    description: 'Strategic planning framework to identify Strengths, Weaknesses, Opportunities, and Threats. Perfect for business strategy sessions and competitive analysis.',
    code: `graph TB
    subgraph "SWOT Analysis"
        subgraph Strengths
            S1[Strong Brand Recognition]
            S2[Experienced Team]
            S3[High Customer Loyalty]
            S4[Innovative Products]
        end
        
        subgraph Weaknesses
            W1[Limited Market Reach]
            W2[High Operating Costs]
            W3[Outdated Technology]
            W4[Small Marketing Budget]
        end
        
        subgraph Opportunities
            O1[Growing Market Demand]
            O2[Digital Transformation]
            O3[New Markets/Regions]
            O4[Strategic Partnerships]
        end
        
        subgraph Threats
            T1[Intense Competition]
            T2[Economic Downturn]
            T3[Regulatory Changes]
            T4[Changing Consumer Trends]
        end
    end
    
    style Strengths fill:#10b981,stroke:#059669,color:#fff
    style Weaknesses fill:#ef4444,stroke:#dc2626,color:#fff
    style Opportunities fill:#3b82f6,stroke:#2563eb,color:#fff
    style Threats fill:#f59e0b,stroke:#d97706,color:#fff`,
    type: 'flowchart',
    category: 'business',
    difficulty: 'beginner',
    usageCount: 1247
  },

  {
    id: 'tpl-business-journey-002',
    name: 'Customer Journey Map',
    description: 'Visual representation of the complete customer experience from awareness to advocacy. Helps identify pain points and opportunities for improvement.',
    code: `journey
    title Customer Journey - E-commerce Purchase
    section Awareness
      See social media ad: 3: Customer
      Visit website: 4: Customer
      Browse products: 4: Customer
    section Consideration
      Compare products: 4: Customer
      Read reviews: 5: Customer
      Add to cart: 5: Customer
    section Purchase
      Enter shipping info: 3: Customer
      Apply discount code: 5: Customer
      Complete payment: 4: Customer
    section Delivery
      Receive confirmation: 5: Customer
      Track shipment: 4: Customer
      Receive product: 5: Customer
    section Post-Purchase
      Use product: 5: Customer
      Leave review: 4: Customer
      Recommend to friend: 5: Customer`,
    type: 'journey',
    category: 'business',
    difficulty: 'intermediate',
    usageCount: 892
  },

  {
    id: 'tpl-business-funnel-003',
    name: 'Sales Funnel Pipeline',
    description: 'Conversion funnel showing the customer acquisition process from awareness to purchase. Essential for tracking and optimizing sales performance.',
    code: `graph TD
    A[Awareness<br/>10,000 Visitors] --> B[Interest<br/>5,000 Engaged]
    B --> C[Consideration<br/>2,000 Prospects]
    C --> D[Intent<br/>800 Qualified Leads]
    D --> E[Evaluation<br/>400 Opportunities]
    E --> F[Purchase<br/>200 Customers]
    
    A -.->|50% Drop-off| G[Left Website]
    B -.->|60% Drop-off| H[Not Interested]
    C -.->|60% Drop-off| I[Chose Competitor]
    D -.->|50% Drop-off| J[Budget Issues]
    E -.->|50% Drop-off| K[Timing Not Right]
    
    style A fill:#8b5cf6,stroke:#7c3aed,color:#fff
    style B fill:#6366f1,stroke:#4f46e5,color:#fff
    style C fill:#3b82f6,stroke:#2563eb,color:#fff
    style D fill:#0ea5e9,stroke:#0284c7,color:#fff
    style E fill:#06b6d4,stroke:#0891b2,color:#fff
    style F fill:#10b981,stroke:#059669,color:#fff
    style G fill:#ef4444,stroke:#dc2626,color:#fff
    style H fill:#ef4444,stroke:#dc2626,color:#fff
    style I fill:#ef4444,stroke:#dc2626,color:#fff
    style J fill:#ef4444,stroke:#dc2626,color:#fff
    style K fill:#ef4444,stroke:#dc2626,color:#fff`,
    type: 'flowchart',
    category: 'business',
    difficulty: 'beginner',
    usageCount: 1456
  },

  {
    id: 'tpl-business-orgchart-004',
    name: 'Organization Chart',
    description: 'Hierarchical structure showing company departments and reporting relationships. Useful for onboarding, planning, and organizational design.',
    code: `graph TD
    CEO[CEO<br/>John Smith]
    
    CEO --> CTO[CTO<br/>Sarah Johnson]
    CEO --> CFO[CFO<br/>Michael Chen]
    CEO --> CMO[CMO<br/>Emily Davis]
    CEO --> COO[COO<br/>David Brown]
    
    CTO --> DevMgr[Development Manager<br/>Alex Kim]
    CTO --> QAMgr[QA Manager<br/>Lisa Wang]
    CTO --> DevOpsMgr[DevOps Manager<br/>Tom Anderson]
    
    DevMgr --> FrontEnd[Frontend Team<br/>5 Engineers]
    DevMgr --> BackEnd[Backend Team<br/>6 Engineers]
    QAMgr --> QATeam[QA Team<br/>4 Testers]
    DevOpsMgr --> DevOpsTeam[DevOps Team<br/>3 Engineers]
    
    CFO --> Accounting[Accounting<br/>3 Staff]
    CFO --> Finance[Finance<br/>2 Analysts]
    
    CMO --> Marketing[Marketing Team<br/>4 Specialists]
    CMO --> Sales[Sales Team<br/>6 Reps]
    
    COO --> HR[HR<br/>2 Staff]
    COO --> Operations[Operations<br/>5 Staff]
    
    style CEO fill:#8b5cf6,stroke:#7c3aed,color:#fff
    style CTO fill:#3b82f6,stroke:#2563eb,color:#fff
    style CFO fill:#3b82f6,stroke:#2563eb,color:#fff
    style CMO fill:#3b82f6,stroke:#2563eb,color:#fff
    style COO fill:#3b82f6,stroke:#2563eb,color:#fff`,
    type: 'flowchart',
    category: 'business',
    difficulty: 'beginner',
    usageCount: 2103
  },

  // ==================== TECHNICAL CATEGORY (4) ====================

  {
    id: 'tpl-technical-api-005',
    name: 'REST API Request Flow',
    description: 'Sequence diagram showing typical REST API authentication and data retrieval process. Demonstrates client-server interaction patterns.',
    code: `sequenceDiagram
    participant Client
    participant Gateway as API Gateway
    participant Auth as Auth Service
    participant API as Resource API
    participant DB as Database
    participant Cache as Redis Cache
    
    Client->>Gateway: POST /auth/login
    Gateway->>Auth: Validate credentials
    Auth->>DB: Query user
    DB-->>Auth: User data
    Auth->>Auth: Generate JWT token
    Auth-->>Gateway: JWT token + refresh token
    Gateway-->>Client: 200 OK + tokens
    
    Note over Client: Store tokens securely
    
    Client->>Gateway: GET /api/users/profile<br/>Authorization: Bearer {token}
    Gateway->>Auth: Validate JWT
    Auth-->>Gateway: Token valid
    
    Gateway->>Cache: Check cache
    Cache-->>Gateway: Cache miss
    
    Gateway->>API: Forward request
    API->>DB: SELECT * FROM users WHERE id=?
    DB-->>API: User profile data
    
    API->>Cache: Store in cache (TTL: 5m)
    API-->>Gateway: User profile JSON
    Gateway-->>Client: 200 OK + profile data
    
    Note over Client,DB: Subsequent request hits cache`,
    type: 'sequence',
    category: 'technical',
    difficulty: 'intermediate',
    usageCount: 1678
  },

  {
    id: 'tpl-technical-microservices-006',
    name: 'Microservices System Architecture',
    description: 'Advanced architecture diagram showing microservices communication patterns with event bus and API gateway. Ideal for distributed system design.',
    code: `graph TB
    subgraph "Client Layer"
        Web[Web App]
        Mobile[Mobile App]
        Admin[Admin Portal]
    end
    
    subgraph "Gateway Layer"
        Gateway[API Gateway<br/>Kong/NGINX]
    end
    
    subgraph "Service Mesh"
        AuthSvc[Auth Service<br/>:8001]
        UserSvc[User Service<br/>:8002]
        ProductSvc[Product Service<br/>:8003]
        OrderSvc[Order Service<br/>:8004]
        PaymentSvc[Payment Service<br/>:8005]
        NotificationSvc[Notification Service<br/>:8006]
    end
    
    subgraph "Message Bus"
        EventBus[Event Bus<br/>Kafka/RabbitMQ]
    end
    
    subgraph "Data Layer"
        AuthDB[(Auth DB<br/>PostgreSQL)]
        UserDB[(User DB<br/>PostgreSQL)]
        ProductDB[(Product DB<br/>MongoDB)]
        OrderDB[(Order DB<br/>PostgreSQL)]
        Cache[(Redis Cache)]
    end
    
    Web --> Gateway
    Mobile --> Gateway
    Admin --> Gateway
    
    Gateway --> AuthSvc
    Gateway --> UserSvc
    Gateway --> ProductSvc
    Gateway --> OrderSvc
    
    AuthSvc --> AuthDB
    UserSvc --> UserDB
    ProductSvc --> ProductDB
    OrderSvc --> OrderDB
    
    OrderSvc --> PaymentSvc
    PaymentSvc --> EventBus
    OrderSvc --> EventBus
    EventBus --> NotificationSvc
    
    UserSvc --> Cache
    ProductSvc --> Cache
    
    style Gateway fill:#8b5cf6,stroke:#7c3aed,color:#fff
    style EventBus fill:#f59e0b,stroke:#d97706,color:#fff`,
    type: 'flowchart',
    category: 'technical',
    difficulty: 'advanced',
    usageCount: 945
  },

  {
    id: 'tpl-technical-git-007',
    name: 'Git Branching Workflow',
    description: 'Git Flow branching strategy showing feature development, releases, and hotfixes. Essential for team collaboration and version control.',
    code: `gitGraph
    commit id: "Initial commit"
    commit id: "Setup project"
    
    branch develop
    checkout develop
    commit id: "Add base structure"
    
    branch feature/user-auth
    checkout feature/user-auth
    commit id: "Add login page"
    commit id: "Add registration"
    commit id: "Add JWT auth"
    
    checkout develop
    merge feature/user-auth
    commit id: "Integrate auth"
    
    branch feature/dashboard
    checkout feature/dashboard
    commit id: "Create dashboard layout"
    commit id: "Add widgets"
    
    checkout develop
    branch release/v1.0
    checkout release/v1.0
    commit id: "Bump version to 1.0"
    commit id: "Update changelog"
    
    checkout main
    merge release/v1.0 tag: "v1.0.0"
    
    checkout develop
    merge release/v1.0
    merge feature/dashboard
    
    checkout main
    branch hotfix/security-patch
    checkout hotfix/security-patch
    commit id: "Fix XSS vulnerability"
    commit id: "Update dependencies"
    
    checkout main
    merge hotfix/security-patch tag: "v1.0.1"
    
    checkout develop
    merge hotfix/security-patch
    commit id: "Continue development"`,
    type: 'git',
    category: 'technical',
    difficulty: 'intermediate',
    usageCount: 1834
  },

  {
    id: 'tpl-technical-database-008',
    name: 'Database Schema Design',
    description: 'Entity-relationship diagram for a complete blog platform with users, posts, comments, and categories. Shows relationships and cardinality.',
    code: `erDiagram
    USERS ||--o{ POSTS : creates
    USERS ||--o{ COMMENTS : writes
    USERS ||--o{ FOLLOWERS : follows
    USERS ||--o{ FOLLOWERS : "is followed by"
    POSTS ||--o{ COMMENTS : contains
    POSTS }o--|| CATEGORIES : "belongs to"
    POSTS }o--o{ TAGS : "tagged with"
    
    USERS {
        uuid id PK
        string email UK
        string username UK
        string password_hash
        string full_name
        string avatar_url
        text bio
        timestamp created_at
        timestamp updated_at
        boolean is_verified
        boolean is_active
    }
    
    POSTS {
        uuid id PK
        uuid author_id FK
        uuid category_id FK
        string title
        string slug UK
        text content
        text excerpt
        string featured_image
        enum status "draft/published/archived"
        integer view_count
        timestamp published_at
        timestamp created_at
        timestamp updated_at
    }
    
    COMMENTS {
        uuid id PK
        uuid post_id FK
        uuid user_id FK
        uuid parent_id FK "for nested comments"
        text content
        boolean is_approved
        timestamp created_at
        timestamp updated_at
    }
    
    CATEGORIES {
        uuid id PK
        string name UK
        string slug UK
        text description
        integer post_count
    }
    
    TAGS {
        uuid id PK
        string name UK
        string slug UK
    }
    
    FOLLOWERS {
        uuid follower_id FK
        uuid following_id FK
        timestamp created_at
    }`,
    type: 'er',
    category: 'technical',
    difficulty: 'intermediate',
    usageCount: 1523
  },

  // ==================== EDUCATION CATEGORY (4) ====================

  {
    id: 'tpl-education-learning-009',
    name: 'Learning Path Roadmap',
    description: 'Structured learning path for becoming a full-stack developer with clear progression stages. Helps students visualize their journey.',
    code: `graph LR
    Start([Start Here]) --> Basics
    
    subgraph "Phase 1: Foundations"
        Basics[Web Basics<br/>HTML/CSS/JS]
        Basics --> Git[Version Control<br/>Git & GitHub]
        Git --> Responsive[Responsive Design<br/>Flexbox/Grid]
    end
    
    subgraph "Phase 2: Frontend"
        Responsive --> React[React Fundamentals<br/>Components & Hooks]
        React --> State[State Management<br/>Redux/Context]
        State --> Next[Next.js<br/>SSR & Routing]
    end
    
    subgraph "Phase 3: Backend"
        Next --> Node[Node.js<br/>Express/Fastify]
        Node --> DB[Databases<br/>SQL & NoSQL]
        DB --> API[REST APIs<br/>GraphQL]
    end
    
    subgraph "Phase 4: Advanced"
        API --> Docker[Containerization<br/>Docker]
        Docker --> Cloud[Cloud Deploy<br/>AWS/Vercel]
        Cloud --> Testing[Testing<br/>Jest/Cypress]
    end
    
    Testing --> Complete([Full-Stack Developer])
    
    style Start fill:#10b981,stroke:#059669,color:#fff
    style Complete fill:#8b5cf6,stroke:#7c3aed,color:#fff
    style Basics fill:#3b82f6,stroke:#2563eb,color:#fff
    style React fill:#3b82f6,stroke:#2563eb,color:#fff
    style Node fill:#3b82f6,stroke:#2563eb,color:#fff
    style Docker fill:#3b82f6,stroke:#2563eb,color:#fff`,
    type: 'flowchart',
    category: 'education',
    difficulty: 'beginner',
    usageCount: 2567
  },

  {
    id: 'tpl-education-mindmap-010',
    name: 'Concept Map - Machine Learning',
    description: 'Mind map showing core machine learning concepts and their relationships. Great for study guides and knowledge organization.',
    code: `graph TB
    ML[Machine Learning]
    
    ML --> Supervised[Supervised Learning]
    ML --> Unsupervised[Unsupervised Learning]
    ML --> Reinforcement[Reinforcement Learning]
    ML --> DeepLearning[Deep Learning]
    
    Supervised --> Classification[Classification]
    Supervised --> Regression[Regression]
    
    Classification --> LogReg[Logistic Regression]
    Classification --> SVM[Support Vector Machines]
    Classification --> DecTree[Decision Trees]
    Classification --> RF[Random Forest]
    
    Regression --> LinReg[Linear Regression]
    Regression --> PolyReg[Polynomial Regression]
    
    Unsupervised --> Clustering[Clustering]
    Unsupervised --> DimRed[Dimensionality Reduction]
    
    Clustering --> KMeans[K-Means]
    Clustering --> DBSCAN[DBSCAN]
    Clustering --> Hierarchical[Hierarchical]
    
    DimRed --> PCA[PCA]
    DimRed --> tSNE[t-SNE]
    
    Reinforcement --> QLearning[Q-Learning]
    Reinforcement --> PolicyGrad[Policy Gradient]
    Reinforcement --> ActorCritic[Actor-Critic]
    
    DeepLearning --> CNN[Convolutional NN<br/>Image Processing]
    DeepLearning --> RNN[Recurrent NN<br/>Sequences]
    DeepLearning --> Transformer[Transformers<br/>NLP]
    DeepLearning --> GAN[GANs<br/>Generation]
    
    style ML fill:#8b5cf6,stroke:#7c3aed,color:#fff
    style Supervised fill:#3b82f6,stroke:#2563eb,color:#fff
    style Unsupervised fill:#10b981,stroke:#059669,color:#fff
    style Reinforcement fill:#f59e0b,stroke:#d97706,color:#fff
    style DeepLearning fill:#ef4444,stroke:#dc2626,color:#fff`,
    type: 'flowchart',
    category: 'education',
    difficulty: 'beginner',
    usageCount: 1789
  },

  {
    id: 'tpl-education-timeline-011',
    name: 'Historical Timeline',
    description: 'Chronological visualization of the evolution of programming languages. Perfect for presentations and educational materials.',
    code: `gantt
    title Evolution of Programming Languages (1950-2020)
    dateFormat YYYY
    axisFormat %Y
    
    section First Generation
    Fortran         :1957, 1957
    LISP           :1958, 1958
    COBOL          :1959, 1959
    
    section Second Generation
    BASIC          :1964, 1964
    Pascal         :1970, 1970
    C              :1972, 1972
    SQL            :1974, 1974
    
    section Third Generation
    C++            :1985, 1985
    Perl           :1987, 1987
    Python         :1991, 1991
    Ruby           :1995, 1995
    Java           :1995, 1995
    JavaScript     :1995, 1995
    PHP            :1995, 1995
    
    section Modern Era
    C#             :2000, 2000
    Scala          :2004, 2004
    Go             :2009, 2009
    Rust           :2010, 2010
    Kotlin         :2011, 2011
    TypeScript     :2012, 2012
    Swift          :2014, 2014`,
    type: 'gantt',
    category: 'education',
    difficulty: 'beginner',
    usageCount: 1234
  },

  {
    id: 'tpl-education-process-012',
    name: 'Process Steps Tutorial',
    description: 'Step-by-step guide for the software development lifecycle with decision points. Excellent for training and documentation.',
    code: `graph TD
    Start([New Project Request]) --> Analysis{Requirements<br/>Clear?}
    
    Analysis -->|No| Gather[Gather Requirements<br/>Stakeholder Meetings]
    Gather --> Analysis
    
    Analysis -->|Yes| Design[System Design<br/>Architecture Planning]
    Design --> Review{Design<br/>Approved?}
    
    Review -->|No| Design
    Review -->|Yes| Dev[Development Phase<br/>Write Code]
    
    Dev --> UnitTest[Unit Testing<br/>Write Tests]
    UnitTest --> CodeReview{Code Review<br/>Passed?}
    
    CodeReview -->|Issues Found| Dev
    CodeReview -->|Approved| Integration[Integration Testing<br/>Test Components]
    
    Integration --> IntegrationPass{Tests<br/>Pass?}
    IntegrationPass -->|Failed| Dev
    IntegrationPass -->|Passed| UAT[User Acceptance Testing<br/>Stakeholder Testing]
    
    UAT --> UATPass{UAT<br/>Approved?}
    UATPass -->|Failed| Analysis
    UATPass -->|Approved| Deploy[Deploy to Production<br/>Release]
    
    Deploy --> Monitor[Monitor Performance<br/>Collect Feedback]
    Monitor --> Maintenance{Maintenance<br/>Needed?}
    
    Maintenance -->|Bug Fix| Dev
    Maintenance -->|New Feature| Analysis
    Maintenance -->|No Issues| Complete([Project Complete])
    
    style Start fill:#10b981,stroke:#059669,color:#fff
    style Complete fill:#8b5cf6,stroke:#7c3aed,color:#fff
    style Analysis fill:#3b82f6,stroke:#2563eb,color:#fff
    style Review fill:#3b82f6,stroke:#2563eb,color:#fff
    style CodeReview fill:#3b82f6,stroke:#2563eb,color:#fff
    style IntegrationPass fill:#3b82f6,stroke:#2563eb,color:#fff
    style UATPass fill:#3b82f6,stroke:#2563eb,color:#fff
    style Maintenance fill:#3b82f6,stroke:#2563eb,color:#fff`,
    type: 'flowchart',
    category: 'education',
    difficulty: 'beginner',
    usageCount: 1987
  }
];

// ==================== UTILITY FUNCTIONS ====================

/**
 * Get a template by its unique ID
 * @param id - Template ID to search for
 * @returns Template object or undefined if not found
 */
export const getTemplateById = (id: string): Template | undefined => {
  return templates.find(template => template.id === id);
};

/**
 * Get all templates in a specific category
 * @param category - Category to filter by (business, technical, education)
 * @returns Array of templates in the specified category
 */
export const getTemplatesByCategory = (category: Category): Template[] => {
  return templates.filter(template => template.category === category);
};

/**
 * Get all templates of a specific diagram type
 * @param type - Diagram type to filter by
 * @returns Array of templates with the specified type
 */
export const getTemplatesByType = (type: DiagramType): Template[] => {
  return templates.filter(template => template.type === type);
};

/**
 * Get templates by difficulty level
 * @param difficulty - Difficulty level (beginner, intermediate, advanced)
 * @returns Array of templates matching the difficulty level
 */
export const getTemplatesByDifficulty = (difficulty: 'beginner' | 'intermediate' | 'advanced'): Template[] => {
  return templates.filter(template => template.difficulty === difficulty);
};

/**
 * Get most popular templates sorted by usage count
 * @param limit - Maximum number of templates to return (default: 5)
 * @returns Array of templates sorted by usage count (descending)
 */
export const getPopularTemplates = (limit: number = 5): Template[] => {
  return [...templates]
    .sort((a, b) => b.usageCount - a.usageCount)
    .slice(0, limit);
};

/**
 * Search templates by name, description, or category
 * @param query - Search query string
 * @returns Array of templates matching the search query
 */
export const searchTemplates = (query: string): Template[] => {
  const lowerQuery = query.toLowerCase();
  return templates.filter(template => 
    template.name.toLowerCase().includes(lowerQuery) ||
    template.description.toLowerCase().includes(lowerQuery) ||
    template.category.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Get a random template
 * @returns Random template from the library
 */
export const getRandomTemplate = (): Template => {
  const randomIndex = Math.floor(Math.random() * templates.length);
  return templates[randomIndex];
};

/**
 * Get template statistics
 * @returns Object containing template library statistics
 */
export const getTemplateStats = () => {
  return {
    total: templates.length,
    byCategory: {
      business: getTemplatesByCategory('business').length,
      technical: getTemplatesByCategory('technical').length,
      education: getTemplatesByCategory('education').length
    },
    byDifficulty: {
      beginner: getTemplatesByDifficulty('beginner').length,
      intermediate: getTemplatesByDifficulty('intermediate').length,
      advanced: getTemplatesByDifficulty('advanced').length
    },
    totalUsage: templates.reduce((sum, t) => sum + t.usageCount, 0),
    averageUsage: Math.round(templates.reduce((sum, t) => sum + t.usageCount, 0) / templates.length)
  };
};
