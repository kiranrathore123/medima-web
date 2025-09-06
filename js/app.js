function route(page) {
    const content = document.getElementById('content');
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    event.target.classList.add('active');

    switch (page) {
        case 'home':
            content.innerHTML = `
                
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <button class="btn" onclick="toggleSidebar()">☰</button>
                    <input type="text" class="form-control w-75" id="search" placeholder="Search medicine..." oninput="searchMedicine()">
                </div>

                
                <div id="searchResults" class="mb-3"></div>

                
                <div class="d-flex justify-content-between mb-3">
                    <button class="btn btn-primary" onclick="route('add')">Add Data</button>
                    <button class="btn btn-danger" onclick="route('sell')">Sell Medicine</button>
                </div>

                <!-- Notification block -->
                <div id="notifications" class="mb-3"></div>

                <!-- Khurak block -->
                <div class="text-center mb-5">
                    <button class="btn btn-warning" onclick="route('khurak')">Make Khurak</button>
                </div>

                <!-- Barcode Scanner icon -->
                <div class="fixed-bottom text-center mb-3">
                    <button class="btn btn-dark rounded-circle" style="width:60px;height:60px;" onclick="openBarcodeScanner()">📷</button>
                </div>
            `;
            loadNotifications();
            break;

        case 'add':
            content.innerHTML = `
              <h4>Add Medicine</h4>
              <form onsubmit="addMedicine(event)">
                <input class="form-control mb-2" id="name" placeholder="Name" required>
                <input class="form-control mb-2" id="expiry" placeholder="Expiry Date (YYYY-MM-DD)" required>
                <input class="form-control mb-2" id="mfg" placeholder="Manufacture Date" required>
                <input class="form-control mb-2" id="rate" type="number" placeholder="Rate" required>
                <input class="form-control mb-2" id="mrp" type="number" placeholder="MRP" required>
                <input class="form-control mb-2" id="quantity" type="number" placeholder="Quantity" required>
                <button class="btn btn-success">Add</button>
              </form>
              <div id="addStatus"></div>
            `;
            break;

        case 'sell':
            content.innerHTML = `
              <h4>Sell Medicine</h4>
              <form onsubmit="sellMedicine(event)">
                <input class="form-control mb-2" id="sellName" placeholder="Name" required>
                <input class="form-control mb-2" id="sellExpiry" placeholder="Expiry Date (YYYY-MM-DD)" required>
                <input class="form-control mb-2" id="sellQty" type="number" placeholder="Quantity" required>
                <button class="btn btn-danger">Sell</button>
              </form>
              <div id="sellStatus"></div>
            `;
            break;

        case 'khurak':
            content.innerHTML = `
                    <h4>Make Khurak</h4>
                    <div class="row">
                        <div class="col-md-6">
                            <input class="form-control mb-2" id="searchKhurak" placeholder="Search Disease..." oninput="searchKhurak()">
                            <div id="searchKhurakResults" class="mt-2"></div>
                        </div>
            
                        <!-- Add Khurak -->
                        <div class="col-md-6">
                            <form onsubmit="addKhurak(event)">
                                <input class="form-control mb-2" id="disease" placeholder="Disease Name" required>
                                <textarea class="form-control mb-2" id="description" placeholder="Description" required></textarea>
                                <button class="btn btn-success">Add Khurak</button>
                            </form>
                            <div id="addKhurakStatus" class="mt-2"></div>
                        </div>
                    </div>
                `;
            break;

        case 'barcode':
            content.innerHTML = `
                    <h4>Scan Barcode</h4>
                    <div id="scanner-container" class="rounded border mb-3" style="position:relative; width:100%; height:300px;"></div>
                    <div id="barcodeResult" class="mt-3"></div>
                    <button class="btn btn-secondary" onclick="stopScanner()">Stop Scanner</button>
                `;
            startScanner();
            break;

    }
}

function loadNotifications() {
    fetch('http://192.168.164.69/medima-web/api/get_notifications.php')
        .then(res => res.json())
        .then(data => {
            let html = `<strong>Low Stock:</strong><ul>`;
            data.lowStock.forEach(med => html += `<li>${med.name} (${med.quantity})</li>`);
            html += `</ul><strong>Expiring Soon:</strong><ul>`;
            data.expiringSoon.forEach(med => html += `<li>${med.name} (${med.expiry})</li>`);
            html += `</ul>`;
            document.getElementById('notifications').innerHTML = html;
        });
}

function addMedicine(e) {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const expiry = document.getElementById("expiry").value;
    const mfg = document.getElementById("mfg").value;
    const rate = parseFloat(document.getElementById("rate").value);
    const mrp = parseFloat(document.getElementById("mrp").value);
    const quantity = parseInt(document.getElementById("quantity").value);
    const data = { name, expiry, mfg, rate, mrp, quantity };

    fetch("http://192.168.164.69/medima-web/api/add_medicine.php", {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
        .then(res => res.text())
        .then(msg => {
            document.getElementById("addStatus").innerHTML = msg;
        })
        .catch(err => {
            document.getElementById("addStatus").innerHTML = `<div class="text-danger">Failed to send request.</div>`;
        });
}

function sellMedicine(e) {
    e.preventDefault();
    const data = {
        name: sellName.value,
        expiry: sellExpiry.value,
        quantity: sellQty.value
    };

    fetch('http://192.168.164.69/medima-web/api/sell_medicine.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(res => res.text())
        .then(msg => document.getElementById('sellStatus').innerHTML = msg);
}

function addKhurak(e) {
    e.preventDefault();
    const disease = document.getElementById("disease").value.trim();
    const description = document.getElementById("description").value.trim();

    fetch("http://192.168.164.69/medima-web/api/add_khurak.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ disease, description })
    })
        .then(res => res.text())
        .then(msg => {
            document.getElementById("addKhurakStatus").innerHTML = msg;
            document.getElementById("disease").value = "";
            document.getElementById("description").value = "";
        })
        .catch(() => {
            document.getElementById("addKhurakStatus").innerHTML = `<div class='text-danger'>Failed to save khurak.</div>`;
        });
}

function searchKhurak() {
    const query = document.getElementById("searchKhurak").value.trim();

    if (!query) {
        document.getElementById("searchKhurakResults").innerHTML = "";
        return;
    }

    fetch(`http://192.168.164.69/medima-web/api/search_khurak.php?query=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
            if (data.length === 0) {
                document.getElementById("searchKhurakResults").innerHTML = "<div class='text-muted'>No khurak found.</div>";
                return;
            }

            let html = "<ul>";
            data.forEach(k => {
                html += `<li><strong>${k.disease}</strong>: ${k.description}</li>`;
            });
            html += "</ul>";
            document.getElementById("searchKhurakResults").innerHTML = html;
        })
        .catch(() => {
            document.getElementById("searchKhurakResults").innerHTML = "<div class='text-danger'>Search failed.</div>";
        });
}



function searchMedicine() {
    const query = document.getElementById("search").value.trim();

    if (query.length === 0) {
        document.getElementById("searchResults").innerHTML = "";
        return;
    }

    fetch(`http://192.168.164.69/medima-web/api/search_medicine.php?query=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
            if (data.length === 0) {
                document.getElementById("searchResults").innerHTML = "<div class='text-muted'>No medicines found.</div>";
                return;
            }

            let html = `<ul>`;
            data.forEach(med => {
                html += `<li><strong>${med.name}</strong> - Qty: ${med.quantity}, Exp: ${med.expiry}</li>`;
            });
            html += `</ul>`;
            document.getElementById("searchResults").innerHTML = html;
        })
        .catch(err => {
            document.getElementById("searchResults").innerHTML = "<div class='text-danger'>Search failed.</div>";
        });
}
function startScanner() {
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector('#scanner-container'),
            constraints: {
                width: 480,
                height: 320,
                facingMode: "environment" // or "user" for front camera
            }
        },
        decoder: {
            readers: ["code_128_reader", "ean_reader", "ean_8_reader", "upc_reader", "upc_e_reader"]
        }
    }, function (err) {
        if (err) {
            console.error("Quagga init error:", err);
            return;
        }
        Quagga.start();
    });

    Quagga.onDetected(data => {
        const code = data.codeResult.code;
        document.getElementById('barcodeResult').innerHTML = `<div class="alert alert-success">Scanned Code: ${code}</div>`;
        Quagga.stop();

        // Optionally, use the code to search the database or fill form
        // fetchMedicineByBarcode(code);
    });
}

function stopScanner() {
    Quagga.stop();
    document.getElementById('barcodeResult').innerHTML = `<div class="text-muted">Scanner stopped.</div>`;
}


function toggleSidebar() {
    alert("Sidebar toggle not implemented yet.");
}

window.onload = () => route('home');
