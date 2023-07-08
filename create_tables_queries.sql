CREATE TABLE genres (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE series (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    release_year INT,
    rating DECIMAL(3, 2),
    certificate TEXT,
    vote_count INT,
    series_type TEXT
);

CREATE TABLE series_genre (
    series_id INT,
    genre_id INT,
    PRIMARY KEY (series_id, genre_id),
    FOREIGN KEY (series_id) REFERENCES series(id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
);

CREATE TABLE directors (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE series_directors (
    series_id INT,
    director_id INT,
    PRIMARY KEY (series_id, director_id),
    FOREIGN KEY (series_id) REFERENCES series(id) ON DELETE CASCADE,
    FOREIGN KEY (director_id) REFERENCES directors(id) ON DELETE CASCADE
);

CREATE TABLE actors (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE series_actors (
    series_id INT,
    actor_id INT,
    PRIMARY KEY (series_id, actor_id),
    FOREIGN KEY (series_id) REFERENCES series(id) ON DELETE CASCADE,
    FOREIGN KEY (actor_id) REFERENCES actors(id) ON DELETE CASCADE
);
