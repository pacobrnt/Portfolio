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
// 5. Exécution au Chargement de la Page
// La fonction principale lance tous les Observateurs et Animations
// ===========================================
document.addEventListener('DOMContentLoaded', () => {

    // 2. Observer les Compétences et Cartes (Scroll Reveal)
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        observer.observe(item);
    });

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