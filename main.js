
const searchField = document.querySelector("#search")
const cardTmpl = document.querySelector('#card')
const field = document.querySelector('.output-field')

const debounce = (fn, debounceTime) => {
  let timer
  return function(...args) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, debounceTime)
  }
};

const getRepos = async (request) => {
    return await fetch(`https://api.github.com/search/repositories?q=${request}`, {
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
      "Authorization": "Bearer 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"
    }
  })
      .then(response => {
        if (response.ok) {
          response.json().then(repos => {
            const items = repos.items.slice(0, 5)
            if (items.length === 0) {
              field.innerHTML = '<p class="no-results">No results...</p>'
            } else {
              field.innerHTML = ''
              items.forEach(item => {
                const card = cardTmpl.content.cloneNode(true)
                card.querySelector('.card-name').textContent = `Name: ${item.name}`
                card.querySelector('.card-owner').textContent = `Owner: ${item.owner.login}`
                card.querySelector('.card-stars').textContent = `Stars: ${item.stargazers_count}`
                field.append(card)
              })
            }
          })
        } else {
          field.innerHTML = '<p class="no-results">No results...</p>'
        }
      })
}

const debounceGetRepos = debounce(getRepos, 1000)


searchField.addEventListener('keyup', () => {
  debounceGetRepos(searchField.value)
})
