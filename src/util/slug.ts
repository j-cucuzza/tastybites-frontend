// https://gist.github.com/codeguy/6684588
// adapted to fit my style of js functions
// remove accents, swap ñ for n, etc
const from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;'
const to   = 'aaaaeeeeiiiioooouuuunc------'

// Code to create slug names for individual recipe links
const slug = (str: string): string  => {
  str = str.trim().toLowerCase()

  for (let i=0, l=from.length ; i<l ; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
  }

  str = str
    .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-') // collapse dashes

  return str
}

export default slug