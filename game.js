/* =====================================================
   VAKA-1407
   THE MILLER MURDER
   GAME ENGINE
===================================================== */


/* =====================================================
   OYUN DURUMU
===================================================== */

const gameState = {

    started: false,

    evidenceFound: [],

    interrogated: [],

    score: 0,

    phoneUnlocked: false,

    laboratoryUnlocked: false,

    cameraViewed: false,

    combinationSolved: false,

    finalUnlocked: false,

    notes: "",

    timeLeft: 20 * 60,

    timerStarted: false,

    timerInterval: null

};


/* =====================================================
   EKRAN SİSTEMİ
===================================================== */

function showScreen(screenId) {

    document.querySelectorAll(".screen").forEach(screen => {

        screen.classList.remove("active");

    });


    const target = document.getElementById(screenId);


    if (target) {

        target.classList.add("active");

    }


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });


    updateInterface();

}


/* =====================================================
   SORUŞTURMAYI BAŞLAT
===================================================== */

function startInvestigation() {

    gameState.started = true;

    showScreen("briefing");


    if (!gameState.timerStarted) {

        startTimer();

    }

}


/* =====================================================
   20 DAKİKALIK SÜRE
===================================================== */

function startTimer() {

    gameState.timerStarted = true;


    updateTimer();


    gameState.timerInterval = setInterval(() => {

        if (gameState.timeLeft <= 0) {

            clearInterval(gameState.timerInterval);

            gameState.timeLeft = 0;

            updateTimer();

            timeExpired();

            return;

        }


        gameState.timeLeft--;

        updateTimer();

    }, 1000);

}


/* =====================================================
   TIMER GÖRÜNTÜLE
===================================================== */

function updateTimer() {

    const minutes =
        Math.floor(gameState.timeLeft / 60);

    const seconds =
        gameState.timeLeft % 60;


    const formatted =
        String(minutes).padStart(2, "0")
        + ":"
        + String(seconds).padStart(2, "0");


    const timer =
        document.getElementById("timer");

    const menuTimer =
        document.getElementById("menuTimer");


    if (timer) {

        timer.innerText = formatted;

        timer.classList.remove(
            "warning",
            "danger"
        );


        if (gameState.timeLeft <= 300) {

            timer.classList.add("danger");

        } else if (gameState.timeLeft <= 600) {

            timer.classList.add("warning");

        }

    }


    if (menuTimer) {

        menuTimer.innerText = formatted;

        menuTimer.classList.remove(
            "warning",
            "danger"
        );


        if (gameState.timeLeft <= 300) {

            menuTimer.classList.add("danger");

        } else if (gameState.timeLeft <= 600) {

            menuTimer.classList.add("warning");

        }

    }

}


/* =====================================================
   SÜRE BİTTİ
===================================================== */

function timeExpired() {

    const result =
        document.getElementById("result");


    if (result) {

        result.innerHTML = `

            <div class="card wrong">

                <h3>
                    ⏱ SÜRE DOLDU
                </h3>

                <p>
                    20 dakikalık soruşturma süren sona erdi.
                </p>

                <br>

                <p>
                    VAKA-1407 henüz çözülemedi.
                </p>

                <br>

                <p>
                    Delilleri yeniden değerlendir.
                </p>

            </div>

        `;

    }


    showScreen("accuse");

}


/* =====================================================
   DELİL SİSTEMİ
===================================================== */

function toggle(button) {

    const details =
        button.nextElementSibling;


    if (!details) return;


    details.classList.toggle("show");


    if (details.classList.contains("show")) {

        button.innerText = "GİZLE";

    } else {

        button.innerText = "İNCELE";

    }

}


/* =====================================================
   DELİL TOPLAMA
===================================================== */

function collectEvidence(evidenceId) {

    if (
        !gameState.evidenceFound.includes(
            evidenceId
        )
    ) {

        gameState.evidenceFound.push(
            evidenceId
        );


        gameState.score += 5;


        console.log(
            "Yeni delil:",
            evidenceId
        );


        updateInterface();

    }

}


/* =====================================================
   SORGU SİSTEMİ
===================================================== */

function answer(button) {

    const answerBox =
        button.nextElementSibling;


    if (!answerBox) return;


    answerBox.classList.toggle("show");


    const text =
        button.innerText;


    if (
        text &&
        !gameState.interrogated.includes(text)
    ) {

        gameState.interrogated.push(text);

        gameState.score += 2;

    }


    updateInterface();

}


/* =====================================================
   SORGU KAYDETME
===================================================== */

function completeInterrogation(suspect) {

    if (
        !gameState.interrogated.includes(
            suspect
        )
    ) {

        gameState.interrogated.push(
            suspect
        );

        gameState.score += 3;

        updateInterface();

    }

}


/* =====================================================
   ARAYÜZ GÜNCELLE
===================================================== */

function updateInterface() {

    const evidenceCount =
        document.getElementById(
            "evidenceCount"
        );


    const interrogationCount =
        document.getElementById(
            "interrogationCount"
        );


    const score =
        document.getElementById("score");


    if (evidenceCount) {

        evidenceCount.innerText =
            gameState.evidenceFound.length;

    }


    if (interrogationCount) {

        interrogationCount.innerText =
            gameState.interrogated.length;

    }


    if (score) {

        score.innerText =
            gameState.score;

    }

}


/* =====================================================
   TELEFON
===================================================== */

function unlockPhone() {

    const input =
        document.getElementById(
            "phoneCode"
        );


    const result =
        document.getElementById(
            "phoneResult"
        );


    const phoneContent =
        document.getElementById(
            "phoneContent"
        );


    if (!input || !result) return;


    const code =
        input.value.trim();


    /*
       ŞİFRE:
       2052

       William'ın telefonuna gelen
       önemli mesajın saati.
    */


    if (code === "2052") {

        gameState.phoneUnlocked = true;

        gameState.score += 20;


        result.innerHTML = `

            <div class="card correct">

                <h3>
                    ✓ TELEFON AÇILDI
                </h3>

                <p>
                    Doğru şifre.
                </p>

            </div>

        `;


        if (phoneContent) {

            phoneContent.classList.add(
                "unlocked"
            );

        }


        collectEvidence("phone");


    } else {

        gameState.score = Math.max(
            0,
            gameState.score - 3
        );


        result.innerHTML = `

            <div class="card wrong">

                <h3>
                    ✕ HATALI ŞİFRE
                </h3>

                <p>
                    Bu şifre çalışmadı.
                </p>

                <p>
                    Olaydaki önemli saatleri
                    yeniden incele.
                </p>

            </div>

        `;

    }


    updateInterface();

}


/* =====================================================
   LABORATUVAR
===================================================== */

function unlockLaboratory() {

    const result =
        document.getElementById(
            "labResult"
        );


    if (!result) return;


    if (
        gameState.evidenceFound.length < 3
    ) {

        result.innerHTML = `

            <div class="card wrong">

                <h3>
                    RAPOR KİLİTLİ
                </h3>

                <p>
                    Önce en az 3 fiziksel delili
                    incelemelisin.
                </p>

            </div>

        `;

        return;

    }


    gameState.laboratoryUnlocked = true;

    gameState.score += 10;


    result.innerHTML = `

        <div class="card correct">

            <h3>
                ✓ RAPOR AÇILDI
            </h3>

            <p>

                Zehrin kaynağının
                evde bulunan sıradan
                ilaçlardan gelmediği
                tespit edildi.

            </p>

            <br>

            <p>

                Zehir, ayrı bir kapta
                hazırlanmış ve içeceğe
                karıştırılmış olabilir.

            </p>

            <br>

            <p>

                Bu bulgu olayın intihar
                olma ihtimalini ciddi şekilde
                zayıflatıyor.

            </p>

        </div>

    `;


    collectEvidence("poisonSource");

}


/* =====================================================
   KAMERA SİSTEMİ
===================================================== */

function revealCamera() {

    const result =
        document.getElementById(
            "cameraResult"
        );


    if (!result) return;


    if (!gameState.cameraViewed) {

        gameState.cameraViewed = true;

        gameState.score += 10;

        collectEvidence("cameraLog");

    }


    result.classList.add(
        "unlocked"
    );


    result.innerHTML = `

        <p>

            Kamera sistemi manuel olarak
            devre dışı bırakılmış.

        </p>

        <br>

        <p>

            Sisteme giriş yapan kişi:

            <b>
                Alex T.
            </b>

        </p>

        <br>

        <p>

            Alex bunu kabul ediyor.

        </p>

        <br>

        <p>

            Ancak kamera kayıtlarının
            kapatılması ile cinayet arasında
            doğrudan bağlantı bulunamadı.

        </p>

        <br>

        <p>

            Alex'in gerçek amacı:

            <b>
                Emma Miller ile gizlice
                görüşmek.
            </b>

        </p>

        <br>

        <p>

            Bu durum Alex'i şüpheli yapıyor,
            fakat katil olduğunu kanıtlamıyor.

        </p>

    `;


    updateInterface();

}


/* =====================================================
   DELİL BİRLEŞTİRME
===================================================== */

function combineEvidence() {

    const first =
        document.getElementById(
            "combineOne"
        ).value;


    const second =
        document.getElementById(
            "combineTwo"
        ).value;


    const result =
        document.getElementById(
            "combineResult"
        );


    if (!result) return;


    if (!first || !second) {

        result.innerHTML = `

            <div class="card wrong">

                <p>
                    İki delil seçmelisin.
                </p>

            </div>

        `;

        return;

    }


    if (first === second) {

        result.innerHTML = `

            <div class="card wrong">

                <p>
                    Aynı delili iki kez seçemezsin.
                </p>

            </div>

        `;

        return;

    }


    /*
       ANA EŞLEŞTİRME

       Masadaki not + O.S. parçası
       Olivia'ya giden önemli bağlantı.
    */


    const correct =
        (
            first === "note" &&
            second === "metal"
        )
        ||
        (
            first === "metal" &&
            second === "note"
        );


    if (correct) {

        if (
            !gameState.combinationSolved
        ) {

            gameState.combinationSolved =
                true;

            gameState.score += 25;

        }


        result.innerHTML = `

            <div class="card correct">

                <h3>
                    ✓ BAĞLANTI BULUNDU
                </h3>

                <p>

                    Masadaki notta kullanılan
                    ifade ile William'ın özel
                    hayatı arasında güçlü bir
                    kıskançlık bağlantısı
                    bulunuyor.

                </p>

                <br>

                <p>

                    Dere kenarındaki metal
                    parçanın üzerindeki:

                    <b>
                        O.S.
                    </b>

                    baş harfleri dikkat çekiyor.

                </p>

                <br>

                <p>

                    Bu iki delil birlikte
                    değerlendirildiğinde
                    <b>Olivia S.</b>
                    önemli bir şüpheli
                    haline geliyor.

                </p>

            </div>

        `;


        collectEvidence(
            "oliviaConnection"
        );


    } else {

        gameState.score = Math.max(
            0,
            gameState.score - 5
        );


        result.innerHTML = `

            <div class="card wrong">

                <h3>
                    BAĞLANTI KURULAMADI
                </h3>

                <p>

                    Bu iki delil arasında
                    yeterince güçlü bir bağlantı
                    yok.

                </p>

                <br>

                <p>

                    Farklı delilleri karşılaştır.

                </p>

            </div>

        `;

    }


    updateInterface();

}


/* =====================================================
   NOTLAR
===================================================== */

function saveNotes() {

    const notes =
        document.getElementById(
            "detectiveNotes"
        );


    const saved =
        document.getElementById(
            "notesSaved"
        );


    if (!notes) return;


    gameState.notes =
        notes.value;


    if (saved) {

        saved.classList.add(
            "show"
        );

    }

}


/* =====================================================
   FİNAL KONTROLÜ
===================================================== */

function canMakeFinalAccusation() {

    const importantEvidence = [

        "autopsy",

        "shoes",

        "balcony",

        "note",

        "camera",

        "metal",

        "phone",

        "oliviaConnection"

    ];


    const found =
        importantEvidence.filter(
            item =>
                gameState.evidenceFound
                    .includes(item)
        );


    /*
       En az 5 önemli delil
       gerekiyor.
    */


    return found.length >= 5;

}


/* =====================================================
   KATİLİ SUÇLAMA
===================================================== */

function accuse(person) {

    const result =
        document.getElementById(
            "result"
        );


    if (!result) return;


    if (!canMakeFinalAccusation()) {

        result.innerHTML = `

            <div class="card wrong">

                <h3>
                    🔒 DOSYA HENÜZ HAZIR DEĞİL
                </h3>

                <p>

                    Elindeki kanıtlar kesin bir
                    suçlama yapmak için yeterli değil.

                </p>

                <br>

                <p>

                    Daha fazla delil incele,
                    ifadeleri karşılaştır ve
                    olay kronolojisini oluştur.

                </p>

            </div>

        `;

        return;

    }


    /* =================================================
       DOĞRU KATİL
    ================================================= */


    if (person === "Olivia") {

        gameState.finalUnlocked = true;

        gameState.score += 50;


        if (gameState.timerInterval) {

            clearInterval(
                gameState.timerInterval
            );

        }


        result.innerHTML = `

            <div class="card correct result-card">

                <h2>
                    ✓ VAKA ÇÖZÜLDÜ
                </h2>

                <br>

                <h3>
                    KATİL: OLIVIA S.
                </h3>

                <br>

                <p>

                    Tebrikler Dedektif.

                    Sen doğru kişiyi
                    buldun.

                </p>

                <br>

                <p>

                    Olivia, William Miller'a
                    karşı uzun süredir gizli
                    duygular besliyordu.

                </p>

                <br>

                <p>

                    William'ın başka birini
                    seçmesi Olivia'nın
                    kıskançlığını tetikledi.

                </p>

                <br>

                <p>

                    Cinayet gecesi William ile
                    görüşmek için malikâneye
                    geldi.

                </p>

                <br>

                <p>

                    William'ı güçlü fare
                    zehriyle zehirledi.

                </p>

                <br>

                <p>

                    Ardından olay yerini
                    intihar gibi göstermeye
                    çalıştı.

                </p>

                <br>

                <p>

                    Balkon ve orman güzergâhını
                    kullanarak olay yerinden
                    uzaklaştı.

                </p>

                <br>

                <p>

                    Alex'in kameraları kapatması
                    Olivia için büyük bir fırsat
                    yarattı.

                </p>

                <br>

                <p>

                    Ancak asıl kritik hata,
                    geride bıraktığı:

                </p>

                <br>

                <b>
                    O.S. metal parçası
                </b>

                <br><br>

                <p>

                    ve tehditkâr notla birlikte
                    oluşan bağlantıydı.

                </p>

                <br><br>

                <h3>
                    VAKA-1407 KAPATILDI
                </h3>

                <br>

                <p>
                    Dedektif puanın:
                    <b>
                        ${gameState.score}
                    </b>
                </p>

                <br>

                <p>
                    🏆 Soruşturma tamamlandı.
                </p>

            </div>

        `;


        return;

    }


    /* =================================================
       YANLIŞ SUÇLAMA
    ================================================= */


    gameState.score =
        Math.max(
            0,
            gameState.score - 20
        );


    result.innerHTML = `

        <div class="card wrong result-card">

            <h2>
                ✕ YANLIŞ SUÇLAMA
            </h2>

            <br>

            <p>

                Seçtiğin kişi katil değil.

            </p>

            <br>

            <p>

                Ancak soruşturma henüz
                tamamen bitmiş değil.

            </p>

            <br>

            <p>

                Delilleri yeniden değerlendir.

            </p>

            <br>

            <p>

                Özellikle olay zamanlarını,
                balkon izlerini ve
                O.S. bağlantısını düşün.

            </p>

            <br>

            <p>

                Kaybettiğin puan:

                <b>
                    -20
                </b>

            </p>

        </div>

    `;


    updateInterface();

}


/* =====================================================
   OYUN DURUMU
===================================================== */

function checkProgress() {

    console.log(
        "========== VAKA-1407 =========="
    );


    console.log(
        "Deliller:",
        gameState.evidenceFound
    );


    console.log(
        "Sorgular:",
        gameState.interrogated
    );


    console.log(
        "Puan:",
        gameState.score
    );


    console.log(
        "Telefon:",
        gameState.phoneUnlocked
    );


    console.log(
        "Laboratuvar:",
        gameState.laboratoryUnlocked
    );


    console.log(
        "Kamera:",
        gameState.cameraViewed
    );


    console.log(
        "Delil bağlantısı:",
        gameState.combinationSolved
    );

}


/* =====================================================
   KLAVYE KISAYOLLARI
===================================================== */

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {

            showScreen("menu");

        }

    }
);


/* =====================================================
   SAYFA BAŞLANGICI
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        updateInterface();

        updateTimer();


        console.log(
            "%cVAKA-1407",
            "font-size:24px;font-weight:bold;"
        );


        console.log(
            "THE MILLER MURDER"
        );


        console.log(
            "Soruşturma sistemi hazır."
        );

    }
);