# Insert data into the tables

USE health;

INSERT INTO users(username, firstname, lastname, email, hashedpassword)
VALUES (
    'gold',
    'gold',
    'gold',
    'gold@gold.ac.uk',
    '$2b$10$TRI0jxzzPx16lP234439R.tV6rElsWwLj8vsQuBWZ.f57fBuZ9SfC'
);