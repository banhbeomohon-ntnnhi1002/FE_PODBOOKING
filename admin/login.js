document.addEventListener("DOMContentLoaded", function () {
    // Kiểm tra nếu đã đăng nhập thì chuyển hướng luôn
    if (localStorage.getItem("isLoggedIn") === "true") {
        window.location.href = "booking.html";
    }

    // Xử lý đăng nhập
    const form = document.getElementById("loginForm");
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (email === "admin@gmail.com" && password === "admin123") {
            document.body.classList.add("fade-out");
            setTimeout(() => {
                localStorage.setItem("isLoggedIn", "true");
                window.location.href = "booking.html";
            }, 500);
        } else {
            alert("Tài khoản hoặc mật khẩu không đúng!");
        }
    });
});