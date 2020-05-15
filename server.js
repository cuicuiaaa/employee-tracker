const mysql = require("mysql");
const inquirer = require("inquirer");



const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "liuyiling123CLARE",
    database: "employee_db"
});

connection.connect(function(err) {
    if (err) {
      console.error("error connecting: " + err.stack);
      return;
    }
    console.log("connected as id " + connection.threadId);
    init();
});

function init() {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "Add department",
            "Add role",
            "Add employee",
            "View departments",
            "View roles",
            "View employees",
            "Update employee roles"
        ]
    }).then(function(answer) {
        switch (answer.action) {
            case "Add department":
                addDepartment();
                break;
            
            case "Add role":
                addRole();
                break;

            case "Add employee":
                addEmployee();
                break;

            case "View departments":
                viewDepartments();
                break;

            case "View roles":
                viewRoles();
                break;

            case "View employees":
                viewEmployees();
                break;

            case "Update employee roles":
                update();
                break;
        }
    });
}

function addDepartment() {
    inquirer.prompt({
        name: "new-department",
        type: "input",
        message: "What is the name of the department?"
    }).then(function(answer) {
        const query = "insert into department set ?";
        connection.query(query, { name: answer["new-department"] }, function(err) {
            if (err) throw err;
            console.log("Added " + answer["new-department"] + " to the database.");
            init();
        });

        
    })
}



function addRole() {
    let departmentList = [];
    let departments = [];    
    connection.query("select id, name from department", function(err, res) {
        
        for (i = 0; i < res.length; i++) {
            departmentList.push(res[i].name);
            departments.push({id: res[i].id, name: res[i].name});
            
        }

        inquirer.prompt([
            {
                name: "new-role",
                type: "input",
                message: "What is the name of the role?"
            },
            {
                name: "salary",
                type: "input",
                message: "What is the salary of the role?"
            },
            {
                name: "department",
                type: "list",
                message: "Which department does the role belong to?",
                choices: departmentList
            }
        ]).then(function(answers) {
            
            let departmentId = "";
            for (i = 0; i < departments.length; i++) {
                if (answers.department === departments[i].name) {
                    departmentId = departments[i].id;
                }
            };
            

            const query = "insert into role set ?";
            connection.query(query, { title: answers["new-role"], salary: answers.salary, department_id: departmentId }, function(err) {
                if (err) throw err;
                console.log("Added " + answers["new-role"] + " to the database.");
                init();
            })
        })
        
    })
    
    
    
   
    
}

let roleList = [];
let roles = [];
connection.query("select id, title from role", function(err, res) {
    for (i = 0; i < res.length; i++) {
        roleList.push(res[i].title);
        roles.push({ id: res[i].id, title: res[i].title })
    };
    
});

function addEmployee() {
    
    let employeeList = ["none"];
    let employees = [];
    connection.query("select id, first_name, last_name from employee", function(err, res) {
        for (i = 0; i < res.length; i++) {
            employeeList.push(res[i].first_name + " " + res[i].last_name);
            employees.push({ id: res[i].id, fullname: res[i].first_name + " " + res[i].last_name });
        };

        inquirer.prompt([
            {
                name: "first-name",
                type: "input",
                message: "What is the employee's first name?"
            },
            {
                name: "last-name",
                type: "input",
                message: "What is the employee's last name?"
            },
            {
                name: "role",
                type: "list",
                message: "What is the employee's role?",
                choices: roleList
            },
            {
                name: "manager",
                type: "list",
                message: "Who is the employee's manager?",
                choices: employeeList
            }
        ]).then(function(answers) {
            
            let roleId = "";

            for (i = 0; i < roles.length; i++) {
                if (answers.role === roles[i].title) {
                    roleId = roles[i].id;
                };
            }

            
    
            let managerId = "none";

            for (i = 0; i < employees.length; i++) {
                if (answers.manager === employees[i].fullname) {
                    managerId = employees[i].id;
                };
            }
            
        
            const query = "insert into employee set ?";
            connection.query(query, { first_name: answers["first-name"], last_name: answers["last-name"], role_id: roleId, manager_id: managerId}, function(err) {
                if (err) throw err;
                console.log("Added " + answers["first-name"] + " " + answers["last-name"] + " to the database.");
                init();
            })
        })
    })
    
    
}








function viewDepartments() {
    connection.query("select * from department", function(err, rows, fields) {
        if (!err) {
            console.table(rows);
        } else {
            throw err;
        }

        init();
    })
}

function viewRoles() {
    connection.query("select * from role", function(err, rows, fields) {
        if (!err) {
            console.table(rows);
        } else {
            throw err;
        }

        init();
    })
}

function viewEmployees() {
    connection.query("select * from employee", function(err, rows, fields) {
        if (!err) {
            console.table(rows);
        } else {
            throw err;
        }

        init();
    })
}

function update() {
    
    let employeeList = [];
    let employees = [];
    connection.query("select id, first_name, last_name from employee", function(err, res) {
        for (i = 0; i < res.length; i++) {
            employeeList.push(res[i].first_name + " " + res[i].last_name);
            employees.push({ fullname: res[i].first_name + " " + res[i].last_name, role_id: res[i].role_id });
        };

        inquirer.prompt([
            {
                name: "employee",
                type: "list",
                message: "Which employee do you want to update?",
                choices: employeeList
            },
            {
                name: "newRole",
                type: "list",
                message: "What is the employee's new role?",
                choices: roleList
            }
            
        ]).then(function(answers) {
            
            let roleId = "";

            for (i = 0; i < roles.length; i++) {
                if (answers.newRole === roles[i].title) {
                    roleId = roles[i].id;
                };
            }

            let employeeId = "";

            for (i = 0; i < employees.length; i++) {
                if (answers.employee === employees[i].fullname) {
                    employeeId = employees[i].id;
                };
            }
            
            
        
            const query = "update employee set role_id = ? where id = ?";
            connection.query(query, [roleId, employeeId], function(err) {
                if (err) throw err;
                console.log("Added " + answers.employee + " to the database.");
                init();
            })
        })
    })
}