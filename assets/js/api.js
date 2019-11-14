var base_url = "api.football-data.org/v2/competitions/2021/";
var second_base_url = "api.football-data.org/v2/teams/";

function status(response) {
    if (response.status !== 200) {
        console.log("Error : " + response.status);
        return Promise.reject(new Error(response.statusText));
    } else {
        return Promise.resolve(response);
    }
}

function json(response) {
    return response.json();
}

function error(error) {
    console.log("Error : " + error);
}

async function getStandings() {
    let proxy = 'https://cors-anywhere.herokuapp.com/';
    let standings = {};
    let options = {
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': '96d7fbd6ae8643b0bcbe078d5c26107b'
        },
        credentials: 'same-origin'
    }

    standings = await fetch(proxy + base_url + "standings?standingType=TOTAL", options)
        .then(status)
        .then(json)
        .catch(error);

    return standings;
}

async function loadDetailTeamPage() {
    let html = await fetch('../../pages/tim.html')
        .then(response => {
            return response.text();
        })
        .catch(err => {
            console.error(err);
        });

    return html;
}

async function getTeam(teamId) {
    let proxy = 'https://cors-anywhere.herokuapp.com/';
    let options = {
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': '96d7fbd6ae8643b0bcbe078d5c26107b'
        },
        credentials: 'same-origin'
    }
    let team = {};
    team = await fetch(proxy + second_base_url + teamId, options)
        .then(status)
        .then(json)
        .catch(err => {
            console.error(err);
        });
        
    return team;
}