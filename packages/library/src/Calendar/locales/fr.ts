const daysShort = ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'] // No periods, Google Calendar style
const monthsLong = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre',
]
const moreText = 'autres'
const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

const fr = {
  locale: 'fr',
  daysShort,
  monthsLong,
  moreText,
  formatTime,
}

export default fr
