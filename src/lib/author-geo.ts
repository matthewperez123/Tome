// ── Author → Country/Coordinates mapping ──

export type AuthorGeo = {
  country: string
  region: string
  lat: number
  lng: number
  tradition: string
}

// Maps author last names or full names to geographic origin
const AUTHORS: Record<string, AuthorGeo> = {
  // Ancient Greek
  Homer: { country: "Greece", region: "Europe", lat: 38.5, lng: 23.7, tradition: "Ancient Greek" },
  Sophocles: { country: "Greece", region: "Europe", lat: 37.97, lng: 23.73, tradition: "Ancient Greek" },
  Euripides: { country: "Greece", region: "Europe", lat: 37.97, lng: 23.73, tradition: "Ancient Greek" },
  Aristophanes: { country: "Greece", region: "Europe", lat: 37.97, lng: 23.73, tradition: "Ancient Greek" },
  Plato: { country: "Greece", region: "Europe", lat: 37.97, lng: 23.73, tradition: "Ancient Greek" },
  Aristotle: { country: "Greece", region: "Europe", lat: 40.63, lng: 22.94, tradition: "Ancient Greek" },
  Aeschylus: { country: "Greece", region: "Europe", lat: 38.0, lng: 23.7, tradition: "Ancient Greek" },
  Herodotus: { country: "Greece", region: "Europe", lat: 37.49, lng: 27.35, tradition: "Ancient Greek" },
  Hesiod: { country: "Greece", region: "Europe", lat: 38.4, lng: 23.1, tradition: "Ancient Greek" },
  // Roman
  Virgil: { country: "Italy", region: "Europe", lat: 45.16, lng: 10.79, tradition: "Roman" },
  Ovid: { country: "Italy", region: "Europe", lat: 42.09, lng: 13.52, tradition: "Roman" },
  "Marcus Aurelius": { country: "Italy", region: "Europe", lat: 41.9, lng: 12.5, tradition: "Roman" },
  Seneca: { country: "Spain", region: "Europe", lat: 37.88, lng: -4.77, tradition: "Roman" },
  Lucretius: { country: "Italy", region: "Europe", lat: 41.9, lng: 12.5, tradition: "Roman" },
  Horace: { country: "Italy", region: "Europe", lat: 40.99, lng: 15.56, tradition: "Roman" },
  Tacitus: { country: "Italy", region: "Europe", lat: 41.9, lng: 12.5, tradition: "Roman" },
  // Medieval
  "Dante Alighieri": { country: "Italy", region: "Europe", lat: 43.77, lng: 11.25, tradition: "Medieval European" },
  "Geoffrey Chaucer": { country: "England", region: "Europe", lat: 51.51, lng: -0.13, tradition: "Medieval European" },
  // Renaissance
  "William Shakespeare": { country: "England", region: "Europe", lat: 52.19, lng: -1.71, tradition: "Renaissance" },
  "Miguel de Cervantes": { country: "Spain", region: "Europe", lat: 40.48, lng: -3.37, tradition: "Renaissance" },
  "Niccolò Machiavelli": { country: "Italy", region: "Europe", lat: 43.77, lng: 11.25, tradition: "Renaissance" },
  "John Milton": { country: "England", region: "Europe", lat: 51.51, lng: -0.13, tradition: "Renaissance" },
  "Michel de Montaigne": { country: "France", region: "Europe", lat: 44.84, lng: 0.22, tradition: "Renaissance" },
  // Enlightenment
  Voltaire: { country: "France", region: "Europe", lat: 48.86, lng: 2.35, tradition: "Enlightenment" },
  "Jonathan Swift": { country: "Ireland", region: "Europe", lat: 53.35, lng: -6.26, tradition: "Enlightenment" },
  "Daniel Defoe": { country: "England", region: "Europe", lat: 51.51, lng: -0.13, tradition: "Enlightenment" },
  "Jean-Jacques Rousseau": { country: "Switzerland", region: "Europe", lat: 46.2, lng: 6.14, tradition: "Enlightenment" },
  // Romantic
  "Jane Austen": { country: "England", region: "Europe", lat: 51.06, lng: -1.31, tradition: "Romantic" },
  "Mary Shelley": { country: "England", region: "Europe", lat: 51.51, lng: -0.13, tradition: "Romantic" },
  "Emily Brontë": { country: "England", region: "Europe", lat: 53.86, lng: -1.96, tradition: "Romantic" },
  "Charlotte Brontë": { country: "England", region: "Europe", lat: 53.86, lng: -1.96, tradition: "Romantic" },
  "Victor Hugo": { country: "France", region: "Europe", lat: 48.84, lng: 2.26, tradition: "Romantic" },
  "Alexandre Dumas": { country: "France", region: "Europe", lat: 49.25, lng: 2.51, tradition: "Romantic" },
  "Johann Wolfgang von Goethe": { country: "Germany", region: "Europe", lat: 50.11, lng: 8.68, tradition: "Romantic" },
  "Herman Melville": { country: "USA", region: "North America", lat: 40.71, lng: -74.01, tradition: "Romantic" },
  "Walt Whitman": { country: "USA", region: "North America", lat: 40.71, lng: -74.01, tradition: "Romantic" },
  // Victorian
  "Charles Dickens": { country: "England", region: "Europe", lat: 51.38, lng: 0.52, tradition: "Victorian" },
  "Oscar Wilde": { country: "Ireland", region: "Europe", lat: 53.35, lng: -6.26, tradition: "Victorian" },
  "Thomas Hardy": { country: "England", region: "Europe", lat: 50.72, lng: -2.44, tradition: "Victorian" },
  "George Eliot": { country: "England", region: "Europe", lat: 52.35, lng: -1.44, tradition: "Victorian" },
  "Bram Stoker": { country: "Ireland", region: "Europe", lat: 53.35, lng: -6.26, tradition: "Victorian" },
  "Robert Louis Stevenson": { country: "Scotland", region: "Europe", lat: 55.95, lng: -3.19, tradition: "Victorian" },
  "H. G. Wells": { country: "England", region: "Europe", lat: 51.27, lng: 0.19, tradition: "Victorian" },
  "Arthur Conan Doyle": { country: "Scotland", region: "Europe", lat: 55.95, lng: -3.19, tradition: "Victorian" },
  "Lewis Carroll": { country: "England", region: "Europe", lat: 54.9, lng: -1.38, tradition: "Victorian" },
  "Rudyard Kipling": { country: "India", region: "Asia", lat: 18.94, lng: 72.84, tradition: "Victorian" },
  "Mark Twain": { country: "USA", region: "North America", lat: 39.96, lng: -91.37, tradition: "Victorian" },
  "Jules Verne": { country: "France", region: "Europe", lat: 47.22, lng: -1.55, tradition: "Victorian" },
  "Jack London": { country: "USA", region: "North America", lat: 37.77, lng: -122.42, tradition: "Victorian" },
  // Russian
  "Fyodor Dostoevsky": { country: "Russia", region: "Europe", lat: 55.76, lng: 37.62, tradition: "Russian" },
  "Leo Tolstoy": { country: "Russia", region: "Europe", lat: 54.08, lng: 37.62, tradition: "Russian" },
  "Anton Chekhov": { country: "Russia", region: "Europe", lat: 47.24, lng: 39.72, tradition: "Russian" },
  "Nikolai Gogol": { country: "Ukraine", region: "Europe", lat: 49.84, lng: 33.48, tradition: "Russian" },
  "Alexander Pushkin": { country: "Russia", region: "Europe", lat: 55.76, lng: 37.62, tradition: "Russian" },
  "Ivan Turgenev": { country: "Russia", region: "Europe", lat: 53.2, lng: 36.59, tradition: "Russian" },
  // American
  "F. Scott Fitzgerald": { country: "USA", region: "North America", lat: 44.98, lng: -93.27, tradition: "American" },
  "Edith Wharton": { country: "USA", region: "North America", lat: 40.71, lng: -74.01, tradition: "American" },
  "Henry David Thoreau": { country: "USA", region: "North America", lat: 42.44, lng: -71.35, tradition: "American" },
  "Nathaniel Hawthorne": { country: "USA", region: "North America", lat: 42.52, lng: -70.9, tradition: "American" },
  "Frederick Douglass": { country: "USA", region: "North America", lat: 38.63, lng: -76.07, tradition: "American" },
  "Edgar Allan Poe": { country: "USA", region: "North America", lat: 37.25, lng: -76.7, tradition: "American" },
  // French
  "Gustave Flaubert": { country: "France", region: "Europe", lat: 49.44, lng: 1.1, tradition: "French" },
  "Émile Zola": { country: "France", region: "Europe", lat: 48.86, lng: 2.35, tradition: "French" },
  "Honoré de Balzac": { country: "France", region: "Europe", lat: 47.39, lng: 0.69, tradition: "French" },
  "Marcel Proust": { country: "France", region: "Europe", lat: 48.86, lng: 2.35, tradition: "French" },
  "Albert Camus": { country: "Algeria", region: "Africa", lat: 36.75, lng: 3.06, tradition: "French" },
  "Guy de Maupassant": { country: "France", region: "Europe", lat: 49.88, lng: 0.11, tradition: "French" },
  // Modernist
  "James Joyce": { country: "Ireland", region: "Europe", lat: 53.35, lng: -6.26, tradition: "Modernist" },
  "Virginia Woolf": { country: "England", region: "Europe", lat: 51.51, lng: -0.13, tradition: "Modernist" },
  "Franz Kafka": { country: "Czech Republic", region: "Europe", lat: 50.08, lng: 14.44, tradition: "Modernist" },
  "Joseph Conrad": { country: "Poland", region: "Europe", lat: 49.69, lng: 24.02, tradition: "Modernist" },
  "Ernest Hemingway": { country: "USA", region: "North America", lat: 41.88, lng: -87.63, tradition: "Modernist" },
  "D. H. Lawrence": { country: "England", region: "Europe", lat: 53.01, lng: -1.21, tradition: "Modernist" },
  "E. M. Forster": { country: "England", region: "Europe", lat: 51.51, lng: -0.13, tradition: "Modernist" },
  "Thomas Mann": { country: "Germany", region: "Europe", lat: 53.87, lng: 10.69, tradition: "Modernist" },
  "Hermann Hesse": { country: "Germany", region: "Europe", lat: 48.5, lng: 8.72, tradition: "Modernist" },
  // Eastern
  "Sun Tzu": { country: "China", region: "Asia", lat: 32.06, lng: 118.8, tradition: "Eastern" },
  Laozi: { country: "China", region: "Asia", lat: 33.87, lng: 115.8, tradition: "Eastern" },
  Confucius: { country: "China", region: "Asia", lat: 35.6, lng: 116.99, tradition: "Eastern" },
  "Murasaki Shikibu": { country: "Japan", region: "Asia", lat: 35.01, lng: 135.77, tradition: "Eastern" },
  "Natsume Sōseki": { country: "Japan", region: "Asia", lat: 35.69, lng: 139.69, tradition: "Eastern" },
  "Omar Khayyám": { country: "Iran", region: "Asia", lat: 36.21, lng: 59.6, tradition: "Eastern" },
  "Rabindranath Tagore": { country: "India", region: "Asia", lat: 22.57, lng: 88.36, tradition: "Eastern" },
  // Contemporary
  "George Orwell": { country: "India", region: "Asia", lat: 25.62, lng: 85.14, tradition: "Contemporary" },
  "Agatha Christie": { country: "England", region: "Europe", lat: 50.46, lng: -3.53, tradition: "Contemporary" },
  "John Steinbeck": { country: "USA", region: "North America", lat: 36.67, lng: -121.66, tradition: "Contemporary" },
  "Ray Bradbury": { country: "USA", region: "North America", lat: 37.69, lng: -89.22, tradition: "Contemporary" },
  "C. S. Lewis": { country: "Ireland", region: "Europe", lat: 54.6, lng: -5.93, tradition: "Contemporary" },
}

export function getAuthorGeo(authorName: string): AuthorGeo | null {
  // Try exact match first
  if (AUTHORS[authorName]) return AUTHORS[authorName]

  // Try matching by last name
  for (const [key, value] of Object.entries(AUTHORS)) {
    if (authorName.includes(key) || key.includes(authorName.split(" ").pop() ?? "")) {
      return value
    }
  }

  return null
}

// Get all unique countries with their author counts
export function getCountryData(): { country: string; lat: number; lng: number; tradition: string; authorCount: number }[] {
  const countryMap = new Map<string, { lat: number; lng: number; tradition: string; count: number }>()

  for (const author of Object.values(AUTHORS)) {
    const existing = countryMap.get(author.country)
    if (existing) {
      existing.count++
    } else {
      countryMap.set(author.country, { lat: author.lat, lng: author.lng, tradition: author.tradition, count: 1 })
    }
  }

  return Array.from(countryMap.entries()).map(([country, data]) => ({
    country,
    lat: data.lat,
    lng: data.lng,
    tradition: data.tradition,
    authorCount: data.count,
  }))
}

// Get authors by country
export function getAuthorsByCountry(country: string): { name: string; tradition: string }[] {
  return Object.entries(AUTHORS)
    .filter(([, geo]) => geo.country === country)
    .map(([name, geo]) => ({ name, tradition: geo.tradition }))
}

export { AUTHORS }
