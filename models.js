class User{
  constructor (id)
  {
    this.id = id;
    this.username;
    this.team;
    this.tasks = [];
  }
}

class Team{
  constructor(id,name)
  {
    this.id = id;
    this.name = name;
    this.milestones = [];
  }
}

class Milestone{
  constructor(id,order,reward,done)
  {
    this.id = id;
    this.order = order;
    this.reward = reward;
    this.health;
    this.done = done;
  }
}

class Task{
  constructor(id,completed,name,description)
  {
    this.id = id;
    this.completed = completed;
    this.name = name;
    this.description = description;
  }
}
