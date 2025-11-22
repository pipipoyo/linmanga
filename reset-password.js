const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const usersPath = path.join(__dirname, 'src', 'data', 'users.json');
const users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));

const email = 'mt114917797@gmail.com';
const newPassword = 'piyopiyo55';
const hashedPassword = bcrypt.hashSync(newPassword, 10);

const userIndex = users.findIndex(u => u.email === email);

if (userIndex !== -1) {
    users[userIndex].password = hashedPassword;
    users[userIndex].role = 'admin';
    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
    console.log('Password updated successfully for', email);
    console.log('New hash:', hashedPassword);
    console.log('Verification:', bcrypt.compareSync(newPassword, hashedPassword));
} else {
    console.log('User not found');
}
