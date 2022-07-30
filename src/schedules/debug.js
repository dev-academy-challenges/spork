const template = require('./template')

template({
  week: (n) => n,

  mon: () => 'Monday',
  tue: () => 'Tuesday',
  wed: () => 'Wednesday',
  thu: () => 'Thursday',
  fri: () => 'Thursday',

  welly: () => null,
  akl: () => null,
  online: () => null,
  all: () => null,
  except: () => null,

  on: (week, day, _, act) => {
    return {
      week,
      day,
      act,
    }
  },

  deploy: (...items) => items,
  schedule: (...items) => {
    const byWeek = [[]]
    for (const item of items) {
      if (byWeek[item.week] == null) {
        byWeek[item.week] = []
      }

      byWeek[item.week].push(...item.act)
    }

    for (let i = 1; i < byWeek.length; i++) {
      console.log(`## Week ${i}\n`)
      const challenges = byWeek[i]
      for (const challenge of challenges) {
        console.log(`- [ ] ${challenge}`)
      }

      console.log('\n')
    }
  },
})
