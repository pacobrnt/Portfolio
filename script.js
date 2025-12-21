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
    // MODIFICATION APPLIQUÉE : Active la section dès qu'elle passe sous les 100px du haut
    // Cela devrait corriger le problème de détection trop lente après 'À Propos'.
    rootMargin: '-100px 0px 0px 0px', 
    threshold: 0.01 // Déclenchement rapide
};

const navObserver = new IntersectionObserver(navObserverCallback, navObserverOptions);

// ===========================================
// 5. Effet de Tilt 3D Dynamique au Curseur (Propre) + Luminosité
// ===========================================

const tiltCards = document.querySelectorAll('.glass-card');
const MAX_TILT = 10; // Degrés maximum de rotation (ajusté pour un effet subtil)

tiltCards.forEach(card => {
    // Événement : Souris se déplace sur la carte
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        
        // Coordonnées X et Y de la souris à l'intérieur de la carte
        const x = e.clientX - rect.left; // Coordonnée X dans la carte
        const y = e.clientY - rect.top; // Coordonnée Y dans la carte
        
        // NOUVELLE LOGIQUE : Calcul et application de la position pour l'effet de luminosité
        // Convertit les coordonnées absolues de la souris en pourcentage (0% à 100%)
        const percentX = (x / rect.width) * 100;
        const percentY = (y / rect.height) * 100;

        // Met à jour les variables CSS personnalisées pour positionner le glow effect
        card.style.setProperty('--mouse-x', `${percentX}%`);
        card.style.setProperty('--mouse-y', `${percentY}%`);
        // FIN NOUVELLE LOGIQUE
        
        // LOGIQUE EXISTANTE : Calcul de la position pour le Tilt 3D
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
        // La luminosité est gérée par le CSS :hover qui passe l'opacité à 0.
    });
});


// ===========================================
// 7. Animation des boutons interactifs (Ripple Effect)
// ===========================================
const interactiveBtns = document.querySelectorAll('.interactive-btn');

interactiveBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.width = '0px';
        ripple.style.height = '0px';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(59, 130, 246, 0.5)';
        ripple.style.transform = 'translate(-50%, -50%)';
        ripple.style.animation = 'ripple-effect 0.6s ease-out';
        ripple.style.pointerEvents = 'none';
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Keyframes pour l'effet ripple (ajouté dynamiquement)
if (!document.getElementById('ripple-keyframes')) {
    const style = document.createElement('style');
    style.id = 'ripple-keyframes';
    style.textContent = `
        @keyframes ripple-effect {
            to {
                width: 300px;
                height: 300px;
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// ===========================================
// 9. Animation Solaire/Planétaire (POINTS LUMINEUX)
// ===========================================
const orbitContainer = document.querySelector('.orbit-container');

// CONFIGURATION DES POINTS LUMINEUX
// Modification : Tailles réduites (size) pour ressembler à des points et non des planètes
const ORBIT_DATA = [
    // Point 1 (proche, rapide, petit)
    { radius: 130, size: 8, type: 'planet-mars', speed: 8 },
    // Point 2 (milieu, vitesse moyenne, moyen)
    { radius: 180, size: 12, type: 'planet-earth', speed: 14 },
    // Point 3 (loin, lent, moyen)
    { radius: 240, size: 10, type: 'planet-saturn', speed: 25 }
];


function createOrbitAnimation() {
    if (!orbitContainer) return;
    
    // Créer les orbes, les cercles, et les "planètes" (maintenant des points)
    ORBIT_DATA.forEach((orbit, index) => {
        // 1. Créer le Cercle d'Orbite (l'anneau statique)
        const orbitCircle = document.createElement('div');
        orbitCircle.className = 'orbit-circle';
        // Taille du cercle = Rayon * 2
        const diameter = orbit.radius * 2;
        orbitCircle.style.width = `${diameter}px`;
        orbitCircle.style.height = `${diameter}px`;
        orbitContainer.appendChild(orbitCircle);
        
        // 2. Créer l'Orbe Contenant le Point (qui tourne sur elle-même)
        const planetOrbit = document.createElement('div');
        planetOrbit.className = 'planet-orbit';
        planetOrbit.style.width = `${diameter}px`;
        planetOrbit.style.height = `${diameter}px`;
        // Ajout d'une variable CSS pour la vitesse de rotation
        planetOrbit.style.setProperty('--rotation-speed', `${orbit.speed}s`);
        
        // 3. Créer le Point Lumineux
        const planet = document.createElement('div');
        // Ajoute la classe de base .planet ET la classe spécifique (utilisée pour le style unique maintenant)
        planet.className = `planet ${orbit.type}`;
        
        planet.style.width = `${orbit.size}px`;
        planet.style.height = `${orbit.size}px`;
        
        // Positionnement initial
        planet.style.transform = `translateX(${orbit.radius}px) translateY(-50%)`;
        
        planetOrbit.appendChild(planet);
        orbitContainer.appendChild(planetOrbit);
    });
}


// ===========================================
// 8. Exécution au Chargement de la Page
// La fonction principale lance tous les Observateurs et Animations
// ===========================================
document.addEventListener('DOMContentLoaded', () => {
    
    // Initialiser l'animation des planètes
    createOrbitAnimation();

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
    
    // CONSERVATION : Taille fixe (pas de changement de padding)
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(17, 24, 39, 0.95)';
    } else {
        navbar.style.background = 'rgba(17, 24, 39, 0.9)'; 
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

const githubUsername = 'pacobrnt'; 
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