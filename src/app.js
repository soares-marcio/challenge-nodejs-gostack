const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

function validateUpdateLikes(request, response, next) {
  const { likes } = request.body;
  const { method } = request;

  if (likes > 0 && method === 'PUT') {
    return response.status(400).json({ likes: 0 });
  }
  return next();
}

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  let splittedTechs = techs;
  if (typeof techs === 'string') {
    splittedTechs = techs.split(',');
  }
  const repository = {
    id: uuid(),
    title,
    url,
    techs: splittedTechs,
    likes: 0,
  }
  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", validateUpdateLikes, (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;
  const index = repositories.findIndex(repository => repository.id === id);
  if (index < 0) {
    return response.status(400).json({ error: 'Repository not found' });
  }
  const repository = {
    id,
    title,
    url,
    techs,
  };
  repositories[index] = repository;
  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const index = repositories.findIndex(repository => repository.id === id);
  if (index < 0) {
    return response.status(400).json({ error: 'Repository not found' });
  }
  repositories.splice(index, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const index = repositories.findIndex(repository => repository.id === id);
  if (index < 0) {
    return response.status(400).json({ error: 'Repository not found' })
  }
  const repository = repositories[index];
  repository.likes += 1;
  return response.json(repository);
});

module.exports = app;
