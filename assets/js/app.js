async function loadStandings() {
    await renderStandings();
    initDB();
}

async function loadDataFromCaches(proxy, base_url){
    let cachesData = {};

    await caches.match(proxy + base_url).then(response => {
        if (response) {
            cachesData = response.json();
        }
    });

    return cachesData;
}

async function renderStandings() {
    let standingElem = document.getElementById('standing-data');
    if (typeof(standingElem) != 'undefined' && standingElem != null) {
        let standings = {};
        let html = "";
        if ("caches" in window) {
            let proxy = 'https://cors-anywhere.herokuapp.com/';
            let base_url = `api.football-data.org/v2/competitions/2021/standings?standingType=TOTAL`;
            standings = await loadDataFromCaches(proxy, base_url);
        }
        standings = await getStandings();
        standings = standings.standings[0].table;
        Object.keys(standings).forEach(standing => {
            let teamUrl = standings[standing].team.crestUrl;
            html += `
                <tr onclick="loadTeamPage(${standings[standing].team.id})" style="cursor: pointer;">
                    <td>${standings[standing].position}</td>
                    <td class="team-logos">
                        <img src="${teamUrl.replace(/^http:\/\//i, 'https://')}" style="width: 30px;margin-right: 10px;">
                        <span>${standings[standing].team.name}</span>
                    </td>
                    <td>${standings[standing].playedGames}</td>
                    <td>${standings[standing].won}</td>
                    <td>${standings[standing].draw}</td>
                    <td>${standings[standing].lost}</td>
                    <td>${standings[standing].goalsFor}</td>
                    <td>${standings[standing].goalsAgainst}</td>
                    <td>${standings[standing].goalDifference}</td>
                    <td>${standings[standing].points}</td>
                </tr>
            `;
        });
        standingElem.innerHTML = html;
    }
}

async function loadTeamPage(teamId) {
    await renderTeamPage();
    await renderTeamInfo(teamId);
    await loadFav(teamId);
    toggleFav(teamId);
}

async function renderTeamPage() {
    let html = await loadDetailTeamPage();
    document.querySelector('#main').innerHTML = html;
}

async function renderTeamInfo(teamId) {
    let teamData = {};

    if ("caches" in window) {
        let proxy = 'https://cors-anywhere.herokuapp.com/';
        let base_url = `api.football-data.org/v2/teams/${teamId}`;
        teamData = await loadDataFromCaches(proxy. base_url);
    }

    teamData = await getTeam(teamId);

    if (teamData != null) {
        let teamUrl = teamData.crestUrl;

        let elem = document.querySelector('#detail-info');
        elem.innerHTML = `
            <div class="detail-logo-wrapper">
                <img id="team-img" src="${teamUrl.replace(/^http:\/\//i, 'https://')}">
            </div>
            <div class="detail-logo-info">
                <h1 id="team-title">${teamData.name}</h1>
                <p>${teamData.address}</p>
                <p>${teamData.phone}</p>
                <p><a href="${teamData.website != null ? teamData.website : '#klasemen'}" target="_blank">Official Website</a></p>
                <p>${teamData.email != null ? teamData.email : 'No Email'}</p>
                <a class="waves-effect waves-light btn btn-team">
                    <i class="material-icons left fav-icon" onclick="toggleFav(teamId)">favorite_border</i>Favorite
                </a>
            </div>
        `;

        let squadTable = document.querySelector('#team-squad');
        let squadHtml = '';
        let squads = teamData.squad;
        Object.keys(squads).forEach((squad, index) => {
            let squadDateUTC = new Date(squads[squad].dateOfBirth);
            let Day = squadDateUTC.getDate();
            let Month = squadDateUTC.getMonth() + 1;
            let FullYear = squadDateUTC.getFullYear();
            squadHtml += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${squads[squad].name}</td>
                    <td>${squads[squad].position}</td>
                    <td>${Month + '-' + Day + '-' + FullYear}</td>
                    <td>${squads[squad].countryOfBirth}</td>
                    <td>${squads[squad].nationality}</td>
                </tr>
            `;
        });
        squadTable.innerHTML = squadHtml;
    }else{
        let elem = document.querySelector('#detail-info');
        elem.innerHTML = `<p>Failed to get data</p>`;
        let squadTable = document.querySelector('#team-squad');
        squadTable.innerHTML = `<td colspan="6" style="text-align: center;">Please check your internet connections!</td>`;
    }
}

async function loadFav(teamIdFav) {
    let elemIcon = document.querySelector('.fav-icon');
    let toggleBtn = document.querySelector('.btn-team');
    let status = false;
    let findedData = await countDataInDB(teamIdFav);
    console.log(findedData);
    if (findedData < 1) {
        //tidak ada di list favorite, maka..
        elemIcon.innerHTML = 'favorite_border';
        toggleBtn.classList.remove('red');
        status = true;
    }else{
        //ada di list fav, maka..
        elemIcon.innerHTML = 'favorite';
        toggleBtn.classList.add('red');
        status = false;
    }
    return status;
}

async function toggleFav(teamId) {
    let toggleIcon = document.querySelector('.fav-icon');
    let toggleBtn = document.querySelector('.btn-team');
    let teamTitle = document.querySelector('#team-title').innerHTML;
    let teamLogo = document.querySelector('#team-img').getAttribute('src');
    let favTeamId = teamId
    toggleBtn.onclick = async (e) => {
        let check = await loadFav(favTeamId);
        if (check) {
            await createDataToDB({
                teamId: favTeamId,
                teamLogo: teamLogo,
                teamTitle: teamTitle
            });
            toggleIcon.innerHTML = 'favorite';
            toggleBtn.classList.add('red');
        }else{
            await deleteDataFromDB(favTeamId);
            toggleIcon.innerHTML = 'favorite_border';
            toggleBtn.classList.remove('red');
        }
    }
}