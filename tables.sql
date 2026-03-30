CREATE TABLE roles
(
	role_name VARCHAR(32) not null CONSTRAINT PK_role PRIMARY KEY,
	description VARCHAR(32)
);

INSERT INTO roles (role_name, description) 
VALUES ('user', 'Пользователь'),('admin', 'Админ');


CREATE TABLE users
(
	login VARCHAR(32) not null CONSTRAINT PK_Login PRIMARY KEY,
	password VARCHAR(255) not null 
	CONSTRAINT CH_Login CHECK (length (login) >= 8),
	CONSTRAINT CH_Password_UPPER CHECK (password similar to '%[A-Z]%'),
	CONSTRAINT CH_Password_LOWER CHECK (password similar to '%[a-z]%'),
	CONSTRAINT CH_Password_SYMBOL CHECK (password similar to '%[!@#$%^&*]%'),
	second_name VARCHAR(30) null,
	first_name VARCHAR(30) null,
	middle_name VARCHAR(30) null,
	role_name VARCHAR(32) not null REFERENCES roles (role_name)
);

INSERT INTO users (login, password, second_name, first_name, middle_name, role_name) 
VALUES ('bazarov_av', '$2a$12$Vm3cTkX/c7AzCKBoe.inceZUt70GMF5sfp7Vl1gWvFEA.1pFskEa.', 'Базаров', 'Евгений', 'Васильевич', 'user'),
('vronski_ak', '$2a$12$Vm3cTkX/c7AzCKBoe.inceZUt70GMF5sfp7Vl1gWvFEA.1pFskEa.', 'Вронский', 'Алексей', 'Кириллович', 'user'),
('admin_01', '$2a$12$Vm3cTkX/c7AzCKBoe.inceZUt70GMF5sfp7Vl1gWvFEA.1pFskEa.', 'Администратор', 'Первый', '', 'admin');

CREATE TABLE cars
(
	car_id serial not null CONSTRAINT PK_car PRIMARY KEY,
	name VARCHAR(32) not null,
	reg_number VARCHAR(10) CONSTRAINT UQ_reg_number UNIQUE,
	date_tech DATE null,
	date_repair DATE null,
	milage INT null,
	its INT null, 
	person VARCHAR(32) null REFERENCES users (login),
	info VARCHAR (1024) null,
	image_url VARCHAR (1024) null
);

INSERT INTO cars (name, reg_number, date_tech, date_repair, milage, its, person, info, image_url) 
VALUES ('КАМАЗ 65956-AA', 'A123BC', '2026-02-07', '2025-02-12', 5000, 100, 'bazarov_av', 'Требуется провести диагностику двигателя', '/images/kamaz.jpg'),
('КАМАЗ 54901-70014-CA', 'A123BB', '2026-02-01', '2025-03-15', 6000, 100, 'vronski_ak', 'Требуется провести регулировку коробки передач', '/images/kamaz2.jpg');

CREATE TABLE units
(
	unit_id serial not null CONSTRAINT PK_unit PRIMARY KEY,
	name VARCHAR(32) not null,
	car_id INT not null REFERENCES cars (car_id),
	date_repair DATE null,
	its INT null,
	info VARCHAR (1024) null,
	image_url VARCHAR (1024) null
);

INSERT INTO units (name, car_id, date_repair, its, info, image_url) VALUES 
('ДВС КАМАЗ 740.735-400', 1, '2026-02-07', 80, 'Провести измерение компрессии', '/images/kamaz-dv.jpg' ),
('Коробка передач ZF 12TX2825TO', 1, '2026-02-07', 60, 'Провести регулировку гидротрансформатора', '/images/kamaz-kpp.jpg' ),
('Тормозной механизм колес', 1, '2026-02-07', 70, 'Провести расточку тормозных колодок через месяц', '/images/kamaz-tormoz.jpg' ),
('ДВС КАМАЗ 740.735-400', 2, '2026-02-07', 80, 'Провести измерение компрессии', '/images/kamaz-dv.jpg' ),
('Коробка передач ZF 12TX2825TO', 2, '2026-02-07', 60, 'Провести регулировку гидротрансформатора', '/images/kamaz-kpp.jpg' ),
('Тормозной механизм колес', 2, '2026-02-07', 70, 'Провести расточку тормозных колодок через месяц', '/images/kamaz-tormoz.jpg' );

CREATE TABLE tech_request_types
(
	request_type VARCHAR(10) not null CONSTRAINT PK_request_type PRIMARY KEY,
	name VARCHAR (32) null
);

INSERT INTO tech_request_types (request_type, name) 
VALUES ('to', 'ТО'),('repair', 'Ремонт');

CREATE TABLE tech_requests
(
	request_id serial not null CONSTRAINT PK_request PRIMARY KEY,
	request_type VARCHAR(10) not null REFERENCES tech_request_types (request_type),
	car_id INT not null REFERENCES cars (car_id),
	date_repair DATE null,
	person VARCHAR(32) null REFERENCES users (login),
	info VARCHAR (1024) null
);

INSERT INTO tech_requests (request_type, car_id, date_repair, person, info) VALUES 
('to', 1, '2026-02-23', 'bazarov_av', 'Отрегулировать гидротрансформатор коробки передач'),
('repair', 2, '2026-02-23', 'bazarov_av', 'Заменить гидротрансформатор коробки передач');

