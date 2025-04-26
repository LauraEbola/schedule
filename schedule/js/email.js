document.addEventListener("DOMContentLoaded", function () {
    const emailLoginFormContainer = document.getElementById("emailLoginFormContainer");
    const emailLoginBtn = document.getElementById("emailLogin");
    const emailBackToLogin = document.getElementById("emailBackToLogin");
    const emailLoginForm = document.getElementById("emailLoginForm");
    const sendCodeBtn = document.getElementById("sendCodeBtn");

    // 切换到邮箱登录页面
    emailLoginBtn.addEventListener("click", function (e) {
        e.preventDefault();
        loginFormContainer.style.display = "none";
        registerFormContainer.style.display = "none";
        emailLoginFormContainer.style.display = "block";
    });

    // 返回登录页
    emailBackToLogin.addEventListener("click", function (e) {
        e.preventDefault();
        emailLoginFormContainer.style.display = "none";
        loginFormContainer.style.display = "block";
    });

    // 发送验证码按钮
    sendCodeBtn.addEventListener("click", async function () {
        const email = document.getElementById("emailAddress").value.trim();

        if (!email || !email.includes("@")) {
            alert("请输入有效的邮箱地址！");
            return;
        }

        // 禁用按钮防止重复点击
        sendCodeBtn.disabled = true;
        sendCodeBtn.textContent = "发送中...";

        try {
            const response = await fetch("http://localhost:5000/api/Auth/SendVerificationCode", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                // 开始60秒倒计时
                startCountdown(60);
            } else {
                alert(data.message || "发送验证码失败");
                sendCodeBtn.disabled = false;
                sendCodeBtn.textContent = "发送验证码";
            }
        } catch (error) {
            console.error("发送验证码错误:", error);
            alert("发送验证码过程中发生错误");
            sendCodeBtn.disabled = false;
            sendCodeBtn.textContent = "发送验证码";
        }
    });

    // 邮箱验证码登录提交
    emailLoginForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.getElementById("emailAddress").value.trim();
        const code = document.getElementById("emailCode").value.trim();

        if (!email || !code) {
            alert("请输入邮箱和验证码");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/Auth/LoginWithEmail", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, code })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '邮箱登录失败');
            }

            const data = await response.json();

            if (response.ok) {
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
                alert(data.message || "登录失败");
            }
        } catch (error) {
            console.error("邮箱登录错误:", error);
            alert("登录过程中发生错误");
        }
    });

    // 倒计时函数
    function startCountdown(seconds) {
        let remaining = seconds;
        sendCodeBtn.textContent = `${remaining}秒后重试`;

        const timer = setInterval(() => {
            remaining--;
            sendCodeBtn.textContent = `${remaining}秒后重试`;

            if (remaining <= 0) {
                clearInterval(timer);
                sendCodeBtn.disabled = false;
                sendCodeBtn.textContent = "发送验证码";
            }
        }, 1000);
    }
});