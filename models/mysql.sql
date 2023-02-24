CREATE TABLE employees (
  emp_no MEDIUMINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  inserted_at datetime default now(),
  updated_at datetime default now()
);

INSERT INTO employees (first_name, last_name)
VALUES
 ('Gwenaël', 'Gallon'),
 ('Ara', 'Herman'),
 ('Khalid', 'Cremin'),
 ('Cyrus', 'Hansen');
