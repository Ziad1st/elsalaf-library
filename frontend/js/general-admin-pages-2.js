document.addEventListener('DOMContentLoaded', () => {
    const pageTitle = document.getElementById('page-title');
    const pageIcon = document.getElementById('page-icon');
    const path = window.location.pathname;

    const pageData = {
        'admin-index.html': { title: 'لوحة التحكم', icon: 'fa-chart-pie' },
        'admin-books.html': { title: 'إدارة المكتبة', icon: 'fa-book-bookmark' },
        'admin-users.html': { title: 'شؤون المستخدمين', icon: 'fa-user-gear' }
    };

    // البحث عن الصفحة الحالية وتحديث البيانات
    for (const [file, data] of Object.entries(pageData)) {
        if (path.includes(file)) {
            pageTitle.innerText = data.title;
            pageIcon.className = `fa-solid ${data.icon} text-lg`;
            break;
        }
    }
});

const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menu-toggle');
const overlay = document.getElementById('overlay');

function toggleSidebar() {
    console.log("toggled")
    const isHidden = sidebar.classList.contains('translate-x-full');
    
    if (isHidden) {
        sidebar.classList.remove('hidden', 'translate-x-full');
        sidebar.classList.add('flex', 'translate-x-0');
        overlay.classList.remove('hidden');
        overlay.classList.add('opacity-100');
    } else {
        sidebar.classList.add('translate-x-full');
        sidebar.classList.remove('translate-x-0');
        overlay.classList.add('hidden');
        setTimeout(() => sidebar.classList.add('hidden'), 300);
    }
}

menuToggle.addEventListener('click', toggleSidebar);
overlay.addEventListener('click', toggleSidebar);
