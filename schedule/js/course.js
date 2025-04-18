const courseList = [
    {
        name: "高等数学",
        teacher: "张老师",
        location: "教学楼101",
        courseTime: "周三 09:00 - 11:00",
        addedAt: new Date().toLocaleString()
    },
    {
        name: "基础物理",
        teacher: "李老师",
        location: "教学楼101",
        courseTime: "周五 08:00 - 08:45",
        addedAt: new Date().toLocaleString()
    },
    {
        name: "离散数学",
        teacher: "吴老师",
        location: "教学楼101",
        courseTime: "周一 10:00 - 12:00",
        addedAt: new Date().toLocaleString()
    },
    {
        name: "数据结构",
        teacher: "里屋",
        location: "教学楼101",
        courseTime: "周一 10:00 - 12:00",
        addedAt: new Date().toLocaleString()
    },
    {
        name: "C++",
        teacher: "茉莉",
        location: "教学楼101",
        courseTime: "周一 10:00 - 12:00",
        addedAt: new Date().toLocaleString()
    }
];

let courseCurrentPage = 1;
const courseItemsPerPage = 5;

//初始化页面
window.onload = function () {
    renderCourses(); // 页面加载时，渲染课程列表（哪怕为空）
};

// 添加课程弹窗控制
function openAddCourseModal() {
    document.getElementById("add-course-modal").style.display = "block";
}

function closeAddCourseModal() {
    document.getElementById("add-course-modal").style.display = "none";
}

// 添加课程
function addCourse() {
    const name = document.getElementById("modal-course-name").value.trim();
    const teacher = document.getElementById("modal-course-teacher").value.trim();
    const location = document.getElementById("modal-course-location").value.trim();
    const courseTime = document.getElementById("modal-course-time").value.trim();

    if (!name || !teacher || !location || !courseTime) {
        alert("请填写完整课程信息");
        return;
    }

    const course = {
        name,
        teacher,
        location,
        courseTime,
        addedAt: new Date().toLocaleString()
    };

    courseList.unshift(course);
    courseCurrentPage = 1;
    renderCourses();
    closeAddCourseModal();

    document.getElementById("modal-course-name").value = "";
    document.getElementById("modal-course-teacher").value = "";
    document.getElementById("modal-course-location").value = "";
    document.getElementById("modal-course-time").value = "";
}

// 打开教务导入弹窗
function openJiaowuImportModal() {
    document.getElementById("jiaowu-import-modal").style.display = "block";
}

function closeJiaowuImportModal() {
    document.getElementById("jiaowu-import-modal").style.display = "none";
}

function importFromJiaowu() {
    const url = document.getElementById("jiaowu-url").value.trim();
    if (!url) {
        alert("请输入网址");
        return;
    }
    alert("将使用 HtmlAgilityPack 抓取网址: " + url);
    closeJiaowuImportModal();
}

// 打开本地导入弹窗
function openLocalImportModal() {
    document.getElementById("local-import-modal").style.display = "block";
}

function closeLocalImportModal() {
    document.getElementById("local-import-modal").style.display = "none";
}

function importFromLocal() {
    const fileInput = document.getElementById("local-file");
    if (!fileInput.files.length) {
        alert("请选择Excel文件");
        return;
    }
    alert("将使用 EPPlus 解析文件: " + fileInput.files[0].name);
    closeLocalImportModal();
}

// 渲染课程
function renderCourses() {
    const container = document.getElementById("course-list");
    container.innerHTML = "";

    const start = (courseCurrentPage - 1) * courseItemsPerPage;
    const end = start + courseItemsPerPage;
    const currentCourses = courseList.slice(start, end);

    currentCourses.forEach((course, index) => {
        const item = document.createElement("div");
        item.className = "course-item";
        item.innerHTML = `
    <input type="checkbox" class="course-checkbox" data-index="${start + index}">
    <h4>${course.name}</h4>
    <p>任课教师：${course.teacher}</p>
    <p>上课地点：${course.location}</p>
    <p>上课时间：${course.courseTime}</p>
    <p>添加时间：${course.addedAt}</p>
`;
        container.appendChild(item);
    });

    renderCoursePagination();
}

// 分页
function renderCoursePagination() {
    const pagination = document.getElementById("course-pagination");
    pagination.innerHTML = "";

    const totalPages = Math.ceil(courseList.length / courseItemsPerPage);

    const prev = document.createElement("button");
    prev.textContent = "上一页";
    prev.onclick = () => {
        if (courseCurrentPage > 1) {
            courseCurrentPage--;
            renderCourses();
        }
    };
    pagination.appendChild(prev);

    for (let i = 1; i <= totalPages; i++) {
        const page = document.createElement("button");
        page.textContent = i;
        page.className = i === courseCurrentPage ? "active" : "";
        page.onclick = () => {
            courseCurrentPage = i;
            renderCourses();
        };
        pagination.appendChild(page);
    }

    const next = document.createElement("button");
    next.textContent = "下一页";
    next.onclick = () => {
        if (courseCurrentPage < totalPages) {
            courseCurrentPage++;
            renderCourses();
        }
    };
    pagination.appendChild(next);
}

//删除选中
function deleteSelectedCourses() {
    const checkboxes = document.querySelectorAll(".course-checkbox:checked");

    if (checkboxes.length === 0) {
        alert("请先选择要删除的课程");
        return;
    }

    if (!confirm("确定要删除选中的课程吗？")) return;

    const indexesToDelete = Array.from(checkboxes).map(cb => parseInt(cb.dataset.index));

    // 按照索引从后往前删，防止索引错位
    indexesToDelete.sort((a, b) => b - a).forEach(index => {
        courseList.splice(index, 1);
    });

    renderCourses();
}
