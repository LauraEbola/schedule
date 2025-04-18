document.addEventListener("DOMContentLoaded", function () {
    // 默认管理员账户
    const defaultAdminAccount = {
        username: "admin",
        password: "admin"
    };

    // 简单注册信息存储（仅用于前端演示）
    const userDatabase = {};

    const loginFormContainer = document.getElementById("loginFormContainer");
    const registerFormContainer = document.getElementById("registerFormContainer");
    const showRegister = document.getElementById("showRegister");
    const showLogin = document.getElementById("showLogin");

    // 切换到注册页面
    showRegister.addEventListener("click", function () {
        loginFormContainer.style.display = "none";
        registerFormContainer.style.display = "block";
    });

    // 切换到登录页面
    showLogin.addEventListener("click", function () {
        registerFormContainer.style.display = "none";
        loginFormContainer.style.display = "block";
    });

    // 登录功能
    const loginForm = document.getElementById("loginForm");
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const username = document.getElementById("loginUsername").value;
        const password = document.getElementById("loginPassword").value;

        if (username === defaultAdminAccount.username) {
            if (password === defaultAdminAccount.password) {
                alert("管理员登录成功！");
                window.location.href = "HomePage.html";
            } else {
                alert("密码错误！");
            }
        } else if (userDatabase[username]) {
            if (userDatabase[username].password === password) {
                alert("登录成功！");
                window.location.href = "HomePage.html";
            } else {
                alert("密码错误！");
            }
        } else {
            alert("账号不存在！");
        }
    });

    // 注册功能
    const registerForm = document.getElementById("registerForm");
    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const username = document.getElementById("regiName").value;
        const password = document.getElementById("regiPw").value;
        const nickname = document.getElementById("regiNick").value;
        const email = document.getElementById("regiEmail").value;

        if (userDatabase[username]) {
            alert("该用户名已存在！");
            return;
        }

        userDatabase[username] = {
            password,
            nickname,
            email: email || null
        };

        alert("注册成功，请使用您的账号登录！");
        registerFormContainer.style.display = "none";
        loginFormContainer.style.display = "block";
    });

    // 游客访问
    const guestAccess = document.getElementById("guestAccess");
    guestAccess.addEventListener("click", function () {
        alert("以游客身份访问");
        window.location.href = "HomePage.html";
    });

});
