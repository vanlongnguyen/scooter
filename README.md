# scooter

Pre-preparation
1. brew install postgresql
2. brew services start postgresql
==> Successfully started `postgresql` (label: homebrew.mxcl.postgresql)
3. postgres=# CREATE ROLE beam WITH LOGIN PASSWORD 'password';
4. Log in with new user: psql -d postgres -U beam
5. Create Database: CREATE DATABASE scooters;
6. Access to new DB: postgres=> \c scooters
7. Create DB schema:

CREATE TABLE scooter_info (
  id SERIAL PRIMARY KEY,
  lat VARCHAR(50),
  long VARCHAR(50),
  country VARCHAR(150),
  name VARCHAR(100)
);

8. Test your schema: scooters=> select * from scooter_info;

 id |    lat    |    long    |    country    |        name        
----+-----------+------------+---------------+--------------------

If you see this. It works.

9. Clone code from git@github.com:vanlongnguyen/scooter.git
10. npm install
11. npm start

Access to http://localhost:80/
