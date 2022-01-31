// velocidade menor que 60
db.pokemons.aggregate([
  { $match: { speed: { $lt: 60 } } },
  { $project: { 
    nome: '$name', 
    vel: '$speed', 
    _id: 0} 
  }
])

db.pokemons.aggregate([
  { $match: { type1: 'fire', is_legendary: 0 } },
  { $project: {
    nome: '$name',
    tipo1: '$type1',
    tipo2: '$type2',
    ataque: '$attack',
    _id: 0,
    lendarion: '$is_legendary',
  }},
  { $sort: { ataque: 1 } } 
]).pretty()

db.pokemons.aggregate([
  { $group: { 
    _id: '$type1', 
    quantidade: { $sum: 1 } 
  }}
])

db.pokemons.aggregate([
  { $group: {
    _id: '$hp',
    quantidade: { $sum: 1 }
  }},
  { $sort: { quantidade: -1 } },
  { $limit: 1 },
  { $project: { quantidade: 1, _id: 0} }
])

