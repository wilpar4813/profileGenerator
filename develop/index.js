
//Run NPM packages
const fs = require("fs");
const inquirer = require("inquirer");
const axios = require("axios");
const generateHTML = require('./generateHTML.js');

//Create data object to hold data items collected from GitHub
const data = {};

//Questions to be prompted to user
const questions = [
  {
      type: "input",
      message: "What is your GitHub username?",
      name: "username"
  }, 
  {
      message: "What is your password?",
      name: 'color',
      type: 'list',
      choices:['green', 'blue', 'pink', 'red']
  }
]

function init() {
    //console.log("init has been called")
    //Use inquirer to prompt question getting username and color choice.
    inquirer.prompt(questions).then(function ({username, color}) {
        //Prepare URL for axios call.  Insert username.
        const queryUrl = `https://api.github.com/users/${username}`;
        //Use the above query URL to make axios call below
        axios.get(queryUrl).then((response) => {

            console.log(response.data)
            switch (color) {
                case 'green':
                    data.color = 0;
                    break;
                case 'blue':
                    data.color = 1;
                    break;
                case 'pink':
                    data.color = 2;
                    break;
                case 'red':
                    data.color = 3;
                    break;
            }

            console.log(data.color)

            //Get data from GitHub for username, number of repos, name, followers, following, portPic, location, blog, company,
            //bio, and number of stars.
            data.username = username;
            data.numOfRepo = response.data.public_repos;
            data.name = response.data.name
            data.followers = response.data.followers;
            data.following = response.data.following;
            data.portPic = response.data.avatar_url;
            data.location = response.data.location;
            data.blog = response.data.blog;
            data.company = response.data.company
            data.bio = response.data.bio

            // Requires a different axios call to get stars
            axios.get(`https://api.github.com/users/${username}/repos?per_page=100`).then((response) => { 
            console.log(response)
            data.stars = 0;
            for (let i = 0; i < response.data.length; i++) { // Loop through each repository and count the number of stars
                data.stars += response.data[i].stargazers_count;
            }
            console.log(data.stars)

            let resumeHTML = generateHTML(data);
            console.log(resumeHTML)

        })//Close second axios call
    })//Close first axios call
})}//Close function init

init();
