const id = new URLSearchParams(location.search).get('id');


const movie_info = {};

async function info_of_id() {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=ko`, options);
    const data = await response.json();
    console.log(response);

    movie_info['title'] = data['title'];
    movie_info['overview'] = data['overview'];
    movie_info['poster_path'] = data['poster_path'];
    movie_info['vote_average'] = data['vote_average'];
    console.log(movie_info);

    return movie_info;
}

function make_movie() {
    const movieDiv = `
    <div class="card h-100">
        <div>
            <img src="https://image.tmdb.org/t/p/w500${movie_info['poster_path']}" class="movie-img-top" alt="이미지 준비중">
        </div>
        <div class="card-body">
            <h5 class="movie-title">${movie_info['title']}</h5>
            <p class="movie-text">${movie_info['overview']}</p>
        </div>
        <div class="card-footer">
            <small class="text-body-secondary">★ ${movie_info['vote_average']}</small>
        </div>
    </div>
        
    `;

    document.querySelector("#test")?.insertAdjacentHTML('beforeend', movieDiv);

}

async function movie_print() {
    await info_of_id();
    make_movie();
}

movie_print();