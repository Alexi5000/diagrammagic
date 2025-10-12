/**
 * AI Prompt/Response Pairs Dataset
 * 
 * This file contains example prompts that users might enter into the AI diagram
 * generator, paired with the expected Mermaid code output. These examples serve
 * multiple purposes:
 * - Training data for understanding AI generation patterns
 * - User inspiration and onboarding examples
 * - Testing and validation of AI diagram generation
 * - Documentation of common use cases
 */

import type { AIPromptExample, DiagramType } from '@/types';

/**
 * Collection of AI prompt examples with their generated Mermaid code
 * 
 * Each example demonstrates:
 * - Natural language prompt (what users type)
 * - Complete, valid Mermaid syntax (AI output)
 * - Diagram type classification
 * - Complexity level
 * 
 * @constant {AIPromptExample[]} aiExamples
 */
export const aiExamples: AIPromptExample[] = [
  // ==================== FLOWCHARTS ====================
  
  {
    title: 'User Login Flow',
    prompt: 'create a user login flowchart',
    type: 'flowchart',
    complexity: 'simple',
    generatedCode: `flowchart TD
    Start([User Opens App]) --> Input[Enter Email & Password]
    Input --> Validate{Valid Credentials?}
    
    Validate -->|No| Error[Display Error Message]
    Error --> Input
    
    Validate -->|Yes| CheckAuth{Account Active?}
    
    CheckAuth -->|No| Locked[Account Locked Message]
    Locked --> Contact[Contact Support]
    
    CheckAuth -->|Yes| Auth[Generate Auth Token]
    Auth --> Session[Create User Session]
    Session --> Redirect[Redirect to Dashboard]
    Redirect --> End([Success])
    
    style Start fill:#e1f5e1
    style End fill:#e1f5e1
    style Error fill:#ffe1e1
    style Locked fill:#ffe1e1
    style Auth fill:#e1e5ff
    style Session fill:#e1e5ff`
  },

  {
    title: 'Sales Funnel Process',
    prompt: 'sales funnel conversion flowchart',
    type: 'flowchart',
    complexity: 'moderate',
    generatedCode: `flowchart TD
    Awareness[Awareness Stage] --> Interest[Interest Generated]
    Interest --> Landing[Visit Landing Page]
    
    Landing --> Engage{Engaged?}
    Engage -->|No| Exit1[Exit - Lost Lead]
    
    Engage -->|Yes| Lead[Capture Lead Info]
    Lead --> Nurture[Email Nurture Campaign]
    
    Nurture --> Consider{Considering Purchase?}
    Consider -->|No| Exit2[Exit - Not Ready]
    
    Consider -->|Yes| Demo[Request Demo/Trial]
    Demo --> Evaluate[Evaluate Product]
    
    Evaluate --> Decision{Make Decision?}
    Decision -->|No| Exit3[Exit - Not Interested]
    
    Decision -->|Yes| Purchase[Complete Purchase]
    Purchase --> Onboard[Customer Onboarding]
    Onboard --> Retention[Retention & Upsell]
    
    style Awareness fill:#fff3e1
    style Purchase fill:#e1f5e1
    style Retention fill:#e1f5e1
    style Exit1 fill:#ffe1e1
    style Exit2 fill:#ffe1e1
    style Exit3 fill:#ffe1e1`
  },

  // ==================== SEQUENCE DIAGRAMS ====================
  
  {
    title: 'Payment Processing Flow',
    prompt: 'sequence diagram for payment processing',
    type: 'sequence',
    complexity: 'moderate',
    generatedCode: `sequenceDiagram
    actor User
    participant Frontend
    participant Backend
    participant PaymentGateway
    participant Database
    
    User->>Frontend: Click "Pay Now"
    Frontend->>Frontend: Validate Payment Form
    Frontend->>Backend: POST /api/payments/create
    
    Backend->>Database: Create Pending Transaction
    Database-->>Backend: Transaction ID
    
    Backend->>PaymentGateway: Process Payment Request
    PaymentGateway->>PaymentGateway: Verify Card Details
    
    alt Payment Successful
        PaymentGateway-->>Backend: Payment Confirmed
        Backend->>Database: Update Transaction Status: SUCCESS
        Backend-->>Frontend: Payment Success Response
        Frontend-->>User: Show Success Message
        Frontend->>Backend: GET /api/receipt
        Backend-->>Frontend: Receipt Data
    else Payment Failed
        PaymentGateway-->>Backend: Payment Declined
        Backend->>Database: Update Transaction Status: FAILED
        Backend-->>Frontend: Payment Error Response
        Frontend-->>User: Show Error Message
    end`
  },

  {
    title: 'API Authentication Flow',
    prompt: 'api authentication flow',
    type: 'sequence',
    complexity: 'moderate',
    generatedCode: `sequenceDiagram
    actor User
    participant Client
    participant API
    participant AuthService
    participant Database
    
    User->>Client: Enter Credentials
    Client->>API: POST /auth/login
    API->>AuthService: Validate Credentials
    AuthService->>Database: Query User
    Database-->>AuthService: User Data
    
    alt Valid Credentials
        AuthService->>AuthService: Generate JWT Token
        AuthService->>AuthService: Generate Refresh Token
        AuthService->>Database: Store Refresh Token
        AuthService-->>API: Tokens
        API-->>Client: Access Token + Refresh Token
        Client->>Client: Store Tokens Securely
        Client-->>User: Login Success
        
        Note over Client,API: Subsequent Requests
        Client->>API: GET /api/protected<br/>(with Access Token)
        API->>AuthService: Verify Token
        AuthService-->>API: Token Valid
        API-->>Client: Protected Resource
        
        Note over Client,API: Token Expired
        Client->>API: GET /api/protected<br/>(expired token)
        API-->>Client: 401 Unauthorized
        Client->>API: POST /auth/refresh<br/>(with Refresh Token)
        API->>AuthService: Validate Refresh Token
        AuthService->>Database: Check Refresh Token
        AuthService->>AuthService: Generate New Access Token
        AuthService-->>API: New Access Token
        API-->>Client: New Access Token
        Client->>API: Retry Request<br/>(with new token)
        API-->>Client: Protected Resource
    else Invalid Credentials
        AuthService-->>API: Authentication Failed
        API-->>Client: 401 Unauthorized
        Client-->>User: Login Failed
    end`
  },

  // ==================== ER DIAGRAMS ====================
  
  {
    title: 'Blog Database Schema',
    prompt: 'database schema for blog',
    type: 'er',
    complexity: 'moderate',
    generatedCode: `erDiagram
    USERS ||--o{ POSTS : writes
    USERS ||--o{ COMMENTS : writes
    POSTS ||--o{ COMMENTS : has
    POSTS }o--o{ TAGS : tagged_with
    POSTS }o--|| CATEGORIES : belongs_to
    
    USERS {
        int id PK
        string email UK
        string username UK
        string password_hash
        string full_name
        string avatar_url
        datetime created_at
        datetime updated_at
        boolean is_active
    }
    
    POSTS {
        int id PK
        int author_id FK
        int category_id FK
        string title
        string slug UK
        text content
        text excerpt
        string featured_image
        enum status
        int view_count
        datetime published_at
        datetime created_at
        datetime updated_at
    }
    
    COMMENTS {
        int id PK
        int post_id FK
        int user_id FK
        int parent_id FK
        text content
        boolean is_approved
        datetime created_at
        datetime updated_at
    }
    
    CATEGORIES {
        int id PK
        string name UK
        string slug UK
        text description
        int post_count
    }
    
    TAGS {
        int id PK
        string name UK
        string slug UK
        int usage_count
    }
    
    POST_TAGS {
        int post_id FK
        int tag_id FK
    }`
  },

  // ==================== CLASS DIAGRAMS ====================
  
  {
    title: 'E-commerce System Architecture',
    prompt: 'class diagram for e-commerce',
    type: 'class',
    complexity: 'complex',
    generatedCode: `classDiagram
    class User {
        +int id
        +string email
        +string name
        +string passwordHash
        +Address[] addresses
        +register()
        +login()
        +updateProfile()
    }
    
    class Customer {
        +ShoppingCart cart
        +Order[] orderHistory
        +WishList wishlist
        +addToCart()
        +checkout()
        +viewOrders()
    }
    
    class Admin {
        +string role
        +string[] permissions
        +manageProducts()
        +manageOrders()
        +viewAnalytics()
    }
    
    class Product {
        +int id
        +string name
        +string description
        +decimal price
        +int stock
        +Category category
        +string[] images
        +Review[] reviews
        +updateStock()
        +calculateDiscount()
    }
    
    class Category {
        +int id
        +string name
        +Category parent
        +Product[] products
        +addProduct()
        +removeProduct()
    }
    
    class ShoppingCart {
        +int id
        +CartItem[] items
        +decimal total
        +addItem()
        +removeItem()
        +updateQuantity()
        +calculateTotal()
        +clear()
    }
    
    class CartItem {
        +Product product
        +int quantity
        +decimal subtotal
        +updateQuantity()
    }
    
    class Order {
        +int id
        +Customer customer
        +OrderItem[] items
        +decimal totalAmount
        +string status
        +Payment payment
        +Shipping shipping
        +datetime createdAt
        +placeOrder()
        +cancelOrder()
        +updateStatus()
    }
    
    class OrderItem {
        +Product product
        +int quantity
        +decimal price
        +decimal subtotal
    }
    
    class Payment {
        +int id
        +Order order
        +decimal amount
        +string method
        +string status
        +datetime paidAt
        +processPayment()
        +refund()
    }
    
    class Shipping {
        +int id
        +Order order
        +Address address
        +string carrier
        +string trackingNumber
        +string status
        +updateStatus()
    }
    
    class Address {
        +int id
        +string street
        +string city
        +string state
        +string zipCode
        +string country
        +validate()
    }
    
    User <|-- Customer
    User <|-- Admin
    Customer "1" --> "1" ShoppingCart
    ShoppingCart "1" --> "*" CartItem
    CartItem "*" --> "1" Product
    Customer "1" --> "*" Order
    Order "1" --> "*" OrderItem
    OrderItem "*" --> "1" Product
    Order "1" --> "1" Payment
    Order "1" --> "1" Shipping
    Shipping "*" --> "1" Address
    User "1" --> "*" Address
    Product "*" --> "1" Category
    Category "1" --> "*" Category : parent`
  },

  // ==================== GANTT CHARTS ====================
  
  {
    title: 'Project Timeline',
    prompt: 'project timeline gantt chart',
    type: 'gantt',
    complexity: 'simple',
    generatedCode: `gantt
    title Software Development Project Timeline
    dateFormat YYYY-MM-DD
    
    section Planning
    Requirements Gathering    :done, req, 2024-01-01, 2024-01-14
    Technical Design          :done, design, 2024-01-15, 2024-01-28
    Sprint Planning           :done, sprint, 2024-01-29, 2024-02-02
    
    section Development
    Setup & Configuration     :done, setup, 2024-02-05, 2024-02-09
    Backend API Development   :active, backend, 2024-02-12, 2024-03-15
    Frontend Development      :active, frontend, 2024-02-19, 2024-03-22
    Database Implementation   :active, db, 2024-02-12, 2024-02-26
    
    section Testing
    Unit Testing              :testing, 2024-03-01, 2024-03-22
    Integration Testing       :int-test, 2024-03-18, 2024-03-29
    UAT Testing              :uat, 2024-04-01, 2024-04-12
    
    section Deployment
    Staging Deployment        :staging, 2024-04-08, 2024-04-12
    Production Deployment     :crit, prod, 2024-04-15, 2024-04-19
    Post-Launch Monitoring    :monitor, 2024-04-20, 2024-05-03
    
    section Milestones
    Design Approval           :milestone, m1, 2024-01-28, 0d
    Alpha Release            :milestone, m2, 2024-03-08, 0d
    Beta Release             :milestone, m3, 2024-03-29, 0d
    Production Launch        :milestone, m4, 2024-04-19, 0d`
  },

  // ==================== GIT DIAGRAMS ====================
  
  {
    title: 'Git Branching Strategy',
    prompt: 'git branching strategy',
    type: 'git',
    complexity: 'moderate',
    generatedCode: `gitGraph
    commit id: "Initial commit"
    commit id: "Add README"
    
    branch develop
    checkout develop
    commit id: "Setup project structure"
    
    branch feature/user-auth
    checkout feature/user-auth
    commit id: "Add login form"
    commit id: "Implement JWT auth"
    commit id: "Add password reset"
    
    checkout develop
    merge feature/user-auth
    commit id: "Update dependencies"
    
    branch feature/dashboard
    checkout feature/dashboard
    commit id: "Create dashboard layout"
    commit id: "Add analytics widgets"
    
    checkout develop
    branch feature/api-integration
    checkout feature/api-integration
    commit id: "Setup API client"
    commit id: "Add error handling"
    
    checkout develop
    merge feature/api-integration
    
    checkout feature/dashboard
    commit id: "Connect to API"
    
    checkout develop
    merge feature/dashboard
    commit id: "Prepare v1.0.0 release"
    
    checkout main
    merge develop tag: "v1.0.0"
    
    checkout main
    branch hotfix/security-patch
    commit id: "Fix security vulnerability"
    
    checkout main
    merge hotfix/security-patch tag: "v1.0.1"
    
    checkout develop
    merge hotfix/security-patch
    
    branch feature/notifications
    checkout feature/notifications
    commit id: "Add notification system"
    commit id: "Email templates"
    
    checkout develop
    merge feature/notifications`
  },

  // ==================== JOURNEY DIAGRAMS ====================
  
  {
    title: 'Customer Onboarding Journey',
    prompt: 'customer onboarding journey',
    type: 'journey',
    complexity: 'simple',
    generatedCode: `journey
    title Customer Onboarding Journey Map
    
    section Discovery
      See advertisement: 3: Customer
      Visit website: 4: Customer
      Read product info: 5: Customer
      
    section Sign Up
      Click "Get Started": 5: Customer
      Fill registration form: 3: Customer
      Verify email: 2: Customer
      Create password: 3: Customer
      
    section First Login
      Welcome tutorial: 4: Customer, Support
      Explore dashboard: 5: Customer
      Set preferences: 4: Customer
      
    section Initial Setup
      Connect integrations: 3: Customer, Support
      Import existing data: 2: Customer, Support
      Customize workspace: 5: Customer
      
    section First Value
      Complete first task: 5: Customer
      See results: 5: Customer
      Share with team: 4: Customer
      
    section Adoption
      Daily usage begins: 5: Customer
      Invite team members: 4: Customer
      Upgrade to paid plan: 5: Customer, Sales
      Become power user: 5: Customer`
  }
];

// ==================== UTILITY FUNCTIONS ====================

/**
 * Get all examples for a specific diagram type
 * 
 * @param type - The diagram type to filter by
 * @returns Array of examples matching the specified type
 * 
 * @example
 * const flowchartExamples = getExampleByType('flowchart');
 */
export const getExampleByType = (type: DiagramType): AIPromptExample[] => {
  return aiExamples.filter(example => example.type === type);
};

/**
 * Get all examples of a specific complexity level
 * 
 * @param complexity - The complexity level to filter by
 * @returns Array of examples matching the specified complexity
 * 
 * @example
 * const simpleExamples = getExampleByComplexity('simple');
 */
export const getExampleByComplexity = (
  complexity: 'simple' | 'moderate' | 'complex'
): AIPromptExample[] => {
  return aiExamples.filter(example => example.complexity === complexity);
};

/**
 * Get a random example from the collection
 * Useful for providing inspiration or demo content
 * 
 * @returns A random AI prompt example
 * 
 * @example
 * const randomExample = getRandomExample();
 * console.log(randomExample.prompt);
 */
export const getRandomExample = (): AIPromptExample => {
  const randomIndex = Math.floor(Math.random() * aiExamples.length);
  return aiExamples[randomIndex];
};

/**
 * Search examples by query string
 * Searches in prompt text, title, and diagram type
 * 
 * @param query - Search query string (case-insensitive)
 * @returns Array of examples matching the search query
 * 
 * @example
 * const authExamples = searchExamples('authentication');
 * const paymentExamples = searchExamples('payment');
 */
export const searchExamples = (query: string): AIPromptExample[] => {
  const lowerQuery = query.toLowerCase().trim();
  
  if (!lowerQuery) {
    return aiExamples;
  }
  
  return aiExamples.filter(example => 
    example.prompt.toLowerCase().includes(lowerQuery) ||
    example.title?.toLowerCase().includes(lowerQuery) ||
    example.type.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Get statistics about the examples collection
 * 
 * @returns Object with statistics about examples
 */
export const getExamplesStats = () => {
  const typeCount: Record<string, number> = {};
  const complexityCount: Record<string, number> = {};
  
  aiExamples.forEach(example => {
    typeCount[example.type] = (typeCount[example.type] || 0) + 1;
    if (example.complexity) {
      complexityCount[example.complexity] = (complexityCount[example.complexity] || 0) + 1;
    }
  });
  
  return {
    total: aiExamples.length,
    byType: typeCount,
    byComplexity: complexityCount
  };
};
