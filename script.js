// ========== AUDIO/MUSIC CONTROL ==========
function toggleMute() {
    const audio = document.getElementById('backsound');
    const muteButton = document.getElementById('muteButton');
    const icon = muteButton.querySelector('i');
    
    if (!audio) {
        console.warn('Audio element not found');
        return;
    }
    
    if (audio.paused || audio.muted) {
        audio.muted = false;
        audio.play().catch(err => console.log('Play error:', err));
        // Change icon to volume-up when playing
        icon.className = 'bi bi-volume-up';
        muteButton.classList.remove('muted');
    } else {
        audio.pause();
        audio.muted = false; // Reset muted state
        // Change icon to volume-mute when paused
        icon.className = 'bi bi-volume-mute';
        muteButton.classList.add('muted');
    }
}

// Initialize music when page loads
function initializeAudio() {
    const audio = document.getElementById('backsound');
    if (audio) {
        audio.volume = 0.3; // Set volume to 30%
        // Coba autoplay, tapi jangan paksa jika browser melarang
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(err => {
                // Autoplay blocked - user perlu klik tombol
                console.log('Autoplay blocked. Musik akan diputar saat user pertama kali klik.');
            });
        }
    }
}

// First click anywhere pada halaman - trigger music autoplay
document.addEventListener('click', function setupAutoplay() {
    const audio = document.getElementById('backsound');
    if (audio && audio.paused) {
        audio.play().catch(err => console.log('First click play error:', err));
    }
    // Hapus listener setelah pertama kali klik
    document.removeEventListener('click', setupAutoplay);
}, { once: true });

// Initialize Intersection Observer untuk scroll animation
document.addEventListener('DOMContentLoaded', function () {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Tambah class untuk trigger animasi
                entry.target.classList.add('visible');

                // Untuk elemen dengan animasi khusus
                if (entry.target.classList.contains('fade-in-up')) {
                    entry.target.style.animationPlayState = 'running';
                }
                if (entry.target.classList.contains('fade-in-left')) {
                    entry.target.style.animationPlayState = 'running';
                }
                if (entry.target.classList.contains('fade-in-right')) {
                    entry.target.style.animationPlayState = 'running';
                }
                if (entry.target.classList.contains('fade-in-scale')) {
                    entry.target.style.animationPlayState = 'running';
                }

                // Optional: jika ingin menghentikan observasi setelah animasi
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe semua elemen dengan class animasi
    const animatedElements = document.querySelectorAll(
        '.fade-in-up, .fade-in-left, .fade-in-right, .fade-in-scale'
    );

    animatedElements.forEach(element => {
        // Set initial state
        element.style.animationPlayState = 'paused';
        observer.observe(element);
    });

    // Particulate animation heroes yang sudah terlihat
    heroAnimations();

    // Button functionality
    setupButtonListeners();
    
    // Initialize audio
    initializeAudio();
});

// Hero section animation pada load
function heroAnimations() {
    const heroElements = document.querySelectorAll('.hero .fade-in-up');
    heroElements.forEach((element, index) => {
        element.style.animationPlayState = 'running';
    });
}

// Setup button listeners
function setupButtonListeners() {
    // Scroll button di hero
    const scrollBtn = document.querySelector('[href="#details"]');
    if (scrollBtn) {
        scrollBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector('#details');
            target.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Note: Message form dan RSVP form sudah memiliki handler khusus
    // Jadi tidak perlu menambahkan handler generic di sini
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    const button = e.target;
    const originalText = button.textContent;

    // Visual feedback
    button.textContent = 'Terkirim!';
    button.style.background = 'var(--soft-mahogany)';

    // Reset setelah 2 detik
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';

        // Kosongkan form jika perlu
        const form = button.closest('.message-form') || button.closest('.rsvp-form');
        if (form) {
            form.querySelectorAll('input, textarea, select').forEach(input => {
                input.value = '';
            });
        }
    }, 2000);
}

// Smooth scroll untuk link navigasi
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Parallax effect pada hero section (optional)
window.addEventListener('scroll', function () {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrollPosition = window.pageYOffset;
        hero.style.backgroundPosition = `0 ${scrollPosition * 0.5}px`;
    }
});

// Mobile menu close setelah klik link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function () {
        const navbarToggler = document.querySelector('.navbar-toggler');
        if (navbarToggler.offsetParent !== null) { // Jika visible
            navbarToggler.click();
        }
    });
});

// ========== COUNTDOWN FLIP TIMER ==========
function initCountdown() {
    // Tanggal pernikahan: 28 Juni 2026 pada pukul 08:00 WIB
    const weddingDate = new Date('2026-06-28T08:00:00+07:00').getTime();

    // Generate Google Calendar URL
    const googleCalendarLink = generateGoogleCalendarLink();
    const calendarBtn = document.getElementById('save-to-calendar');
    if (calendarBtn) {
        calendarBtn.href = googleCalendarLink;
    }

    // Update countdown setiap 1 detik
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        // Jika acara sudah berlalu
        if (distance < 0) {
            document.getElementById('days-display').textContent = '0';
            document.getElementById('hours-display').textContent = '0';
            document.getElementById('minutes-display').textContent = '0';
            document.getElementById('seconds-display').textContent = '0';
            return;
        }

        // Hitung waktu
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Update dengan flip animation
        updateFlipDisplay('days', days, 'days-display', 'days-back');
        updateFlipDisplay('hours', hours, 'hours-display', 'hours-back');
        updateFlipDisplay('minutes', minutes, 'minutes-display', 'minutes-back');
        updateFlipDisplay('seconds', seconds, 'seconds-display', 'seconds-back');
    }

    // Initialize dari kali pertama
    updateCountdown();

    // Update setiap 1 detik
    setInterval(updateCountdown, 1000);
}

function updateFlipDisplay(unit, value, frontId, backId) {
    const frontElem = document.getElementById(frontId);
    const backElem = document.getElementById(backId);
    const cardContainer = frontElem.closest('.flip-card');

    const currentValue = parseInt(frontElem.textContent);
    const formattedValue = String(value).padStart(2, '0');

    if (currentValue !== value) {
        // Set back card value
        backElem.textContent = formattedValue;

        // Trigger flip animation
        cardContainer.classList.add('flip');

        // Update front card setelah animasi
        setTimeout(() => {
            frontElem.textContent = formattedValue;
            cardContainer.classList.remove('flip');
        }, 300);
    }
}

function generateGoogleCalendarLink() {
    const eventTitle = 'Pernikahan Gina & Ethon';
    const eventDate = '20260628'; // YYYYMMDD format
    const eventTime = '080000'; // HHMMSS format
    const eventTimezone = 'Asia/Jakarta';

    // Detail event
    const description = 'Undangan Pernikahan Gina & Ethon';
    const location = 'Lokasi Acara';

    // Format URL Google Calendar
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${eventDate}T${eventTime}/${eventDate}T100000&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}&ctz=${encodeURIComponent(eventTimezone)}`;

    return calendarUrl;
}

// Initialize countdown saat DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCountdown);
} else {
    initCountdown();
}

// ========== MESSAGES & PRAYERS HANDLING ==========
function setupMessagesHandler() {
    const btnSendMessage = document.getElementById('btn-send-message');
    const messageNameInput = document.getElementById('message-name');
    const messageTextInput = document.getElementById('message-text');
    const messagesList = document.getElementById('messages-list');

    // Load persisted messages from localStorage
    function loadPersistedMessages() {
        const storedMessages = localStorage.getItem('weddingMessages');
        if (storedMessages) {
            const messages = JSON.parse(storedMessages);
            messages.forEach(msg => {
                addMessageToList(msg.name, msg.text, messagesList);
            });
        }
    }

    // Add message to the list (UI display)
    function addMessageToList(name, text, container) {
        const newMessageItem = document.createElement('div');
        newMessageItem.className = 'message-item fade-in-left';
        newMessageItem.innerHTML = `
            <p class="message-name">${escapeHtml(name)}</p>
            <p class="message-text">"${escapeHtml(text)}"</p>
        `;
        container.insertBefore(newMessageItem, container.firstChild);
    }

    // Save message to localStorage
    function saveMessageToStorage(name, text) {
        const storedMessages = localStorage.getItem('weddingMessages');
        let messages = storedMessages ? JSON.parse(storedMessages) : [];
        
        // Add new message
        messages.unshift({ name, text, timestamp: new Date().toISOString() });
        
        // Save back to localStorage
        localStorage.setItem('weddingMessages', JSON.stringify(messages));
    }

    // Load existing messages on page load
    loadPersistedMessages();

    if (btnSendMessage) {
        btnSendMessage.addEventListener('click', function () {
            const name = messageNameInput.value.trim();
            const text = messageTextInput.value.trim();

            if (!name || !text) {
                alert('Silakan isi nama dan ucapan Anda');
                return;
            }

            // Save to localStorage
            saveMessageToStorage(name, text);

            // Display in list
            addMessageToList(name, text, messagesList);

            // Clear inputs
            messageNameInput.value = '';
            messageTextInput.value = '';

            // Show success feedback
            btnSendMessage.textContent = 'Terkirim!';
            setTimeout(() => {
                btnSendMessage.textContent = 'Kirim';
            }, 2000);
        });
    }
}

// ========== RSVP EMAIL HANDLING ==========
// SETUP: Ganti 'xkkkppvd' dengan form ID Anda dari https://formspree.io
// 1. Buka https://formspree.io
// 2. Daftar/Login dengan email ethonseno@gmail.com
// 3. Buat form baru dan dapatkan ID-nya
// 4. Ganti 'xkkkppvd' dengan ID form Anda di URL di bawah

function setupRSVPHandler() {
    const btnSendRSVP = document.getElementById('btn-send-rsvp');
    const rsvpForm = {
        name: document.getElementById('rsvp-name'),
        email: document.getElementById('rsvp-email'),
        acara: document.getElementById('rsvp-acara'),
        konfirmasi: document.getElementById('rsvp-konfirmasi'),
        pesan: document.getElementById('rsvp-pesan')
    };
    const rsvpStatus = document.getElementById('rsvp-status');

    if (btnSendRSVP) {
        btnSendRSVP.addEventListener('click', function () {
            // Validate form
            if (!rsvpForm.name.value.trim() || !rsvpForm.email.value.trim() ||
                !rsvpForm.acara.value || !rsvpForm.konfirmasi.value) {
                alert('Silakan isi semua bidang yang diperlukan');
                return;
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(rsvpForm.email.value)) {
                alert('Silakan isi email dengan format yang benar');
                return;
            }

            const templateParams = {
                guest_name: rsvpForm.name.value,
                guest_email: rsvpForm.email.value,
                acara: rsvpForm.acara.value,
                konfirmasi: rsvpForm.konfirmasi.value,
                pesan: rsvpForm.pesan.value || '-'
            };

            // Show loading status
            rsvpStatus.style.display = 'block';
            rsvpStatus.textContent = 'Mengirim...';
            btnSendRSVP.disabled = true;

            sendRSVPWithFormSubmit(templateParams, rsvpForm, rsvpStatus, btnSendRSVP);
        });
    }
}

// Alternative method menggunakan Formspree (no backend needed)
function sendRSVPWithFormSubmit(data, formInputs, statusElement, button) {
    fetch('https://formspree.io/f/xkkkppvd', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
            name: data.guest_name,
            email: data.guest_email,
            acara: data.acara,
            konfirmasi: data.konfirmasi,
            pesan: data.pesan,
            _replyto: data.guest_email
        })
    })
        .then(response => {
            if (response.ok) {
                statusElement.textContent = '✓ Konfirmasi berhasil dikirim!';
                statusElement.style.color = '#4CAF50';

                // Clear form
                formInputs.name.value = '';
                formInputs.email.value = '';
                formInputs.acara.value = '';
                formInputs.konfirmasi.value = '';
                formInputs.pesan.value = '';

                // Reset button
                setTimeout(() => {
                    statusElement.textContent = '';
                    statusElement.style.display = 'none';
                    button.disabled = false;
                }, 3000);
            } else {
                throw new Error('Gagal mengirim');
            }
        })
        .catch(error => {
            statusElement.textContent = '✗ Gagal mengirim. Silakan coba lagi.';
            statusElement.style.color = '#FF6B6B';
            button.disabled = false;
            console.error('Error:', error);
        });
}

// Fungsi untuk menga-escape HTML dan mencegah injection
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ========== URL PARAMETER HANDLING ==========
// Fungsi untuk mengambil parameter dari URL
function getParameterByName(name) {
    const url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// Initialize messages handler
setupMessagesHandler();

// Initialize RSVP handler saat DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
        setupRSVPHandler();

        // Mengambil nama dari ?to=NamaTamu dan memasukkan ke elemen HTML
        const guestName = getParameterByName('to');
        if (guestName) {
            const guestNameElement = document.getElementById('guest-name');
            if (guestNameElement) {
                guestNameElement.innerText = guestName;
            }
        }
    });
} else {
    setupRSVPHandler();

    // Mengambil nama dari ?to=NamaTamu dan memasukkan ke elemen HTML
    const guestName = getParameterByName('to');
    if (guestName) {
        const guestNameElement = document.getElementById('guest-name');
        if (guestNameElement) {
            guestNameElement.innerText = guestName;
        }
    }
}
