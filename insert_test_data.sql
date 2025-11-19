# Insert data into the tables

USE berties_books;

INSERT INTO books (name, price)VALUES('Brighton Rock', 20.25),('Brave New World', 25.00), ('Animal Farm', 12.99), ('The Lean Start Up', 27.99),('Romeo and Julliet', 12.99) ;

INSERT INTO users (username, first_name, last_name, email, hashedPassword)
SELECT 'gold', 'Bertie', 'Gold', 'gold@berties.com', '$2b$10$DjgNZ/V9gJjUXGIOahU3weSqDP.Wj/m8oOenTFSOdKqUixGUXDV1m'
