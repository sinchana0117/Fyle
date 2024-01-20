const searchBtn = $('#search-btn');
const reposTable = $('#repos-table');
const loader = $('#loader');
const reposList = $('#repos-list');
const pageSize = 10;
let currentPage = 1;
let totalPages = 0;
let username = 'johnpapa'; // Set the default username to 'johnpapa'

searchBtn.click(() => {
    username = $('#username').val();
    if (username) {
        searchRepositories(username);
    }
});

function searchRepositories(username) {
    loader.show();
    reposList.empty();
    currentPage = 1;

    $.getJSON(`https://api.github.com/users/${username}/repos?per_page=${pageSize}`, data => {
        totalPages = Math.ceil(data.length / pageSize);
        displayRepositories(data.slice(0, pageSize));
        loader.hide();
    });
}

function displayRepositories(repos) {
    repos.forEach(repo => {
        const row = `
            <tr>
                <td>${repo.name}</td>
                <td><a href="${repo.html_url}" target="_blank">${repo.html_url}</a></td>
                <td>${repo.topics.join(', ')}</td>
            </tr>
        `;
        reposList.append(row);
    });

    updatePagination();
}

function updatePagination() {
    const pagination = $('.pagination');
    pagination.find('li').removeClass('active');
    pagination.find(`li:nth-child(${currentPage})`).addClass('active');
}

$(document).on('click', '.page-link', function (e) {
    e.preventDefault();
    const newPage = $(this).text();
    currentPage = parseInt(newPage);

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    $.getJSON(`https://api.github.com/users/${username}/repos?per_page=${pageSize}&page=${currentPage}`, data => {
        displayRepositories(data.slice(startIndex, endIndex));
    });
});