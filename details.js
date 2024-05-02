// 영화진흥위원회api
const apiKey = 'f798687d636246ea71c5c55821b7573b';

const options = {
    method: 'GET'
};

const movieData = [];

async function getdata() {
    try {
        const response = await fetch('http://kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json?key=' + apiKey + '&movieCd=20124079', options);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

// api key 뽑기
// for (item of data['movieList']) {
//     const movie = {};
//     movie['movieNm'] = item['movieNm'];
//     // movie['overview'] = item['overview'];
//     // movie['poster_path'] = item['poster_path'];
//     // movie['vote_average'] = item['vote_average'];
//     // movie['movie_id'] = item['id'];
//     // movie['original_title'] = item['original_title'];

//     movieData.push(movie);
// };
// return movieData;

async function main() {
    const data = await getdata();
    console.log(data);
}

main();




const returnMain = document.getElementById('back-main');
returnMain.addEventListener('click', () => {
    history.pushState({}, '', 'index.html');
})


