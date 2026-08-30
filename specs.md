Spec Driven Development

Building a RAG-Based College Information Chatbot (CollegeRAG)

This document is the Single Source of Truth (SSOT) for the project.
All implementation decisions, frontend/backend contracts, database models,
RAG behavior, folder structure, API routes, and verification requirements
must follow this specification.

1. Project Overview

Project Name

CollegeRAG – AI-Based RAG College Information Chatbot

Project Purpose

Build a full-stack AI-powered college information assistant that answers
student questions using Retrieval-Augmented Generation (RAG).

The chatbot must retrieve relevant information from the college's uploaded
knowledge base before generating an answer. The knowledge base can contain
college PDFs, notices, FAQs, academic calendars, department documents,
admission information, fee details, hostel rules, library information,
placement documents, scholarship information, policies, and event documents.

The application must not behave as a generic chatbot. Answers must be
grounded in the retrieved college documents.

Primary Users

Student

Register and log in.

Ask college-related questions.

Receive grounded AI answers.

See the sources used for the answer.

Continue conversations using chat history.

Admin

Log in using an admin account.

Upload college documents.

View document processing status.

Delete documents.

Replace/update documents.

Manage the college knowledge base.

View basic ingestion statistics.

Core RAG Flow

College Documents → Text Extraction → Cleaning → Chunking → Embeddings → Vector Database → Similarity Search → Relevant Context → LLM → Grounded Answer + Sources

The vector database and semantic retrieval layer are mandatory.

A direct LLM-only chatbot does not satisfy this specification.

2. Tech Stack

Frontend

Next.js using Pages Router

React 19

Tailwind CSS

Zustand

Axios

lucide-react

Responsive UI

Backend

Node.js

Express.js

MongoDB

Mongoose

JSON Web Tokens (JWT)

bcryptjs

helmet

express-validator

express-rate-limit

morgan

multer

AI / RAG

Google Gemini API for answer generation

Gemini embedding model for document/query embeddings

LangChain for document processing and retrieval utilities

Optional LangGraph-ready service boundary for future agentic extensions

Vector Database

Pinecone

Pinecone must store document chunk embeddings and metadata required for
source retrieval.

Document Processing

pdf-parse for PDF text extraction

mammoth for DOCX text extraction

Custom chunking service

Metadata preservation for document name, page/section, chunk number,
category, and upload date

Storage

MongoDB Atlas for application metadata

Pinecone for vector embeddings

Local/cloud file storage for uploaded source documents

For the first working deployment, uploaded files may be stored in a
server-managed uploads directory if the deployment platform supports
persistent storage. The storage service must be isolated so it can later be
replaced by Cloudinary, S3, Supabase Storage, or another object store.

3. Core Features

The following are mandatory.

Authentication

Student registration

Student login

Admin login

JWT authentication

Protected routes

/api/auth/me

Password hashing using bcrypt

Role separation:

student

admin

Persistent client authentication using Zustand

Logout

Chat Interface

Students must be able to:

Enter a question.

Submit the question.

See a loading state.

Receive the final answer.

See retrieved source documents.

Continue the conversation.

Start a new conversation.

Open previous conversations.

Example questions:

"What is the last date to pay examination fees?"

"What documents are required for admission?"

"What are the hostel timings?"

"How many credits are required for graduation?"

"What scholarships are available?"

"When does the semester start?"

"What is the library timing?"

Document Upload

Admins must be able to upload:

PDF

DOCX

Each document must have:

Original filename

Display title

Category

Department

Description

Uploaded by

Upload date

Processing status

Number of chunks

Error message if processing fails

Document Processing

When an admin uploads a document:

Validate file type.

Validate file size.

Save the original file.

Create a document record.

Extract text.

Clean extracted text.

Split text into chunks.

Generate embeddings.

Store embeddings in Pinecone.

Store chunk metadata in MongoDB.

Mark the document as READY.

If processing fails, mark it as FAILED and store the error.

Processing states:

UPLOADED

PROCESSING

READY

FAILED

Chunking

The chunking service must:

Preserve document order.

Use a configurable chunk size.

Use overlap between chunks.

Avoid creating extremely small fragments.

Preserve page/section metadata whenever available.

Default:

Chunk size: approximately 800–1000 tokens

Overlap: approximately 100–150 tokens

These values must be centralized in configuration and not hard-coded across
multiple files.

Embedding Generation

Every valid text chunk must be converted into an embedding vector.

The same embedding model must be used for:

Document chunks

User queries

The embedding service must expose a clean interface so the provider can be
changed later without changing the RAG service.

Vector Database / Semantic Search

Pinecone must contain one vector record per searchable document chunk.

Each vector record must include metadata such as:

documentId

documentTitle

category

department

page

chunkIndex

text

The chatbot must perform semantic similarity search against Pinecone.

Default retrieval behavior:

Retrieve top 5 relevant chunks.

Apply a minimum relevance threshold.

Remove duplicate/near-duplicate chunks.

Prefer chunks from the same document when they are clearly more relevant.

The retrieval settings must be configurable.

RAG Pipeline

For every student question:

Receive authenticated question.

Validate the request.

Save the user message.

Convert the question into an embedding.

Search Pinecone.

Retrieve the top relevant chunks.

Apply the relevance threshold.

Build a grounded context block.

Send the question + context to Gemini.

Generate the answer.

Save the assistant response.

Save source references.

Return answer + sources to the frontend.

Grounding Rule

The LLM system instruction must explicitly state:

Answer only from the supplied college context.

Do not invent college policies, dates, fees, rules, contacts, or facts.

If the retrieved context does not contain the answer, clearly say that the
information is not available in the college knowledge base.

Do not use unrelated general knowledge to fill missing college information.

Cite the retrieved sources used for the answer.

Unknown Question Handling

If no retrieved chunk passes the configured relevance threshold, the chatbot
must not fabricate an answer.

Example:

"I couldn't find this information in the college documents available to me.
Please check with the concerned department or upload the relevant document."

The API response must identify that the answer was not sufficiently grounded.

Source / Reference Display

Every grounded answer must display source information.

Each source should show:

Document title

Page number when available

Category

Relevance score

Optional short excerpt

Example:

Sources

Academic Calendar 2026.pdf — Page 2

Examination Guidelines.pdf — Page 5

The source information must be clickable or expandable where practical.

Chat History

The system must persist:

Conversation

User

Title

Messages

Sources used per assistant message

Created date

Updated date

Students must be able to:

View conversations

Open a conversation

Continue a conversation

Delete a conversation

Start a new conversation

Conversation context should include recent messages, but retrieval must still
be performed for each new user question.

Admin Document Management

Admin must be able to:

View all documents.

Search documents.

Filter by category.

Filter by department.

View processing status.

Upload documents.

Delete documents.

Re-upload/update documents.

View chunk count.

View upload date.

Retry failed processing.

When a document is deleted, its corresponding Pinecone vectors must also be
deleted.

4. RAG Architecture

Logical Architecture

                    ┌─────────────────────┐
                    │      Student        │
                    └──────────┬──────────┘
                               │ Question
                               ▼
                    ┌─────────────────────┐
                    │   Next.js Frontend  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Express Backend   │
                    └──────────┬──────────┘
                               │
                      Generate Query
                       Embedding
                               │
                               ▼
                    ┌─────────────────────┐
                    │  Pinecone Vector DB │
                    └──────────┬──────────┘
                               │
                         Top-K Chunks
                               │
                               ▼
                    ┌─────────────────────┐
                    │    RAG Service      │
                    │ Context Construction│
                    └──────────┬──────────┘
                               │
                    Question + Context
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Gemini LLM       │
                    └──────────┬──────────┘
                               │
                         Answer + Sources
                               │
                               ▼
                    ┌─────────────────────┐
                    │     Chat UI         │
                    └─────────────────────┘

Document Ingestion Architecture

Admin Upload
     ↓
File Validation
     ↓
Document Record
     ↓
Text Extraction
     ↓
Text Cleaning
     ↓
Chunking
     ↓
Embedding Generation
     ↓
Pinecone Upsert
     ↓
MongoDB Chunk Metadata
     ↓
Document Status = READY

5. Authentication

Authentication must support:

POST /api/auth/register

POST /api/auth/login

GET /api/auth/me

JWT verification middleware

Role authorization middleware

Password hashing using bcrypt

Protected API routes

Passwords must never be stored in plain text.

JWT secret must be read from process.env.JWT_SECRET.

Admin-only endpoints must reject student accounts with HTTP 403.

6. Frontend Pages

The application uses the Next.js Pages Router.

/

Landing page containing:

CollegeRAG introduction

RAG explanation

Key features

Example student questions

Login button

Register button

Responsive design

/login

Must contain:

Email input

Password input

Login button

Validation

Error states

Loading state

/register

Must contain:

Name

Email

Password

Confirm password

Validation

Registration state

Error handling

/dashboard

Student dashboard containing:

Welcome message

Quick question input

Recent conversations

Suggested questions

Knowledge-base status summary

Navigation to chat and history

/chat

Main RAG chatbot page containing:

Conversation sidebar

Message list

User messages

Assistant messages

Typing/loading state

Question input

Send button

New conversation button

Source cards

Relevance/source information

Unknown-answer state

/chat/[id]

Conversation-specific page containing:

Full conversation

Previous messages

Sources

Continue conversation input

Delete conversation action

/admin

Admin dashboard containing:

Total documents

Ready documents

Processing documents

Failed documents

Total chunks

Recent uploads

Knowledge-base health

/admin/documents

Document management page containing:

Upload control

Document list

Search

Category filter

Department filter

Processing status

Chunk count

Delete action

Retry action

Update/re-upload action

/settings

Contains:

Profile information

Role

Logout

Basic account settings

7. UI / UX Requirements

The UI must have a modern AI assistant / college portal aesthetic.

Requirements:

Clean responsive layout.

Desktop and mobile support.

Consistent navigation.

Clear typography.

Loading skeletons.

Empty states.

Error states.

Toast notifications.

Accessible buttons and form labels.

Clear source cards.

Distinguishable user and AI messages.

Admin pages visually separated from student pages.

No unnecessary animations.

No fake statistics.

The chatbot must make the RAG process understandable to the evaluator.

The answer area should clearly separate:

AI Answer

Sources

Grounding/availability status

8. Backend Architecture

The backend must follow a layered architecture.

Routes

Routes handle:

URL mapping

Authentication middleware

Role middleware

Validation middleware

Routes must not contain complex business logic.

Controllers

Controllers must:

Parse request data.

Call services.

Return HTTP responses.

Controllers must not directly perform database queries for complex business
operations.

Services

Services own business logic.

Required services:

authService.js

chatService.js

documentService.js

ragService.js

embeddingService.js

llmService.js

vectorService.js

conversationService.js

Document Processing Layer

Required modules:

pdfExtractor.js

docxExtractor.js

textCleaner.js

chunker.js

ingestionService.js

Middleware

Required:

authMiddleware.js

roleMiddleware.js

errorMiddleware.js

validationMiddleware.js

9. Database Collections

Users

Fields:

_id

name

email

password

role: student | admin

lastLogin

createdAt

updatedAt

Email must be unique.

Documents

Fields:

_id

title

originalName

description

category

department

filePath

fileType

status: UPLOADED | PROCESSING | READY | FAILED

chunkCount

uploadedBy

errorMessage

createdAt

updatedAt

DocumentChunks

Fields:

_id

documentId

chunkIndex

text

page

section

pineconeVectorId

createdAt

The actual embedding vector must remain in Pinecone.

Conversations

Fields:

_id

userId

title

createdAt

updatedAt

Messages

Fields:

_id

conversationId

role: user | assistant

content

sources

grounded

createdAt

A source object should contain:

documentId

documentTitle

page

chunkId

score

excerpt

10. API Endpoints

Health

GET /api/health

Returns:

Server status

Database status

Vector database status

AI provider availability

Authentication

POST /api/auth/register

Register student account.

POST /api/auth/login

Authenticate user and return JWT.

GET /api/auth/me

Return authenticated user profile.

Chat

POST /api/chat

Submit a question.

Request:

{
  "conversationId": "optional-id",
  "message": "What is the exam fee deadline?"
}

Response:

{
  "conversationId": "conversation-id",
  "answer": "The exam fee deadline is ...",
  "grounded": true,
  "sources": [
    {
      "documentId": "id",
      "documentTitle": "Exam Notice.pdf",
      "page": 2,
      "score": 0.86,
      "excerpt": "..."
    }
  ]
}

GET /api/chat/conversations

List the authenticated user's conversations.

GET /api/chat/conversations/:id

Return a conversation and its messages.

POST /api/chat/conversations

Create a new conversation.

DELETE /api/chat/conversations/:id

Delete a conversation owned by the authenticated user.

Documents

GET /api/documents

Admin-only document list with pagination/filtering.

POST /api/documents/upload

Admin-only document upload.

GET /api/documents/:id

Admin-only document details.

POST /api/documents/:id/reprocess

Admin-only document reprocessing.

DELETE /api/documents/:id

Admin-only document deletion and vector cleanup.

PUT /api/documents/:id

Admin-only document metadata update.

Admin Dashboard

GET /api/admin/dashboard

Return:

Document count

Ready count

Processing count

Failed count

Chunk count

Recent documents

11. RAG API Contract

The RAG service must expose the conceptual pipeline:

retrieve(question)
      ↓
generateQueryEmbedding(question)
      ↓
searchVectorDatabase(embedding)
      ↓
filterByRelevance(results)
      ↓
buildContext(results)
      ↓
generateGroundedAnswer(question, context)
      ↓
returnAnswerWithSources()

The frontend must never directly call Pinecone or Gemini.

Only the backend may access:

Gemini API

Pinecone

MongoDB

Uploaded document storage

12. RAG Prompt Contract

The LLM system prompt must follow this behavior:

You are CollegeRAG, a college information assistant.

Answer the user's question using ONLY the supplied college context.

Rules:
1. Do not invent college-specific information.
2. Do not guess missing dates, fees, rules, policies, or procedures.
3. If the context does not contain enough information, say that the
   information is not available in the college knowledge base.
4. Keep answers clear and student-friendly.
5. Use the retrieved sources to support the answer.
6. Do not claim to have accessed documents that were not retrieved.
7. If multiple sources disagree, clearly mention the conflict instead of
   silently choosing one.

13. Retrieval Configuration

Central configuration must include:

TOP_K = 5
MIN_RELEVANCE_SCORE = configurable
CHUNK_SIZE = configurable
CHUNK_OVERLAP = configurable

The exact values may be tuned during testing, but they must remain in one
configuration module.

The application must log retrieval diagnostics during development:

Query

Number of retrieved chunks

Scores

Number of chunks passed to the LLM

Do not log secrets.

14. Admin Knowledge Base Rules

An admin upload is not considered complete until its vectors are successfully
stored.

Document status:

UPLOADED
   ↓
PROCESSING
   ↓
READY

Failure:

PROCESSING
   ↓
FAILED

When reprocessing:

Remove old vectors.

Remove old chunk metadata.

Extract current document text.

Re-chunk.

Re-embed.

Upsert new vectors.

Update chunk metadata.

Set status to READY.

15. Error Handling

The API must return structured errors.

Examples:

AUTH_REQUIRED

FORBIDDEN

DOCUMENT_NOT_FOUND

INVALID_FILE_TYPE

FILE_TOO_LARGE

DOCUMENT_PROCESSING_FAILED

VECTOR_SEARCH_FAILED

EMBEDDING_FAILED

LLM_FAILED

NO_RELEVANT_INFORMATION

CONVERSATION_NOT_FOUND

The frontend must convert these into understandable messages.

A missing knowledge-base answer must never become a generic server error.

16. Security Requirements

The application must:

Hash passwords with bcrypt.

Store JWT secret in environment variables.

Store Gemini API key in environment variables.

Store Pinecone credentials in environment variables.

Never expose backend secrets to the frontend.

Use helmet.

Configure CORS using CLIENT_URL.

Rate-limit authentication endpoints.

Validate request bodies using express-validator.

Validate uploaded file type and size.

Restrict admin routes using role middleware.

Ensure students can access only their own conversations.

Ensure admins can manage documents.

Never log API keys or passwords.

Sanitize user-controlled metadata.

Prevent path traversal when handling uploaded filenames.

17. Environment Variables

Create .env.example.

Required variables:

NODE_ENV=development
PORT=5000

MONGODB_URI=

JWT_SECRET=
JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:3000

GEMINI_API_KEY=
GEMINI_MODEL=

PINECONE_API_KEY=
PINECONE_INDEX=
PINECONE_NAMESPACE=

UPLOAD_DIR=uploads
MAX_FILE_SIZE_MB=10

TOP_K=5
MIN_RELEVANCE_SCORE=0.65
CHUNK_SIZE=900
CHUNK_OVERLAP=120

Never commit the real .env file.

18. Folder Structure

Root

CollegeRAG/
├── client/
├── server/
├── README.md
├── spec.md
└── .gitignore

Frontend

client/
└── src/
    ├── components/
    │   ├── AppShell/
    │   ├── ChatWindow/
    │   ├── ChatMessage/
    │   ├── SourceCard/
    │   ├── ConversationSidebar/
    │   ├── ProtectedRoute/
    │   └── AdminDocumentTable/
    │
    ├── pages/
    │   ├── _app.js
    │   ├── index.js
    │   ├── login.js
    │   ├── register.js
    │   ├── dashboard.js
    │   ├── chat/
    │   │   ├── index.js
    │   │   └── [id].js
    │   ├── admin/
    │   │   ├── index.js
    │   │   └── documents.js
    │   └── settings.js
    │
    ├── store/
    │   ├── authStore.js
    │   └── chatStore.js
    │
    └── services/
        └── api.js

Backend

server/
└── src/
    ├── config/
    │   ├── env.js
    │   ├── db.js
    │   └── pinecone.js
    │
    ├── routes/
    │   ├── authRoutes.js
    │   ├── chatRoutes.js
    │   ├── documentRoutes.js
    │   └── adminRoutes.js
    │
    ├── controllers/
    │   ├── authController.js
    │   ├── chatController.js
    │   ├── documentController.js
    │   └── adminController.js
    │
    ├── middleware/
    │   ├── authMiddleware.js
    │   ├── roleMiddleware.js
    │   ├── errorMiddleware.js
    │   └── validationMiddleware.js
    │
    ├── services/
    │   ├── authService.js
    │   ├── chatService.js
    │   ├── conversationService.js
    │   ├── documentService.js
    │   ├── ragService.js
    │   ├── embeddingService.js
    │   ├── llmService.js
    │   ├── vectorService.js
    │   └── ingestionService.js
    │
    ├── processing/
    │   ├── pdfExtractor.js
    │   ├── docxExtractor.js
    │   ├── textCleaner.js
    │   └── chunker.js
    │
    ├── models/
    │   ├── User.js
    │   ├── Document.js
    │   ├── DocumentChunk.js
    │   ├── Conversation.js
    │   └── Message.js
    │
    ├── utils/
    │   ├── errors.js
    │   └── logger.js
    │
    └── server.js

19. Development Phases

The AI coding agent must build the application phase by phase.

Do not ask the coding agent to build the entire project in one prompt.

Phase 1 – Project Setup and Authentication

Build:

Next.js client

Express server

MongoDB connection

Environment configuration

JWT authentication

bcrypt password hashing

User model

Auth routes/controllers/services

Zustand auth store

Protected routes

Basic AppShell

Login/register pages

Verification:

Register works.

Login works.

/api/auth/me works.

Protected endpoint rejects unauthenticated requests.

Student/admin roles work.

Phase 2 – Document Management

Build:

Document model

DocumentChunk model

Multer upload

PDF extraction

DOCX extraction

Text cleaning

Chunking

Admin document page

Upload status

Delete/reprocess functionality

Verification:

Admin can upload a PDF.

Text is extracted.

Chunks are created.

Metadata is stored.

Failed processing is visible.

Phase 3 – Embeddings and Vector Database

Build:

Gemini embedding service

Pinecone configuration

Vector service

Embedding generation

Pinecone upsert

Metadata mapping

Vector deletion

Semantic search

Verification:

Uploaded document creates vectors.

A test query returns relevant chunks.

Chunk metadata maps back to the correct document.

Phase 4 – RAG Chatbot

Build:

RAG service

Retrieval threshold

Context construction

Gemini answer generation

Grounded prompt

Source references

Unknown question handling

Chat API

Chat UI

Verification:

Ask a question whose answer exists in a document.

Confirm answer is based on retrieved content.

Confirm source document/page is shown.

Ask an unrelated question.

Confirm the chatbot refuses to invent an answer.

Phase 5 – Chat History and Admin Dashboard

Build:

Conversation model

Message model

Conversation sidebar

Conversation detail

New conversation

Delete conversation

Admin dashboard

Document statistics

Verification:

Conversations persist after refresh.

Student can access only their own chats.

Admin dashboard shows real document/processing counts.

Phase 6 – Integration, Testing, and Deployment

Build/finalize:

Error handling

Loading states

Empty states

Security middleware

Rate limiting

Responsive UI

Environment configuration

README

Production build

Deployment

Verification:

Frontend connects to deployed backend.

Backend connects to MongoDB.

Backend connects to Pinecone.

Gemini works using production environment variables.

Admin can upload a document.

Student can ask a question.

RAG returns grounded answer with source.

Unknown question is handled safely.

20. Minimum Demo Dataset

To make the final demonstration reliable, create or upload at least these
college documents:

College Admission Guidelines.pdf

Admission eligibility

Required documents

Application procedure

Academic Calendar.pdf

Semester dates

Examination dates

Holidays

Fee Structure.pdf

Tuition fees

Examination fees

Payment deadlines

Hostel Rules.pdf

Hostel timings

Rules

Leave policy

Visitor policy

Library Guidelines.pdf

Opening hours

Borrowing rules

Fine rules

Placement Policy.pdf

Eligibility

Placement rules

Training information

These documents must contain enough factual information for the evaluator
to test retrieval.

21. Required Demo Questions

The final application must successfully demonstrate questions such as:

Question 1 – Direct Retrieval

"What documents are required for admission?"

Expected:

Grounded answer.

Admission document shown as a source.

Question 2 – Date Retrieval

"When is the last date to pay the examination fee?"

Expected:

Exact information from the uploaded document.

Source displayed.

Question 3 – Policy Retrieval

"What are the hostel visitor rules?"

Expected:

Grounded answer from Hostel Rules.

Question 4 – Multi-source Question

"What are the semester dates and examination dates?"

Expected:

Retrieve relevant academic-calendar chunks.

Answer using the retrieved context.

Show sources.

Question 5 – Unknown Question

"What is the cafeteria's menu for tomorrow?"

Expected:

If not present in the knowledge base, do not invent an answer.

Display an information-unavailable response.

22. Optional Bonus Features

Implement only after all mandatory features work.

Possible bonuses:

Multiple document collections

Department-wise knowledge bases

Source highlighting

Confidence/relevance score

Multilingual chatbot

Voice input

Conversation export

Suggested questions

Answer feedback

Admin analytics

Automatic document summarization

OCR for scanned PDFs

Hybrid keyword + semantic search

Document re-ranking

Role-based access beyond admin/student

AI-generated FAQs

Streaming AI responses

Bonus features must never delay completion of the mandatory RAG pipeline.

23. Testing Checklist

Authentication

Student registration

Student login

Admin login

JWT verification

Protected routes

Role authorization

Logout

Documents

PDF upload

DOCX upload

File validation

Text extraction

Chunking

Embedding generation

Pinecone upsert

Processing status

Reprocessing

Deletion

Vector deletion

RAG

Query embedding

Semantic search

Top-K retrieval

Relevance threshold

Context construction

Gemini generation

Grounded prompt

Source references

Unknown-question handling

Chat

New conversation

Send message

Receive answer

Show sources

Persist messages

Continue conversation

Delete conversation

UI

Responsive

Loading states

Error states

Empty states

Admin dashboard

Document table

Source cards

Deployment

Frontend production build

Backend production build

MongoDB Atlas

Pinecone

Gemini API

Environment variables

CORS

Production API URL

End-to-end test

24. Final Expected Outcome

The completed application must allow an authenticated student to ask
college-related questions and receive answers generated from the college's
uploaded knowledge base.

The complete working flow must be:

Admin
  ↓
Upload College PDF/DOCX
  ↓
Extract Text
  ↓
Chunk Text
  ↓
Generate Embeddings
  ↓
Store Vectors in Pinecone
  ↓
Student Asks Question
  ↓
Generate Query Embedding
  ↓
Semantic Search
  ↓
Retrieve Relevant Chunks
  ↓
Build Context
  ↓
Gemini LLM
  ↓
Grounded Answer
  ↓
Display Sources
  ↓
Save Conversation History

The evaluator must be able to see that this is a real RAG application, not
just a normal LLM chatbot.

The final product should feel like a modern college AI assistant with:

Student authentication

Admin knowledge-base management

Real document ingestion

Real embeddings

Real vector database retrieval

Grounded LLM responses

Source references

Unknown-answer handling

Persistent chat history

Working frontend/backend integration

Working deployed application

25. AI Coding Agent Instructions

The AI coding agent must:

Treat spec.md as the Single Source of Truth.

Build the project phase by phase.

Never replace Pinecone semantic retrieval with a simple keyword search.

Never implement a generic LLM-only chatbot.

Never invent API routes that are not in this specification without first
updating the specification.

Keep controllers thin.

Keep business logic in services.

Keep document processing modules independent.

Keep embedding generation behind embeddingService.js.

Keep Pinecone operations behind vectorService.js.

Keep LLM calls behind llmService.js.

Keep RAG orchestration inside ragService.js.

Never call Gemini or Pinecone directly from frontend code.

Never expose API keys to the browser.

Keep MongoDB access in models/services, not React components.

Preserve source metadata throughout the ingestion and retrieval pipeline.

Never fabricate an answer when retrieval does not provide enough context.

Return structured errors.

Validate every user-controlled input.

Require admin authorization for document management.

Ensure users can access only their own conversations.

Use environment variables for every secret.

Keep configuration values centralized.

Test every phase before starting the next phase.

At the end of every phase, list every file created or modified.

Do not implement bonus features until all mandatory features work.

If a dependency is unavailable, choose the simplest compatible alternative
only after checking this specification and update spec.md if the choice
materially changes the architecture.

26. Codex / Copilot Execution Prompts

Use the following sequence with an AI coding agent.

Prompt 1 – Understand the specification

Read spec.md completely.

Do not write code yet.

Summarize:
1. Project purpose
2. User roles
3. Tech stack
4. RAG pipeline
5. Database collections
6. API endpoints
7. Frontend pages
8. Backend folder structure
9. Development phases
10. Mandatory features

Then identify any implementation risks that could prevent the mandatory
RAG pipeline from working.

Do not change the specification.

Prompt 2 – Phase 1

Implement Phase 1 from spec.md only.

Build project setup and authentication.

Follow the folder structure and API contracts exactly.

Do not implement RAG, document ingestion, Pinecone, or bonus features yet.

After implementation:
1. Run tests/build checks.
2. Verify registration.
3. Verify login.
4. Verify /api/auth/me.
5. Verify protected routes.
6. Verify student/admin roles.
7. List every file created or modified.
8. Report any remaining issue.

Prompt 3 – Phase 2

Read spec.md and implement Phase 2 only.

Build document management, PDF/DOCX extraction, text cleaning, chunking,
processing states, admin document management, and chunk metadata.

Do not implement the chatbot yet.

Verify document upload and processing end-to-end.

List every file created or modified.

Prompt 4 – Phase 3

Read spec.md and implement Phase 3 only.

Implement Gemini embeddings and Pinecone vector storage/search.

Connect the document ingestion pipeline to Pinecone.

Verify:
1. Document chunks receive embeddings.
2. Vectors are stored.
3. Metadata is preserved.
4. Semantic search returns relevant chunks.
5. Vectors can be deleted.

Do not bypass vector search with keyword matching.

List every file created or modified.

Prompt 5 – Phase 4

Read spec.md and implement Phase 4 only.

Implement the complete RAG chatbot.

Required flow:
question → query embedding → Pinecone search → relevance filtering →
context construction → Gemini → grounded answer → sources.

Implement unknown-question handling.

Test one known question and one unknown question.

List every file created or modified.

Prompt 6 – Phase 5

Read spec.md and implement Phase 5 only.

Implement persistent conversations, messages, chat history, conversation
sidebar, admin dashboard, and document statistics.

Verify ownership/security of conversations.

List every file created or modified.

Prompt 7 – Finalization

Read spec.md and perform the final integration pass.

Do not add bonus features unless every mandatory feature is working.

Check:
- Authentication
- Admin document upload
- PDF/DOCX extraction
- Chunking
- Embeddings
- Pinecone retrieval
- Gemini generation
- Grounded answers
- Source display
- Unknown-question handling
- Chat history
- Admin dashboard
- Security
- Error handling
- Responsive UI
- Production build

Fix all blockers.

Then provide:
1. Final architecture summary
2. Exact setup commands
3. Required environment variables
4. Demo credentials/setup
5. Test questions
6. Deployment steps
7. List of files created/modified
8. Known limitations

27. Single Source of Truth Rule

This specification is authoritative.

If any future prompt conflicts with this document, the coding agent must:

Identify the conflict.

Stop before making an architectural change.

Explain the conflict.

Update spec.md only when the project requirement has intentionally
changed.

Continue implementation using the updated specification.

The specification is a living document, but code must never silently drift
away from it.

28. Definition of Done

The project is considered complete only when all of the following are true:

User authentication works.

Admin authentication/authorization works.

Admin can upload PDF/DOCX.

Text extraction works.

Chunking works.

Embeddings are generated.

Embeddings are stored in Pinecone.

Query embeddings are generated.

Semantic search works.

Relevant context reaches the LLM.

Gemini generates grounded answers.

Sources are displayed.

Unknown questions are handled without hallucination.

Chat history persists.

Admin can delete/reprocess documents.

Deleted documents have their vectors removed.

Frontend and backend are integrated.

Security requirements are implemented.

Production deployment works.

At least five realistic college documents are available for demo.

Known and unknown demo questions have been tested.

README contains setup and deployment instructions.

Final acceptance criterion:

A student can ask a question, the system performs an actual embedding-based
vector search over uploaded college documents, the LLM answers using the
retrieved context, and the UI shows the source document used for the answer.