// ===========================================
// 1. Script d'Animation Typewriter (Nom : Paco Hybord)
// L'animation de frappe pour le nom
// ===========================================
const typewriterElement = document.getElementById('typewriter-name'); // Cible le nom
const targetName = "Paco Hybord"; // Le texte à taper
let charIndexName = 0;
let isNameFinished = false;

function typeWriterName() {
    if (!isNameFinished) {
        if (charIndexName < targetName.length) {
            typewriterElement.textContent += targetName.charAt(charIndexName);
            charIndexName++;
            // Vitesse de frappe accélérée (80ms)
            setTimeout(typeWriterName, 80); 
        } else {
            isNameFinished = true;
            // Une fois le nom écrit, on peut démarrer le Glitch Slogan
            setTimeout(animateGlitchSlogan, 1000);
        }
    }
}

// ===========================================
// 2. Script d'Animation Glitch (Slogan dynamique)
// L'animation de défilement pour les slogans
// ===========================================
const glitchElement = document.getElementById('glitch-slogan'); // Cible le slogan
const slogans = [
    "Créateur de solutions métiers.",
    "Spécialiste en PHP/SQL.",
    "Architecte Logiciel Junior.",
    "Développeur Back-end SLAM."
];
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{};:'\",.<>/?|`~";
// Délai de révélation accéléré (30ms)
const revealDelay = 30;
let sloganIndex = 0;
let sloganIntervalId = null;
const getRandomChar = () => chars[Math.floor(Math.random() * chars.length)];

function scrambleCharacterSlogan(slogan, index, totalFrames) {
    let frame = 0;
    const charInterval = 30;

    const charAnimation = setInterval(() => {
        let currentText = glitchElement.textContent.split('');

        if (frame < totalFrames) {
            // Stade de brouillage
            currentText[index] = getRandomChar();
            glitchElement.textContent = currentText.join('');
            frame++;
        } else {
            // Stade de révélation
            currentText[index] = slogan[index];
            glitchElement.textContent = currentText.join('');
            clearInterval(charAnimation);
        }
    }, charInterval);
}

function animateGlitchSlogan() {
    const currentSlogan = slogans[sloganIndex];

    // Remplissage initial avec des caractères aléatoires
    glitchElement.textContent = currentSlogan.split('').map(() => getRandomChar()).join('');

    let index = 0;
    sloganIntervalId = setInterval(() => {
        if (index < currentSlogan.length) {
            // Le nombre d'itérations de brouillage est fixe
            scrambleCharacterSlogan(currentSlogan, index, 15);
            index++;
        } else {
            // Le slogan est terminé. On passe au suivant après une pause.
            clearInterval(sloganIntervalId);
            sloganIndex = (sloganIndex + 1) % slogans.length;

            // Redémarre l'animation après 2.5 secondes
            setTimeout(animateGlitchSlogan, 2500);
        }
    }, revealDelay);
}

// ===========================================
// 3. Intersection Observer (Barres et Scroll Reveal)
// Pour les Compétences et Cartes de Projet
// ===========================================
const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target;

            if (target.classList.contains('skill-item')) {
                const level = target.getAttribute('data-level');
                const bar = target.querySelector('.skill-bar');
                bar.style.width = `${level}%`;
            }

            if (target.classList.contains('card-reveal')) {
                // Cette logique est utilisée pour animer les blocs au défilement
                const delay = target.getAttribute('data-delay') || 0;
                target.style.transitionDelay = `${delay}ms`;
                target.classList.remove('translate-y-10', 'opacity-0');
            }

            observer.unobserve(target);
        }
    });
};

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.3
};

const observer = new IntersectionObserver(observerCallback, observerOptions);

// ===========================================
// 4. Nouvel Observer pour la Navbar
// Détecte la section visible pour mettre le lien en surbrillance
// ===========================================
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]'); // Cibler toutes les sections ayant un ID

const navObserverCallback = (entries) => {
    entries.forEach(entry => {
        const id = entry.target.getAttribute('id');
        const correspondingLink = document.querySelector(`a[href="#${id}"]`);

        // Seulement si la section est visible
        if (entry.isIntersecting) {
            // Retire la classe 'active' de tous les liens
            navLinks.forEach(link => link.classList.remove('active'));

            // Ajoute la classe 'active' au lien correspondant
            if (correspondingLink) {
                correspondingLink.classList.add('active');
            }
        }
    });
};

const navObserverOptions = {
    root: null, // viewport
    rootMargin: '-30% 0px -30% 0px', // Déclenchement quand la section est bien au milieu
    threshold: 0 // Le seuil est bas, la marge fait le gros du travail
};

const navObserver = new IntersectionObserver(navObserverCallback, navObserverOptions);

// ===========================================
// 5. Effet de Tilt 3D Dynamique au Curseur (Propre)
// ===========================================

const tiltCards = document.querySelectorAll('.glass-card');
const MAX_TILT = 10; // Degrés maximum de rotation (ajusté pour un effet subtil)

tiltCards.forEach(card => {
    // Événement : Souris se déplace sur la carte
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        
        // 1. Calcul de la position relative (de -0.5 à +0.5)
        const x = e.clientX - rect.left; // Coordonnée X dans la carte
        const y = e.clientY - rect.top; // Coordonnée Y dans la carte
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Valeur normalisée (de -1 à 1)
        const normalizeX = (x - centerX) / centerX;
        const normalizeY = (y - centerY) / centerY;
        
        // 2. Calcul de la rotation (Tilt)
        const rotateY = normalizeX * MAX_TILT; // Inclinaison de gauche à droite
        const rotateX = normalizeY * -MAX_TILT; // Inclinaison de haut en bas (inversé)
        
        // Appliquer la transformation CSS
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        
    });

    // Événement : Souris quitte la carte (réinitialisation)
    card.addEventListener('mouseleave', () => {
        // Retourne à l'état initial (rotation 0) en utilisant la transition CSS (maintenant plus stable)
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
        card.style.boxShadow = `0 4px 30px rgba(0, 0, 0, 0.4)`;
    });
});


// ===========================================
// 6. Exécution au Chargement de la Page
// La fonction principale lance tous les Observateurs et Animations
// ===========================================
document.addEventListener('DOMContentLoaded', () => {
    
    // 2. Observer les Compétences et Cartes (Scroll Reveal)
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        observer.observe(item);
    });

    // Ceci inclut le conteneur IDE/Logiciels (#software-grid-container)
    const cardsToReveal = document.querySelectorAll('.card-reveal');
    cardsToReveal.forEach(card => {
        observer.observe(card);
    });

    // 3. Observer les sections pour l'effet de navbar active
    sections.forEach(section => {
        navObserver.observe(section);
    });

    // 1. Démarrer l'animation Typewriter du nom après un court délai
    setTimeout(typeWriterName, 500);
});


/* =========================================
   AUTRES SCRIPTS (conservés)
   ========================================= */

// Init AOS (Animation au scroll)
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

const counters = document.querySelectorAll('.counter');
const speed = 200; // Vitesse d'animation
const animateCounters = () => {
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            
            const inc = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 20);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    });
}
let hasAnimated = false; 

window.addEventListener('scroll', function() {
    let navbar = document.querySelector('header nav'); 
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(17, 24, 39, 0.95)';
        navbar.style.paddingTop = '10px';
        navbar.style.paddingBottom = '10px';
    } else {
        navbar.style.background = 'rgba(17, 24, 39, 0.9)'; 
        navbar.style.paddingTop = '16px'; 
        navbar.style.paddingBottom = '16px';
    }
    
    const backToTop = document.getElementById('backToTop');
    if (backToTop) { 
        if (window.scrollY > 300) {
            backToTop.style.opacity = '1';
            backToTop.style.pointerEvents = 'all';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.pointerEvents = 'none';
        }
    }

    if (!hasAnimated && window.scrollY > 500) {
        // animateCounters(); // Décommenter si tu as des compteurs
        hasAnimated = true;
    }

    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    const progressBar = document.getElementById("progress-bar");
    if(progressBar) {
        progressBar.style.width = scrolled + "%";
    }
});

const backToTopBtn = document.getElementById('backToTop');
if(backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

const githubUsername = 'MaitrePoisson'; 
fetch(`https://api.github.com/users/${githubUsername}`)
    .then(response => {
        if (!response.ok) throw new Error("Utilisateur GitHub introuvable");
        return response.json();
    })
    .then(data => {
        const repoCounter = document.getElementById('github-repos');
        if (repoCounter) {
            repoCounter.setAttribute('data-target', data.public_repos);
            if (hasAnimated) {
                repoCounter.innerText = data.public_repos;
            }
        }
    })
    .catch(error => console.log("Erreur API GitHub:", error));

const konamiCode = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiPosition = 0;

document.addEventListener('keydown', function(e) {
    if (e.key === konamiCode[konamiPosition]) {
        konamiPosition++;
        if (konamiPosition === konamiCode.length) {
            document.body.classList.add('hacker-mode');
            alert("⚠️ SYSTEM BREACH DETECTED ⚠️\nMode Hacker Activé !");
            konamiPosition = 0;
        }
    } else {
        konamiPosition = 0;
    }
});