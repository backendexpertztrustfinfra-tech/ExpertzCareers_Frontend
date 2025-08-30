

// UpdateRequest.js

class UpdateRequest {
  // Variables (properties)
  constructor(username, email) {
    this.username = username;
    this.email = email;
  }

  // Methods
  updateUsername(newUsername) {
    this.username = newUsername;
    console.log(`Username updated to: ${this.username}`);
  }

  updateEmail(newEmail) {
    this.email = newEmail;
    console.log(`Email updated to: ${this.email}`);
  }

  displayInfo() {
    console.log(`Username: ${this.username}, Email: ${this.email}`);
  }
}

// Export karke React me import kar sakte ho
export default UpdateRequest;
