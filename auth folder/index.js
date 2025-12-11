
const menuIcon = document.querySelector(".menu-icon");
const dropdown = document.querySelector(".dropdown");

menuIcon.addEventListener("click", () => {
  dropdown.style.display =
    dropdown.style.display === "block" ? "none" : "block";
});

document.addEventListener("click", (e) => {
  if (!menuIcon.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.style.display = "none";
  }
});

function updateNavUser() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navUsername = document.getElementById("nav-username");
  const navProfileImg = document.getElementById("nav-profile-img");

  if (currentUser) {
    if (navUsername) navUsername.textContent = currentUser.username;
    if (navProfileImg) navProfileImg.src = currentUser.profilePic || "./default-avatar.png";
    document.querySelector(".login-btns").style.display = "none";
    document.querySelector(".user-info").style.display = "flex";
  } else {

    if (navUsername) navUsername.textContent = "";
    if (navProfileImg) navProfileImg.src = "./default-avatar.png";
    document.querySelector(".login-btns").style.display = "flex";
    document.querySelector(".user-info").style.display = "none";
  }
}
updateNavUser();
window.addEventListener("storage", (e) => {
  if (e.key === "currentUser") {
    updateNavUser();
  }
});
