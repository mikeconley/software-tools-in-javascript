const config = {
  'name': 'software-tools-in-javascript',
  'version': '0.0.1',
  'description': 'Software Tools in JavaScript',
  'author': 'The Software Tools Tendency'
}

console.log(config['description'])

console.log(config.name)

for (const key of ['author', 'version']) {
  console.log(key, config[key])
}