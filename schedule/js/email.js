const emailLoginFormContainer = document.getElementById("emailLoginFormContainer");
const emailLoginBtn = document.getElementById("emailLogin");
const emailBackToLogin = document.getElementById("emailBackToLogin");

// 邮箱验证码用变量（仅前端演示）
let generatedCode = null;
let emailCodeTarget = "";

// 切换到邮箱登录页面
emailLoginBtn.addEventListener("click", function () {
    loginFormContainer.style.display = "none";
    registerFormContainer.style.display = "none";
    emailLoginFormContainer.style.display = "block";
});

// 返回登录页
emailBackToLogin.addEventListener("click", function () {
    emailLoginFormContainer.style.display = "none";
    loginFormContainer.style.display = "block";
});

// 发送验证码按钮
document.getElementById("sendCodeBtn").addEventListener("click", function () {
    const email = document.getElementById("emailAddress").value.trim();
    if (!email || !email.includes("@")) {
        alert("请输入有效的邮箱地址！");
        return;
    }

    // 模拟生成验证码
    generatedCode = String(Math.floor(10000 + Math.random() * 90000));
    emailCodeTarget = email;

    // 使用 EmailJS 发送验证码邮件
    const templateParams = {
        to_email: email,  // 收件人邮箱地址
        subject: "验证码登录",  // 邮件主题
        message: `您的验证码是：${generatedCode}`  // 邮件内容
    };

    // 发送邮件
    emailjs.send("service_yourServiceID", "template_yourTemplateID", templateParams)
        .then(function (response) {
            alert(`验证码已发送至：${email}（模拟验证码为：${generatedCode}）`);
        }, function (error) {
            alert("验证码发送失败，请稍后再试。");
        });
});

// 邮箱验证码登录提交
document.getElementById("emailLoginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("emailAddress").value.trim();
    const codeInput = document.getElementById("emailCode").value.trim();

    if (email !== emailCodeTarget || codeInput !== generatedCode) {
        alert("验证码错误或邮箱不匹配！");
        return;
    }

    // 查找是否绑定了该邮箱的用户
    let userFound = null;
    for (const [username, info] of Object.entries(userDatabase)) {
        if (info.email === email) {
            userFound = username;
            break;
        }
    }

    if (userFound) {
        alert(`欢迎回来，${userFound}！`);
    } else {
        alert("登录成功！（该邮箱未绑定账号，将以临时用户登录）");
    }

    window.location.href = "HomePage.html";
});