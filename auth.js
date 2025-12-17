
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("signupUsername").value.trim();
    const password = document.getElementById("signupPassword").value.trim();
    const imgInput = document.getElementById("signupImage").files[0];
    const messageEl = document.getElementById("signupMessage");

    if (!username || !password) {
      messageEl.style.display = "block";
      messageEl.style.color = "red";
      messageEl.textContent = "Username and password are required!";
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.find(u => u.username === username)) {
      messageEl.style.display = "block";
      messageEl.style.color = "red";
      messageEl.textContent = "Username already exists!";
      return;
    }

    if (imgInput) {
      const reader = new FileReader();
      reader.onload = function () {
        saveUser(username, password, reader.result);
      };
      reader.readAsDataURL(imgInput);
    } else {
      saveUser(username, password, "");
    }

    function saveUser(username, password, profilePic) {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const newUser = { username, password, profilePic };
      users.push(newUser);

      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("currentUser", JSON.stringify(newUser));

      messageEl.style.display = "block";
      messageEl.style.color = "green";
      messageEl.textContent = "Account created! Redirecting...";

      setTimeout(() => {
        window.location.href = "./profile.html";
      }, 1000);
    }
  });
}


const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    const messageEl = document.getElementById("loginMessage");

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const match = users.find(u => u.username === username && u.password === password);

    if (!match) {
      messageEl.style.display = "block";
      messageEl.style.color = "red";
      messageEl.textContent = "Incorrect username or password!";
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(match));

    messageEl.style.display = "block";
    messageEl.style.color = "green";
    messageEl.textContent = "Login successful! Redirecting...";

    setTimeout(() => {
      window.location.href = "./profile.html";
    }, 1000);
  });
}


document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("currentUser");
      window.location.href = "./login.html";
    });
  }
});


document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("profile.html")) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      window.location.href = "./login.html";
      return;
    }

    const profileUsername = document.getElementById("profileUsername");
    const profileImage = document.getElementById("profileImage");

    if (profileUsername) profileUsername.textContent = currentUser.username;
    if (profileImage && currentUser.profilePic) {
      profileImage.src = currentUser.profilePic;
      profileImage.style.display = "block";
    }
  }
});
const imageInput = document.getElementById("signupImage");
const imagePreview = document.getElementById("imagePreview");
const fileName = document.getElementById("fileName");

if (imageInput) {
  imageInput.addEventListener("click", (e) => e.stopPropagation());

  imageInput.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      imagePreview.src = e.target.result;
      imagePreview.style.display = "block";

      if (fileName) fileName.textContent = file.name;
    };
    reader.readAsDataURL(file);
  });
}


