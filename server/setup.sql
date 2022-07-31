DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS profile;

DROP TABLE IF EXISTS games_names;
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

CREATE TABLE games_name (
    id SERIAL PRIMARY KEY,
    game_name VARCHAR NOT NULL CHECK (alias != ''),
);

CREATE TABLE games(
    id SERIAL PRIMARY KEY,
    player_A_id INT REFERENCES users(id) NOT NULL,
    player_B_id INT REFERENCES users(id) NOT NULL,
    game_id INT REFERENCES games_name(id) NOT NULL,
    winner_id INT REFERENCES users(id),
    player_A_pts INT NOT NULL,
    player_B_pts INT NOT NULL,
    play_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CREATE TABLE resetpassword (
--     id SERIAL PRIMARY KEY,
--     email VARCHAR NOT NULL CHECK (email != '') REFERENCES users(email),
--     code VARCHAR NOT NULL CHECK (code != ''),
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

INSERT INTO games_name (game_name)
    VALUES (`TicTacToe`)