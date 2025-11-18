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

Tech Stack
----------

-   Runtime: Node.js (LTS)

-   Framework: Express.js

-   Templating: EJS
