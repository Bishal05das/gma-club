// Global Variables
let allMembers = [];
let filteredMembers = [];
let currentPage = 1;
let itemsPerPage = 50;
let isAdmin = false;
let editingMemberId = null;
let sortColumn = '';
let sortDirection = 'asc';
const ADMIN_PASSWORD = "admin123"; // Change this password for security!

// Notices data
let notices = [
];

// Advisors data
let advisors = [

];

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Generate initials from a full name
 * @param {string} name - Full name
 * @returns {string} - Initials
 */
function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

/**
 * Format date for display
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date
 */
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// =============================================================================
// AUTHENTICATION FUNCTIONS
// =============================================================================

/**
 * Show the login modal
 */
function showLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}

/**
 * Close the login modal
 */
function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('adminPassword').value = '';
}

function showAdminInterface() {
    document.getElementById('actionsHeader').style.display = 'table-cell';
    document.getElementById('loginBtn').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'block';
    document.getElementById('exportBtnContainer').style.display = 'block';
    document.getElementById('addNoticeForm').style.display = 'block';
    document.getElementById('addAdvisorForm').style.display = 'grid';
    displayMembers();
    displayNotices();
    displayAdvisors();
}

/**
 * Handle admin login
 */
function login() {
    const password = document.getElementById('adminPassword').value;
    if (password === ADMIN_PASSWORD) {
        isAdmin = true;
        showAdminInterface();
        closeLoginModal();
        alert('Welcome, Admin!');
    } else {
        alert('Incorrect password!');
    }
}

/**
 * Show admin interface elements
 */
function logout() {
    isAdmin = false;
    document.getElementById('actionsHeader').style.display = 'none';
    document.getElementById('loginBtn').style.display = 'block';
    document.getElementById('logoutBtn').style.display = 'none';
    document.getElementById('exportBtnContainer').style.display = 'none';
    document.getElementById('addNoticeForm').style.display = 'none';
    document.getElementById('addAdvisorForm').style.display = 'none';
    displayMembers();
    displayNotices();
    displayAdvisors();
    alert('Logged out successfully!');
}

/**
 * Logout admin and hide admin interface
 */
// function logout() {
//     isAdmin = false;
//     document.getElementById('adminControls').style.display = 'none';
//     document.getElementById('actionsHeader').style.display = 'none';
//     document.getElementById('loginBtn').style.display = 'block';
//     document.getElementById('logoutBtn').style.display = 'none';
//     document.getElementById('exportBtn').style.display = 'none';
//     document.getElementById('addNoticeForm').style.display = 'none';
//     document.getElementById('addAdvisorForm').style.display = 'none';
//     displayMembers();
//     displayNotices();
//     displayAdvisors();
//     alert('Logged out successfully!');
// }

// =============================================================================
// MEMBER REGISTRATION FUNCTIONS
// =============================================================================

/**
 * Register a new member
 */
function registerMember() {
    // Get form values
    const name = document.getElementById('regName').value.trim();
    const roll = document.getElementById('regRoll').value.trim();
    const department = document.getElementById('regDepartment').value.trim();
    const hometown = document.getElementById('regHometown').value;
    const phone = document.getElementById('regPhone').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const school = document.getElementById('regSchool').value.trim();
    const college = document.getElementById('regCollege').value.trim();
    const gender = document.getElementById('regGender').value;
    const series = document.getElementById('regSeries').value.trim();

    // Validate required fields
    if (!name || !roll || !department || !hometown || !phone || !email || !series) {
        alert('Please fill in all required fields!');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address!');
        return;
    }

    // Check for duplicate email
    if (allMembers.some(member => member.email.toLowerCase() === email.toLowerCase())) {
        alert('A member with this email already exists!');
        return;
    }

    // Check for duplicate roll
    if (allMembers.some(member => member.roll === roll)) {
        alert('A member with this roll number already exists!');
        return;
    }

    // Create new member object
    const newMember = {
        id: Date.now(),
        name,
        roll,
        department,
        hometown,
        phone,
        email,
        school,
        college,
        gender,
        series,
        role: "Member",
        joinDate: new Date().toISOString().split('T')[0]
    };

    // Add to members array
    allMembers.push(newMember);
    filterMembers();
    
    // Clear form
    clearRegistrationForm();
    
    alert('Registration successful! Welcome to the association.');
}

/**
 * Clear the registration form
 */
function clearRegistrationForm() {
    document.getElementById('regName').value = '';
    document.getElementById('regRoll').value = '';
    document.getElementById('regDepartment').value = '';
    document.getElementById('regHometown').value = 'Mymensingh';
    document.getElementById('regPhone').value = '';
    document.getElementById('regEmail').value = '';
    document.getElementById('regSchool').value = '';
    document.getElementById('regCollege').value = '';
    document.getElementById('regGender').value = 'Male';
    document.getElementById('regSeries').value = '';
}

// =============================================================================
// MEMBER MANAGEMENT FUNCTIONS
// =============================================================================

/**
 * Delete a member from the system
 * @param {number} id - Member ID to delete
 */
function deleteMember(id) {
    const member = allMembers.find(m => m.id === id);
    if (!member) return;

    if (confirm(`Are you sure you want to delete ${member.name}?`)) {
        allMembers = allMembers.filter(member => member.id !== id);
        filterMembers();
        alert('Member deleted successfully!');
    }
}

/**
 * Open edit modal for a member
 * @param {number} id - Member ID to edit
 */
function editMember(id) {
    const member = allMembers.find(m => m.id === id);
    if (!member) return;

    editingMemberId = id;
    
    // Populate edit form
    document.getElementById('editName').value = member.name;
    document.getElementById('editRoll').value = member.roll;
    document.getElementById('editDepartment').value = member.department;
    document.getElementById('editHometown').value = member.hometown;
    document.getElementById('editPhone').value = member.phone;
    document.getElementById('editEmail').value = member.email;
    document.getElementById('editSchool').value = member.school;
    document.getElementById('editCollege').value = member.college;
    document.getElementById('editGender').value = member.gender;
    document.getElementById('editSeries').value = member.series;
    
    // Show modal
    document.getElementById('editModal').style.display = 'block';
}

/**
 * Update member information
 */
function updateMember() {
    if (!editingMemberId) return;

    const memberIndex = allMembers.findIndex(m => m.id === editingMemberId);
    if (memberIndex === -1) return;

    // Get form values
    const name = document.getElementById('editName').value.trim();
    const roll = document.getElementById('editRoll').value.trim();
    const department = document.getElementById('editDepartment').value.trim();
    const hometown = document.getElementById('editHometown').value;
    const phone = document.getElementById('editPhone').value.trim();
    const email = document.getElementById('editEmail').value.trim();
    const school = document.getElementById('editSchool').value.trim();
    const college = document.getElementById('editCollege').value.trim();
    const gender = document.getElementById('editGender').value;
    const series = document.getElementById('editSeries').value.trim();

    // Validate required fields
    if (!name || !roll || !department || !hometown || !phone || !email || !series) {
        alert('Please fill in all required fields!');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address!');
        return;
    }

    // Check for duplicate email (excluding current member)
    if (allMembers.some(member => 
        member.email.toLowerCase() === email.toLowerCase() && 
        member.id !== editingMemberId
    )) {
        alert('A member with this email already exists!');
        return;
    }

    // Check for duplicate roll (excluding current member)
    if (allMembers.some(member => 
        member.roll === roll && 
        member.id !== editingMemberId
    )) {
        alert('A member with this roll number already exists!');
        return;
    }

    // Update member
    allMembers[memberIndex] = {
        ...allMembers[memberIndex],
        name,
        roll,
        department,
        hometown,
        phone,
        email,
        school,
        college,
        gender,
        series
    };

    filterMembers();
    closeEditModal();
    alert('Member updated successfully!');
}

/**
 * Close the edit member modal
 */
function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
    editingMemberId = null;
}

// =============================================================================
// NOTICE BOARD FUNCTIONS
// =============================================================================

/**
 * Display all notices
 */
function displayNotices() {
    const container = document.getElementById('noticesContainer');
    container.innerHTML = '';

    // Sort notices by date (newest first)
    const sortedNotices = [...notices].sort((a, b) => new Date(b.date) - new Date(a.date));

    sortedNotices.forEach(notice => {
        const noticeElement = document.createElement('div');
        noticeElement.className = 'notice-item';
        
        noticeElement.innerHTML = `
            <p>${notice.text}</p>
            <div class="notice-date">${formatDate(notice.date)}</div>
            ${isAdmin ? `<button class="delete-notice" onclick="deleteNotice(${notice.id})">×</button>` : ''}
        `;
        
        container.appendChild(noticeElement);
    });

    // Show add notice form button for admin
    const addNoticeForm = document.getElementById('addNoticeForm');
    if (isAdmin) {
        addNoticeForm.style.display = 'block';
    } else {
        addNoticeForm.style.display = 'none';
    }
}

/**
 * Show the add notice form
 */
function showAddNoticeForm() {
    document.getElementById('newNoticeText').value = '';
    document.getElementById('addNoticeForm').style.display = 'block';
}

/**
 * Add a new notice
 */
function addNotice() {
    const text = document.getElementById('newNoticeText').value.trim();
    if (!text) {
        alert('Please enter notice text!');
        return;
    }

    const newNotice = {
        id: Date.now(),
        text,
        date: new Date().toISOString().split('T')[0]
    };

    notices.unshift(newNotice);
    displayNotices();
    
    // Clear the textarea but keep the form visible
    document.getElementById('newNoticeText').value = '';
    
    // Optional: Focus back on the textarea for quick entry
    document.getElementById('newNoticeText').focus();
    
    alert('Notice added successfully!');
    
    // If you prefer to hide the form after adding:
    // document.getElementById('addNoticeForm').style.display = 'none';
}

/**
 * Delete a notice
 * @param {number} id - Notice ID to delete
 */
function deleteNotice(id) {
    if (confirm('Are you sure you want to delete this notice?')) {
        notices = notices.filter(notice => notice.id !== id);
        displayNotices();
        alert('Notice deleted successfully!');
    }
}

// =============================================================================
// ADVISORS FUNCTIONS
// =============================================================================

/**
 * Display all advisors
 */
function displayAdvisors() {
    const container = document.getElementById('advisorsContainer');
    container.innerHTML = '';

    advisors.forEach(advisor => {
        const advisorElement = document.createElement('div');
        advisorElement.className = 'advisor-card';
        
        advisorElement.innerHTML = `
            <div class="advisor-image">
                <img src="${advisor.image}" alt="${advisor.name}">
            </div>
            <div class="advisor-details">
                <h3>${advisor.name}</h3>
                <div class="advisor-position">${advisor.position}</div>
                <div class="advisor-department">${advisor.department}</div>
                <div class="advisor-contact">
                    <div>Phone: ${advisor.phone}</div>
                    <div>Email: ${advisor.email}</div>
                </div>
                ${isAdmin ? `<button class="delete-advisor" onclick="deleteAdvisor(${advisor.id})">Delete</button>` : ''}
            </div>
        `;
        
        container.appendChild(advisorElement);
    });

    // Show add advisor form button for admin
    const addAdvisorForm = document.getElementById('addAdvisorForm');
    if (isAdmin) {
        addAdvisorForm.style.display = 'grid';
    } else {
        addAdvisorForm.style.display = 'none';
    }
}

/**
 * Show the add advisor form
 */
function showAddAdvisorForm() {
    document.getElementById('advisorName').value = '';
    document.getElementById('advisorPosition').value = '';
    document.getElementById('advisorDepartment').value = '';
    document.getElementById('advisorPhone').value = '';
    document.getElementById('advisorEmail').value = '';
    document.getElementById('advisorImageURL').value = '';
    document.getElementById('addAdvisorForm').style.display = 'grid';
}

/**
 * Add a new advisor
 */
function addAdvisor() {
    const name = document.getElementById('advisorName').value.trim();
    const position = document.getElementById('advisorPosition').value.trim();
    const department = document.getElementById('advisorDepartment').value.trim();
    const phone = document.getElementById('advisorPhone').value.trim();
    const email = document.getElementById('advisorEmail').value.trim();
    const imageURL = document.getElementById('advisorImageURL').value.trim();

    if (!name || !position || !department || !phone || !email) {
        alert('Please fill in all required fields!');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address!');
        return;
    }

    // Default image if none provided
    const image = imageURL || `https://via.placeholder.com/100x120?text=${name.split(' ')[0]}`;

    const newAdvisor = {
        id: Date.now(),
        name,
        position,
        department,
        phone,
        email,
        image
    };

    advisors.push(newAdvisor);
    displayAdvisors();
    alert('Advisor added successfully!');
}

/**
 * Delete an advisor
 * @param {number} id - Advisor ID to delete
 */
function deleteAdvisor(id) {
    if (confirm('Are you sure you want to delete this advisor?')) {
        advisors = advisors.filter(advisor => advisor.id !== id);
        displayAdvisors();
        alert('Advisor deleted successfully!');
    }
}

// =============================================================================
// SEARCH AND FILTER FUNCTIONS
// =============================================================================

/**
 * Filter members based on search and filters
 */
function filterMembers() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const hometownFilter = document.getElementById('hometownFilter').value;
    const departmentFilter = document.getElementById('departmentFilter').value.toLowerCase();
    const seriesFilter = document.getElementById('seriesFilter').value.toLowerCase();

    filteredMembers = allMembers.filter(member => {
        const matchesSearch = !searchTerm || 
            member.name.toLowerCase().includes(searchTerm) ||
            member.roll.toLowerCase().includes(searchTerm) ||
            member.department.toLowerCase().includes(searchTerm);

        const matchesHometown = !hometownFilter || member.hometown === hometownFilter;
        const matchesDepartment = !departmentFilter || member.department.toLowerCase().includes(departmentFilter);
        const matchesSeries = !seriesFilter || member.series.toLowerCase().includes(seriesFilter);

        return matchesSearch && matchesHometown && matchesDepartment && matchesSeries;
    });

    currentPage = 1;
    displayMembers();
}

// =============================================================================
// SORTING FUNCTIONS
// =============================================================================

/**
 * Sort table by column
 * @param {string} column - Column name to sort by
 */
function sortTable(column) {
    if (sortColumn === column) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        sortColumn = column;
        sortDirection = 'asc';
    }

    // Clear previous sort indicators
    document.querySelectorAll('th').forEach(th => {
        th.classList.remove('sorted-asc', 'sorted-desc');
    });

    // Add current sort indicator
    const header = document.querySelector(`th[onclick="sortTable('${column}')"]`);
    if (header) {
        header.classList.add(`sorted-${sortDirection}`);
    }

    // Sort the filtered members array
    filteredMembers.sort((a, b) => {
        let aVal = a[column];
        let bVal = b[column];

        if (typeof aVal === 'string') {
            aVal = aVal.toLowerCase();
            bVal = bVal.toLowerCase();
        }

        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    displayMembers();
}

// =============================================================================
// DISPLAY FUNCTIONS
// =============================================================================

/**
 * Display all members (admin view)
 */
function showAllMembers() {
    filteredMembers = [...allMembers];
    currentPage = 1;
    displayMembers();
}

/**
 * Display members in the table
 */
function displayMembers() {
    const emptyState = document.getElementById('emptyState');
    const tableWrapper = document.getElementById('tableWrapper');
    const paginationSection = document.getElementById('paginationSection');
    
    // Show empty state if no members
    if (filteredMembers.length === 0) {
        emptyState.style.display = 'block';
        tableWrapper.style.display = 'none';
        paginationSection.style.display = 'none';
        return;
    }

    // Show table and pagination
    emptyState.style.display = 'none';
    tableWrapper.style.display = 'block';
    paginationSection.style.display = 'flex';

    const tbody = document.getElementById('membersTableBody');
    tbody.innerHTML = '';

    // Calculate pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredMembers.length);
    const membersToShow = filteredMembers.slice(startIndex, endIndex);

    // Create table rows
    membersToShow.forEach(member => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>
                <div class="member-name">
                    <div class="member-avatar">${getInitials(member.name)}</div>
                    ${member.name}
                </div>
            </td>
            <td>${member.roll}</td>
            <td>${member.department}</td>
            <td><span class="hometown-badge hometown-${member.hometown.toLowerCase()}">${member.hometown}</span></td>
            <td><span class="series-badge">${member.series}</span></td>
            <td>${member.phone}</td>
            <td>${member.email}</td>
            <td>${member.school || ''} ${member.college ? (member.school ? ', ' : '') + member.college : ''}</td>
            <td class="actions-cell" style="display: ${isAdmin ? 'table-cell' : 'none'}">
                <button class="btn btn-sm" onclick="editMember(${member.id})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteMember(${member.id})">Delete</button>
            </td>
        `;
        
        tbody.appendChild(row);
    });

    updatePagination();
}

// =============================================================================
// PAGINATION FUNCTIONS
// =============================================================================

/**
 * Update pagination controls and information
 */
function updatePagination() {
    const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
    const paginationInfo = document.getElementById('paginationInfo');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    paginationInfo.textContent = `Page ${currentPage} of ${totalPages} (${filteredMembers.length} members)`;
    
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    
    prevBtn.style.opacity = prevBtn.disabled ? '0.5' : '1';
    nextBtn.style.opacity = nextBtn.disabled ? '0.5' : '1';
}

/**
 * Go to previous page
 */
function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        displayMembers();
    }
}

/**
 * Go to next page
 */
function nextPage() {
    const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayMembers();
    }
}

/**
 * Change number of items displayed per page
 */
function changeItemsPerPage() {
    itemsPerPage = parseInt(document.getElementById('itemsPerPage').value);
    currentPage = 1;
    displayMembers();
}

// =============================================================================
// EXPORT FUNCTIONS
// =============================================================================

/**
 * Export filtered members to CSV file
 */
function exportToCSV() {
    if (filteredMembers.length === 0) {
        alert('No members to export!');
        return;
    }

    // Create CSV content
    const headers = ['Name', 'Roll', 'Department', 'Hometown', 'Phone', 'Email', 'School', 'College', 'Gender', 'Series', 'Join Date'];
    const csvContent = [
        headers.join(','),
        ...filteredMembers.map(member => [
            `"${member.name}"`,
            `"${member.roll}"`,
            `"${member.department}"`,
            `"${member.hometown}"`,
            `"${member.phone}"`,
            `"${member.email}"`,
            `"${member.school}"`,
            `"${member.college}"`,
            `"${member.gender}"`,
            `"${member.series}"`,
            `"${member.joinDate}"`
        ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `mymensingh_association_members_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    alert(`Exported ${filteredMembers.length} members to CSV file!`);
}

// =============================================================================
// DATA MANAGEMENT FUNCTIONS
// =============================================================================

/**
 * Load sample data for demonstration
 */
function loadSampleData() {
    const sampleMembers = [
    ];

    allMembers = sampleMembers;
    filteredMembers = [...allMembers];
}

// =============================================================================
// EVENT LISTENERS AND INITIALIZATION
// =============================================================================

/**
 * Initialize the application when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    // Load sample data
    loadSampleData();
    displayMembers();
    displayNotices();
    displayAdvisors();
    
    // Hide export button for non-admins
    document.getElementById('exportBtn').style.display = 'none';
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        // Ctrl/Cmd + K to focus search
        if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
            event.preventDefault();
            document.getElementById('searchInput').focus();
        }
        
        // Escape to close modals
        if (event.key === 'Escape') {
            closeEditModal();
            closeLoginModal();
        }
    });
});

/**
 * Handle clicks outside modals to close them
 */
window.onclick = function(event) {
    const editModal = document.getElementById('editModal');
    const loginModal = document.getElementById('loginModal');
    
    if (event.target === editModal) {
        closeEditModal();
    }
    if (event.target === loginModal) {
        closeLoginModal();
    }
}

/**
 * Handle Enter key in login form
 */
document.getElementById('adminPassword').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        login();
    }
});