/**
 * Sample Mermaid diagram dataset for AI Diagram Creator
 * 
 * This file contains pre-built diagram examples across different types:
 * - Flowcharts for business processes
 * - Sequence diagrams for technical flows
 * - ER diagrams for database schemas
 * - Class diagrams for OOP structures
 * - Gantt charts for project timelines
 * 
 * @module data/sampleDiagrams
 */

import { Diagram, DiagramType } from '@/types';

/**
 * Complete set of sample diagrams covering all major diagram types
 * Each diagram includes realistic metadata and production-ready Mermaid code
 */
export const sampleDiagrams: Diagram[] = [
  {
    id: 'usr-reg-001',
    title: 'User Registration Workflow',
    description: 'Complete user registration flow with email verification and validation steps',
    code: `graph TD
    A[Start Registration] --> B{Email Valid?}
    B -->|No| C[Show Error Message]
    C --> A
    B -->|Yes| D{Password Strong?}
    D -->|No| E[Show Password Requirements]
    E --> A
    D -->|Yes| F[Create User Account]
    F --> G[Send Verification Email]
    G --> H{Email Verified?}
    H -->|No| I[Resend Email Option]
    I --> H
    H -->|Yes| J[Activate Account]
    J --> K[Show Success Message]
    K --> L[Redirect to Dashboard]
    L --> M[End]
    
    style A fill:#e3f2fd
    style M fill:#c8e6c9
    style C fill:#ffcdd2
    style E fill:#ffcdd2`,
    type: 'flowchart',
    createdAt: '2025-01-10T09:15:00Z',
    updatedAt: '2025-01-12T14:30:00Z',
    tags: ['authentication', 'user-flow', 'registration', 'workflow', 'business'],
    isFavorite: false
  },
  
  {
    id: 'auth-seq-002',
    title: 'JWT Authentication Flow',
    description: 'Sequence diagram showing JWT token-based authentication between client, server, and database',
    code: `sequenceDiagram
    participant Client
    participant API
    participant Auth
    participant DB
    
    Client->>+API: POST /login (email, password)
    API->>+Auth: Verify Credentials
    Auth->>+DB: Query User by Email
    DB-->>-Auth: User Data
    Auth->>Auth: Compare Password Hash
    
    alt Credentials Valid
        Auth->>Auth: Generate JWT Token
        Auth-->>-API: Token + User Info
        API-->>-Client: 200 OK {token, user}
        Client->>Client: Store Token in localStorage
        
        Note over Client,API: Subsequent Requests
        Client->>+API: GET /protected (Authorization: Bearer token)
        API->>+Auth: Verify Token
        Auth->>Auth: Decode & Validate JWT
        Auth-->>-API: Token Valid
        API->>+DB: Fetch Protected Data
        DB-->>-API: Data
        API-->>-Client: 200 OK {data}
    else Credentials Invalid
        Auth-->>-API: Invalid Credentials Error
        API-->>-Client: 401 Unauthorized
        Client->>Client: Show Error Message
    end`,
    type: 'sequence',
    createdAt: '2025-01-08T11:20:00Z',
    updatedAt: '2025-01-15T16:45:00Z',
    tags: ['authentication', 'jwt', 'security', 'api', 'technical'],
    isFavorite: true
  },
  
  {
    id: 'db-erd-003',
    title: 'Blog Platform Database Schema',
    description: 'Entity-relationship diagram for a full-featured blog platform with users, posts, comments, and social features',
    code: `erDiagram
    USERS ||--o{ POSTS : creates
    USERS ||--o{ COMMENTS : writes
    USERS ||--o{ FOLLOWERS : has
    USERS ||--o{ FOLLOWERS : follows
    POSTS ||--o{ COMMENTS : contains
    POSTS }o--|| CATEGORIES : "belongs to"
    POSTS }o--o{ TAGS : tagged_with
    
    USERS {
        uuid id PK
        string email UK "unique, not null"
        string username UK "unique, not null"
        string password_hash "not null"
        string full_name
        text bio
        string avatar_url
        timestamp created_at
        timestamp updated_at
        boolean is_active
    }
    
    POSTS {
        uuid id PK
        uuid author_id FK "references users(id)"
        uuid category_id FK "references categories(id)"
        string title "not null"
        string slug UK "unique, indexed"
        text content "not null"
        text excerpt
        string featured_image
        enum status "draft, published, archived"
        int view_count "default 0"
        timestamp published_at
        timestamp created_at
        timestamp updated_at
    }
    
    COMMENTS {
        uuid id PK
        uuid post_id FK "references posts(id)"
        uuid user_id FK "references users(id)"
        uuid parent_id FK "self-reference, nullable"
        text content "not null"
        boolean is_approved "default false"
        timestamp created_at
        timestamp updated_at
    }
    
    CATEGORIES {
        uuid id PK
        string name UK "unique, not null"
        string slug UK "unique, indexed"
        text description
        int post_count "default 0"
    }
    
    TAGS {
        uuid id PK
        string name UK "unique, not null"
        string slug UK "unique, indexed"
    }
    
    FOLLOWERS {
        uuid follower_id FK "references users(id)"
        uuid following_id FK "references users(id)"
        timestamp created_at
    }`,
    type: 'er',
    createdAt: '2025-01-05T14:00:00Z',
    updatedAt: '2025-01-10T10:15:00Z',
    tags: ['database', 'schema', 'erd', 'blog', 'technical'],
    isFavorite: false
  },
  
  {
    id: 'class-oop-004',
    title: 'E-commerce System Class Structure',
    description: 'Object-oriented class diagram showing inheritance and relationships in an e-commerce platform',
    code: `classDiagram
    class User {
        -string id
        -string email
        -string passwordHash
        -Address[] addresses
        -PaymentMethod[] paymentMethods
        +register()
        +login()
        +updateProfile()
        +addAddress(address)
    }
    
    class Customer {
        -ShoppingCart cart
        -Order[] orderHistory
        -Wishlist wishlist
        +browseProducts()
        +addToCart(product)
        +checkout()
        +viewOrderHistory()
    }
    
    class Admin {
        -string role
        -Permission[] permissions
        +manageProducts()
        +manageOrders()
        +viewAnalytics()
        +manageUsers()
    }
    
    class Product {
        -string id
        -string name
        -decimal price
        -int stockQuantity
        -Category category
        -string[] images
        -Review[] reviews
        +updatePrice(newPrice)
        +updateStock(quantity)
        +addReview(review)
    }
    
    class ShoppingCart {
        -CartItem[] items
        -decimal subtotal
        -decimal tax
        -decimal total
        +addItem(product, quantity)
        +removeItem(productId)
        +updateQuantity(productId, quantity)
        +calculateTotal()
        +clear()
    }
    
    class Order {
        -string id
        -Customer customer
        -OrderItem[] items
        -decimal totalAmount
        -string status
        -DateTime createdAt
        -Address shippingAddress
        -PaymentMethod paymentMethod
        +calculateTotal()
        +updateStatus(status)
        +processPayment()
        +shipOrder()
    }
    
    class OrderItem {
        -Product product
        -int quantity
        -decimal price
        +getSubtotal()
    }
    
    class Category {
        -string id
        -string name
        -Category parent
        -Category[] subcategories
        +addSubcategory(category)
    }
    
    class PaymentMethod {
        -string id
        -string type
        -boolean isDefault
        +process(amount)
        +validate()
    }
    
    class Address {
        -string street
        -string city
        -string state
        -string zipCode
        -string country
        -boolean isDefault
        +format()
        +validate()
    }
    
    User <|-- Customer : extends
    User <|-- Admin : extends
    Customer "1" --> "1" ShoppingCart : has
    Customer "1" --> "*" Order : places
    Order "1" --> "*" OrderItem : contains
    OrderItem "*" --> "1" Product : references
    Product "*" --> "1" Category : belongs to
    User "1" --> "*" Address : has
    User "1" --> "*" PaymentMethod : has
    Order "1" --> "1" Address : ships to
    Order "1" --> "1" PaymentMethod : pays with`,
    type: 'class',
    createdAt: '2025-01-12T08:30:00Z',
    updatedAt: '2025-01-14T12:00:00Z',
    tags: ['class-diagram', 'oop', 'e-commerce', 'architecture', 'technical'],
    isFavorite: true
  },
  
  {
    id: 'proj-gantt-005',
    title: 'Web Application Development Timeline',
    description: 'Project timeline for a full-stack web application development from planning to deployment',
    code: `gantt
    title Web App Development Timeline - Q1 2025
    dateFormat YYYY-MM-DD
    section Planning
    Requirements Gathering           :done,    req1, 2025-01-01, 2025-01-10
    Technical Architecture Design    :done,    arch1, 2025-01-08, 2025-01-15
    UI/UX Design & Wireframes        :done,    design1, 2025-01-12, 2025-01-25
    
    section Backend Development
    Database Schema Design           :done,    db1, 2025-01-20, 2025-01-25
    API Development                  :active,  api1, 2025-01-26, 2025-02-15
    Authentication System            :active,  auth1, 2025-02-01, 2025-02-10
    Business Logic Implementation    :         logic1, 2025-02-10, 2025-02-28
    
    section Frontend Development
    Component Library Setup          :done,    comp1, 2025-01-22, 2025-01-28
    Core UI Components               :active,  ui1, 2025-01-28, 2025-02-12
    State Management Integration     :         state1, 2025-02-08, 2025-02-18
    API Integration                  :         api_int1, 2025-02-15, 2025-02-25
    Responsive Design Implementation :         resp1, 2025-02-20, 2025-03-05
    
    section Testing & QA
    Unit Testing                     :         test1, 2025-02-18, 2025-03-01
    Integration Testing              :         test2, 2025-02-25, 2025-03-08
    User Acceptance Testing          :         uat1, 2025-03-05, 2025-03-12
    Bug Fixes & Refinements          :         bugs1, 2025-03-08, 2025-03-18
    
    section Deployment
    Production Environment Setup     :         prod1, 2025-03-10, 2025-03-15
    Security Audit                   :         sec1, 2025-03-12, 2025-03-17
    Performance Optimization         :         perf1, 2025-03-15, 2025-03-20
    Deploy to Production             :crit,    deploy1, 2025-03-22, 2025-03-23
    Post-Launch Monitoring           :         monitor1, 2025-03-23, 2025-03-31`,
    type: 'gantt',
    createdAt: '2025-01-03T10:00:00Z',
    updatedAt: '2025-01-16T09:30:00Z',
    tags: ['gantt', 'project-management', 'timeline', 'planning', 'workflow'],
    isFavorite: false
  }
];

/**
 * Get a diagram by its unique identifier
 * @param id - The diagram ID to search for
 * @returns The matching diagram or undefined if not found
 */
export function getDiagramById(id: string): Diagram | undefined {
  return sampleDiagrams.find(diagram => diagram.id === id);
}

/**
 * Filter diagrams by diagram type
 * @param type - The diagram type to filter by
 * @returns Array of diagrams matching the specified type
 */
export function getDiagramsByType(type: DiagramType): Diagram[] {
  return sampleDiagrams.filter(diagram => diagram.type === type);
}

/**
 * Filter diagrams by tag
 * @param tag - The tag to search for (case-insensitive)
 * @returns Array of diagrams that include the specified tag
 */
export function getDiagramsByTag(tag: string): Diagram[] {
  const normalizedTag = tag.toLowerCase();
  return sampleDiagrams.filter(diagram => 
    diagram.tags.some(t => t.toLowerCase() === normalizedTag)
  );
}

/**
 * Get all diagrams marked as favorites
 * @returns Array of favorite diagrams
 */
export function getFavoriteDiagrams(): Diagram[] {
  return sampleDiagrams.filter(diagram => diagram.isFavorite === true);
}

/**
 * Get a random diagram from the collection
 * Useful for "surprise me" features or default examples
 * @returns A randomly selected diagram
 */
export function getRandomDiagram(): Diagram {
  const randomIndex = Math.floor(Math.random() * sampleDiagrams.length);
  return sampleDiagrams[randomIndex];
}

/**
 * Search diagrams by keyword in title, description, or tags
 * @param keyword - The search term (case-insensitive)
 * @returns Array of diagrams matching the search keyword
 */
export function searchDiagrams(keyword: string): Diagram[] {
  const normalizedKeyword = keyword.toLowerCase();
  return sampleDiagrams.filter(diagram => 
    diagram.title.toLowerCase().includes(normalizedKeyword) ||
    diagram.description?.toLowerCase().includes(normalizedKeyword) ||
    diagram.tags.some(tag => tag.toLowerCase().includes(normalizedKeyword))
  );
}
