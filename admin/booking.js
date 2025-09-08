const API_BASE = "http://192.168.1.19:6868";
let bookings = [];

// Hàm lấy dữ liệu bookings từ API
async function fetchBookings() {
    try {
        const response = await fetch(`${API_BASE}/bookings`);
        if (!response.ok) throw new Error(`Lỗi API: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Không thể tải dữ liệu bookings:", error);
        return [];
    }
}

// Khi trang được load, kiểm tra đăng nhập, gán các sự kiện cho sidebar, tìm kiếm, logout và khởi tạo bảng
document.addEventListener("DOMContentLoaded", async function () {
    if (localStorage.getItem("isLoggedIn") !== "true") {
        window.location.href = "login.html";
    }

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

    const editModal = document.getElementById('editModal');
    if (editModal) editModal.classList.remove('show');

    bookings = await fetchBookings();
    updateTable(bookings);
    updateReport();

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

    // Lấy các phần tử menu
    const menuItems = document.querySelectorAll('.sidebar-menu li');
    const bookingSection = document.querySelector('.main .table-container');
    const searchSection = document.querySelector('.search-container');
    const reportSection = document.getElementById('reportSection');
    const pageTitle = document.querySelector('.page-title');

    if (menuItems.length >= 2) {
        // Đặt chỗ làm việc
        menuItems[0].addEventListener('click', function () {
            menuItems.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
            // Lấy lại DOM mỗi lần click
            const bookingSection = document.querySelector('.main .table-container');
            const searchSection = document.querySelector('.search-container');
            const reportSection = document.getElementById('reportSection');
            const pageTitle = document.querySelector('.page-title');
            if (bookingSection) bookingSection.style.display = 'block';
            if (searchSection) searchSection.style.display = 'block';
            if (reportSection) reportSection.style.display = 'none';
            if (pageTitle) pageTitle.textContent = 'Đặt chỗ làm việc';
        });

        // Báo cáo & Doanh thu
        menuItems[1].addEventListener('click', function () {
            menuItems.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
            // Lấy lại DOM mỗi lần click
            const bookingSection = document.querySelector('.main .table-container');
            const searchSection = document.querySelector('.search-container');
            const reportSection = document.getElementById('reportSection');
            const pageTitle = document.querySelector('.page-title');
            if (bookingSection) bookingSection.style.display = 'none';
            if (searchSection) searchSection.style.display = 'none';
            if (reportSection) reportSection.style.display = 'block';
            if (pageTitle) pageTitle.textContent = 'Báo cáo Doanh thu';
        });
    }
});

// Hàm mở modal chỉnh sửa
function openEditModal(id, email, bookingCode, date, startTime, status, statusActive) {
    const editModal = document.getElementById('editModal');
    if (editModal) {
        editModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 id="modalTitle" class="modal-title">Chỉnh sửa thông tin đặt chỗ</h3>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="editEmail" class="form-label">Email</label>
                        <input type="text" id="editEmail" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="editBookingCode" class="form-label">Mã đặt chỗ</label>
                        <input type="text" id="editBookingCode" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="editDate" class="form-label">Ngày</label>
                        <input type="date" id="editDate" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="editStartTime" class="form-label">Giờ bắt đầu</label>
                        <input type="time" id="editStartTime" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="editDuration" class="form-label">Thời lượng (giờ)</label>
                        <input type="number" id="editDuration" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="editPrice" class="form-label">Giá gói (VNĐ)</label>
                        <input type="number" id="editPrice" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="editStatus" class="form-label">Trạng thái thanh toán</label>
                        <select id="editStatus" class="form-control">
                            <option value="paid">Đã thanh toán</option>
                            <option value="pending">Chưa thanh toán</option>
                            <option value="vip-paid">VIP - Đã thanh toán</option>
                            <option value="cancel">Đã hủy</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="editStatusActive" class="form-label">Trạng thái hoạt động</label>
                        <select id="editStatusActive" class="form-control">
                            <option value="active">Hoạt động</option>
                            <option value="inactive">Không hoạt động</option>
                        </select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button id="saveButton" class="btn btn-primary">Lưu</button>
                    <button onclick="closeEditModal()" class="btn btn-secondary">Hủy</button>
                </div>
            </div>
        `;
        editModal.classList.add('show');
        document.getElementById('editEmail').value = email || '';
        document.getElementById('editBookingCode').value = bookingCode || '';
        document.getElementById('editDate').value = date || '';
        document.getElementById('editStartTime').value = startTime || '';
        const currentBooking = bookings.find(b => b.id === id);
        document.getElementById('editDuration').value = currentBooking?.duration?.split(' ')[0] || '';
        document.getElementById('editPrice').value = currentBooking?.price?.replace(/[^0-9]/g, '') || '';
        document.getElementById('editStatus').value = status || 'pending';
        document.getElementById('editStatusActive').value = statusActive || 'active';
        document.getElementById('saveButton').onclick = function () {
            saveChanges(id);
        };
    }
}

// Hàm lưu thay đổi khi chỉnh sửa (gọi API PUT)
async function saveChanges(id) {
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

        const updatedBooking = {
            email,
            bookingCode,
            date,
            startTime,
            duration: `${duration} giờ`,
            price: `${parseInt(price).toLocaleString('vi-VN')} VNĐ`,
            status,
            statusActive
        };

        try {
            const response = await fetch(`${API_BASE}/bookings/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedBooking)
            });
            if (!response.ok) throw new Error('Cập nhật thất bại');
            bookings = await fetchBookings();
            updateTable(bookings);
            updateReport();
        } catch (err) {
            alert('Không thể cập nhật trên server!');
        }

        closeEditModal();
    }
}

// Hàm đóng modal chỉnh sửa
function closeEditModal() {
    const editModal = document.getElementById('editModal');
    if (editModal) {
        editModal.classList.remove('show');
        editModal.innerHTML = '';
    }
}

// Hàm cập nhật bảng với switch đẹp cho trạng thái hoạt động
function updateTable(data = bookings) {
    const tbody = document.getElementById('tableBody');
    if (!tbody) return;
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
            <td><img src="${booking.image || ''}" alt="Ảnh" class="w-12 h-12 rounded"></td>
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

    // Gắn sự kiện cho switch trạng thái hoạt động (gọi API PATCH)
    document.querySelectorAll('.toggle-status').forEach(input => {
        input.onchange = async function () {
            const id = Number(input.getAttribute('data-id'));
            const booking = bookings.find(b => b.id === id);
            if (booking) {
                const newStatus = input.checked ? 'active' : 'inactive';
                try {
                    const response = await fetch(`${API_BASE}/bookings/${id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ statusActive: newStatus })
                    });
                    if (!response.ok) throw new Error('Cập nhật trạng thái thất bại');
                    booking.statusActive = newStatus;
                    updateTable(bookings);
                } catch (err) {
                    alert('Không thể cập nhật trạng thái trên server!');
                    input.checked = !input.checked;
                }
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

// Hàm xóa đặt chỗ (gọi API DELETE)
async function deleteBooking(id) {
    if (confirm("Bạn có chắc chắn muốn xóa đặt chỗ này không?")) {
        try {
            const response = await fetch(`${API_BASE}/bookings/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Xóa thất bại');
            bookings = await fetchBookings();
            updateTable(bookings);
            updateReport();
        } catch (err) {
            alert('Không thể xóa trên server!');
        }
    }
}

// Hàm cập nhật báo cáo doanh thu
function updateReport() {
    const totalBookings = bookings.length;
    const paidBookings = bookings.filter(b => b.status === "paid" || b.status === "vip-paid");
    const totalRevenue = paidBookings.reduce((sum, b) => {
        return sum + parseInt(b.price.replace(/[^0-9]/g, ""));
    }, 0);

    const totalBookingsEl = document.getElementById("totalBookings");
    const paidBookingsEl = document.getElementById("paidBookings");
    const totalRevenueEl = document.getElementById("totalRevenue");
    if (totalBookingsEl) totalBookingsEl.textContent = totalBookings;
    if (paidBookingsEl) paidBookingsEl.textContent = paidBookings.length;
    if (totalRevenueEl) totalRevenueEl.textContent = totalRevenue.toLocaleString("vi-VN") + " VNĐ";
}
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

