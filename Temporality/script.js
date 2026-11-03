// DESIGN: Oyunun ayarlanabilir kuralları, hızları ve boyutları
const DESIGN = {
    canvasWidth: 400,
    canvasHeight: 300,
    playerSize: 20,
    playerSpeed: 150, // Saniyede piksel cinsi hareket hızı
    switchSize: 40,
    maxRecordTimeMs: 15000, // Hafıza dolumu (Maksimum 15 saniye kayıt)
    colors: {
        bg: '#0d0d14',
        player: '#00ffff', // Canlı oyuncu (Cyan)
        echo: 'rgba(255, 0, 255, 0.6)', // Geçmiş oyuncu (Magenta/Şeffaf)
        switchOff: 'transparent',
        switchOn: '#00ffff',
        switchBorder: '#556'
    },
    startPos: { x: 200, y: 250 },
    switches: {
        a: { x: 80, y: 80 },
        b: { x: 320, y: 80 }
    }
};

// STATE: Sistemin o anki durumu ve hafızası
let state = {
    phase: 'IDLE', // IDLE, RECORDING, PLAYING
    player: { x: DESIGN.startPos.x, y: DESIGN.startPos.y },
    echo: { x: DESIGN.startPos.x, y: DESIGN.startPos.y, isVisible: false },
    switches