create table users (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    email VARCHAR(200) NOT NULL,
    name VARCHAR(200) NOT NULL,
    UNIQUE(email)
);

CREATE TABLE posts(
    id SERIAL NOT NULL,
    caption TEXT,
    user_id BIGINT REFERENCES users(id),
    UNIQUE(user_id)
);