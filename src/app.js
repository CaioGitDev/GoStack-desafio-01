const express = require("express");
const cors = require("cors");
const { v4: uuid } = require('uuid');
const { isUuid } = require("uuidv4");

const app = express();

function validateReposUuid(request, response, next) {
  const { id } = request.params;
  if (!isUuid(id)) {
    return response.status(400).json({ error: "invalid uuid." })
  }
  return next();
}

function findRepoIndexById(id) {
  return repositories.findIndex(p => p.id === id);
}

app.use(express.json());
app.use(cors());
app.use('/repositories/:id', validateReposUuid);

const repositories = [];

app.get("/repositories", (request, response) => {
  response.send(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repositorie = {
    "id": uuid(),
    "title": title,
    "url": url,
    "techs": techs,
    "likes": 0
  }
  repositories.push(repositorie);
  response.send(repositorie)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const repoIndex = findRepoIndexById(id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: 'project not found.' });
  }


  const repositorie = {
    id,
    title,
    url,
    techs,
    "likes": 0
  }

  repositories[repoIndex] = repositorie;
  response.send(repositorie);

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repoIndex = findRepoIndexById(id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: "repo not found." });
  }

  repositories.splice(repoIndex, 1);
  response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repoIndex = findRepoIndexById(id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: "repo not found." });
  }

  repositories[repoIndex].likes++;
  return response.json({ "likes": repositories[repoIndex].likes });

});

module.exports = app;
