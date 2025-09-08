// Khi trang được load, kiểm tra đăng nhập, gán các sự kiện cho sidebar, tìm kiếm, logout và khởi tạo bảng
document.addEventListener("DOMContentLoaded", function () {
    // Kiểm tra trạng thái đăng nhập
    if (localStorage.getItem("isLoggedIn") !== "true") {
        window.location.href = "login.html";
    }

    // Xử lý đăng xuất 
    const logoutBtn = document.getElementById("logout");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            document.body.classList.add("fade-out");
            setTimeout(() => {
                localStorage.removeItem("isLoggedIn");
                window.location.href = "login.html";
            }, 500);
        });
    }

    // Đảm bảo modal ẩn khi trang tải bị ẩn 
    const editModal = document.getElementById('editModal');
    if (editModal) {
        editModal.classList.remove('show');
    }

    // Khởi tạo bảng
    updateTable();

    // Xử lý tìm kiếm ( theo email hoặc mã đặt chỗ)
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const query = this.value.toLowerCase();
            const filteredBookings = bookings.filter(b =>
                b.email.toLowerCase().includes(query) ||
                b.bookingCode.toLowerCase().includes(query)
            );
            updateTable(filteredBookings);
        });
    }

    // Gán sự kiện cho sidebar menu ( ở tab làm việc)
    const bookingMenu = document.querySelector(".sidebar-menu li:nth-child(1)");
    if (bookingMenu) {
        bookingMenu.addEventListener("click", function () {
            document.querySelector(".sidebar-menu li.active").classList.remove("active");
            bookingMenu.classList.add("active");

            document.querySelector(".main .table-container").style.display = "block";
            document.querySelector(".search-container").style.display = "block";
            document.getElementById("reportSection").style.display = "none";
        });
    }
// Gán sự kiện cho sidebar menu ( ở tab báo cáo)
    const reportMenu = document.querySelector(".sidebar-menu li:nth-child(2)");
    if (reportMenu) {
        reportMenu.addEventListener("click", function () {
            document.querySelector(".sidebar-menu li.active").classList.remove("active");
            reportMenu.classList.add("active");

            document.querySelector(".main .table-container").style.display = "none";
            document.querySelector(".search-container").style.display = "none";
            document.getElementById("reportSection").style.display = "block";

            updateReport();
        });
    }
});

// Dữ liệu mẫu bookings ( có thể thay thế bằng dữ liệu từ server API)
let bookings = [
    {
        id: 1,
        email: "nhtabuilong765",
        bookingCode: "BK001",
        date: "2023-10-01",
        startTime: "10:00",
        duration: "2 giờ",
        price: "200,000 VNĐ",
        status: "paid",
        statusActive: "active",
        image: ""
    }
];

// Hàm mở modal chỉnh sửa
function openEditModal(id, email, bookingCode, date, startTime, status, statusActive) {
    const editModal = document.getElementById('editModal');
    if (editModal) {
        editModal.classList.add('show');
        document.getElementById('modalTitle').textContent = 'Chỉnh sửa thông tin đặt chỗ';
        document.getElementById('editEmail').value = email || '';
        document.getElementById('editBookingCode').value = bookingCode || '';
        document.getElementById('editDate').value = date || '';
        document.getElementById('editStartTime').value = startTime || '';
        const currentBooking = bookings.find(b => b.id === id);
        document.getElementById('editDuration').value = currentBooking?.duration?.split(' ')[0] || '';
        document.getElementById('editPrice').value = currentBooking?.price?.replace(/[^0-9]/g, '') || '';
        document.getElementById('editStatus').value = status || 'pending';
        document.getElementById('editStatusActive').value = statusActive || 'active';
        document.getElementById('saveButton').setAttribute('onclick', `saveChanges(${id})`);
    }
}
// hàm lưu thay đổi khi chỉnh sửa
function saveChanges(id) {
    const editModal = document.getElementById('editModal');
    if (editModal) {
        const email = document.getElementById('editEmail').value;
        const bookingCode = document.getElementById('editBookingCode').value;
        const date = document.getElementById('editDate').value;
        const startTime = document.getElementById('editStartTime').value;
        const duration = document.getElementById('editDuration').value;
        const price = document.getElementById('editPrice').value;
        const status = document.getElementById('editStatus').value;
        const statusActive = document.getElementById('editStatusActive').value;
// tìm booking theo ID và cập nhật thông tin
        const booking = bookings.find(b => b.id === id);
        if (booking) {
            booking.email = email;
            booking.bookingCode = bookingCode;
            booking.date = date;
            booking.startTime = startTime;
            booking.duration = `${duration} giờ`;
            booking.price = `${parseInt(price).toLocaleString('vi-VN')} VNĐ`;
            booking.status = status;
            booking.statusActive = statusActive;
            updateTable(bookings);
        }

        closeEditModal();
    }
}

function closeEditModal() {
    const editModal = document.getElementById('editModal');
    if (editModal) {
        editModal.classList.remove('show');
    }
}

// Hàm cập nhật bảng với switch đẹp cho trạng thái hoạt động
function updateTable(data = bookings) {
    const tbody = document.getElementById('tableBody');
    if (tbody) {
        tbody.innerHTML = '';
        data.forEach((booking, index) => {
            const isActive = booking.statusActive === 'active';
            const statusSwitch = `
                <label class="switch${isActive ? '' : ' inactive'}">
                    <input type="checkbox" class="toggle-status" data-id="${booking.id}" ${isActive ? 'checked' : ''}>
                    <span class="slider"></span>
                    <span class="switch-label">${isActive ? 'Hoạt động' : 'Không hoạt động'}</span>
                </label>
            `;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${booking.email}</td>
                <td>${booking.bookingCode}</td>
                <td>${new Date(booking.date).toLocaleDateString('vi-VN')}</td>
                <td><img src="${booking.image}" alt="Ảnh" class="w-12 h-12 rounded"></td>
                <td>${booking.startTime}</td>
                <td>${booking.duration}</td>
                <td>${booking.price}</td>
                <td><span class="status ${booking.status}">${booking.status.replace('vip-paid', 'VIP - Đã thanh toán').replace('paid', 'Đã thanh toán').replace('pending', 'Chưa thanh toán').replace('cancel', 'Đã hủy')}</span></td>
                <td>${statusSwitch}</td>
                <td>
                    <button class="btn btn-edit">Chỉnh sửa</button>
                    <button class="btn btn-secondary ml-2">Xóa</button>
                </td>
            `;
            tbody.appendChild(row);
        });

        // Gắn sự kiện cho nút trạng thái hoạt động
        document.querySelectorAll('.toggle-status').forEach(input => {
            input.onchange = function () {
                const id = Number(input.getAttribute('data-id'));
                const booking = bookings.find(b => b.id === id);
                if (booking) {
                    booking.statusActive = input.checked ? 'active' : 'inactive';
                    updateTable(bookings);
                }
            };
        });

        // Gắn event listeners cho nút chỉnh sửa và xóa
        document.querySelectorAll('.btn-edit').forEach((btn, index) => {
            btn.onclick = function () {
                const booking = data[index];
                openEditModal(
                    booking.id,
                    booking.email,
                    booking.bookingCode,
                    booking.date,
                    booking.startTime,
                    booking.status,
                    booking.statusActive
                );
            };
        });
        document.querySelectorAll('.btn-secondary').forEach((btn, index) => {
            btn.onclick = function () {
                deleteBooking(data[index].id);
            };
        });
    }
}

// Hàm xóa đặt chỗ
function deleteBooking(id) {
    if (confirm("Bạn có chắc chắn muốn xóa đặt chỗ này không?")) {
        bookings = bookings.filter(b => b.id !== id);
        updateTable(bookings);
        updateReport();
    }
}

// Hàm cập nhật báo cáo doanh thu
function updateReport() {
    const totalBookings = bookings.length;
    const paidBookings = bookings.filter(b => b.status === "paid" || b.status === "vip-paid");
    const totalRevenue = paidBookings.reduce((sum, b) => {
        return sum + parseInt(b.price.replace(/[^0-9]/g, ""));
    }, 0);

    document.getElementById("totalBookings").textContent = totalBookings;
    document.getElementById("paidBookings").textContent = paidBookings.length;
    document.getElementById("totalRevenue").textContent = totalRevenue.toLocaleString("vi-VN") + " VNĐ";
}