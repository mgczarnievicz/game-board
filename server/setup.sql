DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS profile;

DROP TABLE IF EXISTS users;


CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR,
    surname VARCHAR,
    email VARCHAR NOT NULL CHECK (email != '') UNIQUE,
    password VARCHAR,
    active BOOLEAN NOT NULL
);

CREATE TABLE profile (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) NOT NULL,
    alias VARCHAR NOT NULL CHECK (alias != ''),
    image_url VARCHAR
);

CREATE TABLE games(
    id SERIAL PRIMARY KEY,
    player_A_id INT REFERENCES users(id) NOT NULL,
    player_B_id INT REFERENCES users(id) NOT NULL,
    game_name TEXT,
    winner_id INT REFERENCES users(id),
    play_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CREATE TABLE resetpassword (
--     id SERIAL PRIMARY KEY,
--     email VARCHAR NOT NULL CHECK (email != '') REFERENCES users(email),
--     code VARCHAR NOT NULL CHECK (code != ''),
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );