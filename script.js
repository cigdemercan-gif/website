const themeBtn = document.getElementById("themeBtn");
const deckEl = document.getElementById("deck");
const deckHeading = document.getElementById("deck-heading");
const selectedPanel = document.getElementById("selectedPanel");
const selectedEmpty = selectedPanel.querySelector(".selected-empty");
const selectedContent = document.getElementById("selectedContent");
const openCard = document.getElementById("openCard");
const openInfo = document.getElementById("openInfo");
const categoryTiles = document.querySelectorAll(".category-tile");

const CATEGORY_LABELS = {
  bilgi: "Bilgi",
  hareket: "Hareket",
  yaraticilik: "Yaratıcılık",
  sans: "Şans / Engel"
};

/** Arka yüz teması: Bilgi = Athena + sütun, Hareket = Hermes + kanat, Yaratıcılık = Apollo + lir, Şans = Zeus + şimşek */
const PATRON_BY_CAT = {
  bilgi: "Athena",
  hareket: "Hermes",
  yaraticilik: "Apollo",
  sans: "Zeus"
};

/** id kullanılmıyor; aynı sayfada çok kart olsa da çakışma yok */
const BACK_ART_SVG = {
  bilgi: `<svg class="svg-motif svg-motif--column" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 110" aria-hidden="true">
  <ellipse cx="40" cy="16" rx="24" ry="9" fill="#f1f5f9" opacity=".95"/>
  <rect x="26" y="22" width="28" height="72" rx="2" fill="#cbd5e1"/>
  <line x1="32" y1="30" x2="32" y2="88" stroke="#64748b" stroke-width="1.2" opacity=".5"/>
  <line x1="40" y1="30" x2="40" y2="88" stroke="#64748b" stroke-width="1.2" opacity=".35"/>
  <line x1="48" y1="30" x2="48" y2="88" stroke="#64748b" stroke-width="1.2" opacity=".5"/>
  <rect x="18" y="94" width="44" height="10" rx="2" fill="#64748b"/>
  <rect x="22" y="104" width="36" height="6" rx="1" fill="#475569"/>
</svg>`,
  hareket: `<svg class="svg-motif svg-motif--wings" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 70" aria-hidden="true">
  <path d="M50 38 Q12 8 5 42 Q22 48 50 38" fill="#e2e8f0" stroke="#94a3b8" stroke-width="0.5"/>
  <path d="M50 38 Q88 8 95 42 Q78 48 50 38" fill="#cbd5e1" stroke="#94a3b8" stroke-width="0.5"/>
  <ellipse cx="50" cy="40" rx="6" ry="10" fill="#f1f5f9" opacity=".95"/>
</svg>`,
  yaraticilik: `<svg class="svg-motif svg-motif--lyre" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 100" aria-hidden="true">
  <path d="M32 18 L32 78 Q45 88 58 78 L58 18 Q45 12 32 18 Z" fill="none" stroke="#fbbf24" stroke-width="3" stroke-linejoin="round"/>
  <line x1="37" y1="28" x2="53" y2="28" stroke="#fcd34d" stroke-width="1.2"/>
  <line x1="37" y1="38" x2="53" y2="38" stroke="#fcd34d" stroke-width="1.2"/>
  <line x1="37" y1="48" x2="53" y2="48" stroke="#fcd34d" stroke-width="1.2"/>
  <line x1="37" y1="58" x2="53" y2="58" stroke="#fcd34d" stroke-width="1.2"/>
  <path d="M45 78 L45 92" stroke="#fbbf24" stroke-width="2"/>
</svg>`,
  sans: `<svg class="svg-motif svg-motif--bolt zeus-kart" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 100" aria-hidden="true">
  <path d="M38 4 L18 46 L34 46 L22 96 L54 38 L36 38 L48 4 Z" fill="#facc15" stroke="#ca8a04" stroke-width="1" stroke-linejoin="round"/>
</svg>`
};

function card(catKey, title, task, points, lore) {
  return { catKey, patron: PATRON_BY_CAT[catKey], title, task, points, lore };
}

const ALL_CARDS = [
  ...[
    // ["Başlık", "Soru", puan, "cevap"]
    ["", "Tanrıların kralı Zeus'un simgesi ve en güçlü silahı nedir?", 1, "Şimşek/Yıldırım"],
    ["", "Yılan saçlı, gözlerine bakanı taşa çeviren meşhur gorgon kimdir?", 1, "Medusa"],
    ["", "Denizlerin tanrısı Poseidon'un elinde taşıdığı meşhur silahın adı nedir?", 1, "Üç Dişli Yaba"],
    ["", "Güzellik ve aşk tanrıçası kimdir? ", 1, "Afrodit"],
    ["", "Yeraltı dünyasının kapısını koruyan üç başlı dev köpeğin adı nedir?", 2, "Kerberos"],
    ["", "Labirentin derinliklerinde yaşayan yarı insan yarı boğa canavarın adı nedir?", 2, "Minotor"],
    ["", "Vücudu silah işlemez olan ama sadece topuğundan vurularak öldürülebilen yenilmez savaşçı kimdir?", 2, "Aşil."],
    ["", "Tanrılardan ateşi çalıp insanlara hediye eden titan kimdir? ", 3, "Athena disiplinli strateji, Ares çoğu zaman çatışmanın ham gücüdür."],
    ["", "Herkül'ün (Herakles) günahlarından arınmak için yerine getirmesi gereken kaç zorlu görev (iş) vardı? ", 3, "Efsaneye göre Atina onun armağanlarıyla seçilmiştir."],
    ["", "Balmumu ve tüylerden yaptığı kanatlarla güneşe fazla yaklaşıp düşen karakter kimdir?", 3, "Sanatta tanrıların sembolleri hızlıca ayırt edilir."]
  ].map((x) => card("bilgi", ...x)),
  ...[
    ["30 Saniyede Anlat", "Lir çalmak (Apollon)", 1, "Hermes haber ve hızın tanrısıdır; kanatlı sandaletleriyle anılır."],
    ["30 Saniyede Anlat", "Uçmak (Hermes)", 1, "Hermes yolu kısaltan, Iris ise gökkuşağı köprüsüyle mesaj taşır."],
    ["30 Saniyede Anlat", "Taşa dönüşmek (Medusa'nın kurbanı)", 1, "Hermes yol gösterir ve engelleri aşmayı sembolize eder."],
    ["30 Saniyede Anlat", "Ok atmak (Artemis / Eros)", 1, "Asa (caduceus) Hermes’in bildirgesidir."],
    ["30 Saniyede Anlat", "Kaslarını gösterip ağırlık kaldırmak (Herkül)", 1, "Denge ve çeviklik, yolculukta kontrol gerektirir."],
    ["45 Saniyede Anlat", "Kürek çekerek ruhları taşımak (Kharon)", 2, "Hız kazanırken yere yumuşak inmek Hermes’in zarafetidir."],
    ["45 Saniyede Anlat", "Kendi yansımasına aşık olup izlemek (Narkissos)", 2, "Konuşma temposu iletişimin ritmini temsil eder."],
    ["60 Saniyede Anlat", "Dünyayı sırtında taşımak (Atlas)", 3, "Yön değiştirmek yol kavramının parçasıdır."],
    ["60 Saniyede Anlat", "Kutu açıp içinden çıkanlardan korkup kaçmak (Pandora)", 3, "Yolculuk ileri-geri kararlarıyla doludur."],
    ["60 Saniyede Anlat", "Güneşe fazla yaklaşıp kanatları eriyerek düşmek (İkarus)", 3, "Kanat imgeleri Hermes’i en çok ayırt eden öğelerdendir."]
  ].map((x) => card("hareket", ...x)),
  ...[
    ["30 Saniyede Çiz", "Kalkan", 1, "Apollo sanat, müzik ve ölçülü güzelliğin tanrısıdır."],
    ["30 Saniyede Çiz", "Kanatlı Ayakkabı", 1, "Apollo kehanet ve uyumla bağlantılıdır."],
    ["30 Saniyede Çiz", "Ok ve Yay", 1, "Güneş ve ışık Apolloncu şiirin klasik temasıdır."],
    ["30 Saniyede Çiz", "Tapınak Sütunu", 1, "Tiyatro Dionysos ile de bağlansa Apolloncu düzen sıkça yanyana gelir."],
    ["45 Saniyede Çiz", "Truva Atı", 2, "Klasik sanatta Apollon genç ve dengeli bedenle betimlenir."],
    ["45 Saniyede Çiz", "Minotor (Yarı insan, yarı boğa)", 2, "Müzik doğa ve ritimle başlar."],
    ["45 Saniyede Çiz", "Pegasus", 2, "Renk seçimi tematik anlatımı güçlendirir."],
    ["45 Saniyede Çiz", "Üç Dişli Yaba", 2, "Ritim müzikal düşünmenin temelidir."],
    ["60 Saniyede Çiz", "Olimpos Dağı", 3, "Kısalık yaratıcı seçimi zorlar."],
    ["60 Saniyede Çiz", "Kerberos (Üç başlı köpek)", 3, "Marka sesi yaratıcılığın günlük halidir."]
  ].map((x) => card("yaraticilik", ...x)),
  ...[
    ["Hermes'in Rüzgarı", "Rüzgarı arkana aldın! Hemen 1 adım ileri git.", 1, "Zeus göğün egemeni ve adaletin koruyucusudur."],
    ["Satir'in Şakası", "Orman ruhları zarlarla oynamış! En gerideki oyuncu 1 adım öne gelsin.", 1, "Kader anları bazen tek hamleye indirgenir."],
    ["Kahin'in Fısıltısı", "Geleceği gördün. Solundaki oyuncunun sıradaki zar atışında kaç geleceğini tahmin et. Bilirsen 1 adım ileri git.", 1, "Gök işaretleri Zeus mitinde belirleyicidir."],
    ["Medusa ile Göz Göze", "Göz göze geldiniz ve taş kesildin! 2 adım geri git.", 2, "Tanrısal karar bazen topluluk oyu gibidir."],
    ["Pegasus'un Kanatları", "Harika bir uçuş yakaladın! Engelleri aşarak doğrudan 2 adım ileri uç.", 2, "Şans ve risk Olyntis yolunda yan yana durur."],
    ["Kharon'un Kayığı", ": Ölüler diyarı nehrinden geçmek için para vermeyi unuttun. 2 adım geri dön.", 2, "Zeus adaletle de anılır."],
    ["Ares'in Savaş Narası", "Meydan okuma zamanı! Sağındaki oyuncuyla taş-kağıt-makas oyna. Kazanan 2 adım ileri fırlar.", 2, "Beklenen an şimşek gibidir."],
    ["Zeus'un Yıldırımı", "BAM! Masadaki lider oyuncuya yıldırım düştü. Lider 3 adım geri gitsin!", 3, "Şans anlarında dikkat yönlendirir."],
    ["Athena'nın Kalkanı (Aegis)", "Mutlak koruma! Bu kartı elinde tut. Sana gelecek ilk kötü kader kartını iptal eder ve sana 3 adım kazandırır.", 3, "Zorlu kararlar fırtına öncesi sessizlik gibi olur."],
    ["Kronos'un Zaman Çarkı", "Zaman geriye sarıyor! Lider oyuncu ile en sondaki oyuncu yer değiştirsin! (Sen ikisi de değilsen 3 adım ileri git).", 3, "Zeus gökyüzü ve yolculuğun belirsizliğiyle bağlanır."]
  ].map((x) => card("sans", ...x))
];

let activeCategory = "bilgi";

function labelForCard(card) {
  return CATEGORY_LABELS[card.catKey] || card.catKey;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function closeSiblings(except) {
  deckEl.querySelectorAll(".flip-card.opened").forEach((el) => {
    if (el !== except) {
      el.classList.remove("opened");
      el.setAttribute("aria-expanded", "false");
    }
  });
}

function backFaceHtml(catKey) {
  // Tüm kategoriler için yazısız, vektörsüz, tamamen boş bir arka yüz oluştur.
  // Arka plan görsellerini CSS üzerinden atayacağız.
  return `<span class="flip-face flip-back flip-back--${catKey}"></span>`;
}

function createCardElement(card, index) {
  const catLabel = labelForCard(card);
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "flip-card";
  btn.dataset.index = String(index);
  btn.setAttribute("aria-expanded", "false");
  btn.setAttribute(
    "aria-label",
    `${card.patron} (${catLabel}) kartı. Tıkla ve çevir. Görev: ${card.title}.`
  );

  btn.innerHTML = `
    <span class="flip-inner">
      ${backFaceHtml(card.catKey)}
      <span class="flip-face flip-front">
        <span class="card-cat">${escapeHtml(catLabel)}</span>
        <span class="flip-front-title">${escapeHtml(card.title)}</span>
        <span class="flip-task">${escapeHtml(card.task)}</span>
        <span class="pts">Puan: ${card.points}</span>
      </span>
    </span>
  `;

  btn.addEventListener("click", () => {
    const willOpen = !btn.classList.contains("opened");
    if (willOpen) {
      closeSiblings(btn);
    }
    btn.classList.toggle("opened");
    const isFront = btn.classList.contains("opened");
    btn.setAttribute("aria-expanded", isFront ? "true" : "false");
    if (isFront) {
      showSelectedCard(card);
    }
  });

  btn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      btn.click();
    }
  });

  return btn;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function showSelectedCard(card) {
  const catLabel = labelForCard(card);
  selectedEmpty.classList.add("hidden");
  selectedContent.classList.remove("hidden");

  openCard.innerHTML = `
    <p class="card-cat">${escapeHtml(catLabel)}</p>
    <h4>${escapeHtml(card.title)}</h4>
    <p><strong>Arka yüz teması:</strong> ${escapeHtml(card.patron)}</p>
    <p>${escapeHtml(card.task)}</p>
    <p class="pts">Kart değeri: ${card.points}</p>
  `;

  openInfo.innerHTML = `
    <p><strong>Mitoloji notu:</strong> ${escapeHtml(card.lore)}</p>
    <p><strong>Uygulama:</strong> Görev tamamlanırsa ${card.points} adım; tamamlanamazsa yerinde kal.</p>
    <p><strong>Tekrar:</strong> Aynı kategoriden farklı kart için zar/kategori uyumu.</p>
  `;
}

function clearSelectionPanel() {
  selectedEmpty.classList.remove("hidden");
  selectedContent.classList.add("hidden");
  openCard.innerHTML = "";
  openInfo.innerHTML = "";
}

function setActiveTab(catKey) {
  const prev = activeCategory;
  activeCategory = catKey;
  categoryTiles.forEach((tile) => {
    const is = tile.dataset.cat === catKey;
    tile.classList.toggle("is-active", is);
    tile.setAttribute("aria-selected", is ? "true" : "false");
  });
  const tab = document.getElementById(`tab-${catKey}`);
  if (tab) {
    deckEl.setAttribute("aria-labelledby", tab.id);
  }
  deckHeading.textContent = `${CATEGORY_LABELS[catKey] || catKey} kartları`;
  if (prev !== catKey) {
    clearSelectionPanel();
  }
  renderDeck(catKey);
}

function renderDeck(catKey) {
  deckEl.innerHTML = "";
  const list = shuffle(ALL_CARDS.filter((c) => c.catKey === catKey));
  list.forEach((card, i) => {
    deckEl.appendChild(createCardElement(card, i));
  });
}

categoryTiles.forEach((tile) => {
  tile.addEventListener("click", () => {
    const cat = tile.dataset.cat;
    if (!cat || cat === activeCategory) {
      return;
    }
    setActiveTab(cat);
  });
});

function syncThemeColorMeta() {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    return;
  }
  meta.setAttribute(
    "content",
    document.body.classList.contains("light") ? "#f8fafc" : "#0f172a"
  );
}

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
  syncThemeColorMeta();
});

syncThemeColorMeta();

setActiveTab(activeCategory);
