const scheduleResources = [
    {
        id: 1,
        name: "吃饭",
        content: "记得按时吃饭",
        deadline: "",
        addedDate: new Date().toLocaleString()
    },
    {
        id: 2,
        name: "睡觉",
        content: "保证充足睡眠",
        deadline: "",
        addedDate: new Date().toLocaleString()
    },
    {
        id: 3,
        name: "写作业",
        content: "完成数学作业",
        deadline: "2023-12-31",
        addedDate: new Date().toLocaleString()
    }, {
        id: 4,
        name: "打豆豆~~",
        content: "摸鱼放水睡懒觉，好好好",
        deadline: "",
        addedDate: new Date().toLocaleString()
    },
    {
        id: 5,
        name: "购物 shopping",
        content: "Go Go Go 出发喽",
        deadline: "",
        addedDate: new Date().toLocaleString()
    },
    {
        id: 6,
        name: "干饭人",
        content: "世间唯有美食不可辜负也~~",
        deadline: "2023-12-31",
        addedDate: new Date().toLocaleString()
    }
]; // 储存日程项
let scheduleCurrentPage = 1;
const scheduleItemsPerPage = 5;

//初始化页面
window.onload = function () {
    renderScheduleResources(); // 页面加载时，渲染日程列表（哪怕为空）
};

// 添加日程
function addSchedule() {
    const name = document.getElementById('schedule-name').value.trim();
    const content = document.getElementById('schedule-content').value.trim();
    const deadline = document.getElementById('schedule-deadline').value;

    if (!name || !content) {
        alert("日程名称和内容不能为空！");
        return;
    }

    const now = new Date();
    const addedDate = now.toLocaleString();

    scheduleResources.unshift({
        id: Date.now(),
        name,
        content,
        deadline,
        addedDate
    });

    scheduleCurrentPage = 1;
    renderScheduleResources();

    // 清空输入框
    document.getElementById('schedule-name').value = '';
    document.getElementById('schedule-content').value = '';
    document.getElementById('schedule-deadline').value = '';
}

// 渲染日程项
function renderScheduleResources() {
    const container = document.getElementById('schedule-list');
    container.innerHTML = '';

    const start = (scheduleCurrentPage - 1) * scheduleItemsPerPage;
    const end = start + scheduleItemsPerPage;
    const currentSchedules = scheduleResources.slice(start, end);

    currentSchedules.forEach(item => {
        const div = document.createElement('div');
        div.className = 'schedule-item';
        div.innerHTML = `
            <input type="checkbox" data-id="${item.id}">
            <h4>${item.name}</h4>
            <p>${item.content}</p>
            ${item.deadline ? `<p>截止时间：${item.deadline}</p>` : ''}
            <p>添加时间：${item.addedDate}</p>
        `;
        container.appendChild(div);
    });

    renderSchedulePagination();
}

// 渲染分页
function renderSchedulePagination() {
    const pagination = document.getElementById('schedule-pagination');
    pagination.innerHTML = '';

    const totalPages = Math.ceil(scheduleResources.length / scheduleItemsPerPage);

    const prevBtn = document.createElement('button');
    prevBtn.innerText = '上一页';
    prevBtn.onclick = () => {
        if (scheduleCurrentPage > 1) {
            scheduleCurrentPage--;
            renderScheduleResources();
        }
    };
    pagination.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.innerText = i;
        btn.className = scheduleCurrentPage === i ? 'active' : '';
        btn.onclick = () => {
            scheduleCurrentPage = i;
            renderScheduleResources();
        };
        pagination.appendChild(btn);
    }

    const nextBtn = document.createElement('button');
    nextBtn.innerText = '下一页';
    nextBtn.onclick = () => {
        if (scheduleCurrentPage < totalPages) {
            scheduleCurrentPage++;
            renderScheduleResources();
        }
    };
    pagination.appendChild(nextBtn);
}

// 删除选中日程
function deleteSelectedSchedules() {
    const checkboxes = document.querySelectorAll('.schedule-item input[type="checkbox"]:checked');
    const idsToDelete = Array.from(checkboxes).map(cb => parseInt(cb.dataset.id));
    if (idsToDelete.length === 0) {
        alert('请先勾选要删除的日程');
        return;
    }

    scheduleResources = scheduleResources.filter(item => !idsToDelete.includes(item.id));
    renderScheduleResources();
}
