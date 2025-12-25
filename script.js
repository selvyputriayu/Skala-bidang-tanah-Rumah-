// ================= LOGIN =================
function login() {
  if (user.value && pass.value) {
    localStorage.setItem("login", "true");
    location.href = "home.html";
  } else alert("Isi login");
}

if (location.pathname.includes("home.html") &&
    localStorage.getItem("login") !== "true") {
  location.href = "index.html";
}

// ================= MAP =================
if (document.getElementById("map")) {

var map = L.map("map").setView([-7.6959, 111.9424], 17);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

var titik = [
  [-7.6956, 111.9419],
  [-7.6955, 111.9432],
  [-7.6964, 111.9433],
  [-7.6965, 111.9420]
];

var poly = L.polygon(titik, {
  fillColor: "red",
  fillOpacity: 0.6,
  color: "white"
}).addTo(map);

map.fitBounds(poly.getBounds());

// ================= UPDATE =================
function update() {
  poly.setLatLngs(titik);

  // luas
  let turfPts = titik.map(t => [t[1], t[0]]);
  turfPts.push(turfPts[0]);
  let luas = turf.area(turf.polygon([turfPts]));
  luasEl.innerText = luas.toFixed(2);

  // sisi
  sisi.innerHTML = "";
  titik.forEach((p, i) => {
    let q = titik[(i+1)%titik.length];
    let d = map.distance(p, q);
    sisi.innerHTML += `<li>Sisi ${i+1}: ${d.toFixed(2)} m</li>`;
  });
}
update();

// ================= TAMBAH TITIK =================
let tambah = false;
function aktifTambah() {
  tambah = true;
  alert("Klik peta");
}

map.on("click", e => {
  if (tambah) {
    titik.push([e.latlng.lat, e.latlng.lng]);
    update();
  }
});

// ================= GPS =================
function ambilGPS() {
  if (!navigator.geolocation) return alert("GPS tidak didukung");

  navigator.geolocation.getCurrentPosition(p => {
    let lat = p.coords.latitude;
    let lng = p.coords.longitude;
    map.setView([lat,lng],18);
    L.marker([lat,lng]).addTo(map);
  });
}

// ================= PDF =================
function exportPDF() {
  const pdf = new window.jspdf.jsPDF();
  pdf.text("DATA BIDANG TANAH", 10, 10);
  pdf.text("Luas: " + luasEl.innerText + " m²", 10, 20);
  pdf.save("bidang-tanah.pdf");
}

// ================= LOGOUT =================
function logout() {
  localStorage.clear();
  location.href="index.html";
}

// ELEMENT
var luasEl = document.getElementById("luas");
var sisi = document.getElementById("sisi");

}
