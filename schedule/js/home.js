// 实时显示当前日期和时间
        function updateTime() {
            const now = new Date();
            
            // 获取年月日
            const year = now.getFullYear();
            const month = (now.getMonth() + 1).toString().padStart(2, '0'); // 月份从0开始
            const day = now.getDate().toString().padStart(2, '0');
            
            // 获取时分秒
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');
            
            // 组合完整的日期和时间字符串
            const dateString = `${year}-${month}-${day}`;
            const timeString = `${hours}:${minutes}:${seconds}`;
            
            // 显示日期和时间
            document.getElementById('current-time').textContent = `${dateString} ${timeString}`;
        }

        // 每秒更新一次时间
        setInterval(updateTime, 1000);
        updateTime(); // 页面加载时立即显示时间