# Bertie's Books Application
==========================

A dynamic web application for a bookstore allowing users to search for books, register, log in, and view bargain deals.

Live VM
-------

You can view the running application here:

https://www.doc.gold.ac.uk/usr/235/home

Features
--------

-   Home (/, /home) --- Landing page displaying the shop name and main navigation.

-   About (/about) --- Information about Bertie's Books.

-   Search (/books/search → /books/search-result) --- A search form allowing users to find books by name.

-   Register (/users/register → /users/registered) --- User registration form including username, password, name, and email. Passwords are securely hashed using bcrypt.

-   Login (/users/login → /users/loggedin) --- User authentication page that verifies credentials against the database.

-   Bargain Books (/books/bargainbooks) --- A filter to quickly find books priced under £20.

-   Audit Log (/users/audit) --- An administrative view showing a history of all successful and failed login attempts.

Security Implementations (Lab 7)
--------------------------------

This project implements specific security measures for data protection and monitoring:

### 1\. Dotenv Configuration

-   Goal: Prevent sensitive database credentials from being exposed in source control.

-   Implementation: Credentials (host, user, password, database name) are stored in a local .env file and accessed via process.env.

### 2\. Audit Logging

-   Goal: Monitor authentication attempts for security auditing.

-   Logic: Every login attempt triggers an entry in the login_audit database table, recording the username, the action (e.g., "success", "fail (wrong password)"), and the attempt_time.


Security Implementations (Lab 8 - Sanitisation & Validation)

Sanitisation 

Goal: Prevent Cross-Site Scripting (XSS) attacks by cleaning user input before processing.

Implementation Details:

Register Form (/registered):

First Name & Last Name: Sanitised using req.sanitize(). These fields are often displayed back to users (e.g., "Hello Henry..."), making them prime targets for XSS scripts like <script>alert('hack')</script>.

Username: Sanitised. Although less commonly used for large scripts, usernames are displayed throughout the site (header, login success messages), so they must be clean.

Email: Sanitised. While emails have strict formats, sanitising them adds a layer of defence against complex injection attempts.

Other Forms:

Add Book (/bookadded): The book name and price are sanitised to prevent stored XSS attacks where a malicious book title could execute code on the book list page for every visitor.

Reasoning for Exclusions:

Passwords: I did not sanitise the password field. Passwords are hashed immediately and never displayed back to the user. Sanitising them might modify special characters (e.g., < or >) that users legitimately use in strong passwords, causing login failures.

Validation

Goal: Ensure data integrity and prevent invalid data from corrupting the database logic.

Implementation Details:

Email: Validated using check('email').isEmail(). Ensures the input follows the standard email format.

Username: Validated using isLength({ min: 5, max: 20 }). Enforces a reasonable length constraint consistent with database limits.

Password: Validated using isLength({ min: 8 }). Enforces a minimum security standard for user accounts.

Required Fields: first and last names are checked with .notEmpty() to prevent incomplete user profiles.

Reasoning:

Validation is applied strictly to the registration form because this is the entry point for user identity.

Validation is not strictly applied to the "Search" bar because an invalid search term (e.g., empty string) simply returns no results rather than breaking the application logic.

API Documentation (Lab 9b)
--------------------------
The application provides a public API endpoint that returns book data in JSON format. This can be used by other developers or applications to consume the bookshop's data.

**Base Endpoint:**
`GET /api/books`
Returns a list of all books in the database.

**Query Parameters (Extensions):**
The API supports filtering and sorting via query strings:

-   **Search by Name:** Filter books containing a specific keyword.
    -   *Example:* `/api/books?search=sun`
-   **Price Range:** Filter books within a specific price range using `minprice` and `max_price`.
    -   *Example:* `/api/books?minprice=5&max_price=20`
-   **Sorting:** Sort the results by `name` or `price`.
    -   *Example:* `/api/books?sort=price`



## Installation & Setup Instructions

Follow these steps to set up and run the Express web application:

1. Install dependencies:
   npm install


2. Start the server:

node index.js


3. Check your terminal output:
You should see:

Node server is running on port 8000...

Tech Stack
----------

-   Runtime: Node.js (LTS)

-   Framework: Express.js

-   Templating: EJS
