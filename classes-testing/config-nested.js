const config = {
  name: 'software-tools-in-javascript',
  version: '0.0.1',
  description: 'Software Tools in JavaScript',
  author: 'The Software Tools Tendency',
  keywords: ['lesson', 'JavaScript', 'software tools'],
  'repository': {
    'type': 'git',
    'url': 'git+https://github.com/software-tools-in-javascript/software-tools-in-javascript.git'
  }
}

for (const key in config) {
  console.log(key, config[key])
}
