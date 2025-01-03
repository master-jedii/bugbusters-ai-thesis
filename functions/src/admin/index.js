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
// Get a reference to the authentication service

function calculateProvinceStats(provinceCounts) {
    const mostBookedProvinceElement = document.getElementById('mostBookedProvince');
    const leastBookedProvinceElement = document.getElementById('leastBookedProvince');

    let mostBookedProvince = '';
    let leastBookedProvince = '';
    let maxCount = 0;
    let minCount = Infinity;

    for (const province in provinceCounts) {
        const count = provinceCounts[province];
        if (count > maxCount) {
            maxCount = count;
            mostBookedProvince = province;
        }
        if (count < minCount) {
            minCount = count;
            leastBookedProvince = province;
        }
    }

    if (mostBookedProvinceElement) {
        mostBookedProvinceElement.textContent = mostBookedProvince;
    }
    if (leastBookedProvinceElement) {
        leastBookedProvinceElement.textContent = leastBookedProvince;
    }
}

function calculateProvinceStats(users) {
    const mostBookedProvinceElement = document.getElementById('mostBookedProvince');
    const leastBookedProvinceElement = document.getElementById('leastBookedProvince');

    const provinceCounts = {};

    users.forEach(user => {
        const province = user.province;
        if (provinceCounts[province]) {
            provinceCounts[province]++;
        } else {
            provinceCounts[province] = 1;
        }
    });

    let mostBookedProvince = '';
    let leastBookedProvince = '';
    let maxCount = 0;
    let minCount = Infinity;

    for (const province in provinceCounts) {
        const count = provinceCounts[province];
        if (count > maxCount) {
            maxCount = count;
            mostBookedProvince = province;
        }
        if (count < minCount) {
            minCount = count;
            leastBookedProvince = province;
        }
    }

    if (mostBookedProvinceElement) {
        mostBookedProvinceElement.textContent = mostBookedProvince;
    }
    if (leastBookedProvinceElement) {
        leastBookedProvinceElement.textContent = leastBookedProvince;
    }
}

function loadUserData() {
    console.log('Loading user data...');
    const tableBody = document.getElementById('userTableBody');
    const userCountElement = document.getElementById('userCount');
    const dateselectElement = document.getElementById('dateselect');

    const usersRef = firebase.database().ref('Users');
    let totalUserCount = 0;

    // นับจำนวนผู้ใช้ทั้งหมดใน Firebase
    usersRef.once('value', (snapshot) => {
        totalUserCount = snapshot.numChildren();
        if (userCountElement) {
            userCountElement.textContent = totalUserCount; // แสดงจำนวนผู้ใช้ทั้งหมดในฐานข้อมูล
        }
    });

    // ดึงข้อมูลผู้ใช้ 5 คนล่าสุดตาม timestamp
    usersRef.orderByChild('timestamp').limitToLast(5).on('value', (snapshot) => {
        console.log('Data snapshot received', snapshot.val());
        const sortedUsers = [];
        let latestDateselect = '';
        let userCount = 0;

        snapshot.forEach((childSnapshot) => {
            const userData = childSnapshot.val();
            sortedUsers.push(userData);

            if (!latestDateselect || new Date(userData.timestamp) > new Date(latestDateselect)) {
                latestDateselect = userData.dateselect;
            }

            userCount++; // นับจำนวนผู้ใช้ที่เข้าสู่ระบบ
        });

        sortedUsers.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        tableBody.innerHTML = '';

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
                statusColorClass = 'text-danger';
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
            `;

            tableBody.appendChild(row);
        });

        if (userCountElement) {
            // ให้แสดงจำนวนผู้ใช้ที่เข้าสู่ระบบล่าสุด 5 คน
            userCountElement.textContent = userCount;
        }

        if (dateselectElement) {
            dateselectElement.textContent = `ล่าสุด: ${latestDateselect}`;
        }

        calculateProvinceStats(sortedUsers);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
});




function loadStatusData() {
    const pendingConfirmationElement = document.getElementById('pendingConfirmation');
    const confirmedElement = document.getElementById('confirmed');

    const usersRef = firebase.database().ref('Users');

    usersRef.on('value', (snapshot) => {
        let pendingConfirmationCount = 0;
        let confirmedCount = 0;

        snapshot.forEach((childSnapshot) => {
            const userData = childSnapshot.val();
            if (userData.status === 'Not confirm') {
                pendingConfirmationCount++;
            } else if (userData.status === 'Confirmed') {
                confirmedCount++;
            }
        });

        pendingConfirmationElement.textContent = pendingConfirmationCount;
        confirmedElement.textContent = confirmedCount;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadStatusData();
});


// Validate Functions

document.addEventListener('DOMContentLoaded', () => {
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
    const currentYear = currentDate.getFullYear();

    const userCountElement = document.getElementById('currentMonth');
    userCountElement.textContent = `ช่วงเดือน ${currentMonth} ${currentYear} ที่ผ่านมา`;
});



const xValues = ["กรุงเทพมหานคร", "นนทบุรี", "ปทุมธานี", "สมุทรปราการ", "สมุทรสาคร", "นครปฐม"];
let yValues = [0, 0, 0, 0, 0, 0]; // สร้าง array ให้มีขนาดเท่ากับ xValues และเติมค่าเริ่มต้นเป็น 0

const usersRef = firebase.database().ref('Users');

usersRef.once('value', (snapshot) => {
    snapshot.forEach((childSnapshot) => {
        const userData = childSnapshot.val();
        const province = userData.province;

        if (province && xValues.includes(province)) {
            const index = xValues.indexOf(province);
            yValues[index]++;
        }
    });

    const ctx = document.getElementById("myChart").getContext("2d");
    const myChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: xValues,
            datasets: [{
                fill: false,
                lineTension: 0,
                backgroundColor: "rgba(0,0,255,1.0)",
                borderColor: "rgba(0,0,255,0.1)",
                data: yValues
            }]
        },
        options: {
            legend: { display: false },
            scales: {
                yAxes: [{
                    ticks: { min: 0, max: 10, stepSize: 1 } // กำหนดค่า y-axis min เป็น 0 และ max เป็น 10
                }]
            }
        }
    });
});


