```javascript
/* =====================================================
   VAKA-1407
   THE MILLER MURDER
   GAME SYSTEM
===================================================== */

let timeLeft = 20 * 60;
let timerStarted = false;
let timerInterval = null;

let score = 0;
let evidenceCollected = new Set();
let interrogationsCompleted = new Set();


/* =====================================================
   SAYFA / EKRAN SİSTEMİ
===================================================== */

function showScreen(screenId) {

    const screens = document.querySelectorAll(".screen");

    screens.forEach(screen => {
        screen.classList.remove("active");
    });

    const target = document.getElementById(screenId);

    if (target) {
        target.classList.add("active");
        window.scrollTo(0, 0);
    }
}


/* =====================================================
   SORUŞTURMAYI BAŞLAT
===================================================== */

function startInvestigation() {

    showScreen("case");

    if (!timerStarted) {
        timerStarted = true;
        startTimer();
    }
}


/* =====================================================
   ZAMANLAYICI
===================================================== */

function startTimer() {

    updateTimer();

    timerInterval = setInterval(() => {

        if (timeLeft <= 0) {

            clearInterval(timerInterval);

            timeLeft = 0;
            updateTimer();

            alert(
                "SORUŞTURMA SÜRESİ DOLDU!\n\n" +
                "Artık son kararını vermelisin."
            );

            return;
        }

        timeLeft--;

        updateTimer();

    }, 1000);
}


function updateTimer() {

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const formatted =
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0");

    const timer = document.getElementById("timer");
    const menuTimer = document.getElementById("menuTimer");

    if (timer) {
        timer.textContent = formatted;
    }

    if (menuTimer) {
        menuTimer.textContent = formatted;
    }

    updateTimerStyle(timer);
    updateTimerStyle(menuTimer);
}


function updateTimerStyle(element) {

    if (!element) return;

    element.classList.remove(
        "warning",
        "danger"
    );

    if (timeLeft <= 300 && timeLeft > 60) {
        element.classList.add("warning");
    }

    if (timeLeft <= 60) {
        element.classList.add("danger");
    }
}


/* =====================================================
   DELİL SİSTEMİ
===================================================== */

function collectEvidence(evidenceName) {

    if (evidenceCollected.has(evidenceName)) {
        return;
    }

    evidenceCollected.add(evidenceName);

    score += 5;

    updateStats();
}


function updateStats() {

    const evidenceCount =
        document.getElementById("evidenceCount");

    const interrogationCount =
        document.getElementById("interrogationCount");

    const scoreElement =
        document.getElementById("score");

    if (evidenceCount) {
        evidenceCount.textContent =
            evidenceCollected.size;
    }

    if (interrogationCount) {
        interrogationCount.textContent =
            interrogationsCompleted.size;
    }

    if (scoreElement) {
        scoreElement.textContent = score;
    }
}


/* =====================================================
   DELİL DETAYI AÇ / KAPAT
===================================================== */

function toggle(button) {

    if (!button) return;

    const details = button.nextElementSibling;

    if (!details) return;

    details.classList.toggle("show");

    if (details.classList.contains("show")) {

        button.textContent = "İNCELEMEYİ KAPAT";

    } else {

        button.textContent = "İNCELE";

    }
}


/* =====================================================
   SORGU SİSTEMİ
===================================================== */

function answer(button) {

    if (!button) return;

    const answerBox = button.nextElementSibling;

    if (!answerBox) return;

    answerBox.classList.toggle("show");
}


function completeInterrogation(suspect) {

    if (interrogationsCompleted.has(suspect)) {
        return;
    }

    interrogationsCompleted.add(suspect);

    score += 3;

    updateStats();
}


/* =====================================================
   LABORATUVAR
===================================================== */

function unlockLaboratory() {

    const result =
        document.getElementById("labResult");

    if (!result) return;

    result.innerHTML = `
        <div class="details show">
            <b>GİZLİ RAPOR AÇILDI</b>
            <br><br>
            Fare zehrinin kaynağının
            malikânenin dışındaki eski depo
            çevresindeki kimyasal maddelerle
            uyumlu olduğu tespit edildi.
            <br><br>
            Zehrin William'ın içeceğine
            karıştırılmış olma ihtimali yüksek.
        </div>
    `;

    score += 10;

    updateStats();
}


/* =====================================================
   TELEFON
===================================================== */

function unlockPhone() {

    const input =
        document.getElementById("phoneCode");

    const result =
        document.getElementById("phoneResult");

    const content =
        document.getElementById("phoneContent");

    if (!input || !result || !content) return;

    const code = input.value.trim();

    /*
       Telefon şifresi:
       20:52 -> 2052
    */

    if (code === "2052") {

        content.classList.add("unlocked");

        result.innerHTML = `
            <div class="details show">
                ✓ TELEFON KİLİDİ AÇILDI.
                <br><br>
                Silinmiş mesajlar kurtarıldı.
            </div>
        `;

        if (!content.dataset.scored) {

            score += 15;

            content.dataset.scored = "true";

            updateStats();
        }

    } else {

        result.innerHTML = `
            <div class="details show">
                ✕ Yanlış şifre.
                <br><br>
                İpucundaki önemli saati
                tekrar düşün.
            </div>
        `;
    }
}


/* =====================================================
   KAMERA
===================================================== */

function revealCamera() {

    const cameraResult =
        document.getElementById("cameraResult");

    if (!cameraResult) return;

    cameraResult.classList.add("unlocked");

    if (!cameraResult.dataset.scored) {

        score += 5;

        cameraResult.dataset.scored = "true";

        updateStats();
    }
}


/* =====================================================
   DELİL BİRLEŞTİRME
===================================================== */

function combineEvidence() {

    const first =
        document.getElementById("combineOne").value;

    const second =
        document.getElementById("combineTwo").value;

    const result =
        document.getElementById("combineResult");

    if (!result) return;

    if (!first || !second) {

        result.innerHTML = `
            <div class="details show">
                Önce iki delil seçmelisin.
            </div>
        `;

        return;
    }

    if (first === second) {

        result.innerHTML = `
            <div class="details show">
                Aynı delili iki kez seçemezsin.
            </div>
        `;

        return;
    }


    /*
       DOĞRU EŞLEŞMELER
    */

    const pair =
        [first, second]
        .sort()
        .join("-");


    if (pair === "note-metal") {

        result.innerHTML = `
            <div class="details show">
                <b>BAĞLANTI BULUNDU.</b>
                <br><br>
                Masadaki tehdit mesajı ile
                dere kenarında bulunan
                O.S. işaretli metal parça
                aynı kişinin olayla bağlantılı
                olabileceğini düşündürüyor.
                <br><br>
                <b>O.S. kim olabilir?</b>
            </div>
        `;

        score += 15;

    } else if (pair === "camera-shoes") {

        result.innerHTML = `
            <div class="details show">
                <b>BAĞLANTI BULUNDU.</b>
                <br><br>
                Kameraların kapalı olduğu süre
                ile olay yerindeki sürüklenme
                izleri arasında bağlantı olabilir.
                <br><br>
                Birinin kamera sistemini
                kapatıp olay yerinden
                uzaklaşmış olması mümkün.
            </div>
        `;

        score += 10;

    } else if (pair === "note-shoes") {

        result.innerHTML = `
            <div class="details show">
                <b>İLGİNÇ BAĞLANTI.</b>
                <br><br>
                Tehdit mesajı ve sürüklenme
                izleri olayın planlı olabileceğini
                düşündürüyor.
            </div>
        `;

        score += 5;

    } else {

        result.innerHTML = `
            <div class="details show">
                Bu iki delil arasında şu anda
                yeterli bağlantı bulunamadı.
                <br><br>
                Diğer delilleri dene.
            </div>
        `;
    }

    updateStats();
}


/* =====================================================
   DEDEKTİF DEFTERİ
===================================================== */

function saveNotes() {

    const notes =
        document.getElementById("detectiveNotes");

    const saved =
        document.getElementById("notesSaved");

    if (!notes || !saved) return;

    localStorage.setItem(
        "vaka1407_notes",
        notes.value
    );

    saved.classList.add("show");

    setTimeout(() => {
        saved.classList.remove("show");
    }, 2500);
}


function loadNotes() {

    const notes =
        document.getElementById("detectiveNotes");

    if (!notes) return;

    const savedNotes =
        localStorage.getItem("vaka1407_notes");

    if (savedNotes !== null) {
        notes.value = savedNotes;
    }
}


/* =====================================================
   SON KARAR
===================================================== */

function accuse(suspect) {

    const result =
        document.getElementById("result");

    if (!result) return;


    /*
       VAKA-1407'NİN ÇÖZÜMÜ:
       OLIVIA S.
    */

    if (suspect === "Olivia") {

        score += 50;

        result.innerHTML = `
            <div class="card result-card correct">

                <h3>
                    VAKA ÇÖZÜLDÜ
                </h3>

                <p>
                    Doğru kişi: <b>Olivia S.</b>
                </p>

                <br>

                <p>
                    Olivia'nın şirketten çıkışı
                    21:00 olarak kayıtlıydı.
                    Ancak William'ın telefonundaki
                    mesajlar 21:07 ve 21:09'da
                    olayın hâlâ devam ettiğini
                    gösteriyor.
                </p>

                <br>

                <p>
                    Dere kenarında bulunan
                    <b>O.S.</b> işaretli parça,
                    Olivia'nın kimliğine ilişkin
                    önemli bir bağlantı oluşturuyor.
                </p>

                <br>

                <p>
                    Olivia'nın malikâneye hiç
                    gitmediği yönündeki ifadesi
                    diğer delillerle çelişiyor.
                </p>

                <br>

                <h3>
                    PUAN: ${score}
                </h3>

            </div>
        `;

    } else {

        score = Math.max(0, score - 20);

        result.innerHTML = `
            <div class="card result-card wrong">

                <h3>
                    YANLIŞ ŞÜPHELİ
                </h3>

                <p>
                    <b>${getSuspectName(suspect)}</b>
                    için yeterli kanıt bulunamadı.
                </p>

                <br>

                <p>
                    Delilleri ve zaman çizelgesini
                    yeniden incele.
                </p>

                <br>

                <p>
                    Özellikle <b>21:00 - 22:30</b>
                    arasındaki olaylara dikkat et.
                </p>

                <br>

                <h3>
                    PUAN: ${score}
                </h3>

            </div>
        `;
    }

    updateStats();
}


function getSuspectName(suspect) {

    const names = {
        Jack: "Jack R.",
        Sofia: "Sofia K.",
        Katherine: "Katherine C.",
        Alex: "Alex T.",
        Emma: "Emma Miller",
        James: "James Miller",
        Olivia: "Olivia S."
    };

    return names[suspect] || suspect;
}


/* =====================================================
   SAYFA YÜKLENDİĞİNDE
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    loadNotes();

    updateStats();

    updateTimer();

});
```
