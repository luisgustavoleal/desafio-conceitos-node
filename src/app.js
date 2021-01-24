const express = require("express");
const cors = require("cors");

//const { v4: uuid, validate: isUuid } = require('uuid');
const { v4: uuidv4, validate } = require('uuid');
//const { isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];
const likes = [];

function logRequests(request, response, next) {

  const { method, url } = request;
  const logLabel = `[${method.toUpperCase()}] ${url}`;
  console.time(logLabel);
  next(); 
  console.timeEnd(logLabel); // Mostra o tempo que levou para executar.
}

app.use(logRequests);

app.get("/repositories", (request, response) => {
  // TODO
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  // Recive data from body
  const { title, url, techs } = request.body;
  
  // Creat object
  const repository = {
    id: uuidv4(),
    title,
    url,
    techs,
    likes: 0,
  };

  // Add in array
  repositories.push(repository);

  // Return object created  
  return response.json(repository);

});

app.put("/repositories/:id", (request, response) => {
  // TODO
  const { id } = request.params;
  const { title, url, techs} = request.body;

  //get index position
  const repositoryIndex = repositories.findIndex(repository => repository.id === id );

  // check exist id and 
  if(repositoryIndex < 0 ){
    return response.status(400).json();
  }

  // change position
  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes
  };

  repositories[repositoryIndex] = repository;

  // return element
  return response.json(repository);

});

app.delete("/repositories/:id", (request, response) => {

  // Get id
  const { id } = request.params;
  // Find index
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  // Valide exist
  if(repositoryIndex >= 0){
    // Delete position
      repositories.splice(repositoryIndex,1);
    
  } else {

    return response.status(400).json({ error: "ID nof found"});
  }

  // Return 204 
  return response.status(204).send();  

});

app.post("/repositories/:id/like", (request, response) => {
  // TODO
  const { id } = request.params;

//  const repositoryIndex = repositories.find(repository => repository.id === id); meu erro
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  if(repositoryIndex === -1 ) {
    return response.status(400).json({ error: 'Repository does not exists. '});
  }

  repositories[repositoryIndex].likes += 1;

  //return response.status(204).json(repositories[repositoryIndex]);  meu "erro"
  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
