document.addEventListener("DOMContentLoaded", function () {
    // Kiểm tra trạng thái đăng nhập
    if (localStorage.getItem("isLoggedIn") !== "true") {
        window.location.href = "login.html";
    }

    // Xử lý đăng xuất
    const logoutBtn = document.getElementById("logout");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            document.body.classList.add("fade-out"); // Add fade-out class
            setTimeout(() => {
                localStorage.removeItem("isLoggedIn");
                window.location.href = "login.html";
            }, 500); // Match this duration with CSS transition
        });
    }

    // Đảm bảo modal ẩn khi trang tải
    const editModal = document.getElementById('editModal');
    if (editModal) {
        editModal.classList.remove('show');
    }

    // Khởi tạo bảng
    updateTable();

    // Xử lý tìm kiếm
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
});

// Gọi API từ backend để lấy dữ liệu booking ( thêm giúp tui nhé)
let bookings = []
   

function openEditModal(id, email, bookingCode, date, startTime, status) {
    const editModal = document.getElementById('editModal');
    if (editModal) {
        editModal.classList.add('show');
        document.getElementById('modalTitle').textContent = 'Chỉnh sửa thông tin đặt chỗ';
        document.getElementById('editEmail').value = email || '';
        document.getElementById('editBookingCode').value = bookingCode || '';
        document.getElementById('editDate').value = date || '';
        document.getElementById('editStartTime').value = startTime || '';
        
        // Tìm thông tin đặt chỗ để lấy thời lượng và giá ở dạng thô 
        const currentBooking = bookings.find(b => b.id === id);
        document.getElementById('editDuration').value = currentBooking?.duration?.split(' ')[0] || '';
        document.getElementById('editPrice').value = currentBooking?.price?.replace(/[^0-9]/g, '') || '';
        
        document.getElementById('editStatus').value = status || 'pending';
        document.getElementById('saveButton').setAttribute('onclick', `saveChanges(${id})`);
    }
}

function closeEditModal() {
    const editModal = document.getElementById('editModal');
    if (editModal) {
        editModal.classList.remove('show');
    }
}

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

        const booking = bookings.find(b => b.id === id);
        if (booking) {
            booking.email = email;
            booking.bookingCode = bookingCode;
            booking.date = date;
            booking.startTime = startTime;
            booking.duration = `${duration} giờ`;
            // Ensure price is a number before formatting
            booking.price = `${parseInt(price).toLocaleString('vi-VN')} VNĐ`; 
            booking.status = status;
            updateTable(bookings);
        }

        closeEditModal();
    }
}

function deleteBooking(id) {
    // xác nhận lần nữa trước khi xóa 
    if (confirm("Bạn có chắc chắn muốn xóa đặt chỗ này không?")) {
        bookings = bookings.filter(b => b.id !== id);
        updateTable(bookings);
    }
}

function updateTable(data = bookings) {
    const tbody = document.getElementById('tableBody');
    if (tbody) {
        tbody.innerHTML = ''; 
        data.forEach((booking, index) => {
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
                <td>
                    <button class="btn btn-edit">Chỉnh sửa</button>
                    <button class="btn btn-secondary ml-2">Xóa</button>
                </td>
            `;
            tbody.appendChild(row);
        });

        // Gắn event listeners sau khi bảng được cập nhật
        document.querySelectorAll('.btn-edit').forEach((btn, index) => {
            btn.onclick = function () {
                const booking = data[index];
                openEditModal(booking.id, booking.email, booking.bookingCode, booking.date, booking.startTime, booking.status);
            };
        });
        document.querySelectorAll('.btn-secondary').forEach((btn, index) => {
            btn.onclick = function () {
                deleteBooking(data[index].id);
            };
        });
    }
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
    

