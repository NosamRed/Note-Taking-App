Note Taking App: Project Description

# **1. Project Title**

**Note Taking App (NTA)**

# **2. Objective**

The primary objective of the Note Taking App (NTA) project is to create a fast, intuitive, and fully responsive web application that enables users to easily take and keep notes. The application aims to provide a seamless user experience for people that need extra help in remembering things or to keep track of things already accomplished.

# **3. Requirements**

## **3.1. Functional Requirements**

- **Database:** The notes a user takes must be save to a database so they are able to access them.
- **API Integration:** The application must successfully integrate with the Database to fetch the notes data, such as title and the information the user has saved.
- **Search Functionality:** Users must be able to search for their notes by title. Search results should update dynamically.
- **Browse:** The application must display a list of the different notes the user has taken.
- **Detailed View:** Clicking on a list item must navigate the user to a dedicated detail page showing any information the user has saved.
- **Error Handling:** The system must gracefully handle API and Database errors (e.g., connection issues, rate limiting) and display relevant messages to the user.
- **Titles:** Notes must have titles.

## **3.2. Non-Functional Requirements**

- **Performance:** All pages and search results must load quickly, aiming for an initial load time of under 3 seconds.
- **Responsiveness:** The user interface must be fully functional and aesthetically pleasing on all screen sizes, including mobile, tablet, and desktop.
- **Security:** API keys must be handled securely on the server-side (if applicable) or through environment variables.
- **Usability:** The interface must be clean, minimal, and easy to navigate.

# **4. User Stories**

The following user stories define the core features from the end-user perspective:

- **As a student,** I want to see a list of recent notes I have taken on the homepage once I login, so that I can quickly pick up where I left off.
- **As a user,** I want to be able to search for notes by keywords (e.g., JavaScript), so that I can quickly find the exact notes I'm looking for.
- **As a user,** I want to click on a summary button, so that I can view a dedicated page with the full summary of my notes.
- **As a user,** I want the site to look good and work perfectly on my phone, so that I can use the note taker while I'm on the go.
- **As a researcher,** I want to see the date and time of my notes, so that I have an accurate timeline of my research.

# **5. Implementation Details**

## **5.1. Technical Stack (Proposed)**

| **Component**          | **Technology**                       | **Rationale**                                                                                   |
| ---------------------- | ------------------------------------ | ----------------------------------------------------------------------------------------------- |
| **Frontend Framework** | React; Angular; Vanilla HTML + JS    | Modern framework for efficient component-based UI development and state management.             |
| **Styling**            | Tailwind CSS                         | Utility-first framework for rapid, responsive, and aesthetically pleasing design.               |
| **Backend Framework**  | Node.js                              | Provides RESTful API endpoints for handling CRUD operations on notes and user authentication.   |
| **Database**           | MongoDB                              | Stores user accounts and note data persistently. Choice depends on preference for NoSQL vs SQL. |
| **API Communication**  | Fetch API; Axios                     | Handles HTTP requests between frontend and backend.                                             |
| **Authentication**     | JSON Web Tokens (JWT); Firebase Auth | Secure user login, session handling, and protected routes.                                      |
| **Deployment**         | Frontend: Vercel / Netlify           |

Backend: Render / Railway / Heroku
Database: MongoDB Atlas / Supabase | Scalable hosting for full-stack architecture with separate deployment for client, server, and database. |

## **5.2. API Integration Strategy**

The application will expose custom RESTful API endpoints for creating, reading, updating, and deleting notes. Authentication middleware will ensure only authorized users can access their data.

# **6. Deliverables**

The successful completion of the Online Movie Finder project will result in the following
deliverables:

1. **Fully Functional Web Application:** A deployed, responsive web application that meets all specified functional and non-functional requirements.
2. **Source Code:** Clean, well-commented, and organized source code for the frontend application.
3. **Project Documentation:** This project description document and a README file providing setup instructions.
4. **UI Mockups/Design:** Simple wireframes or design concepts (if created) to illustrate the final look and feel of the application.
