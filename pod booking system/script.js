window.onload = function() {
  if (localStorage.getItem('loggedIn') === 'true') {
    showMainContent();
    showDashboard();
    hideSectionsAfterLogin();
  }
};

function showMainContent() {
  document.querySelectorAll('.auth-buttons .login, .auth-buttons .signup, .mobile-menu .login, .mobile-menu .signup').forEach(el => el.classList.add('hidden'));
  document.getElementById('logoutLink').classList.remove('hidden');
  document.getElementById('mobileLogoutLink').classList.remove('hidden');
  document.getElementById('userInfo').textContent = 'Chào, ' + localStorage.getItem('userEmail') + ' | ';
  document.querySelector('.auth-buttons').classList.add('hidden');
}

function showDashboard() {
  document.getElementById('hero').classList.add('hidden');
  document.getElementById('dashboard').classList.remove('hidden');
  document.getElementById('dashboardUserName').textContent = localStorage.getItem('userEmail');
  updateRecentBookings();
}

function hideSectionsAfterLogin() {
  document.getElementById('features').classList.add('hidden');
  document.getElementById('pricing').classList.add('hidden');
  document.getElementById('about').classList.add('hidden');
  document.getElementById('contact').classList.add('hidden');
  document.querySelectorAll('nav a, .mobile-menu a').forEach(link => {
    if (link.getAttribute('href') === '#features' || link.getAttribute('href') === '#pricing' || link.getAttribute('href') === '#about' || link.getAttribute('href') === '#contact') {
      link.classList.add('hidden');
    }
  });
}

function updateRecentBookings() {
  const recentBookings = document.getElementById('recent-bookings');
  recentBookings.innerHTML = '';
  mockUserBookings.forEach((booking, index) => {
    const li = document.createElement('li');
    li.textContent = `${booking.date} - Loại POD: ${booking.podType.toUpperCase()}`;
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Xóa';
    deleteButton.addEventListener('click', () => {
      mockUserBookings.splice(index, 1);
      updateRecentBookings();
      showNotification('Xóa lịch sử đặt chỗ thành công!');
    });
    li.appendChild(deleteButton);
    recentBookings.appendChild(li);
  });
}

function logout() {
  localStorage.removeItem('loggedIn');
  localStorage.removeItem('userEmail');
  document.querySelectorAll('.auth-buttons .login, .auth-buttons .signup, .mobile-menu .login, .mobile-menu .signup').forEach(el => el.classList.remove('hidden'));
  document.getElementById('logoutLink').classList.add('hidden');
  document.getElementById('mobileLogoutLink').classList.add('hidden');
  document.getElementById('userInfo').textContent = '';
  document.querySelector('.auth-buttons').classList.remove('hidden');
  document.getElementById('hero').classList.remove('hidden');
  document.getElementById('dashboard').classList.add('hidden');
  document.getElementById('features').classList.remove('hidden');
  document.getElementById('pricing').classList.remove('hidden');
  document.getElementById('about').classList.remove('hidden');
  document.getElementById('contact').classList.remove('hidden');
  document.querySelectorAll('nav a, .mobile-menu a').forEach(link => link.classList.remove('hidden'));
  showNotification('Đăng xuất thành công!');
}

document.getElementById('logoutLink').addEventListener('click', (e) => {
  e.preventDefault();
  logout();
});

document.getElementById('mobileLogoutLink').addEventListener('click', (e) => {
  e.preventDefault();
  logout();
});

const sidebarToggle = document.getElementById('sidebar-toggle');
sidebarToggle.addEventListener('click', () => {
  document.querySelector('.sidebar').classList.toggle('active');
});

const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
mobileMenuButton.addEventListener('click', () => {
  mobileMenu.classList.toggle('active');
});

document.querySelectorAll('.learn-more').forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
  });
});

const loginButtons = document.querySelectorAll('.login');
const signupButtons = document.querySelectorAll('.signup');
const bookNowButtons = document.querySelectorAll('.book-now');
const bookPodButtons = document.querySelectorAll('.book-pod');
const manageScheduleButtons = document.querySelectorAll('.manage-schedule');
const managePackageButtons = document.querySelectorAll('.manage-package');
const customizeInterfaceButtons = document.querySelectorAll('.customize-interface');
const loginModal = document.getElementById('login-modal');
const signupModal = document.getElementById('signup-modal');
const bookingModal = document.getElementById('booking-modal');
const scheduleModal = document.getElementById('schedule-modal');
const packageModal = document.getElementById('package-modal');
const customizeModal = document.getElementById('customize-modal');
const closeLoginModal = document.getElementById('close-login-modal');
const closeSignupModal = document.getElementById('close-signup-modal');
const closeBookingModal = document.getElementById('close-booking-modal');
const closeScheduleModal = document.getElementById('close-schedule-modal');
const closePackageModal = document.getElementById('close-package-modal');
const closeCustomizeModal = document.getElementById('close-customize-modal');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const bookingForm = document.getElementById('booking-form');
const scheduleForm = document.getElementById('schedule-form');
const packageForm = document.getElementById('package-form');
const customizeForm = document.getElementById('customize-form');
const bookingDate = document.getElementById('booking-date');
const bookingAvailableSlots = document.getElementById('booking-available-slots');
const bookingAvailableSlotsList = document.getElementById('booking-available-slots-list');
const bookingTime = document.getElementById('booking-time');
const bookingDuration = document.getElementById('booking-duration');
const bookingPodType = document.getElementById('booking-pod-type');
const bookingPriceEstimate = document.getElementById('booking-price-estimate');
const bookingEstimatedPrice = document.getElementById('booking-estimated-price');
const scheduleDate = document.getElementById('schedule-date');
const scheduleTime = document.getElementById('schedule-time');
const scheduleTask = document.getElementById('schedule-task');
const scheduleList = document.getElementById('schedule-list');
const scheduleListItems = document.getElementById('schedule-list-items');
const packageType = document.getElementById('package-type');
const packageDuration = document.getElementById('package-duration');
const packageList = document.getElementById('package-list');
const packageListItems = document.getElementById('package-list-items');
const customizeColor = document.getElementById('customize-color');
const customizeFont = document.getElementById('customize-font');
const notification = document.getElementById('notification');

const mockAvailability = {};

let mockSchedule = [];// dùng hàm gọi api ở chỗ này nha mấy mẹ

let mockPackages = [
  { type: 'hour', duration: 5, price: 150000 },
  { type: 'day', duration: 1, price: 200000 },
];

let mockUserBookings = [
  { date: '2025-09-05', podType: 'standard' },
  { date: '2025-09-06', podType: 'premium' },
];

const pricing = {
  standard: 30000,
  premium: 45000,
  vip: 60000
};

function showNotification(message, type = 'success') {
  notification.textContent = message;
  notification.className = `notification ${type} active`;
  notification.style.display = 'block';
  setTimeout(() => {
    notification.className = 'notification';
    notification.style.display = 'none';
  }, 5000);
}

function updateAvailableSlots(date, slotsContainer, slotsList, timeInput) {
  slotsList.innerHTML = '';
  const slots = mockAvailability[date] || [];
  if (slots.length > 0) {
    slots.forEach(slot => {
      const li = document.createElement('li');
      li.textContent = slot;
      li.addEventListener('click', () => {
        timeInput.value = slot;
        slotsList.querySelectorAll('li').forEach(item => item.classList.remove('selected'));
        li.classList.add('selected');
        showNotification('Đã chọn giờ: ' + slot);
      });
      slotsList.appendChild(li);
    });
    slotsContainer.style.display = 'block';
  } else {
    slotsContainer.style.display = 'none';
    timeInput.value = '';
    showNotification('Không có khung giờ trống cho ngày này', 'error');
  }
}

function calculatePrice(durationSelect, podTypeSelect, priceEstimate, estimatedPrice) {
  const duration = parseInt(durationSelect.value) || 0;
  const podType = podTypeSelect.value;
  if (duration && podType) {
    const price = pricing[podType] * duration;
    estimatedPrice.textContent = price.toLocaleString('vi-VN') + '₫';
    priceEstimate.style.display = 'block';
  } else {
    priceEstimate.style.display = 'none';
  }
}

function updateScheduleList() {
  scheduleListItems.innerHTML = '';
  mockSchedule.forEach((item, index) => {
    const li = document.createElement('li');
    li.textContent = `${item.date} ${item.time} - ${item.task}`;
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Xóa';
    deleteButton.addEventListener('click', () => {
      mockSchedule.splice(index, 1);
      updateScheduleList();
      showNotification('Xóa lịch làm việc thành công!');
    });
    li.appendChild(deleteButton);
    scheduleListItems.appendChild(li);
  });
  scheduleList.style.display = mockSchedule.length > 0 ? 'block' : 'none';
}

function updatePackageList() {
  packageListItems.innerHTML = '';
  mockPackages.forEach((item, index) => {
    const li = document.createElement('li');
    li.textContent = `${item.type.toUpperCase()} - ${item.duration} (Giá: ${item.price.toLocaleString('vi-VN')}₫)`;
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Hủy';
    deleteButton.addEventListener('click', () => {
      mockPackages.splice(index, 1);
      updatePackageList();
      showNotification('Hủy gói dịch vụ thành công!');
    });
    li.appendChild(deleteButton);
    packageListItems.appendChild(li);
  });
  packageList.style.display = mockPackages.length > 0 ? 'block' : 'none';
}

const modals = [loginModal, signupModal, bookingModal, scheduleModal, packageModal, customizeModal];
modals.forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
});

[closeLoginModal, closeSignupModal, closeBookingModal, closeScheduleModal, closePackageModal, closeCustomizeModal].forEach(close => {
  close.addEventListener('click', () => {
    close.closest('.modal').classList.remove('active');
  });
});

loginButtons.forEach(button => {
  button.addEventListener('click', () => {
    loginModal.classList.add('active');
  });
});

signupButtons.forEach(button => {
  button.addEventListener('click', () => {
    signupModal.classList.add('active');
  });
});

bookNowButtons.forEach(button => {
  button.addEventListener('click', () => {
    if (localStorage.getItem('loggedIn') === 'true') {
      bookingModal.classList.add('active');
    } else {
      showNotification('Vui lòng đăng nhập để đặt chỗ!', 'error');
      loginModal.classList.add('active');
    }
  });
});

bookPodButtons.forEach(button => {
  button.addEventListener('click', () => {
    if (localStorage.getItem('loggedIn') === 'true') {
      bookingModal.classList.add('active');
    } else {
      showNotification('Vui lòng đăng nhập để đặt chỗ!', 'error');
      loginModal.classList.add('active');
    }
  });
});

manageScheduleButtons.forEach(button => {
  button.addEventListener('click', () => {
    if (localStorage.getItem('loggedIn') === 'true') {
      scheduleModal.classList.add('active');
      updateScheduleList();
    } else {
      showNotification('Vui lòng đăng nhập để quản lý lịch!', 'error');
      loginModal.classList.add('active');
    }
  });
});

managePackageButtons.forEach(button => {
  button.addEventListener('click', () => {
    if (localStorage.getItem('loggedIn') === 'true') {
      packageModal.classList.add('active');
      updatePackageList();
    } else {
      showNotification('Vui lòng đăng nhập để quản lý gói!', 'error');
      loginModal.classList.add('active');
    }
  });
});

customizeInterfaceButtons.forEach(button => {
  button.addEventListener('click', () => {
    if (localStorage.getItem('loggedIn') === 'true') {
      customizeModal.classList.add('active');
    } else {
      showNotification('Vui lòng đăng nhập để tùy chỉnh!', 'error');
      loginModal.classList.add('active');
    }
  });
});

document.querySelectorAll('.switch-to-signup').forEach(link => {
  link.addEventListener('click', () => {
    loginModal.classList.remove('active');
    signupModal.classList.add('active');
  });
});

document.querySelectorAll('.switch-to-login').forEach(link => {
  link.addEventListener('click', () => {
    signupModal.classList.remove('active');
    loginModal.classList.add('active');
  });
});

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  document.querySelectorAll('#login-form .error').forEach(error => {
    error.style.display = 'none';
    error.textContent = '';
  });

  const email = document.getElementById('login-email').value;
  const emailError = document.getElementById('login-email-error');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    emailError.textContent = 'Vui lòng nhập email hợp lệ';
    emailError.style.display = 'block';
    valid = false;
  }

  const password = document.getElementById('login-password').value;
  const passwordError = document.getElementById('login-password-error');
  if (password.length < 6) {
    passwordError.textContent = 'Mật khẩu phải có ít nhất 6 ký tự';
    passwordError.style.display = 'block';
    valid = false;
  }

  if (valid) {
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('userEmail', email);
    showMainContent();
    showDashboard();
    hideSectionsAfterLogin();
    showNotification('Đăng nhập thành công!');
    loginModal.classList.remove('active');
    loginForm.reset();
  }
});

signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  document.querySelectorAll('#signup-form .error').forEach(error => {
    error.style.display = 'none';
    error.textContent = '';
  });

  const name = document.getElementById('signup-name').value;
  const nameError = document.getElementById('signup-name-error');
  if (name.length < 2) {
    nameError.textContent = 'Họ và tên phải có ít nhất 2 ký tự';
    nameError.style.display = 'block';
    valid = false;
  }

  const email = document.getElementById('signup-email').value;
  const emailError = document.getElementById('signup-email-error');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    emailError.textContent = 'Vui lòng nhập email hợp lệ';
    emailError.style.display = 'block';
    valid = false;
  }

  const password = document.getElementById('signup-password').value;
  const passwordError = document.getElementById('signup-password-error');
  if (password.length < 6) {
    passwordError.textContent = 'Mật khẩu phải có ít nhất 6 ký tự';
    passwordError.style.display = 'block';
    valid = false;
  }

  const confirmPassword = document.getElementById('signup-confirm-password').value;
  const confirmPasswordError = document.getElementById('signup-confirm-password-error');
  if (password !== confirmPassword) {
    confirmPasswordError.textContent = 'Mật khẩu xác nhận không khớp';
    confirmPasswordError.style.display = 'block';
    valid = false;
  }

  if (valid) {
    localStorage.setItem('loggedIn', 'false');
    localStorage.setItem('userEmail', email);
    signupModal.classList.remove('active');
    loginModal.classList.add('active');
    showNotification('Đăng ký thành công! Vui lòng đăng nhập.');
    signupForm.reset();
  }
});

bookingDate.addEventListener('change', () => {
  updateAvailableSlots(bookingDate.value, bookingAvailableSlots, bookingAvailableSlotsList, bookingTime);
});

bookingDuration.addEventListener('change', () => {
  calculatePrice(bookingDuration, bookingPodType, bookingPriceEstimate, bookingEstimatedPrice);
});

bookingPodType.addEventListener('change', () => {
  calculatePrice(bookingDuration, bookingPodType, bookingPriceEstimate, bookingEstimatedPrice);
});

bookingForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  document.querySelectorAll('#booking-form .error').forEach(error => {
    error.style.display = 'none';
    error.textContent = '';
  });

  const date = bookingDate.value;
  const dateError = document.getElementById('booking-date-error');
  const today = new Date().toISOString().split('T')[0];
  if (!date || date < today) {
    dateError.textContent = 'Vui lòng chọn ngày từ hôm nay trở đi';
    dateError.style.display = 'block';
    valid = false;
  }

  const time = bookingTime.value;
  const timeError = document.getElementById('booking-time-error');
  if (!time) {
    timeError.textContent = 'Vui lòng chọn giờ bắt đầu từ danh sách trên';
    timeError.style.display = 'block';
    valid = false;
  } else if (mockAvailability[date] && !mockAvailability[date].includes(time)) {
    timeError.textContent = 'Giờ này không có sẵn';
    timeError.style.display = 'block';
    valid = false;
  }

  const duration = bookingDuration.value;
  const durationError = document.getElementById('booking-duration-error');
  if (!duration) {
    durationError.textContent = 'Vui lòng chọn thời lượng';
    durationError.style.display = 'block';
    valid = false;
  }

  const podType = bookingPodType.value;
  const podTypeError = document.getElementById('booking-pod-type-error');
  if (!podType) {
    podTypeError.textContent = 'Vui lòng chọn loại POD';
    podTypeError.style.display = 'block';
    valid = false;
  }

  if (valid) {
    mockUserBookings.push({ date, podType });
    updateRecentBookings();
    showNotification('Đặt chỗ thành công! Vui lòng kiểm tra email để xác nhận.');
    bookingModal.classList.remove('active');
    bookingForm.reset();
    bookingAvailableSlots.style.display = 'none';
    bookingPriceEstimate.style.display = 'none';
  }
});

scheduleForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  document.querySelectorAll('#schedule-form .error').forEach(error => {
    error.style.display = 'none';
    error.textContent = '';
  });

  const date = scheduleDate.value;
  const dateError = document.getElementById('schedule-date-error');
  const today = new Date().toISOString().split('T')[0];
  if (!date || date < today) {
    dateError.textContent = 'Vui lòng chọn ngày từ hôm nay trở đi';
    dateError.style.display = 'block';
    valid = false;
  }

  const time = scheduleTime.value;
  const timeError = document.getElementById('schedule-time-error');
  if (!time) {
    timeError.textContent = 'Vui lòng chọn giờ';
    timeError.style.display = 'block';
    valid = false;
  }

  const task = scheduleTask.value;
  const taskError = document.getElementById('schedule-task-error');
  if (!task) {
    taskError.textContent = 'Vui lòng nhập nhiệm vụ';
    taskError.style.display = 'block';
    valid = false;
  }

  if (valid) {
    mockSchedule.push({ date, time, task });
    updateScheduleList();
    showNotification('Thêm lịch làm việc thành công!');
    scheduleForm.reset();
  }
});

packageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  document.querySelectorAll('#package-form .error').forEach(error => {
    error.style.display = 'none';
    error.textContent = '';
  });

  const type = packageType.value;
  const typeError = document.getElementById('package-type-error');
  if (!type) {
    typeError.textContent = 'Vui lòng chọn loại gói';
    typeError.style.display = 'block';
    valid = false;
  }

  const duration = packageDuration.value;
  const durationError = document.getElementById('package-duration-error');
  if (!duration || duration < 1) {
    durationError.textContent = 'Vui lòng nhập thời lượng hợp lệ';
    durationError.style.display = 'block';
    valid = false;
  }

  if (valid) {
    const price = duration * (type === 'hour' ? 30000 : type === 'day' ? 200000 : 600000);
    mockPackages.push({ type, duration, price });
    updatePackageList();
    showNotification('Thêm gói dịch vụ thành công!');
    packageForm.reset();
  }
});

customizeForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  document.querySelectorAll('#customize-form .error').forEach(error => {
    error.style.display = 'none';
    error.textContent = '';
  });

  const color = customizeColor.value;
  const colorError = document.getElementById('customize-color-error');
  if (!color) {
    colorError.textContent = 'Vui lòng chọn màu chủ đạo';
    colorError.style.display = 'block';
    valid = false;
  }

  const font = customizeFont.value;
  const fontError = document.getElementById('customize-font-error');
  if (!font) {
    fontError.textContent = 'Vui lòng chọn font chữ';
    fontError.style.display = 'block';
    valid = false;
  }

  if (valid) {
    document.documentElement.style.setProperty('--primary-color', color);
    document.documentElement.style.setProperty('--secondary-color', color);
    document.documentElement.style.setProperty('--dashboard-bg', `linear-gradient(135deg, ${color}, #fef2f2)`);
    document.body.style.fontFamily = font;
    showNotification('Áp dụng tùy chỉnh thành công!');
    customizeModal.classList.remove('active');
    customizeForm.reset();
  }
});