# Online Book Store Application

This is a basic Online Book Store Application built with Node.js, Express, MySQL, and a simple HTML/JavaScript frontend. It allows users to register, login, browse books by subject, add books to a cart, and proceed to checkout.

## Features

- **User Registration and Login**: New users can register and log in to their accounts.
- **Browse Books**: View books categorized by subjects.
- **Search Books**: Search books by author or title.
- **Cart Management**: Add books to a cart and view cart items.
- **Checkout**: Place an order and generate an invoice.

## Installation

### Prerequisites

- Node.js installed on your system.
- MySQL installed and running.
- MySQL Workbench for managing the database (optional).

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/online-book-store.git
   cd online-book-store
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the database:

   - Create a MySQL database, e.g., `myappdb`.
   - Import the provided SQL scripts (books.sql and others) to create and populate the tables.
   - Update the [.env](http://_vscodecontentref_/1) file with your database credentials:

   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=myappdb
   ```

4. Start the server:

   ```bash
   npm start
   ```

5. Open the application:

   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Registration

Go to New Member Registration and fill in the form to create an account.

### Login

Enter your email and password to log in.

### Browse Books

Click Browse by Subject to view books categorized by subjects.

### Search Books

Use the search menu to find books by author or title.

### Add to Cart

Click Add to Cart for any book to add it to your cart.

### Checkout

Proceed to checkout to place an order and view the invoice.

### Logout

Log out using the Logout button.

## Technologies Used

- **Backend**: Node.js, Express
- **Database**: MySQL
- **Frontend**: HTML, CSS, JavaScript

## License

This project is licensed under the MIT License.

## Author
Hao Chen
hc222ig@student.lnu.se
