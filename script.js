// Configuration API TMDB
const API_KEY = '8bc0c1cd570e0fc1b3b4b9894d2db994';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

let currentCategory = 'popular';
let allMovies = [];

// Données de démonstration (utilisées si l'API ne fonctionne pas)
const demoMovies = [
    {
        id: 1,
        title: "Inception",
        overview: "Dom Cobb est un voleur expérimenté dans l'art de l'extraction, voler les secrets les plus intimes enfouis au plus profond du subconscient durant une phase de rêve.",
        poster_path: "./images/placeholder.svg",
        backdrop_path: "./images/placeholder.svg",
        release_date: "2010-07-16",
        vote_average: 8.8,
        runtime: 148,
        genres: [{ name: "Science Fiction" }, { name: "Action" }]
    },
    {
        id: 2,
        title: "Interstellar",
        overview: "Le film raconte les aventures d'un groupe d'explorateurs qui utilisent une faille récemment découverte dans l'espace-temps afin de repousser les limites humaines.",
        poster_path: "./images/placeholder.svg",
        backdrop_path: "./images/placeholder.svg",
        release_date: "2014-11-05",
        vote_average: 8.6,
        runtime: 169,
        genres: [{ name: "Science Fiction" }, { name: "Drame" }]
    },
    {
        id: 3,
        title: "The Dark Knight",
        overview: "Batman entreprend de démanteler les dernières organisations criminelles de Gotham. Mais il se heurte bientôt à un nouveau génie du crime qui répand la terreur : le Joker.",
        poster_path: "./images/placeholder.svg",
        backdrop_path: "./images/placeholder.svg",
        release_date: "2008-07-18",
        vote_average: 9.0,
        runtime: 152,
        genres: [{ name: "Action" }, { name: "Crime" }, { name: "Drame" }]
    },
    {
        id: 4,
        title: "Pulp Fiction",
        overview: "L'odyssée sanglante et burlesque de petits malfrats dans la jungle de Hollywood à travers trois histoires qui s'entremêlent.",
        poster_path: "./images/placeholder.svg",
        backdrop_path: "./images/placeholder.svg",
        release_date: "1994-10-14",
        vote_average: 8.9,
        runtime: 154,
        genres: [{ name: "Crime" }, { name: "Thriller" }]
    },
    {
        id: 5,
        title: "The Matrix",
        overview: "Un pirate informatique découvre que la réalité dans laquelle il vit est en fait une simulation créée par des machines.",
        poster_path: "./images/placeholder.svg",
        backdrop_path: "./images/placeholder.svg",
        release_date: "1999-03-31",
        vote_average: 8.7,
        runtime: 136,
        genres: [{ name: "Science Fiction" }, { name: "Action" }]
    },
    {
        id: 6,
        title: "Gladiator",
        overview: "Le général romain Maximus est le plus fidèle soutien de l'empereur Marc Aurèle. Avant sa mort, l'empereur choisit Maximus pour lui succéder.",
        poster_path: "./images/placeholder.svg",
        backdrop_path: "./images/placeholder.svg",
        release_date: "2000-05-05",
        vote_average: 8.5,
        runtime: 155,
        genres: [{ name: "Action" }, { name: "Drame" }, { name: "Aventure" }]
    },
    {
        id: 7,
        title: "Avatar",
        overview: "Sur la lointaine planète de Pandora, Jake Sully, un ancien Marine paralysé, devient mobile à nouveau grâce à un Avatar.",
        poster_path: "./images/placeholder.svg",
        backdrop_path: "./images/placeholder.svg",
        release_date: "2009-12-18",
        vote_average: 7.8,
        runtime: 162,
        genres: [{ name: "Science Fiction" }, { name: "Aventure" }, { name: "Action" }]
    },
    {
        id: 8,
        title: "Fight Club",
        overview: "Un employé de bureau insomniaque et un fabriquant de savon forment un club de combat clandestin qui devient beaucoup plus.",
        poster_path: "./images/placeholder.svg",
        backdrop_path: "./images/placeholder.svg",
        release_date: "1999-10-15",
        vote_average: 8.8,
        runtime: 139,
        genres: [{ name: "Drame" }, { name: "Thriller" }]
    }
];

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    // Test de connexion à l'API
    console.log('🎬 CineVault - Initialisation...');
    console.log('🔑 Clé API configurée:', API_KEY.substring(0, 8) + '...');
    
    // Charger les films populaires au démarrage
    loadMovies('popular');
    updateStats();
    
    // Test rapide de l'API
    fetch(`${BASE_URL}/configuration?api_key=${API_KEY}`)
        .then(response => {
            if (response.ok) {
                console.log('✅ Connexion à TMDb API réussie !');
                return response.json();
            } else {
                throw new Error(`Status: ${response.status}`);
            }
        })
        .then(config => {
            console.log('📡 Configuration API:', {
                'Images base URL': config.images.secure_base_url,
                'Poster sizes': config.images.poster_sizes.join(', '),
                'Backdrop sizes': config.images.backdrop_sizes.join(', ')
            });
        })
        .catch(error => {
            console.error('⚠️ Erreur de connexion API:', error.message);
            console.log('💡 L\'application fonctionnera avec les données de démonstration');
        });
    
    // Recherche sur Enter
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchMovies();
        }
    });
    
    // Clear search on escape
    document.getElementById('searchInput').addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            e.target.value = '';
            loadMovies(currentCategory);
        }
    });
});

// Charger les films
async function loadMovies(category) {
    const moviesGrid = document.getElementById('moviesGrid');
    moviesGrid.innerHTML = '<div class="loading"><div class="spinner"></div><p>Chargement des films...</p></div>';
    
    try {
        // Essayer de charger depuis l'API TMDB
        const response = await fetch(`${BASE_URL}/movie/${category}?api_key=${API_KEY}&language=fr-FR&page=1`);
        
        if (response.ok) {
            const data = await response.json();
            allMovies = data.results;
        } else {
            // Si l'API échoue, utiliser les données de démonstration
            allMovies = demoMovies;
        }
    } catch (error) {
        // En cas d'erreur, utiliser les données de démonstration
        console.log('Utilisation des données de démonstration');
        allMovies = demoMovies;
    }
    
    displayMovies(allMovies);
    updateStats();
}

// Afficher les films
function displayMovies(movies) {
    const moviesGrid = document.getElementById('moviesGrid');
    
    if (movies.length === 0) {
        moviesGrid.innerHTML = '<div class="error-message">Aucun film trouvé. Essayez une autre recherche.</div>';
        return;
    }
    
    moviesGrid.innerHTML = movies.map((movie, index) => {
        // Gestion de l'URL de l'image
        let posterSrc;
        if (movie.poster_path) {
            if (movie.poster_path.startsWith('http')) {
                posterSrc = movie.poster_path;
            } else {
                posterSrc = `${IMAGE_BASE_URL}/w500${movie.poster_path}`;
            }
        } else {
            posterSrc = './images/placeholder.svg';
        }
        
        // Formatage de la date
        const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
        
        // Note avec couleur selon la valeur
        const rating = movie.vote_average || 0;
        const ratingColor = rating >= 7 ? '#4CAF50' : rating >= 5 ? '#FFC107' : '#f44336';
        
        return `
            <div class="movie-card" style="--i: ${index}" onclick="showMovieDetails(${movie.id})">
                <img class="movie-poster" 
                     src="${posterSrc}" 
                     alt="${movie.title || movie.original_title || 'Film'}"
                     loading="lazy"
                     onerror="this.onerror=null; this.src='./images/placeholder.svg'">
                <div class="movie-info">
                    <h3 class="movie-title" title="${movie.title || movie.original_title}">${movie.title || movie.original_title || 'Titre inconnu'}</h3>
                    <p class="movie-year">${year}</p>
                    <div class="movie-rating">
                        <span class="rating-star">⭐</span>
                        <span class="rating-value" style="color: ${ratingColor}">${rating.toFixed(1)}</span>
                        <span style="color: var(--text-secondary); font-size: 0.8rem">/10</span>
                    </div>
                    <p class="movie-overview">${movie.overview || 'Aucune description disponible.'}</p>
                </div>
            </div>
        `;
    }).join('');
}

// Filtrer les films
function filterMovies(category) {
    currentCategory = category;
    
    // Mettre à jour les boutons actifs
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    loadMovies(category);
}

// Rechercher des films
async function searchMovies() {
    const query = document.getElementById('searchInput').value.trim();
    
    if (!query) {
        loadMovies(currentCategory);
        return;
    }
    
    const moviesGrid = document.getElementById('moviesGrid');
    moviesGrid.innerHTML = '<div class="loading"><div class="spinner"></div><p>Recherche en cours...</p></div>';
    
    try {
        const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&language=fr-FR&query=${encodeURIComponent(query)}&page=1`);
        
        if (response.ok) {
            const data = await response.json();
            allMovies = data.results;
        } else {
            // Recherche dans les données de démonstration
            allMovies = demoMovies.filter(movie => 
                movie.title.toLowerCase().includes(query.toLowerCase())
            );
        }
    } catch (error) {
        // Recherche dans les données de démonstration
        allMovies = demoMovies.filter(movie => 
            movie.title.toLowerCase().includes(query.toLowerCase())
        );
    }
    
    displayMovies(allMovies);
    updateStats();
}

// Afficher les détails d'un film
async function showMovieDetails(movieId) {
    const modal = document.getElementById('movieModal');
    const movie = allMovies.find(m => m.id === movieId) || demoMovies.find(m => m.id === movieId);
    
    if (movie) {
        document.getElementById('modalBackdrop').src = movie.backdrop_path.startsWith('http') 
            ? movie.backdrop_path 
            : IMAGE_BASE_URL + '/original' + movie.backdrop_path;
        document.getElementById('modalTitle').textContent = movie.title;
        document.getElementById('modalYear').textContent = `📅 ${movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}`;
        document.getElementById('modalRating').textContent = `⭐ ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}/10`;
        document.getElementById('modalRuntime').textContent = `⏱️ ${movie.runtime || 120} min`;
        document.getElementById('modalGenres').textContent = `🎭 ${movie.genres ? movie.genres.map(g => g.name).join(', ') : 'Action, Aventure'}`;
        document.getElementById('modalOverview').textContent = movie.overview || 'Aucune description disponible.';
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Fermer le modal
function closeModal() {
    const modal = document.getElementById('movieModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Fermer le modal en cliquant en dehors
window.onclick = function(event) {
    const modal = document.getElementById('movieModal');
    if (event.target == modal) {
        closeModal();
    }
}

// Mettre à jour les statistiques
function updateStats() {
    document.getElementById('totalMovies').textContent = allMovies.length;
    
    const avgRating = allMovies.reduce((acc, movie) => acc + (movie.vote_average || 0), 0) / allMovies.length;
    document.getElementById('avgRating').textContent = avgRating.toFixed(1);
    
    document.getElementById('currentYear').textContent = new Date().getFullYear();
}