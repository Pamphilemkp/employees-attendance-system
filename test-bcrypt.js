import bcrypt from 'bcryptjs';

// Test Password
const password = '123456';

// Hash the password
bcrypt.hash(password, 10).then(hashedPassword => {
  console.log('Original Password:', password);
  console.log('Hashed Password:', hashedPassword);

  // Compare with the hashed password (Simulating a login process)
  bcrypt.compare(password, hashedPassword).then(isMatch => {
    console.log('Password match:', isMatch);
  });

  // Simulate storing the password in the database
  const storedHashedPassword = hashedPassword;

  // Simulate fetching and comparing during login
  bcrypt.compare(password, storedHashedPassword).then(isMatch => {
    console.log('Password match with DB hash:', isMatch);
  });
});
