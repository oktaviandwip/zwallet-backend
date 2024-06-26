CREATE TABLE users (
	id SERIAL NOT NULL PRIMARY KEY,
	email VARCHAR(255) UNIQUE NOT NULL,
	username VARCHAR(255) UNIQUE NOT NULL,
	password VARCHAR(255) NOT NULL,
	pin VARCHAR(6) NOT NULL,
	name VARCHAR(255),
	phone_number VARCHAR(20) NULL UNIQUE,
	balance FLOAT8 NOT NULL DEFAULT 0 CHECK (balance >= 0),
	photo_profile TEXT,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP
);

CREATE TABLE receivers (
	id SERIAL PRIMARY KEY,
	user_id SERIAL NOT NULL,
	receiver_id SERIAL NOT NULL,
	created_at TIMESTAMP DEFAULT NOW(),
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
	UNIQUE (user_id, receiver_id)
);

CREATE TABLE transactions (
	id serial NOT NULL PRIMARY KEY,
	sender_id serial NOT NULL,
	receiver_id serial NOT NULL,
	amount int NOT NULL,
	notes text NULL,
	created_at TIMESTAMP DEFAULT NOW(),
	CONSTRAINT sender_fk FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE on update cascade,
	CONSTRAINT receiver_fk FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE on update cascade
);

INSERT INTO users (email, username, password, pin, balance) VALUES
('admin@gmail.com', 'admin', 'admin1234', '111111', 1000000000);