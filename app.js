/* Lifeline Blood Center — demo site for Microsoft Clarity sales demos. */

/* ---------- Visitor mix ----------
   A link with ?mix sends each visitor to a landing page with a randomly
   chosen traffic source (UTM tags), so the Referrer, Source and Campaign
   cards in Clarity get a realistic spread. It runs before Clarity loads, so
   the redirect itself is never recorded. */
var MIX = [
  { w: 34, page: "eligibility.html", utm: "utm_source=facebook&utm_medium=paid_social&utm_campaign=fall_donor_drive" },
  { w: 10, page: "eligibility.html", utm: "utm_source=instagram&utm_medium=social&utm_campaign=fall_donor_drive" },
  { w: 16, page: "index.html", utm: "utm_source=google&utm_medium=cpc&utm_campaign=brand_search" },
  { w: 14, page: "book.html", utm: "utm_source=newsletter&utm_medium=email&utm_campaign=september_newsletter" },
  { w: 6, page: "host-a-drive.html", utm: "utm_source=linkedin&utm_medium=social&utm_campaign=corporate_drives" },
  { w: 20, page: "index.html", utm: "" }
];
(function visitorMix() {
  var params = new URLSearchParams(location.search);
  if (!params.has("mix")) return;
  var total = MIX.reduce(function (s, m) { return s + m.w; }, 0), r = Math.random() * total, pick = MIX[0];
  for (var i = 0; i < MIX.length; i++) { r -= MIX[i].w; if (r <= 0) { pick = MIX[i]; break; } }
  window.__redirecting = true;
  location.replace(pick.page + (pick.utm ? "?" + pick.utm : ""));
})();

(function loadClarity() {
  var id = (window.CLARITY_PROJECT_ID || "").trim();
  if (!id || window.__redirecting || document.documentElement.hasAttribute("data-no-clarity")) return;
  (function (c, l, a, r, i, t, y) {
    c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
    t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
    y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
  })(window, document, "clarity", "script", id);
})();

function clarityCall() { if (typeof window.clarity === "function") window.clarity.apply(null, arguments); }
function track(name) { clarityCall("event", name); }
function tag(k, v) { clarityCall("set", k, v); }

/* State lives in window.name so it carries across pages in one tab. */
var store = {
  all: function () { try { return JSON.parse(window.name || "{}"); } catch (e) { return {}; } },
  get: function (k, d) { var a = store.all(); return k in a ? a[k] : d; },
  set: function (k, v) { var a = store.all(); a[k] = v; window.name = JSON.stringify(a); }
};

(function rememberCampaign() {
  var p = new URLSearchParams(location.search);
  if (p.get("utm_campaign")) { store.set("campaign", p.get("utm_campaign")); store.set("source", p.get("utm_source") || ""); }
  var c = store.get("campaign", "");
  if (c) { tag("campaign", c); tag("source", store.get("source", "")); }
})();

/* ---------- Data ---------- */
var LOCATIONS = [
  { id: "downtown", type: "center", name: "Downtown Donor Center", addr: "410 Pine Street", hours: "Mon–Sat · 7 am–7 pm", note: "Whole blood, platelets, plasma" },
  { id: "northgate", type: "center", name: "Northgate Donor Center", addr: "1122 N 103rd Street", hours: "Tue–Sun · 8 am–6 pm", note: "Whole blood, platelets" },
  { id: "eastside", type: "center", name: "Eastside Donor Center", addr: "88 Bellfield Avenue", hours: "Mon–Fri · 9 am–7 pm", note: "Whole blood, Power Red" },
  { id: "lincoln", type: "drive", name: "Lincoln High School Gym", addr: "4400 Interlake Avenue", hours: "Sat, Oct 3 · 9 am–3 pm", note: "Community drive · 22 spots left" },
  { id: "harbor", type: "drive", name: "Harbor Tech Campus", addr: "2 Harbor Way, Building C", hours: "Wed, Oct 7 · 10 am–4 pm", note: "Corporate drive · open to public" },
  { id: "stmark", type: "drive", name: "St. Mark Community Hall", addr: "760 Maple Road", hours: "Sun, Oct 11 · 11 am–5 pm", note: "Community drive · 35 spots left" }
];
var TYPES = [
  { t: "O−", lvl: 18, gives: "Everyone", gets: "O−", note: "Universal donor. Used first in trauma care when there’s no time to test." },
  { t: "O+", lvl: 42, gives: "O+, A+, B+, AB+", gets: "O+, O−", note: "The most common type, and the one hospitals use most." },
  { t: "A−", lvl: 55, gives: "A−, A+, AB−, AB+", gets: "A−, O−", note: "A− platelets can go to patients of any blood type." },
  { t: "A+", lvl: 71, gives: "A+, AB+", gets: "A+, A−, O+, O−", note: "One of the most common types. Great for platelet donation." },
  { t: "B−", lvl: 34, gives: "B−, B+, AB−, AB+", gets: "B−, O−", note: "Fewer than 2 in 100 people have B−." },
  { t: "B+", lvl: 66, gives: "B+, AB+", gets: "B+, B−, O+, O−", note: "B+ donors help patients with B+ and AB+ blood." },
  { t: "AB−", lvl: 48, gives: "AB−, AB+", gets: "All negative types", note: "The rarest type. AB plasma is universal." },
  { t: "AB+", lvl: 80, gives: "AB+", gets: "Everyone", note: "Universal recipient, and universal plasma donor." }
];
function level(n) { return n < 30 ? ["low", "Critical"] : n < 50 ? ["mid", "Low"] : ["ok", "Stable"]; }

/* ---------- Shell ---------- */
var LOGO = '<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M16 3C16 3 6 14.5 6 20.5a10 10 0 0 0 20 0C26 14.5 16 3 16 3Z" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/><path d="M10 21h3.5l2-4 2.5 7 1.8-3H22" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
var SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
var MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
var MENU = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';

function renderShell() {
  var page = document.body.dataset.page;
  var cur = function (p) { return page === p ? ' aria-current="page"' : ""; };
  var h = document.getElementById("site-header");
  if (h) h.innerHTML =
    '<a class="skip" href="#main">Skip to content</a>' +
    '<div class="alert-bar">O-negative supply is critically low. <a href="book.html">Book a donation this week</a></div>' +
    '<header class="site-header"><div class="wrap">' +
      '<a class="brand" href="index.html" aria-label="Lifeline Blood Center home">' + LOGO + '<span>Lifeline</span></a>' +
      '<nav class="nav" id="nav" aria-label="Main">' +
        '<a href="eligibility.html"' + cur("eligibility") + '>Eligibility Checker<span class="new">New</span></a>' +
        '<a href="locations.html"' + cur("locations") + '>Locations</a>' +
        '<a href="blood-types.html"' + cur("types") + '>Blood types</a>' +
        '<a href="host-a-drive.html"' + cur("host") + '>Host a drive</a>' +
      '</nav>' +
      '<div class="head-actions">' +
        '<button class="icon-btn" id="theme" aria-label="Toggle dark mode"></button>' +
        '<button class="icon-btn menu-btn" id="menu" aria-label="Open menu" aria-expanded="false">' + MENU + '</button>' +
        '<a class="btn sm" href="book.html">Book a donation</a>' +
      '</div>' +
    '</div></header>';
  var f = document.getElementById("site-footer");
  if (f) f.innerHTML =
    '<footer class="site-footer"><div class="wrap">' +
      '<div><a class="brand" href="index.html">' + LOGO + '<span>Lifeline</span></a><p style="margin-top:.8rem;max-width:32ch">Community-supported blood center serving 40 hospitals across the region since 1968.</p></div>' +
      '<div><h4>Donate</h4><ul><li><a href="eligibility.html">Eligibility Checker</a></li><li><a href="book.html">Book a donation</a></li><li><a href="locations.html">Locations</a></li></ul></div>' +
      '<div><h4>Learn</h4><ul><li><a href="blood-types.html">Blood types</a></li><li><a href="index.html#after">After you donate</a></li></ul></div>' +
      '<div><h4>Partner</h4><ul><li><a href="host-a-drive.html">Host a drive</a></li><li><a href="host-a-drive.html#form">Corporate programs</a></li></ul></div>' +
      '<p class="fine">Lifeline Blood Center is a fictional organization made for product demos. Eligibility results on this site are not medical advice.</p>' +
    '</div></footer>';

  var root = document.documentElement, t = document.getElementById("theme");
  var theme = store.get("theme", matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  function applyTheme() { root.setAttribute("data-theme", theme); if (t) t.innerHTML = theme === "dark" ? SUN : MOON; }
  applyTheme();
  if (t) t.addEventListener("click", function () { theme = theme === "dark" ? "light" : "dark"; store.set("theme", theme); applyTheme(); });
  var m = document.getElementById("menu"), nav = document.getElementById("nav");
  if (m) m.addEventListener("click", function () { var o = nav.classList.toggle("open"); m.setAttribute("aria-expanded", o); });
}

/* ---------- Home ---------- */
function initHome() {
  var wrap = document.getElementById("supply"), detail = document.getElementById("type-detail");
  if (!wrap) return;
  wrap.innerHTML = TYPES.map(function (x, i) {
    var l = level(x.lvl);
    return '<button class="type-tile" data-i="' + i + '" aria-pressed="false"><div class="t">' + x.t + '</div>' +
      '<div class="meter"><i style="height:' + x.lvl + '%;background:var(--' + l[0] + ')"></i></div>' +
      '<div class="lvl ' + l[0] + '">' + l[1] + '</div></button>';
  }).join("");
  wrap.addEventListener("click", function (e) {
    var b = e.target.closest(".type-tile"); if (!b) return;
    wrap.querySelectorAll(".type-tile").forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
    b.setAttribute("aria-pressed", "true");
    var x = TYPES[+b.dataset.i];
    detail.innerHTML = '<strong>' + x.t + ':</strong> ' + x.note + ' Can give to ' + x.gives + '. <a href="book.html">Book a donation</a>';
    track("blood_type_viewed");
  });
  var drives = document.getElementById("drives");
  if (drives) drives.innerHTML = LOCATIONS.filter(function (l) { return l.type === "drive"; }).map(function (l) {
    return '<article class="card drive"><div class="date">' + l.hours.split(" · ")[0] + '</div><h3>' + l.name + '</h3>' +
      '<p class="muted">' + l.addr + ' · ' + l.hours.split(" · ")[1] + '</p>' +
      '<div class="spots"><span>' + l.note.split(" · ")[1] + '</span><a class="btn sm ghost" href="book.html?loc=' + l.id + '">Reserve</a></div></article>';
  }).join("");
}

/* ---------- Eligibility checker ---------- */
var QUESTIONS = [
  { q: "How old are you?", hint: "Donors 16–17 need a signed parent consent form.", opts: [["Under 16", "no"], ["16 or 17", "ok"], ["18 or older", "ok"]] },
  { q: "Do you weigh at least 110 lbs (50 kg)?", hint: "This keeps donating safe for you.", opts: [["Yes", "ok"], ["No", "no"], ["Not sure", "ok"]] },
  { q: "Are you feeling healthy and well today?", hint: "No cold, flu or fever in the last 48 hours.", opts: [["Yes, I feel great", "ok"], ["I’m a little under the weather", "wait"]] },
  { q: "Have you given whole blood in the last 8 weeks?", hint: "Your body needs about 56 days to rebuild red cells.", opts: [["No", "ok"], ["Yes", "wait"], ["I’ve never donated", "ok"]] },
  { q: "Have you had a tattoo or piercing in the last 3 months?", hint: "Only matters if it was done somewhere that isn’t state-licensed.", opts: [["No", "ok"], ["Yes, at a licensed studio", "ok"], ["Yes, somewhere else", "wait"]] },
  { q: "Have you traveled outside the country in the last 3 months?", hint: "Some regions have a short waiting period.", opts: [["No", "ok"], ["Yes", "ok"]] }
];
function initEligibility() {
  var box = document.getElementById("quiz"); if (!box) return;
  var i = 0, answers = [], started = false;
  function render() {
    document.getElementById("bar").style.width = (i / QUESTIONS.length * 100) + "%";
    if (i >= QUESTIONS.length) return result();
    var q = QUESTIONS[i];
    box.innerHTML = '<div class="q"><div class="q-count">Question ' + (i + 1) + ' of ' + QUESTIONS.length + '</div><h2>' + q.q + '</h2><p class="hint">' + q.hint + '</p>' +
      '<div class="options">' + q.opts.map(function (o, k) { return '<button class="opt" data-k="' + k + '">' + o[0] + '</button>'; }).join("") + '</div>' +
      '<div class="quiz-nav">' + (i ? '<button class="linkish" id="back">Back</button>' : '<span></span>') + '<span class="muted" style="font-size:var(--text-xs)">About 60 seconds</span></div></div>';
    box.querySelectorAll(".opt").forEach(function (b) {
      b.addEventListener("click", function () {
        if (!started) { started = true; track("eligibility_started"); }
        answers[i] = q.opts[+b.dataset.k][1]; i++; render();
      });
    });
    var back = document.getElementById("back"); if (back) back.addEventListener("click", function () { i--; render(); });
  }
  function result() {
    var no = answers.indexOf("no") > -1, wait = answers.indexOf("wait") > -1;
    var status = no ? "not_now" : wait ? "wait" : "eligible";
    store.set("eligibility", status);
    tag("eligibility_result", status);
    track(status === "eligible" ? "eligibility_eligible" : "eligibility_not_yet");
    if (status === "eligible") {
      box.innerHTML = '<div class="result"><div class="badge yes">✓</div><h2>Good news, you’re likely eligible</h2><p>Staff will confirm a few details at your appointment. Most donations take about an hour from check-in to snacks.</p><a class="btn" href="book.html" id="book-cta">Book your donation</a></div>';
    } else if (status === "wait") {
      box.innerHTML = '<div class="result"><div class="badge wait">!</div><h2>You may need to wait a little</h2><p>Based on your answers, you might need a short waiting period. You can still book a date a few weeks out, or call us to check.</p><a class="btn" href="book.html">Book a later date</a> <a class="btn ghost" href="locations.html">Call a center</a></div>';
    } else {
      box.innerHTML = '<div class="result"><div class="badge wait">!</div><h2>You can’t donate right now</h2><p>You can still help. Hosting a blood drive at your school or workplace brings in dozens of donors.</p><a class="btn" href="host-a-drive.html">Host a drive</a></div>';
    }
    box.insertAdjacentHTML("beforeend", '<p style="text-align:center;margin-top:1rem"><button class="linkish" id="restart">Start over</button></p>');
    document.getElementById("restart").addEventListener("click", function () { i = 0; answers = []; render(); });
  }
  render();
}

/* ---------- Booking ---------- */
function initBook() {
  var form = document.getElementById("book-form"); if (!form) return;
  var pre = new URLSearchParams(location.search).get("loc") || "downtown";
  document.getElementById("locs").innerHTML = LOCATIONS.map(function (l) {
    return '<div class="choice"><input type="radio" name="loc" id="l-' + l.id + '" value="' + l.id + '"' + (l.id === pre ? " checked" : "") + '><label for="l-' + l.id + '">' + l.name + '<small>' + l.hours + '</small></label></div>';
  }).join("");
  var days = [], d = new Date();
  for (var k = 1; days.length < 8; k++) { var x = new Date(d.getTime() + k * 864e5); if (x.getDay() !== 0) days.push(x); }
  document.getElementById("days").innerHTML = days.map(function (x, n) {
    var lab = x.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    return '<div class="choice"><input type="radio" name="day" id="d' + n + '" value="' + lab + '"><label for="d' + n + '">' + lab + '</label></div>';
  }).join("");
  var slots = ["8:00 am", "9:30 am", "11:00 am", "12:30 pm", "2:00 pm", "3:30 pm", "5:00 pm"];
  document.getElementById("times").innerHTML = slots.map(function (s, n) {
    return '<div class="choice"><input type="radio" name="time" id="t' + n + '" value="' + s + '"><label for="t' + n + '">' + s + '</label></div>';
  }).join("");
  var elig = store.get("eligibility", "");
  document.getElementById("elig-note").innerHTML = elig === "eligible"
    ? '<span style="color:var(--ok);font-weight:700">✓ Eligibility check passed</span>'
    : 'Not sure you can donate? <a href="eligibility.html">Take the 60-second Eligibility Checker</a>';
  function upd() {
    var fd = new FormData(form), l = LOCATIONS.find(function (z) { return z.id === fd.get("loc"); });
    document.getElementById("s-loc").textContent = l ? l.name : "—";
    document.getElementById("s-day").textContent = fd.get("day") || "—";
    document.getElementById("s-time").textContent = fd.get("time") || "—";
  }
  form.addEventListener("change", upd); upd();
  var began = false;
  form.addEventListener("input", function () { if (!began) { began = true; track("booking_started"); } });
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var fd = new FormData(form), err = document.getElementById("err");
    if (!fd.get("day") || !fd.get("time")) { err.textContent = "Please choose a date and time."; track("booking_missing_time"); return; }
    if (!fd.get("name") || !/\S+@\S+\.\S+/.test(fd.get("email") || "")) { err.textContent = "Please add your name and a valid email."; return; }
    var l = LOCATIONS.find(function (z) { return z.id === fd.get("loc"); });
    store.set("booking", { loc: l.name, addr: l.addr, day: fd.get("day"), time: fd.get("time"), name: fd.get("name") });
    tag("booked_location", l.id);
    track("appointment_booked");
    location.href = "confirmed.html";
  });
}

function initConfirmed() {
  var el = document.getElementById("conf"); if (!el) return;
  var b = store.get("booking", null);
  if (!b) { el.innerHTML = '<p class="muted">No appointment found in this tab. <a href="book.html">Book a donation</a></p>'; return; }
  el.innerHTML = '<dl><dt>Name</dt><dd>' + b.name.replace(/</g, "&lt;") + '</dd><dt>Where</dt><dd>' + b.loc + '<br><span class="muted">' + b.addr + '</span></dd><dt>When</dt><dd>' + b.day + ' · ' + b.time + '</dd></dl>';
  var cal = document.getElementById("cal");
  if (cal) cal.addEventListener("click", function () { cal.textContent = "Added to calendar"; cal.disabled = true; track("add_to_calendar"); });
  var sh = document.getElementById("share");
  if (sh) sh.addEventListener("click", function () { sh.textContent = "Link copied"; track("share_clicked"); });
}

/* ---------- Locations ---------- */
function initLocations() {
  var list = document.getElementById("loc-list"); if (!list) return;
  function draw(f) {
    list.innerHTML = LOCATIONS.filter(function (l) { return f === "all" || l.type === f; }).map(function (l) {
      return '<article class="card loc"><span class="tag">' + (l.type === "center" ? "Donor center" : "Blood drive") + '</span><h3>' + l.name + '</h3>' +
        '<div class="meta">' + l.addr + '<br>' + l.hours + '<br>' + l.note + '</div><a class="btn sm" href="book.html?loc=' + l.id + '">Book here</a></article>';
    }).join("");
  }
  var bar = document.getElementById("filters");
  bar.addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    bar.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
    b.setAttribute("aria-pressed", "true"); draw(b.dataset.f); track("location_filter");
  });
  draw("all");
  var z = document.getElementById("zip-form");
  if (z) z.addEventListener("submit", function (e) { e.preventDefault(); document.getElementById("zip-out").textContent = "Showing locations sorted by distance."; track("zip_search"); });
}

/* ---------- Blood types ---------- */
function initTypes() {
  var p = document.getElementById("picker"); if (!p) return;
  p.innerHTML = TYPES.map(function (x, i) { return '<button data-i="' + i + '" aria-pressed="false">' + x.t + '</button>'; }).join("");
  var out = document.getElementById("compat-out");
  p.addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    p.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
    b.setAttribute("aria-pressed", "true");
    var x = TYPES[+b.dataset.i];
    var pills = function (s) { return s.split(", ").map(function (v) { return '<span class="pill">' + v + '</span>'; }).join(""); };
    out.innerHTML = '<div class="card"><h3>You can give to</h3><div style="margin-top:.6rem">' + pills(x.gives) + '</div></div>' +
      '<div class="card"><h3>You can receive from</h3><div style="margin-top:.6rem">' + pills(x.gets) + '</div></div>';
    track("compatibility_checked");
  });
  var tb = document.getElementById("compat-table");
  if (tb) tb.innerHTML = TYPES.map(function (x) { var l = level(x.lvl); return '<tr><td><strong>' + x.t + '</strong></td><td>' + x.gives + '</td><td>' + x.gets + '</td><td class="lvl ' + l[0] + '">' + l[1] + '</td></tr>'; }).join("");
}

/* ---------- Host a drive ---------- */
function initHost() {
  var f = document.getElementById("host-form"); if (!f) return;
  f.addEventListener("submit", function (e) {
    e.preventDefault();
    var fd = new FormData(f), err = document.getElementById("host-err");
    if (!fd.get("org") || !/\S+@\S+\.\S+/.test(fd.get("email") || "")) { err.textContent = "Please add your organization and a valid email."; return; }
    f.innerHTML = '<h3>Thanks, we got it</h3><p class="muted" style="margin-top:.5rem">A drive coordinator will email you within two business days.</p>';
    track("drive_host_request");
  });
}

/* ---------- Guide ---------- */
function initGuide() {
  var box = document.getElementById("links"); if (!box) return;
  var base = location.href.replace(/[^/]*$/, "");
  var rows = [
    ["Friends link (random mix of sources)", "index.html?mix"],
    ["Facebook ad → Eligibility Checker", "eligibility.html?utm_source=facebook&utm_medium=paid_social&utm_campaign=fall_donor_drive"],
    ["Instagram post → Eligibility Checker", "eligibility.html?utm_source=instagram&utm_medium=social&utm_campaign=fall_donor_drive"],
    ["Google search ad → Home", "index.html?utm_source=google&utm_medium=cpc&utm_campaign=brand_search"],
    ["Email newsletter → Book", "book.html?utm_source=newsletter&utm_medium=email&utm_campaign=september_newsletter"],
    ["LinkedIn → Host a drive", "host-a-drive.html?utm_source=linkedin&utm_medium=social&utm_campaign=corporate_drives"],
    ["Direct visit → Home", "index.html"]
  ];
  box.innerHTML = rows.map(function (r) {
    var u = base + r[1];
    return '<div class="linkrow"><div><b>' + r[0] + '</b><code>' + u + '</code></div><button class="btn sm ghost" data-u="' + u + '">Copy</button></div>';
  }).join("");
  box.addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    var done = function () { b.textContent = "Copied"; setTimeout(function () { b.textContent = "Copy"; }, 1500); };
    if (navigator.clipboard) navigator.clipboard.writeText(b.dataset.u).then(done, function () { prompt("Copy this link", b.dataset.u); });
    else prompt("Copy this link", b.dataset.u);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  if (window.__redirecting) return;
  renderShell(); initHome(); initEligibility(); initBook(); initConfirmed(); initLocations(); initTypes(); initHost(); initGuide();
});
