const template = (w) =>
  w.schedule(
    w.on(
      w.week(1),
      w.mon(),
      w.all(),
      w.deploy('two-truths-and-a-lie', 'kata-objects-and-arrays')
    ),
    w.on(
      w.week(1),
      w.tue(),
      w.all(),
      w.deploy(
        'kata-types-modules',
        'kata-strings-numbers-modules',
        'exercise-arrays',
        'object-array-practice',
        'kata-number-patterns'
      )
    ),
    w.on(
      w.week(1),
      w.wed(),
      w.all(),
      w.deploy('kata-data-structures', 'bowling-kata', 'jest-demo')
    ),
    w.on(w.week(1), w.thu(), w.all(), w.deploy('tdd-bowling-kata', 'conways')),
    w.on(w.week(1), w.fri(), w.all(), w.deploy('ascii-art-reader')),
    w.on(
      w.week(2),
      w.mon(),
      w.all(),
      w.deploy('express-server', 'boilerplate-phase1')
    ),
    w.on(
      w.week(2),
      w.tue(),
      w.all(),
      w.deploy('server-side-rendering', 'meowtown')
    ),
    w.on(w.week(2), w.wed(), w.all(), w.deploy('pupparazzi')),
    w.on(
      w.week(2),
      w.thu(),
      w.all(),
      w.deploy('heroku-checklist', 'pupparazzi')
    ),
    w.on(w.week(3), w.mon(), w.all(), w.deploy('knex-todo-cli')),
    w.on(w.week(3), w.tue(), w.all(), w.deploy('knex-joins-stories')),
    w.on(
      w.week(3),
      w.wed(),
      w.all(),
      w.deploy('knex-relationships-stories', 'database-diagram')
    ),
    w.on(
      w.week(3),
      w.thu(),
      w.all(),
      w.deploy('knex-forms-stories', 'lightning-talks')
    ),
    w.on(
      w.week(4),
      w.mon(),
      w.all(),
      w.deploy('react-paws-for-effect', 'charlottes-web-log', 'react-minimal')
    ),
    w.on(
      w.week(4),
      w.tue(),
      w.all(),
      w.deploy(
        'broken-kaleidoscope',
        'memory',
        'enspiraled',
        'boilerplate-react-webpack',
        'enzyme-examples'
      )
    ),
    w.on(w.week(4), w.wed(), w.all(), w.deploy('worldwide-routing')),
    w.on(w.week(4), w.thu(), w.all(), w.deploy('react-form-demo')),
    w.on(
      w.week(5),
      w.mon(),
      w.all(),
      w.deploy(
        'charlottes-web-log-api',
        'web-api-stories',
        'boilerplate-express-api'
      )
    ),
    w.on(w.week(5), w.tue(), w.all(), w.deploy('react-to-web-api')),
    w.on(
      w.week(5),
      w.wed(),
      w.all(),
      w.deploy('consuming-external-apis', 'boilerplate-react-webpack')
    ),
    w.on(w.week(6), w.mon(), w.all(), w.deploy('redux-minimal')),
    w.on(
      w.week(6),
      w.tue(),
      w.all(),
      w.deploy('sweet-as-beers', 'react-redux-stories')
    ),
    w.on(
      w.week(6),
      w.wed(),
      w.all(),
      w.deploy(
        'async-redux-stories',
        'sweet-as-organics-api',
        'todo-full-stack'
      )
    )
  )

module.exports = template
