// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCxTCUmIzvkC8cTW_TETeZBOTZZ7aPqnhw",
    authDomain: "geminibugbuster.firebaseapp.com",
    databaseURL: "https://geminibugbuster-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "geminibugbuster",
    storageBucket: "geminibugbuster.appspot.com",
    messagingSenderId: "576048046575",
    appId: "1:576048046575:web:dadf68947e6a0486ec561a",
    measurementId: "G-NDN0MM76KS"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize variables
const database = firebase.database();

function loadUserData(filterDateselect , filterProvince , filterStatus) {
    console.log('Loading user data...');
    const tableBody = document.getElementById('userTableBody');
    const userCountElement = document.getElementById('userCount');
    const dateselectElement = document.getElementById('dateselect');

    const usersRef = firebase.database().ref('Users');

    usersRef.orderByChild('timestamp').on('value', (snapshot) => {
        console.log('Data snapshot received', snapshot.val());
        const sortedUsers = [];
        let latestDateselect = '';

        snapshot.forEach((childSnapshot) => {
            const userData = childSnapshot.val();
            userData.key = childSnapshot.key; // Save the unique key for each user
            
            // Apply filters
            if ((filterDateselect && userData.dateselect !== filterDateselect) || 
                (filterProvince && userData.province !== filterProvince) ||
                (filterStatus && userData.status !== filterStatus)
            ) {
                return; // Skip this user if it doesn't match the filters
            }

            sortedUsers.push(userData);

            if (!latestDateselect || new Date(userData.timestamp) > new Date(latestDateselect)) {
                latestDateselect = userData.dateselect;
            }
        });

        sortedUsers.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        tableBody.innerHTML = '';
        let userCount = 0;

        sortedUsers.forEach(user => {
            const row = document.createElement('tr');
            const timestampDate = new Date(user.timestamp);
            const timestampFormatted = timestampDate.toLocaleString();

            let statusColorClass = '';
            if (user.status === 'Confirmed') {
                statusColorClass = 'text-success';
            } else if (user.status === 'Canceled') {
                statusColorClass = 'text-danger';
            } else if (user.status === 'Not confirm') {
                statusColorClass = 'text-warning';
            }

            row.innerHTML = `
                <td>${user.name}</td>
                <td>${user.lastname}</td>
                <td>${user.address}</td>
                <td>${user.province}</td>
                <td>${user.amphure}</td>
                <td>${user.tambon}</td>
                <td>${user.dateselect}</td>
                <td class="${statusColorClass}">${user.status}</td>
                <td>${user.tel}</td>
                <td>${timestampFormatted}</td>
                <td>
                    <button class="edit-btn btn-warning text-light" data-id="${user.key}">แก้ไข</button>
                    <button class="delete-btn btn-danger" data-id="${user.key}">ลบข้อมูล</button>
                </td>
            `;

            tableBody.appendChild(row);
            userCount++;
        });

        if (userCountElement) {
            userCountElement.textContent = userCount;
        }

        if (dateselectElement) {
            dateselectElement.textContent = `ล่าสุด: ${latestDateselect}`;
        }

        // Attach event listeners for edit and delete buttons
        attachEventListeners();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
});

function applyFilter() {
    try {
        const filterDateselect = document.getElementById('filterDateselect').value;
        const filterProvince = document.getElementById('filterProvince').value;
        const filterStatus = document.getElementById('filterStatus').value;
       
        loadUserData(filterDateselect, filterProvince, filterStatus);
    } catch (error) {
        console.error('Error applying filter:', error);
        alert('เกิดข้อผิดพลาดในการกรองข้อมูล: ' + error.message);
    }
}

function attachEventListeners() {
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-id');
            editUser(userId);
        });
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-id');
            confirmDeleteUser(userId);
        });
    });
}

function editUser(userId) {
    firebase.database().ref('Users/' + userId).once('value').then((snapshot) => {
        const userData = snapshot.val();
        
        Swal.fire({
            icon: "warning",
            title: "ข้อมูลการนัดหมาย",
            html: `
            <div class="SwalDesign">
                <label><strong>วันที่เลือก:</strong></label><br>
                <input type="date" id="dateselect" value="${userData.dateselect}"><br>
                <label><strong>ชื่อ:</strong></label>
                <input type="text" id="swal-input1" value="${userData.name}">
                <label><strong>นามสกุล:</strong></label>
                <input type="text" id="swal-input2" value="${userData.lastname}">
                <label><strong>เบอร์โทร:</strong></label>
                <input type="text" id="swal-input3" value="${userData.tel}">
                <br><br>
                <label><strong>ที่อยู่:</strong></label>
                <input type="text" id="swal-input4" value="${userData.address}">
                <label><strong>จังหวัด:</strong></label>
                <input type="text" id="swal-input5" value="${userData.province}">
                <label><strong>อำเภอ:</strong></label>
                <input type="text" id="swal-input6" value="${userData.amphure}">
                <label><strong>ตำบล:</strong></label>
                <input type="text" id="swal-input7" value="${userData.tambon}">
            </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'บันทึกการเปลี่ยนแปลง',
            cancelButtonText: 'ยกเลิก',
            customClass: {
                title: 'custom-title-class',
                htmlContainer: 'custom-html-container-class',
                confirmButton: 'swal2-confirm',
                cancelButton: 'custom-cancel-button-class',
                iconSwal_custom: 'icon'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedUserData = {
                    dateselect: document.getElementById('dateselect').value,
                    name: document.getElementById('swal-input1').value,
                    lastname: document.getElementById('swal-input2').value,
                    tel: document.getElementById('swal-input3').value,
                    address: document.getElementById('swal-input4').value,
                    province: document.getElementById('swal-input5').value,
                    amphure: document.getElementById('swal-input6').value,
                    tambon: document.getElementById('swal-input7').value,
                };

                firebase.database().ref('Users/' + userId).update(updatedUserData).then(() => {
                    Swal.fire(
                        'บันทึกสำเร็จ!',
                        'ข้อมูลผู้ใช้ถูกอัปเดตเรียบร้อยแล้ว.',
                        'success'
                    );
                    loadUserData(); // โหลดข้อมูลใหม่เพื่อแสดงการเปลี่ยนแปลง
                }).catch((error) => {
                    Swal.fire(
                        'เกิดข้อผิดพลาด!',
                        'ไม่สามารถอัปเดตข้อมูลผู้ใช้นี้ได้.',
                        'error'
                    );
                    console.error('Error updating user data:', error);
                });
            }
        });
    }).catch((error) => {
        console.error('Error fetching user data:', error);
    });
}

function confirmDeleteUser(userId) {
    Swal.fire({
        title: 'คุณแน่ใจหรือไม่?',
        text: "คุณต้องการลบข้อมูลนี้หรือไม่!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ใช่, ลบมันเลย!',
        cancelButtonText: 'ยกเลิก'
    }).then((result) => {
        if (result.isConfirmed) {
            deleteUser(userId);
        }
    });
}

function deleteUser(userId) {
    firebase.database().ref('Users/' + userId).remove().then(() => {
        Swal.fire(
            'ลบสำเร็จ!',
            'ข้อมูลผู้ใช้ถูกลบเรียบร้อยแล้ว.',
            'success'
        );
        loadUserData(); // โหลดข้อมูลใหม่เพื่อแสดงการเปลี่ยนแปลง
    }).catch((error) => {
        Swal.fire(
            'เกิดข้อผิดพลาด!',
            'ไม่สามารถลบข้อมูลผู้ใช้นี้ได้.',
            'error'
        );
        console.error('Error deleting user:', error);
    });
}


async function logOut() {
    try {
        await auth.signOut();
        console.log("User logged out");
        document.getElementById('authStatus').innerText = 'No user logged in';
    } catch (error) {
        console.error("Error logging out:", error);
        throw error;
    }
}

const auth = firebase.auth();
        // ตรวจสอบสถานะการล็อกอินของผู้ใช้เมื่อโหลดหน้า
        auth.onAuthStateChanged((user) => {
            if (!user) {
                window.location.href = '/admin/index.html';
            } else {
                document.getElementById('authStatus').innerText = `Logged in as: ${user.email}`;
            }
        });

        document.getElementById('logoutButton').addEventListener('click', async () => {
            try {
                await auth.signOut();
                window.location.href = '/admin/index.html';
            } catch (err) {
                console.error("Error logging out:", err);
            }
});