  class Navbar extends HTMLElement {

    connectedCallback() {
      this.innerHTML = `
            <nav id="sidebar" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
                <div class="position-sticky">
                    <ul class="nav flex-column">
                        <li class="nav-item">
                          <a class="nav-link active" aria-current="page" href="dashboard.html">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-home"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                            <span class="ml-2">Dashboard</span>
                          </a>
                        </li>
                        <li class="nav-item">
                          <a class="nav-link" href="viewall.html">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-file"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                            <span class="ml-2">ข้อมูลผู้ใช้</span>
                          </a>
                        </li>
                        <li class="nav-item">
                          <a class="nav-link" href="calendar.html">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-shopping-cart"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                            <span class="ml-2">ปฏิทินนัดสำรวจ</span>
                          </a>
                        </li>
                        <li class="nav-item">
                          <a class="nav-link" href="#">
                             <button id="logoutButton" class="btn btn-danger">Log Out</button>
                          </a>
                        </li>
                      </ul>
                </div>
            </nav>
        </div>  
      `;
    }
  }

  class Dashboard extends HTMLElement {

    connectedCallback() {
      this.innerHTML = `
            <main class="col-md-9 ml-sm-auto col-lg-10 px-md-4 py-4">
                <h1 class="h2">Dashboard</h1>
                <p>This is the homepage of a simple admin interface which is part of a tutorial written on Themesberg</p>
                
                <div >
                  <div class="card">
                    <canvas id="myChart" style="width:100%;max-width:600px"></canvas>
                  </div>
              </div>
                <div class="row my-3">
                  <div class="col-12 col-md-6 col-lg-3 mb-4 mb-lg-0">
                      <div class="card">
                          <h5 class="card-header">การจองคิวทั้งหมด</h5>
                          <div class="card-body">
                              <h5> จำนวน: <span id="userCount"></span> คน</h5>
                              <p id="currentMonth"></p>
                              <p></p>
                          </div>
                      </div>
                  </div>
                  <div class="col-12 col-md-6 col-lg-3 mb-4 mb-lg-0">
                      <div class="card">
                          <h5 class="card-header">พื้นที่การจองมากที่สุด</h5>
                          <div class="card-body">
                              <p class="card-title">จังหวัดที่มีการจองมากที่สุด: <span id="mostBookedProvince" class="text-success"></span></p>
                              <p class="card-title">จังหวัดที่มีการจองน้อยที่สุด: <span id="leastBookedProvince" class="text-danger"></span></p>
                              <p></p>
                          </div>
                      </div>
                  </div>
                  <div class="col-12 col-md-6 col-lg-3 mb-4 mb-lg-0">
                    <div class="card">
                        <h5 class="card-header">สถานะยืนยันนัดสำรวจ</h5>
                        <div class="card-body">
                          <p class="card-text text-warning">รอการยืนยัน: <span id="pendingConfirmation" class="text-warning">(จำนวน) คน</span></p>
                          <p class="card-text text-success">ยืนยันแล้ว: <span id="confirmed" class="text-success">(จำนวน) คน</span></p>                          
                        </div>
                    </div>  
                </div>
              </div>
              
              <div class="row">
                <div class="col-12 mb-4 mb-lg-0">
                  <div class="card">
                    <h5 class="card-header">การจองล่าสุด</h5>
                    <div class="card-body">
                      <div class="table-responsive">
                        <table class="table w-100">
                          <thead>
                            <tr>
                              <th scope="col">ชื่อ</th>
                              <th scope="col">นามสกุล</th>
                              <th scope="col">ที่อยู่</th>
                              <th scope="col">จังหวัด</th>
                              <th scope="col">อำเภอ</th>
                              <th scope="col">ตำบล</th>
                              <th scope="col">วันที่จอง</th>
                              <th scope="col">สถานะ</th>
                              <th scope="col">เบอร์โทรศัพท์</th>
                              <th scope="col">การจองล่าสุด</th>
                            </tr>
                          </thead>
                          <tbody id="userTableBody">
                            <!-- Rows will be inserted here by JavaScript -->
                          </tbody>
                        </table>
                      </div>
                      <a href="viewall.html" class="btn btn-block btn-light">View all</a>
                    </div>
                  </div>
                </div>
              </div>
                
            </main>
      `;
    }
  }


  class footer extends HTMLElement {

    connectedCallback() {
      this.innerHTML = `
            <main class="col-md-9 ml-sm-auto col-lg-10 px-md-4 py-4">
                <footer class="pt-5 d-flex justify-content-between">
                    <span>Copyright © 2019-2020 <a href="https://themesberg.com">Themesberg</a></span>
                    <ul class="nav m-0">
                        <li class="nav-item">
                          <a class="nav-link text-secondary" aria-current="page" href="#">Privacy Policy</a>
                        </li>
                        <li class="nav-item">
                          <a class="nav-link text-secondary" href="#">Terms and conditions</a>
                        </li>
                        <li class="nav-item">
                          <a class="nav-link text-secondary" href="#">Contact</a>
                        </li>
                      </ul>
                </footer>
            </main>
      `;
    }
  }

  customElements.define('footer-component', footer);
  customElements.define('dashboard-component', Dashboard);
  customElements.define('navbar-component', Navbar);
  