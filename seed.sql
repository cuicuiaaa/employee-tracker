drop database if exists employee_db;

create database employee_db;

use employee_db;

create table department (
    id int auto_increment not null,
    name varchar(30) not null,
    primary key (id)
);

create table role (
    id int auto_increment not null,
    title varchar(30) not null,
    salary decimal not null,
    department_id int not null,
    primary key (id),
    foreign key (department_id) references department(id)

);

create table employee (
    id int auto_increment not null,
    first_name varchar(30) not null,
    last_name varchar(30) not null,
    role_id int not null,
    manager_id int,
    primary key (id),
    foreign key (role_id) references role(id),
    foreign key (manager_id) references employee(id)
);

insert into department (name)
values 
    ("Legal"), 
    ("Finance"), 
    ("Engineering"),
    ("Sales");

insert into role (title, salary, department_id)
values
    ("Software Engineer", "70000", 3),
    ("Lawyer", "90000", 1),
    ("Sales Manager", "80000", 4),
    ("Accountant", "50000", 2);

insert into employee (first_name, last_name, role_id, manager_id)
values
    ("John", "Smith", 1, null),
    ("David", "Jones", 2, null),
    ("Michael", "Johnson", 3, null),
    ("Chris", "Lee", 4, null);
