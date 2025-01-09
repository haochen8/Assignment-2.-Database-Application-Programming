const baseURL = "http://localhost:3000";

/**
 * Register a new member
 */
async function register() {
  const messageDiv = document.getElementById("message");
  const data = {
    fname: document.getElementById("fname").value,
    lname: document.getElementById("lname").value,
    address: document.getElementById("address").value,
    city: document.getElementById("city").value,
    state: document.getElementById("state").value,
    zip: document.getElementById("zip").value,
    phone: document.getElementById("phone").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  try {
    const response = await fetch(`${baseURL}/members/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      messageDiv.textContent = "Registration successful!";
      messageDiv.className = "success";
      messageDiv.style.display = "block";

      document.querySelector("#register-form form").reset();

      setTimeout(() => {
        messageDiv.style.display = "none";
        showMainMenu();
      }, 1000);
    } else {
      let errorMessage = "Error registering. Please try again.";
      try {
        const error = await response.json();
        errorMessage = `Error: ${error.message}`;
      } catch (parseError) {
        console.error("Error parsing response JSON:", parseError);
      }
      messageDiv.textContent = errorMessage;
      messageDiv.className = "error";
      messageDiv.style.display = "block";
    }
  } catch (err) {
    console.error(err);
    messageDiv.textContent = "Failed to register. Please try again.";
    messageDiv.className = "error";
    messageDiv.style.display = "block";
  }
}

let currentUserId = null;

/**
 * Login a member
 */
async function login() {
  const messageDiv = document.getElementById("message");
  const data = {
    email: document.getElementById("login-email").value,
    password: document.getElementById("login-password").value,
  };

  try {
    const response = await fetch(`${baseURL}/members/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const result = await response.json();
      messageDiv.textContent = "Login successful!";
      messageDiv.className = "success";
      messageDiv.style.display = "block";

      currentUserId = result.userid;
      setTimeout(() => {
        messageDiv.style.display = "none";
        showMemberMenu();
      }, 1000);
    } else {
      const error = await response.json();
      messageDiv.textContent = `Invalid email or password. Please try again.`;
      messageDiv.className = "error";
      messageDiv.style.display = "block";
    }
  } catch (err) {
    console.error(err);
    messageDiv.textContent = "Failed to login. Please try again.";
    messageDiv.className = "error";
    messageDiv.style.display = "block";
  }
}

/**
 * Logout the current user
 */
async function logout() {
  const messageDiv = document.getElementById("message");
  try {
    const response = await fetch(`${baseURL}/members/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      messageDiv.textContent = "You have successfully logged out.";
      messageDiv.className = "success";
      messageDiv.style.display = "block";

      currentUserId = null;

      setTimeout(() => {
        messageDiv.style.display = "none";
        showMainMenu();
      }, 1000);
    } else {
      const error = await response.json();
      messageDiv.textContent = `Error: ${error.message}`;
      messageDiv.className = "error";
      messageDiv.style.display = "block";
    }
  } catch (err) {
    console.error("Error during logout:", err);
    messageDiv.textContent = "Failed to logout. Please try again.";
    messageDiv.className = "error";
    messageDiv.style.display = "block";
  }
}

/**
 * Browse books by subject
 */
async function browseBySubject() {
  const messageDiv = document.getElementById("message");
  try {
    const response = await fetch(`${baseURL}/books/browse`);

    if (response.ok) {
      const data = await response.json();
      const subjectsDiv = document.getElementById("subject-list");
      if (!subjectsDiv) {
        console.error("Subject list not found in the DOM.");
        throw new Error("Unable to find subject list.");
      }
      subjectsDiv.innerHTML = "<h3>Subjects:</h3>";
      data.subjects.forEach((subject) => {
        subjectsDiv.innerHTML += `<button onclick="fetchBooksBySubject('${subject}')">${subject}</button><br>`;
      });
      showBrowseMenu();
    } else if (response.status === 304) {
      showBrowseMenu();
    } else {
      const error = await response.json();
      messageDiv.textContent = `Error: ${error.message}`;
      messageDiv.className = "error";
      messageDiv.style.display = "block";
    }
  } catch (err) {
    console.error(err);
    messageDiv.textContent = "Failed to load subjects. Please try again.";
    messageDiv.className = "error";
    messageDiv.style.display = "block";
  }
}

/**
 * Fetch books by subject
 *
 * @param {*} subject
 */
async function fetchBooksBySubject(subject) {
  const messageDiv = document.getElementById("message");
  try {
    const encodedSubject = encodeURIComponent(subject);
    const response = await fetch(`${baseURL}/books/browse/${encodedSubject}`);
    const data = await response.json();

    if (response.ok) {
      let booksHtml = `<h3>Books under "${subject}":</h3>`;
      data.books.forEach((book) => {
        booksHtml += `
                  <div>
                      <p><strong>${book.Title}</strong> by ${book.Author}</p>
                      <p>Price: ${book.Price}, ISBN: ${book.ISBN}</p>
                      <button onclick="addToCart('${book.ISBN}')">Add to Cart</button>
                  </div>
              `;
      });
      document.getElementById("subject-list").innerHTML = booksHtml;
    } else {
      messageDiv.textContent = `Error: ${data.message}`;
      messageDiv.className = "error";
      messageDiv.style.display = "block";
    }
  } catch (err) {
    console.error(err);
    messageDiv.textContent = "Failed to fetch books. Please try again.";
    messageDiv.className = "error";
    messageDiv.style.display = "block";
  }
}

/**
 * Search for books by author or title
 */
async function searchBooks() {
  const messageDiv = document.getElementById("message");
  const searchType = document.getElementById("search-type").value;
  const searchQuery = document.getElementById("search-query").value;

  try {
    const response = await fetch(
      `${baseURL}/books/search?type=${searchType}&query=${searchQuery}`
    );
    const data = await response.json();

    if (response.ok) {
      let resultsHtml = "<h3>Search Results:</h3>";
      data.books.forEach((book) => {
        resultsHtml += `
                  <div>
                      <p><strong>${book.Title}</strong> by ${book.Author}</p>
                      <p>Price: ${book.Price}, ISBN: ${book.ISBN}</p>
                      <button onclick="addToCart('${book.ISBN}')">Add to Cart</button>
                  </div>
              `;
      });
      document.getElementById("search-results").innerHTML = resultsHtml;
    } else {
      messageDiv.textContent = `Error: ${data.message}`;
      messageDiv.className = "error";
      messageDiv.style.display = "block";
    }
  } catch (err) {
    console.error(err);
    messageDiv.textContent = "Failed to search books. Please try again.";
    messageDiv.className = "error";
    messageDiv.style.display = "block";
  }
}

/**
 * View the items in the cart
 */
async function viewCart() {
  const messageDiv = document.getElementById("message");
  try {
    const response = await fetch(
      `${baseURL}/cart/view?userid=${currentUserId}`
    );
    const data = await response.json();

    if (response.ok) {
      let cartHtml = "<h3>Items in Cart:</h3>";
      data.cart.forEach((item) => {
        cartHtml += `
                  <div>
                      <p><strong>${item.title}</strong></p>
                      <p>Price: ${item.price}, Quantity: ${item.qty}, Total: ${item.total}</p>
                  </div>
              `;
      });
      cartHtml += `<p><strong>Total Amount: ${data.total}</strong></p>`;
      document.getElementById("cart-items").innerHTML = cartHtml;
      showCart();
    } else {
      messageDiv.textContent = `Error: ${data.message}`;
      messageDiv.className = "error";
      messageDiv.style.display = "block";
    }
  } catch (err) {
    console.error(err);
    messageDiv.textContent = "Failed to view cart. Please try again.";
    messageDiv.className = "error";
    messageDiv.style.display = "block";
  }
}

/**
 * Add a book to the cart
 *
 * @param {string} isbn - ISBN of the book
 * @returns
 */
async function addToCart(isbn) {
  const messageDiv = document.getElementById("message");
  const quantity = prompt("Enter quantity:");
  if (!quantity) return;

  try {
    const response = await fetch(`${baseURL}/cart/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userid: currentUserId, isbn, quantity }),
    });

    if (response.ok) {
      messageDiv.textContent = "Book added to cart successfully!";
      messageDiv.className = "success";
      messageDiv.style.display = "block";
    } else {
      const error = await response.json();
      messageDiv.textContent = `Error: ${error.message}`;
      messageDiv.className = "error";
      messageDiv.style.display = "block";
    }
  } catch (err) {
    console.error(err);
    messageDiv.textContent = "Failed to add book to cart. Please try again.";
    messageDiv.className = "error";
    messageDiv.style.display = "block";
  }
}

/**
 * Checkout the items in the cart
 */
async function checkout() {
  const messageDiv = document.getElementById("message");
  if (!currentUserId) {
    messageDiv.textContent = "Please login to checkout.";
    messageDiv.className = "error";
    messageDiv.style.display = "block";
    return;
  }
  try {
    const response = await fetch(`${baseURL}/cart/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userid: currentUserId }),
    });

    if (response.ok) {
      const data = await response.json();
      let invoiceHtml = `<h3>Invoice for Order #${data.invoice.orderId}</h3>`;
      invoiceHtml += "<div><h4>Items:</h4>";
      data.invoice.items.forEach((item) => {
        invoiceHtml += `
                  <div>
                      <p>${item.title} - Qty: ${item.qty}, Total: ${item.total}</p>
                  </div>
              `;
      });
      invoiceHtml += `</div><p><strong>Grand Total: ${data.invoice.total}</strong></p>`;
      document.getElementById("cart-items").innerHTML = invoiceHtml;
      messageDiv.textContent = "Checkout successful!";
      messageDiv.className = "success";
      messageDiv.style.display = "block";
    } else {
      const error = await response.json();
      messageDiv.textContent = `Error: ${error.message}`;
      messageDiv.className = "error";
      messageDiv.style.display = "block";
    }
  } catch (err) {
    console.error(err);
    messageDiv.textContent = "Failed to checkout. Please try again.";
    messageDiv.className = "error";
    messageDiv.style.display = "block";
  }
}

function toggleMenu(menuIdToShow) {
  const menus = [
    "main-menu",
    "register-form",
    "login-form",
    "member-menu",
    "browse-menu",
    "search-menu",
    "checkout-menu",
    "cart-menu",
    "subject-menu",
    "author-title-menu",
  ];

  menus.forEach((menuId) => {
    const menu = document.getElementById(menuId);
    if (menu) {
      menu.style.display = menuId === menuIdToShow ? "block" : "none";
    } else {
      console.warn(`Menu with ID "${menuId}" not found.`);
    }
  });
}

function showRegisterForm() {
  toggleMenu("register-form");
}

function showLoginForm() {
  toggleMenu("login-form");
}

function showLogoutForm() {
  toggleMenu("main-menu");
}

function showMainMenu() {
  toggleMenu("main-menu");
}

function showMemberMenu() {
  toggleMenu("member-menu");
}

function showBrowseMenu() {
  toggleMenu("browse-menu");
}

function showSearchMenu() {
  toggleMenu("search-menu");
}

function showCheckoutMenu() {
  toggleMenu("checkout-menu");
}

function showBrowseBySubject() {
  toggleMenu("subject-menu");
}

function showSearchByAuthorTitle() {
  toggleMenu("author-title-menu");
}

function showCart() {
  toggleMenu("cart-menu");
}
