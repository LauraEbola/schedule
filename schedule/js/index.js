document.addEventListener("DOMContentLoaded", function () {
    const loginFormContainer = document.getElementById("loginFormContainer");
    const registerFormContainer = document.getElementById("registerFormContainer");
    const emailLoginFormContainer = document.getElementById("emailLoginFormContainer");
    const showRegister = document.getElementById("showRegister");
    const showLogin = document.getElementById("showLogin");
    const emailLogin = document.getElementById("emailLogin");
    const emailBackToLogin = document.getElementById("emailBackToLogin");
    const guestAccess = document.getElementById("guestAccess");

    // 表单切换
    showRegister.addEventListener("click", function (e) {
        e.preventDefault();
        loginFormContainer.style.display = "none";
        registerFormContainer.style.display = "block";
    });

    showLogin.addEventListener("click", function (e) {
        e.preventDefault();
        registerFormContainer.style.display = "none";
        loginFormContainer.style.display = "block";
    });

    emailLogin.addEventListener("click", function (e) {
        e.preventDefault();
        loginFormContainer.style.display = "none";
        emailLoginFormContainer.style.display = "block";
    });

    emailBackToLogin.addEventListener("click", function (e) {
        e.preventDefault();
        emailLoginFormContainer.style.display = "none";
        loginFormContainer.style.display = "block";
    });

    // 登录功能
    const loginForm = document.getElementById("loginForm");
    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const username = document.getElementById("loginUsername").value;
        const password = document.getElementById("loginPassword").value;

        try {
            const response = await fetch("http://localhost:5000/api/Auth/Login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '登录失败');
            }

            const data = await response.json();

            if (response.ok) {

                // 登录成功
                // 保存登录状态和用户信息
                sessionStorage.setItem('isLoggedIn', 'true');
                sessionStorage.setItem('user', JSON.stringify({
                    userId: data.user.userId,
                    username: data.user.username,
                    nickname: data.user.nickname,
                    email: data.user.email,
                    isAdmin: data.user.isAdmin
                }));
                sessionStorage.setItem('token', data.token);

                alert(data.message);
                window.location.href = "HomePage.html";
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("登录错误:", error);
            alert("登录过程中发生错误");
        }
    });

    // 注册功能
    const registerForm = document.getElementById("registerForm");
    registerForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const username = document.getElementById("regiName").value;
        const password = document.getElementById("regiPw").value;
        const nickname = document.getElementById("regiNick").value;
        const email = document.getElementById("regiEmail").value;

        try {
            const response = await fetch("http://localhost:5000/api/Auth/Register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password, nickname, email }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                registerFormContainer.style.display = "none";
                loginFormContainer.style.display = "block";
                registerForm.reset();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("注册错误:", error);
            alert("注册过程中发生错误");
        }
    });

    // 游客访问
    guestAccess.addEventListener("click", async function (e) {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5000/api/Auth/Guest", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                window.location.href = "HomePage.html";
            } else {
                alert("游客访问失败");
            }
        } catch (error) {
            console.error("游客访问错误:", error);
            alert("游客访问过程中发生错误");
        }
    });

});